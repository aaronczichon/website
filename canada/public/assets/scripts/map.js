const element = document.getElementById('map');

// mapboxgl.accessToken =
// 	'pk.eyJ1Ijoid2ViYXRsYXMiLCJhIjoiY2xrdHB6dHg0MGVqbTNnbzR4Z3pvbTBvNCJ9.jSswMTOvnmDuLu9v9mdp9w';
mapboxgl.accessToken = 'pk.eyJ1Ijoid2ViYXRsYXMiLCJhIjoiY2lvYmt1djVqMDA0OXV3bTFuMHZjNWI5MCJ9.ltEAHRP0jWVKshgCqt5Z7g'
const map = new mapboxgl.Map({
	container: element,
	style: 'mapbox://styles/mapbox/streets-v12',
	center: [-63.582687, 44.65107],
	zoom: 10,
});

map.on('load', async () => {
	// Add zoom controls

   map.addControl(new mapboxgl.NavigationControl(), 'top-right');
   map.addControl(new mapboxgl.ScaleControl(), 'bottom-right');
   map.addControl(new mapboxgl.FullscreenControl(), 'top-right');

	map.addLayer({
		id: 'circleLayer',
		type: 'circle',
		source: {
			type: 'geojson',
			data: {
				type: 'Feature',
				geometry: {
					type: 'Point',
					coordinates: [-63.582687, 44.65107],
				},
			},
		},
		paint: {
			'circle-radius': {
				base: 1.75,
				stops: [
					[48, 40],
					[88, 720],
				],
			}, // in pixels
			'circle-color': 'blue',
			'circle-opacity': 0.5,
		},
	});
	document.getElementsByClassName('mapboxgl-control-container').item(0).remove();
});
