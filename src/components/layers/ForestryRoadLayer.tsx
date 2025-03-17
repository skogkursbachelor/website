import ImageLayer from "ol/layer/Image";
import ImageWMS from "ol/source/ImageWMS";

const ForestryRoadLayer = new ImageLayer({
  properties: { title: "Skogsbilveger" },
  opacity: 0.75,
  visible: false, // Set default visibility to false
  source: new ImageWMS({
    url: import.meta.env.VITE_FORESTRYROADS_URL,
    params: {
      SERVICE: "WMS",
      REQUEST: "GetMap",
      LAYERS: "skogsbilveg",
      VERSION: "1.3.0",
    },
    ratio: 1,
    serverType: "mapserver",
  }),
});

export default ForestryRoadLayer;
