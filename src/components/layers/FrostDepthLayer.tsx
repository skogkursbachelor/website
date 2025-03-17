import { Image as ImageLayer } from "ol/layer";
import { ImageWMS } from "ol/source";

const FrostDepthLayer = new ImageLayer({
  properties: { title: "Teledyp" },
  opacity: 0.75,
  visible: false, // Set default visibility to false
  source: new ImageWMS({
    url: import.meta.env.VITE_FROSTDEPTH_URL,
    params: {
      SERVICE: "WMS",
      REQUEST: "GetMap",
      FORMAT: "image/png",
      TRANSPARENT: true,
      VERSION: "1.1.1",
      LAYERS: "gwb_frd",
      UNITTYPE: "cm",
      TIME: `${new Date().toISOString().split("T")[0]}`,
      EXCEPTIONS: "BLANK",
    },
    ratio: 1,
    serverType: "mapserver",
  }),
});

export default FrostDepthLayer;
