<script lang="ts">
    import { getToastStore } from '@skeletonlabs/skeleton';
    import Identicon from '$lib/components/ui/Identicon.svelte';
    import type { Message } from 'ye_olde_guestbook';
    import StellarExpertLink from './ui/StellarExpertLink.svelte';
    import SquarePen from 'lucide-svelte/icons/square-pen';
    import Check from 'lucide-svelte/icons/check';
    import X from 'lucide-svelte/icons/x';
    import { contractId } from '$lib/stores/contractId';
    import ye_olde_guestbook from '$lib/contracts/ye_olde_guestbook';
    import { account, send } from '$lib/passkeyClient';
    import { keyId } from '$lib/stores/keyId';
    import { isLoading } from '$lib/stores/isLoading';
    const toastStore = getToastStore();

    interface Props {
        message: Message;
        messageId: number;
    }

    let { message, messageId }: Props = $props();
    let editing: boolean = $state();
    let messageTitle = $state(message.title);
    let messageText = $state(message.text);

    const cancelEdit = () => {
        messageTitle = message.title;
        messageText = message.text;
        editing = false;
    };

    const submitEdit = async () => {
        console.log('submitting message edit');
        isLoading.set(true);
        try {
            const at = await ye_olde_guestbook.edit_message({
                message_id: messageId,
                title: messageTitle,
                text: messageText,
            });

            const txn = await account.sign(at.built!, { keyId: $keyId });
            await send(txn.built!);

            toastStore.trigger({
                message: 'Message edited successfully.',
                background: 'variant-filled-success',
            });
        } catch (err) {
            console.log(err);
            toastStore.trigger({
                message: 'Something went wrong editing your message. Please try again later.',
                background: 'variant-filled-error',
            });
        } finally {
            editing = false;
            isLoading.set(false);
        }
    };
</script>

<section class="card w-full variant-soft-primary">
    <div class="p-4 space-y-4">
        <div class="flex gap-8 justify-between">
            <div class="space-y-2 grow">
                {#if editing}
                    <label class="label">
                        <span>Message Title</span>
                        <input
                            class="input"
                            title="Message Title"
                            type="text"
                            bind:value={messageTitle}
                        />
                    </label>
                    <label class="label">
                        <span>Message Text</span>
                        <textarea
                            class="textarea"
                            rows="4"
                            title="Message Text"
                            bind:value={messageText}
                        ></textarea>
                    </label>
                {:else}
                    <h3 class="h3">
                        {messageTitle}
                    </h3>
                    <article>
                        <p>{messageText}</p>
                    </article>
                {/if}
            </div>
            {#if $contractId && $contractId === message.author}
                <div class="flex flex-row space-x-2">
                    {#if editing}
                        <div>
                            <button
                                type="button"
                                class="btn-icon btn-icon-sm variant-soft-error"
                                onclick={cancelEdit}
                                disabled={$isLoading}><X size={16} /></button
                            >
                        </div>
                        <div>
                            <button
                                type="button"
                                class="btn-icon btn-icon-sm variant-soft-success"
                                onclick={submitEdit}
                                disabled={$isLoading}><Check size={16} /></button
                            >
                        </div>
                    {:else}
                        <div>
                            <button
                                type="button"
                                class="btn-icon btn-icon-sm variant-soft"
                                onclick={() => (editing = true)}><SquarePen size={16} /></button
                            >
                        </div>
                    {/if}
                </div>
            {/if}
        </div>
        <hr class="opacity-50" />
        <footer
            class="w-full p-4 flex flex-col md:flex-row justify-start md:justify-between space-y-2 md:space-y-0 md:space-x-4"
        >
            <div class="flex flex-row space-x-4">
                <div class="self-center">
                    <Identicon width="w-10" address={message.author} />
                </div>
                <div class="flex flex-col space-y-1 overflow-hidden">
                    <h6 class="h6">Author</h6>
                    <StellarExpertLink target={message.author} />
                </div>
            </div>
            <div>
                <small>At ledger <StellarExpertLink target={message.ledger} /></small>
            </div>
        </footer>
    </div>
</section>
