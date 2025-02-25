import ImageLayer from "ol/layer/Image";
import ImageWMS from "ol/source/ImageWMS";

const NibioSoilMoistureLayer = new ImageLayer({
  properties: { title: "Markfuktigheter" },
  opacity: 0.75,
  visible: false, // Set default visibility to false
  source: new ImageWMS({
    url: "https://wms.nibio.no/cgi-bin/markfuktighetskart",
    params: {
      SERVICE: "WMS",
      REQUEST: "GetMap",
      LAYERS: "markfuktighetsklasser",
      VERSION: "1.3.0",
    },
    ratio: 1,
    serverType: "mapserver",
  }),
});

export default NibioSoilMoistureLayer;
