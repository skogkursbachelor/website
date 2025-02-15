import { useEffect } from "react";
import TileLayer from "ol/layer/Tile";
import { Map } from "ol";
import OSM from "ol/source/OSM";

interface Props {
  map: Map;
}

const BaseLayer: React.FC<Props> = ({ map }) => {
  useEffect(() => {
    if (!map) return; // Ensure map is not null

    const baseLayer = new TileLayer({
      source: new OSM(),
    });

    map.addLayer(baseLayer);

    // Clean up on unmount
    return () => {
      map.removeLayer(baseLayer);
    };
  }, [map]);

  return null; // No UI to render
};

export default BaseLayer;
