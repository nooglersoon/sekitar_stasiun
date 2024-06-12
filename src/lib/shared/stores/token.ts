import { browser } from '$app/environment';
import { writable } from 'svelte/store';

export const token = writable<string>('')