import ImageLayer from "ol/layer/Image";
import ImageWMS from "ol/source/ImageWMS";

const SoilMoistureLayer = new ImageLayer({
  properties: {
    title: "Jordfuktighet",
    minDate: "2024-01-01",
    maxDate: "2024-12-31",
  },
  opacity: 0.75,
  visible: false, // Default to false
  source: new ImageWMS({
    url: import.meta.env.VITE_NCWMS_URL,
    params: {
      ITEM: "layerDetails",
      LAYERS: "1/sm",
      STYLE: "raster/default",
      TIME: `${new Date().toISOString().split("T")[0]}`,
      EXCEPTIONS: "BLANK",
    },
    ratio: 1,
  }),
});

export default SoilMoistureLayer;
