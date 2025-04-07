import { Image as ImageLayer } from "ol/layer";
import { ImageWMS } from "ol/source";

const soilSaturationSource = new ImageWMS({
  url: "https://nve.geodataonline.no/arcgis/services/seNorgeGrid_png/ImageServer/WMSServer",
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
        "https://geodata-hosting-nve-prod-imagefiles.s3.eu-north-1.amazonaws.com/static/seNorgeGridLegend/gwb_sssrel.png",
    },
  },
  opacity: 0.75,
  visible: false,
  source: soilSaturationSource,
});

export default SoilSaturationLayer;
