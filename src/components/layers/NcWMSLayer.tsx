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
    // TODO: Get URL from env or config
    url: "http://10.212.171.219:3030/ncWMS2/wms",
    params: {
      item: "layerDetails",
      layers: "1/sm",
      styles: "raster/default",
      TIME: `${new Date().toISOString().split("T")[0]}`,
      EXCEPTIONS: "BLANK",
    },
    ratio: 1,
  }),
});

export default SoilMoistureLayer;
