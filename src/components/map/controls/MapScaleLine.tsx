import { useEffect } from "react";
import { ScaleLine } from "ol/control";
import { Map } from "ol";

interface Props {
  map: Map;
}

const MapScaleLine: React.FC<Props> = ({ map }) => {
  useEffect(() => {
    if (!map) return;

    const scaleLine = new ScaleLine();
    map.addControl(scaleLine);

    return () => {
      map.removeControl(scaleLine);
    };
  }, [map]);

  return null;
};

export default MapScaleLine;
