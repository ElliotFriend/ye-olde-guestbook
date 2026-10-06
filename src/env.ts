import { defineEnvVars } from '@sveltejs/kit/env';

export const variables = defineEnvVars({
    PRIVATE_RELAYER_BASE_URL: { static: true },
    PRIVATE_RELAYER_API_KEY: { static: true },
    PUBLIC_STELLAR_RPC_URL: { public: true, static: true },
    PUBLIC_STELLAR_NETWORK_PASSPHRASE: { public: true, static: true },
    PUBLIC_ACCOUNT_WASM_HASH: { public: true, static: true },
    PUBLIC_WEBAUTHN_VERIFIER_ADDRESS: { public: true, static: true },
    PUBLIC_NATIVE_TOKEN_CONTRACT: { public: true, static: true },
    PUBLIC_STELLAR_NETWORK: { public: true, static: true },
});
