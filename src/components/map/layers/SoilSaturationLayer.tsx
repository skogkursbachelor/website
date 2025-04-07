import {Image as ImageLayer} from "ol/layer";
import {ImageWMS} from "ol/source";

const soilSaturationSource = new ImageWMS({
  url: `http://${window.location.hostname}:${import.meta.env.VITE_API_PORT}${import.meta.env.VITE_SENORGEWMS_URL}`,
  params: {
    SERVICE: "WMS",
    REQUEST: "GetMap",
    FORMAT: "image/png",
    TRANSPARENT: true,
    VERSION: "1.1.1",
    LAYERS: "gwb_sssrel",
    UNITTYPE: "cm",
    TIME: `${new Date().toISOString().split("T")[0]}`,
    EXCEPTIONS: "BLANK",
  },
  ratio: 1,
  serverType: "mapserver",
});

const SoilSaturationLayer = new ImageLayer({
  properties: {
    title: "Vannmetning i jord",
    legendUrls: {
      gwb_sssrel:
          `http://${window.location.hostname}:${import.meta.env.VITE_API_PORT}${import.meta.env.VITE_LEGEND_SOILSATURATION_URL}`,
    },
  },
  opacity: 0.75,
  visible: false,
  source: soilSaturationSource,
});

export default SoilSaturationLayer;
