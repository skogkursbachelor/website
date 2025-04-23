import { useEffect } from "react";
import { OverviewMap } from "ol/control";
import { Map } from "ol";
import OSM from "ol/source/OSM";
import TileLayer from "ol/layer/Tile";

interface Props {
  map: Map;
}

const MapOverview: React.FC<Props> = ({ map }) => {
  useEffect(() => {
    if (!map) return;

    const overview = new OverviewMap({
      collapsed: false,
      layers: [new TileLayer({ source: new OSM() })],
    });
    map.addControl(overview);

    // Set the title for overview map
    setTimeout(() => {
      const overviewElement = document.querySelector(
        ".ol-overviewmap button"
      ) as HTMLElement;

      if (overviewElement) overviewElement.title = "Oversiktskart";
    }, 0);

    return () => {
      map.removeControl(overview);
    };
  }, [map]);

  return null;
};

export default MapOverview;
