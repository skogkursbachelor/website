import { useEffect } from "react";
import { Zoom } from "ol/control";
import { Map } from "ol";

interface Props {
  map: Map;
}

const MapZoom: React.FC<Props> = ({ map }) => {
  useEffect(() => {
    if (!map) return;

    const zoomControl = new Zoom();
    map.addControl(zoomControl);

    return () => {
      map.removeControl(zoomControl);
    };
  }, [map]);

  return null;
};

export default MapZoom;
