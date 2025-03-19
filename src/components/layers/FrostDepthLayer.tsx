import { Image as ImageLayer } from "ol/layer";
import { ImageWMS } from "ol/source";

const frostDepthSource = new ImageWMS({
  url: "https://nve.geodataonline.no/arcgis/services/seNorgeGrid_png/ImageServer/WMSServer",
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
});

const FrostDepthLayer = new ImageLayer({
  properties: {
    title: "Teledyp",
    legendUrls: {
      gwb_frd:
        "https://geodata-hosting-nve-prod-imagefiles.s3.eu-north-1.amazonaws.com/static/seNorgeGridLegend/gwb_frd.png",
    },
  },
  opacity: 0.75,
  visible: false,
  source: frostDepthSource,
});

export default FrostDepthLayer;
