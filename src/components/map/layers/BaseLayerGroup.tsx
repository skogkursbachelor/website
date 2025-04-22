import { useEffect } from "react";
import TileLayer from "ol/layer/Tile";
import { Map } from "ol";
import OSM from "ol/source/OSM";
import LayerGroup from "ol/layer/Group";

interface Props {
  map: Map;
}

const BaseLayerGroup: React.FC<Props> = ({ map }) => {
  useEffect(() => {
    if (!map) return;

    const standardLayer = new TileLayer({
      source: new OSM({
        url: `http://${window.location.hostname}:${
          import.meta.env.VITE_API_PORT
        }${import.meta.env.VITE_BASELAYER_URL}/std/{a-c}/{z}/{x}/{y}`,
        attributions:
          '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap-bidragsytere</a>',
      }),
      visible: true, // Default visible layer
      properties: { title: "Standard", imageLocation: "/standardMap.png" },
    });

    const topoLayer = new TileLayer({
      source: new OSM({
        url: `http://${window.location.hostname}:${
          import.meta.env.VITE_API_PORT
        }${import.meta.env.VITE_BASELAYER_URL}/topo/{a-c}/{z}/{x}/{y}`,
        attributions:
          'Kartdata: © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap-bidragsytere</a>, SRTM | Kartstil: © <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
      }),
      visible: false,
      properties: { title: "Terreng", imageLocation: "/topoMap.png" },
    });

    const baseLayerGroup = new LayerGroup({
      layers: [standardLayer, topoLayer],
      properties: { title: "BaseLayerGroup" },
    });

    map.addLayer(baseLayerGroup);

    // Cleanup on unmount
    return () => {
      map.removeLayer(baseLayerGroup);
    };
  }, [map]);

  return null; // No UI
};

export default BaseLayerGroup;
