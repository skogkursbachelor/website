import { useEffect } from "react";
import { Map } from "ol";
import ImageLayer from "ol/layer/Image";
import ImageWMS from "ol/source/ImageWMS";

interface Props {
  map: Map;
}

const SuperficialDepositsLayer: React.FC<Props> = ({ map }) => {
  useEffect(() => {
    if (!map) return; // Ensure map is not null

    const SuperficialDepositsWMS = new ImageWMS({
      url: "https://geo.ngu.no/mapserver/LosmasserWMS2?",
      params: {
        LAYERS: "Losmasse_Norge,Losmasse_flate,Losmasseflate_SOSI_kode",
        VERSION: "1.3.0",
      },
      ratio: 1,
      serverType: "mapserver",
    });

    const SuperficialDepositsImageLayer = new ImageLayer({
      source: SuperficialDepositsWMS,
      opacity: 0.75,
      visible: true,
    });

    map.addLayer(SuperficialDepositsImageLayer);

    // Clean up on unmount
    return () => {
      map.removeLayer(SuperficialDepositsImageLayer);
    };
  }, [map]);

  return null; // No UI to render
};

export default SuperficialDepositsLayer;
