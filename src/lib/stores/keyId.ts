import { persisted } from "svelte-persisted-store";

export const keyId = persisted<string>('yog:keyId', "");
