<script lang="ts">
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import { fade } from 'svelte/transition';
	import mapboxgl from 'mapbox-gl';
	import 'mapbox-gl/dist/mapbox-gl.css';
	import { createMRTMarkerElement } from '../../components/builder/MRTMarker';
	import type { Station } from '$lib/model/Station';
	import { mrtJakartaPhase1Stations } from '$lib/data/stations';
	import { getIsochroneService } from '$lib/service/getIsochroneService';
	import type { ErrorType } from '$lib/model/ErrorType';
	import { tokenValidation } from '$lib/service/tokenValidation';
	import { goto } from '$app/navigation';

	// Bundaran HI as initial selected stations
	let map: mapboxgl.Map;
	const date = new Date();
	const checkedMode = writable('walking');
	const checkedDuration = writable('10');
	const selectedStation = writable<Station>(mrtJakartaPhase1Stations[0]);
	let isMenuOpen = false;

	export let data;

	const handleSelection = (event: Event) => {
		const selectedName = (event.target as HTMLSelectElement).value;
		const station = mrtJakartaPhase1Stations.find((station) => station.name === selectedName);
		if (station) {
			selectedStation.set(station);
		}
	};

	const getIsochrone = () => {
		getIsochroneService({
			transportMode: $checkedMode,
			latitude: $selectedStation.latitude,
			longitude: $selectedStation.longitude,
			duration: $checkedDuration,
			token: mapboxgl.accessToken,
			callback: (data: any) => {
				if (map && map.getSource('iso')) {
					// @ts-ignore
					map.getSource('iso').setData(data);
				}
			}
		});
	};

	function updateMaps() {
		let zoom: number = 13;

		if ($checkedDuration === '20' && $checkedMode === 'cycling') {
			zoom = 11.5;
		} else if ($checkedDuration === '20' && $checkedMode === 'driving') {
			zoom = 11.5;
		} else if ($checkedDuration === '30' && $checkedMode === 'cycling') {
			zoom = 11;
		} else if ($checkedDuration === '30' && $checkedMode === 'driving') {
			zoom = 10.5;
		}
		map.flyTo({
			center: [$selectedStation.longitude, $selectedStation.latitude],
			zoom: zoom,
			speed: 1,
			curve: 1,
			easing(t) {
				return t;
			}
		});

		getIsochrone();
	}

	onMount(async () => {
		let errorResult: ErrorType | null = await tokenValidation(data.value);
		if (errorResult !== null) {
			console.log('Error');
			goto('/');
		}

		const accessToken = data.value;
		// Set the access token
		mapboxgl.accessToken = accessToken;

		let marker = new mapboxgl.Marker(createMRTMarkerElement($selectedStation.name));

		map = new mapboxgl.Map({
			container: 'map',
			style: 'mapbox://styles/mapbox/navigation-night-v1',
			center: [$selectedStation.longitude, $selectedStation.latitude],
			zoom: 13
		});

		map.on('load', () => {
			map.addSource('iso', {
				type: 'geojson',
				data: {
					type: 'FeatureCollection',
					features: []
				}
			});

			map.addLayer(
				{
					id: 'isoLayer',
					type: 'fill',
					source: 'iso',
					layout: {},
					paint: {
						'fill-color': '#F3CA40',
						'fill-opacity': 0.3
					}
				},
				'poi-label'
			);

			map.addLayer(
				{
					id: 'isoLine',
					type: 'line',
					source: 'iso',
					layout: {},
					paint: {
						'line-color': '#F2A541',
						'line-width': 2
					}
				},
				'poi-label'
			);

			marker
				.setLngLat({ lat: $selectedStation.latitude, lng: $selectedStation.longitude })
				.addTo(map);

			getIsochrone();
		});

		checkedMode.subscribe(updateMaps);

		checkedDuration.subscribe(updateMaps);

		selectedStation.subscribe((latestStation) => {
			marker.remove();
			marker = new mapboxgl.Marker(createMRTMarkerElement($selectedStation.name));
			marker.setLngLat({ lat: latestStation.latitude, lng: latestStation.longitude }).addTo(map);
			updateMaps();
		});
	});
</script>

<div class="relative">
	<div id="map" class="w-screen h-screen"></div>
	<div
		class="absolute top-4 left-4 z-50 flex flex-col py-4 px-4 bg-gray-800 rounded-md items-start gap-4 bg-opacity-85 text-white right-4"
	>
		<div class="flex flex-row justify-between w-full gap-8">
			<div class="font-bold text-lg md:text-xl">Sekitar Stasiun.</div>
			<button
				on:click={() => {
					isMenuOpen = !isMenuOpen;
				}}
			>
				{#if isMenuOpen}
					<img class="w-4 h-4" src="./close.svg" alt="Close" />
				{:else}
					<img class="w-4 h-4" src="./menu.svg" alt="Menu" />
				{/if}
			</button>
		</div>
		{#if isMenuOpen}
			<div id="params" transition:fade={{ delay: 0, duration: 300 }}>
				<div class="mb-4">
					<label for="station-select" class="font-semibold mb-1.5 text-sm"
						>Choose a MRT station:</label
					>
					<select
						id="station-select"
						class="rounded-lg p-2 w-full bg-gray-800 text-white text-sm font-semibold"
						on:change={handleSelection}
					>
						{#each mrtJakartaPhase1Stations as station}
							<option value={station.name} selected={station === $selectedStation}
								>{station.name}</option
							>
						{/each}
					</select>
				</div>
				<h4 class="font-semibold mb-1.5 text-sm">Choose a travel mode:</h4>
				<div class="mb-4 flex items-center gap-4">
					<label class="inline-flex items-center">
						<input
							name="profile"
							type="radio"
							value="walking"
							class="hidden"
							bind:group={$checkedMode}
						/>
						<div
							class={`cursor-pointer p-2 text-xs ${$checkedMode === 'walking' ? 'bg-blue-600 rounded-lg text-white' : ''}`}
						>
							<img src="./walking.svg" alt="walking" class="w-6 h-6" />
						</div>
					</label>
					<label class="inline-flex items-center">
						<input
							name="profile"
							type="radio"
							value="cycling"
							class="hidden"
							bind:group={$checkedMode}
							checked
						/>
						<div
							class={`cursor-pointer p-2 text-xs ${$checkedMode === 'cycling' ? 'bg-blue-600 rounded-lg text-white' : ''}`}
						>
							<img src="./cycling.svg" alt="cycling" class="w-6 h-6" />
						</div>
					</label>
					<label class="inline-flex items-center">
						<input
							name="profile"
							type="radio"
							value="driving"
							class="hidden"
							bind:group={$checkedMode}
						/>
						<div
							class={`cursor-pointer p-2 text-xs ${$checkedMode === 'driving' ? 'bg-blue-600 rounded-lg text-white' : ''}`}
						>
							<img src="./driving.svg" alt="driving" class="w-6 h-6" />
						</div>
					</label>
				</div>
				<h4 class="font-semibold mb-1.5 text-sm">Choose a maximum duration:</h4>
				<div class="flex items-center gap-4">
					<label class="inline-flex items-center">
						<input
							name="duration"
							type="radio"
							value="10"
							class="hidden"
							bind:group={$checkedDuration}
							checked
						/>
						<div
							class={`cursor-pointer p-2 text-xs ${$checkedDuration === '10' ? 'bg-blue-600 rounded-lg text-white' : ''}`}
						>
							10 min
						</div>
					</label>
					<label class="inline-flex items-center">
						<input
							name="duration"
							type="radio"
							value="20"
							class="hidden"
							bind:group={$checkedDuration}
						/>
						<div
							class={`cursor-pointer p-2 text-xs ${$checkedDuration === '20' ? 'bg-blue-600 rounded-lg text-white' : ''}`}
						>
							20 min
						</div>
					</label>
					<label class="inline-flex items-center">
						<input
							name="duration"
							type="radio"
							value="30"
							class="hidden"
							bind:group={$checkedDuration}
						/>
						<div
							class={`cursor-pointer p-2 text-xs ${$checkedDuration === '30' ? 'bg-blue-600 rounded-lg text-white' : ''}`}
						>
							30 min
						</div>
					</label>
				</div>
			</div>
		{/if}
	</div>
	<div class="absolute bottom-10 left-8 md:left-1/2 md:-translate-x-1/2">
		<div
			class="flex flex-row gap-2 px-8 rounded-xl bg-white bg-opacity-75 items-center py-2 justify-center"
		>
			<div class="font-base text-sm text-black">
				© {date.getFullYear()}
			</div>
			<a href="https://enums.id"><img src="./enums-icon.svg" class="w-12 object-fit" alt="" /></a>
			<div class="font-base text-sm text-black">All Rights Reserved</div>
		</div>
	</div>
</div>
