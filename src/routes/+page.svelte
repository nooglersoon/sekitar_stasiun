<script lang="ts">
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import mapboxgl from 'mapbox-gl';
	import 'mapbox-gl/dist/mapbox-gl.css';
	import type { Station } from '$lib/stations';
	import { mrtJakartaPhase1Stations } from '$lib/stations';

	// Bundaran HI as initial selected stations
	const selectedStation = writable<Station>(mrtJakartaPhase1Stations[0]);

	const handleSelection = (event: Event) => {
		const selectedName = (event.target as HTMLSelectElement).value;
		const station = mrtJakartaPhase1Stations.find((station) => station.name === selectedName);
		if (station) {
			selectedStation.set(station);
		}
	};

	let map: mapboxgl.Map;
	const checkedMode = writable('walking');
	const checkedDuration = writable('10');

	const urlBase = 'https://api.mapbox.com/isochrone/v1/mapbox/';

	mapboxgl.accessToken =
		'pk.eyJ1Ijoicm9iaW5rb2hycyIsImEiOiJjanU5am95bm4xZnZ6NDNrOTRyYTYwdzJzIn0.iMFQgQIlhz36wB3819Xftw';

	async function getIso() {
		const query = await fetch(
			`${urlBase}${$checkedMode}/${$selectedStation.longitude},${$selectedStation.latitude}?contours_minutes=${$checkedDuration}&polygons=true&access_token=${mapboxgl.accessToken}`,
			{ method: 'GET' }
		);
		const data = await query.json();
		if (map && map.getSource('iso')) {
			// @ts-ignore
			map.getSource('iso').setData(data);
		}
	}

	onMount(() => {
		const marker = new mapboxgl.Marker({ color: '#314ccd' });

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
						'fill-color': '#5a3fc0',
						'fill-opacity': 0.3
					}
				},
				'poi-label'
			);

			marker
				.setLngLat({ lat: $selectedStation.latitude, lng: $selectedStation.longitude })
				.addTo(map);

			getIso();
		});

		checkedMode.subscribe((latestMode) => {
			getIso();

			let zoom: number = 13;

			if ($checkedDuration === '20' && latestMode === 'cycling') {
				zoom = 11.5;
			} else if ($checkedDuration === '20' && latestMode === 'driving') {
				zoom = 11.5;
			} else if ($checkedDuration === '30' && latestMode === 'cycling') {
				zoom = 11;
			} else if ($checkedDuration === '30' && latestMode === 'driving') {
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
		});

		checkedDuration.subscribe((latestDuration) => {
			getIso();

			let zoom: number = 13;

			if (latestDuration === '20' && $checkedMode === 'cycling') {
				zoom = 11.5;
			} else if (latestDuration === '20' && $checkedMode === 'driving') {
				zoom = 11.5;
			} else if (latestDuration === '30' && $checkedMode === 'cycling') {
				zoom = 11;
			} else if (latestDuration === '30' && $checkedMode === 'driving') {
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
		});

		selectedStation.subscribe((latestStation) => {
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
			// using flyTo options
			map.flyTo({
				center: [latestStation.longitude, latestStation.latitude],
				zoom: zoom,
				speed: 1,
				curve: 1,
				easing(t) {
					return t;
				}
			});
			marker.setLngLat({ lat: latestStation.latitude, lng: latestStation.longitude }).addTo(map);
			getIso();
		});
	});
</script>

<div class="relative">
	<div id="map" class="w-screen h-screen"></div>
	<div
		class="absolute top-4 left-4 z-50 flex flex-col py-4 px-4 bg-gray-800 rounded-md items-start gap-4 bg-opacity-85 text-white"
	>
		<div class="font-bold text-lg md:text-xl">Sekitar Stasiun.</div>
		<form id="params">
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
						<option value={station.name}>{station.name}</option>
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
						Walking
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
						Cycling
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
						Driving
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
		</form>
		<div class="font-base text-xs md:text-md">
			Developed by <a
				class="font-bold underline-offset-1 underline"
				href="https://github.com/nooglersoon">nooglersoon</a
			>
		</div>
	</div>
</div>
