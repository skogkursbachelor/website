import { useEffect, useState } from "react";
import { Map } from "ol";
import ImageLayer from "ol/layer/Image";
import ImageWMS from "ol/source/ImageWMS";

interface Props {
  map: Map;
}

const SuperficialDepositsLayer: React.FC<Props> = ({ map }) => {
  const [layer] = useState(() => {
    const superficialDepositsWMS = new ImageWMS({
      url: "https://geo.ngu.no/mapserver/LosmasserWMS2?request=GetCapabilities&service=WMS",
      params: {
        LAYERS: "Losmasse_Norge,Losmasse_flate,Losmasseflate_SOSI_kode",
        VERSION: "1.3.0",
      },
      ratio: 1,
      serverType: "mapserver",
    });

    return new ImageLayer({
      source: superficialDepositsWMS,
      opacity: 0.75,
      visible: true,
    });
  });

  useEffect(() => {
    if (map) {
      map.addLayer(layer);

      // Clean up the layer on unmount
      return () => {
        map.removeLayer(layer); // Remove layer when component is unmounted
      };
    }
  }, [map]);

  return null; // No UI to render, layer added via map
};

export default SuperficialDepositsLayer;
