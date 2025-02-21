import ImageLayer from "ol/layer/Image";
import ImageWMS from "ol/source/ImageWMS";

// Define the layer outside the component
const SoilMoistureLayer = new ImageLayer({
  properties: { title: "Jordfuktighet" },
  opacity: 0.75,
  visible: false, // Default to false
  source: new ImageWMS({
    url: import.meta.env.VITE_NCWMS_URL,
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
