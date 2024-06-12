<script lang="ts">
	import { ErrorType } from '$lib/model/ErrorType';
	import { browser } from '$app/environment';
	import toast, { Toaster } from 'svelte-french-toast';
	import { token } from '../lib/shared/stores/token';
	import { tokenValidation } from '$lib/service/tokenValidation';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	export let form;
	$: apiKey = '';
	let isLoading = false;

	if (form) {
		// @ts-ignore
		validateCurrentToken(form.errorType);
	}

	onMount(async () => {
		const errorType = await tokenValidation($token);
		validateCurrentToken(errorType);
	});

	function validateCurrentToken(errorType: ErrorType | null) {
		if (errorType === ErrorType.InvalidToken) {
			toast.error('Invalid token. Please try other tokens');
		} else if (errorType === ErrorType.ServiceUnavailable) {
			toast.error('Service currently unavailable. Please try again later');
		} else if (errorType === null) {
			toast.success('Token is valid. Enjoy!');
			isLoading = true;
			setTimeout(() => {
				isLoading = false;
				if (browser) {
					goto('/maps');
				}
			}, 1500);
		} else {
			toast.error('Service currently unavailable. Please try again later');
		}
	}
</script>

<main class="h-screen fle bg-gray-800 text-white flex">
	<Toaster />

	{#if isLoading}
		<div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
			<div
				class="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12"
			></div>
		</div>
	{/if}

	<div class="my-auto mx-auto max-w-screen-xl px-8 py-16 flex flex-col gap-12">
		<div class="mb-4 flex items-center gap-4 mx-auto">
			<div class={`cursor-pointer p-2 text-xs bg-gray-600 rounded-lg text-white bg-opacity-60`}>
				<img src="./walking.svg" alt="walking" class="w-6 h-6" />
			</div>
			<div class={`cursor-pointer p-2 text-xs bg-gray-600 rounded-lg text-white bg-opacity-60`}>
				<img src="./cycling.svg" alt="cycling" class="w-6 h-6" />
			</div>
			<div class={`cursor-pointer p-2 text-xs bg-gray-600 rounded-lg text-white bg-opacity-60`}>
				<img src="./driving.svg" alt="driving" class="w-6 h-6" />
			</div>
		</div>

		<div class="text-center flex flex-col gap-4 md:gap-8">
			<h1 class="text-3xl font-bold md:text-5xl">Sekitar Stasiun.</h1>

			<p class="text-sm md:text-2xl">
				Do you wonder how far you can walk or ride or drive from the nearest transportation hub?
				This app will guide you.
			</p>
		</div>

		<div class="flex flex-col gap-6">
			<div class="text-xs md:text-lg text-left">
				Since we are in development and use Mapbox to enhance user experience, please input your
				mapbox api token to continue. We will not store/keep the api key to our server.
			</div>

			<form class="flex flex-col gap-2 md:gap-4" method="POST" action="?/saveToken">
				<div>
					<label for="api-key" class="sr-only">Api Key</label>
					<input
						id="api-key"
						type="text"
						name="api-key"
						class="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm text-black"
						placeholder="Mapbox Api Token"
						bind:value={apiKey}
					/>
				</div>

				<div class="flex flex-col justify-between md:flex-row gap-4 md:gap-0">
					<p class="text-xs text-gray-500">
						Don't have one?
						<a class="underline" href="https://docs.mapbox.com/help/getting-started/access-tokens/"
							>Create mapbox api token</a
						>
					</p>

					<button
						type="submit"
						class="inline-block rounded-lg bg-green-500 px-5 py-3 text-sm font-medium text-white disabled:bg-opacity-60"
						disabled={apiKey === '' || apiKey === undefined}
					>
						Continue
					</button>
				</div>
			</form>
		</div>
	</div>
</main>

<style>
	.loader {
		border-top-color: #f9c643;
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}
</style>
