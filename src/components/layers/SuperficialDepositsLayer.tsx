import ImageLayer from "ol/layer/Image";
import ImageWMS from "ol/source/ImageWMS";

const SuperficialDepositsLayer = new ImageLayer({
  properties: { title: "Løsmasser" },
  opacity: 0.75,
  visible: false, // Set default visibility to false
  source: new ImageWMS({
    url: import.meta.env.VITE_SUPERFICIALDEPOSITS_URL,
    params: {
      SERVICE: "WMS",
      REQUEST: "GetMap",
      LAYERS: "Losmasse_Norge,Losmasse_flate,Losmasseflate_SOSI_kode",
      VERSION: "1.3.0",
    },
    ratio: 1,
    serverType: "mapserver",
  }),
});

export default SuperficialDepositsLayer;
