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

    // Set the title for zoom buttons
    setTimeout(() => {
      const zoomInElement = document.querySelector(
        ".ol-zoom-in"
      ) as HTMLElement;
      const zoomOutElement = document.querySelector(
        ".ol-zoom-out"
      ) as HTMLElement;

      if (zoomInElement) zoomInElement.title = "Zoom inn";
      if (zoomOutElement) zoomOutElement.title = "Zoom ut";
    }, 0);

    return () => {
      map.removeControl(zoomControl);
    };
  }, [map]);

  return null;
};

export default MapZoom;
