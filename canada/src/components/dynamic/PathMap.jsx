import { useState, useEffect } from 'preact/hooks';
import * as mapboxgl from 'mapbox-gl';
import gpxParser from 'gpxparser';

import BasicMap from './BasicMap';

// Function to parse GPX file and extract route coordinates
function parseGPX(gpxData) {
  const parser = new gpxParser();
  parser.parse(gpxData);
  const route = parser.tracks[0].points.map(point => [point.lat, point.lon]);
  return route;
}

export default function PathDynamicMap({gpxUrl, zoom, tooltip}) {
  const [map, setMap] = useState(null);
  const [popup, setPopup] = useState(null);
  const [routeCoordinates, setRouteCoordinates] = useState(null);

  useEffect(() => {
    // Fetch and parse GPX file
    if (gpxUrl && map) {
      fetch(gpxUrl)
        .then(response => response.text())
        .then(gpxData => {
          const route = parseGPX(gpxData);
          const switchedRoute = route.map(subArray => {
            return [subArray[1], subArray[0]];
        });
          setRouteCoordinates(switchedRoute);
        })
        .catch(error => {
          console.error('Error fetching GPX file:', error);
        });
    }
  }, [gpxUrl, map]);

  useEffect(() => {
    // Add route to map
    if (map && routeCoordinates) {
      map.on('load', () => {

        map.addLayer({
          id: 'route',
          type: 'line',
          source: {
            type: 'geojson',
            data: {
              type: 'Feature',
              properties: {},
              geometry: {
                type: 'LineString',
                coordinates: routeCoordinates
              }
            }
          },
          layout: {
            'line-join': 'round',
            'line-cap': 'round'
          },
          paint: {
            'line-color': '#b33335',
            'line-width': 7
          }
        });
      });
      map.setCenter(routeCoordinates[0]);

      // Add popup on hover
      if (!tooltip) return;

      const popup = new mapboxgl.Popup({ closeOnClick: false })
          .setHTML(tooltip);
      // Add popup on hover over the route
      map.on('mouseenter', 'route', (e) => {
        map.getCanvas().style.cursor = 'pointer';
        popup.setLngLat(e.lngLat).addTo(map);
      });

      map.on('mouseleave', 'route', () => {
          map.getCanvas().style.cursor = ''; // Reset cursor style
          popup.remove(); // Remove popup on mouse leave
      });
    }
  }, [map, routeCoordinates, popup, tooltip]);

  return (
    <BasicMap zoom={zoom} setMap={setMap} />
  );
}