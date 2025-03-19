import { Image as ImageLayer } from "ol/layer";
import { ImageWMS } from "ol/source";

const copernicusSoilMoistureSource = new ImageWMS({
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
});

const CopernicusSoilMoistureLayer = new ImageLayer({
  properties: {
    title: "Copernicus Jordfuktighet",
    legendUrls: {
      satSoilMoisture:
        "https://european-flood.emergency.copernicus.eu/api/wms/?request=GetLegend&layers=mapserver:satSoilMoisture&styles=default&width=80&height=50",
    },
  },
  opacity: 0.75,
  visible: false, // Set default visibility to false
  source: copernicusSoilMoistureSource,
});

export default CopernicusSoilMoistureLayer;
