<script lang="ts">
    import {
        clipboard,
        getModalStore,
        getToastStore,
        popup,
        type ModalComponent,
        type ModalSettings,
        type PopupSettings,
    } from '@skeletonlabs/skeleton';
    const toastStore = getToastStore();
    const modalStore = getModalStore();

    import { error } from '@sveltejs/kit';
    import { account, send, getContractId, native, fundContract } from '$lib/passkeyClient';
    import { PUBLIC_SITE_NAME, PUBLIC_SUPERPEACH_URL } from '$env/static/public';
    import base64url from 'base64url';
    import { keyId } from '$lib/stores/keyId';
    import { contractId } from '$lib/stores/contractId';
    import Settings from 'lucide-svelte/icons/settings';
    import ChevronDown from 'lucide-svelte/icons/chevron-down';
    import Copy from 'lucide-svelte/icons/copy';
    import { Wallet, CircleDollarSign, HelpingHand, LogOut, LoaderCircle } from 'lucide-svelte';
    import Identicon from '$lib/components/ui/Identicon.svelte';
    import TruncatedAddress from '$lib/components/ui/TruncatedAddress.svelte';
    import { seContractLink } from '$lib/stellarExpert';
    import { networks } from 'ye_olde_guestbook';
    import SuperpeachEmbed from './ui/SuperpeachEmbed.svelte';

    let balance: string = '0';
    let isFunding: boolean = false;
    let isDonating: boolean = false;
    let popupWindow: Window | null;

    async function getBalance() {
        try {
            const { result } = await native.balance({ id: $contractId });
            balance = result.toString();
        } catch (err) {
            console.log(err);
            toastStore.trigger({
                message: 'Something went wrong checking your balance. Please try again later.',
                background: 'variant-filled-error',
            });
        }
    }

    async function signup() {
        try {
            const {
                keyId: kid,
                contractId: cid,
                xdr,
            } = await account.createWallet(PUBLIC_SITE_NAME, 'Guestbook Author');

            const keyId_b64 = base64url(kid);
            keyId.set(keyId_b64);
            contractId.set(cid);

            if (!xdr) {
                error(500, {
                    message: 'XDR transaction missing',
                });
            }
            await send(xdr);
            await fundContract($contractId);
            getBalance();
        } catch (err) {
            console.log(err);
            toastStore.trigger({
                message: 'Something went wrong signing up. Please try again later.',
                background: 'variant-filled-error',
            });
        }
    }

    async function login() {
        try {
            const { keyId: kid, contractId: cid } = await account.connectWallet({
                getContractId,
            });

            const keyId_base64url = base64url(kid);

            keyId.set(keyId_base64url);
            console.log(keyId_base64url);

            contractId.set(cid);
            console.log(cid);
        } catch (err) {
            console.log(err);
            toastStore.trigger({
                message: 'Something went wrong logging in. Please try again later.',
                background: 'variant-filled-error',
            });
        }
    }

    async function fund() {
        isFunding = true;
        const toastId = toastStore.trigger({
            message: 'You got it! Awaiting airdrop.',
            background: 'variant-filled-warning',
            autohide: false,
        });

        try {
            await fundContract($contractId);
            toastStore.close(toastId);
            toastStore.trigger({
                message: 'Funds received. Congrats!',
                background: 'variant-filled-success',
            });
            getBalance();
        } catch (err) {
            toastStore.close(toastId);
            console.log(err);
            toastStore.trigger({
                message: 'Something went funding smart wallet. Please try again later.',
                background: 'variant-filled-error',
            });
        } finally {
            isFunding = false;
        }
    }

    async function donate() {
        isDonating = true;
        let toastId: string = '';
        try {
            new Promise<number>((resolve) => {
                const modal: ModalSettings = {
                    type: 'prompt',
                    title: 'Your Generosity Knows No Bounds!',
                    body: 'Donations help this guestbook stay alive. Please enter the quantity of XLM you would like to donate.',
                    valueAttr: {
                        type: 'number',
                        required: true,
                        min: 1,
                    },
                    response: (donation: number) => {
                        resolve(donation);
                    }
                }
                modalStore.trigger(modal)
            }).then(async (donation: number) => {
                toastId = toastStore.trigger({
                    message: 'Submitting donation. Much appreciated!',
                    background: 'variant-filled-warning',
                    autohide: false,
                });

                const { built } = await native.transfer({
                    to: networks.testnet.contractId,
                    from: $contractId,
                    amount: BigInt(donation * 10_000_000),
                });

                const xdr = await account.sign(built!, { keyId: $keyId });
                const res = await send(xdr);

                console.log(res);

                toastStore.close(toastId);
                toastStore.trigger({
                    message: 'Donation received! You reall ARE the goat.',
                    background: 'variant-filled-success',
                });
                getBalance();
            })
        } catch (err) {
            console.log(err);
            toastStore.trigger({
                message: 'Something went wrong donating. Please try again later.',
                background: 'variant-filled-error',
            });
        } finally {
            isDonating = false;
            if (toastId !== '') {
                toastStore.close(toastId);
            }
        }
    }

    async function logout() {
        try {
            keyId.reset();
            contractId.set('');
            localStorage.removeItem('yog:keyId');
            window.location.reload();
        } catch (err) {
            console.log(err);
            toastStore.trigger({
                message: 'Something went wrong logging out. Please try again later.',
                background: 'variant-filled-error',
            });
        }
    }


    async function superpeach() {
        let kid: Buffer;
        let superpeachUrl: string

        async function messenger(event: MessageEvent<any>) {
            try {
                console.log('event here', event)
                if (
                    event.data.name === 'superpeach'
                    && event.data.message === 'OK'
                    && event.origin === superpeachUrl
                ) {
                    popupWindow?.close()

                    const { contractId: cid } = await account.connectWallet({
                        keyId: $keyId,
                        getContractId,
                    })

                    contractId.set(cid)
                    console.log(cid)

                    window.removeEventListener("message", messenger)
                }
            } catch (err) {
                console.log(err)
            }
        }

        window.addEventListener('message', messenger)

        try {
            new Promise<string>((resolve) => {
                const modal: ModalSettings = {
                    type: 'prompt',
                    title: 'Connect Existing Wallet',
                    body: 'You already have a smart wallet? Amazing! Enter the URL here, and we can get you connected!',
                    value: PUBLIC_SUPERPEACH_URL,
                    valueAttr: {
                        type: 'string',
                        required: true,
                    },
                    response: (spUrl: string) => {
                        resolve(spUrl)
                    }
                }
                modalStore.trigger(modal);
            }).then(async (spUrl: any) => {
                if (!spUrl) {
                    throw 400
                } else {
                    console.log('spurl', spUrl)
                    superpeachUrl = spUrl
                }
            }).then(async () => {
                const wallet = await account.createKey(PUBLIC_SITE_NAME, "Guestbook Author")
                kid = wallet.keyId

                const w = 400;
                const h = 500;
                const left = window.screenX + (window.outerWidth - w) / 2;
                const top = window.screenY + (window.outerHeight - h) / 2;

                const windowFeatures = `width=${w},height=${h},left=${left},top=${top},resizable=no,scrollbars=no,menubar=no,toolbar=no,location=no,status=no`;

                popupWindow = window.open(
                    `${superpeachUrl}/add-signer?from=${encodeURIComponent(location.origin)}&keyId=${base64url(kid)}&publicKey=${base64url(wallet.publicKey)}`,
                    "Connect Super Peach",
                    windowFeatures,
                )

                if (!popupWindow) {
                    toastStore.trigger({
                        message: 'Popup was blocked by the browser. Please try again.',
                        background: 'variant-filled-error',
                    });
                } else {
                    popupWindow.focus()
                }

                keyId.set(base64url(kid))

                // const modal: ModalSettings = {
                //     type: 'component',
                //     component: {ref: SuperpeachEmbed},
                //     meta: {
                //         kid: base64url(kid),
                //         publicKey: base64url(wallet.publicKey),
                //         spUrl: spUrl,
                //     },
                //     response: (cid: string) => {
                //         resolve(cid)
                //     }
                // }
                // modalStore.trigger(modal)
            })
        } catch (err) {
            console.log(err)
            toastStore.trigger({
                message: 'Something went wrong super peaching. Please try again later.',
                background: 'variant-filled-error',
            });
        }
    }

    const popupFeatured: PopupSettings = {
        event: 'click',
        target: 'popupFeatured',
        placement: 'bottom',
    };
</script>

<div class="flex space-x-1 md:space-x-2">
    {#if !$contractId}
        <button class="btn variant-outline-primary" on:click={superpeach}>Superpeach</button>
        <button class="btn variant-filled-primary" on:click={signup}>Signup</button>
        <button class="btn variant-soft-primary" on:click={login}>Login</button>
    {:else}
        <button class="btn hover:variant-soft-primary" use:popup={popupFeatured}>
            <span><Settings /></span>
            <span><ChevronDown size="18" /></span>
        </button>

        <div class="card p-4 w-60 shadow-xl z-10" data-popup="popupFeatured">
            <div class="space-y-4">
                <div class="flex gap-4 w-full justify-between">
                    <div>
                        <Identicon width="w-12" address={$contractId} />
                    </div>
                    <div class="flex flex-col gap-0.25">
                        <div class="text-right"><small>Balance</small></div>
                        {#await getBalance() then}
                            <div>
                                <h4 class="h4">
                                    {parseFloat((Number(balance) / 1e7).toFixed(2))}<small
                                        >XLM</small
                                    >
                                </h4>
                            </div>
                        {/await}
                    </div>
                </div>
                <div>
                    <p class="font-bold">Your Wallet</p>
                    <div class="mt-1">
                        <div class="overflow-hidden flex items-center gap-3">
                            <TruncatedAddress address={$contractId} />
                            <input
                                type="hidden"
                                bind:value={$contractId}
                                data-clipboard="stellarAddress"
                            />
                            <button
                                type="button"
                                class="btn-icon btn-icon-sm variant-soft-surface"
                                use:clipboard={{ input: 'stellarAddress' }}
                                ><Copy size="14" /></button
                            >
                        </div>
                    </div>
                </div>
                <hr class="opacity-50" />
                <nav class="list-nav">
                    <ul>
                        <li>
                            <button
                                class="btn variant-soft-success w-full"
                                on:click={fund}
                                disabled={isFunding}
                            >
                                <span>
                                    {#if isFunding}
                                        <LoaderCircle class="animate-spin" />
                                    {:else}
                                        <CircleDollarSign />
                                    {/if}
                                </span>
                                <span>Fund Wallet</span>
                            </button>
                        </li>
                        <li>
                            <a
                                href={seContractLink($contractId)}
                                class="btn variant-soft-surface"
                                target="_blank"
                            >
                                <span><Wallet /></span>
                                <span>View Wallet</span></a
                            >
                        </li>
                        <li>
                            <button class="btn variant-soft-surface w-full" on:click={donate}>
                                <span>
                                    {#if isDonating}
                                        <LoaderCircle class="animate-spin" />
                                    {:else}
                                        <HelpingHand />
                                    {/if}
                                </span>
                                <span>Send Donation</span>
                            </button>
                        </li>
                        <li>
                            <button class="btn variant-soft-error w-full" on:click={logout}>
                                <span><LogOut /></span>
                                <span>Logout</span></button
                            >
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    {/if}
</div>
