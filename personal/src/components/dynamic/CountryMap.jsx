import { useState, useEffect } from 'preact/hooks';

import BasicMap from './BasicMap';
import { addCanadaProvinceLayer, addMapLayer, addUsStateLayer } from './map.func';

export default function CountryDynamicMap({zoom, center}) {
  const [map, setMap] = useState(null);
  useEffect(() => {
    // Add route to map
    if (map) {
      map.on('load', () => {
        addMapLayer(map);
        addCanadaProvinceLayer(map);
        addUsStateLayer(map);
      });
    }
  }, [map]);

  useEffect(() => {
    if (map) {
      map.setCenter(center);
    }
  })

  return (
    <BasicMap zoom={zoom} setMap={setMap} />
  );
}