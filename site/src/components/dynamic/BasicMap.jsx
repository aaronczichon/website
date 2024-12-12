import * as mapboxgl from 'mapbox-gl';
import { useEffect, useState } from 'preact/hooks';

import 'mapbox-gl/dist/mapbox-gl.css';

export default function BasicDynamicMap({ zoom, setMap }) {
	const [mapId] = useState(`map-${Math.random().toString(36).substr(2, 9)}`)[0];

	useEffect(() => {
		// Real Token:
		const accessToken =
			'pk.eyJ1Ijoid2ViYXRsYXMiLCJhIjoiY2xrdHB6dHg0MGVqbTNnbzR4Z3pvbTBvNCJ9.jSswMTOvnmDuLu9v9mdp9w';
		const map = new mapboxgl.Map({
			container: mapId,
			style: 'mapbox://styles/mapbox/streets-v12',
			center: [-63.582687, 44.65107],
			zoom: zoom || 10,
			accessToken,
		});

		map.addControl(new mapboxgl.NavigationControl(), 'top-right');
		map.addControl(new mapboxgl.ScaleControl(), 'bottom-right');
		map.addControl(new mapboxgl.FullscreenControl(), 'top-right');

		setMap(map);

		// Clean up function (optional)
		return () => {
			map.remove(); // Cleanup Mapbox map
		};
	}, [zoom, setMap, mapId]); // Empty dependency array ensures that this effect runs only once
	return <div id={mapId} class="map-container" />;
}
