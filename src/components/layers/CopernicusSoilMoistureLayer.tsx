import { Image as ImageLayer } from "ol/layer";
import { ImageWMS } from "ol/source";

const CopernicusSoilMoistureLayer = new ImageLayer({
  properties: { title: "Copernicus Jordfuktighet" },
  opacity: 0.75,
  visible: false, // Set default visibility to false
  source: new ImageWMS({
    url: "https://european-flood.emergency.copernicus.eu/api/wms/",
    params: {
      SERVICE: "WMS",
      REQUEST: "GetMap",
      FORMAT: "image/png",
      TRANSPARENT: true,
      VERSION: "1.3.0",
      LAYERS: "mapserver:satSoilMoisture",
      TIME: `${new Date().toISOString().split("T")[0]}`,
      EXCEPTIONS: "BLANK",
    },
    ratio: 1,
    serverType: "mapserver",
  }),
});

export default CopernicusSoilMoistureLayer;
