import ImageLayer from "ol/layer/Image";
import ImageWMS from "ol/source/ImageWMS";

const nibioSoilMoistureSource = new ImageWMS({
  url: "https://wms.nibio.no/cgi-bin/markfuktighetskart",
  params: {
    SERVICE: "WMS",
    REQUEST: "GetMap",
    LAYERS: "markfuktighetsklasser",
    VERSION: "1.3.0",
  },
  ratio: 1,
  serverType: "mapserver",
});

const NibioSoilMoistureLayer = new ImageLayer({
  properties: {
    title: "Markfuktigheter",
    legendUrls: {
      markfuktighetsklasser:
        "https://wms.nibio.no/cgi-bin/markfuktighetskart?language=nor&version=1.3.0&service=WMS&request=GetLegendGraphic&sld_version=1.1.0&layer=markfuktighetsklasser&format=image/png&STYLE=default",
    },
  },
  opacity: 0.75,
  visible: false, // Set default visibility to false
  source: nibioSoilMoistureSource,
});

export default NibioSoilMoistureLayer;
