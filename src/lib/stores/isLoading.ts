import { writable, type Writable } from 'svelte/store';

export const isLoading: Writable<boolean> = writable(false);
