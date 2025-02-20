import ImageLayer from "ol/layer/Image";
import ImageWMS from "ol/source/ImageWMS";

// Define the layer outside the component
const SoilMoistureLayer = new ImageLayer({
  properties: { title: "Jordfuktighet" },
  opacity: 0.75,
  visible: false, // Default to false
  source: new ImageWMS({
    // TODO: Get URL from env or config
    url: "http://10.212.171.219:3030/ncWMS2/wms",
    params: {
      item: "layerDetails",
      layers: "1/sm",
      styles: "raster/default",
      TIME: "2024-04-19T00:00:00.000Z", // Example time
      // TODO: Add time control
    },
    ratio: 1,
  }),
});

export default SoilMoistureLayer;
