import ImageLayer from "ol/layer/Image";
import ImageWMS from "ol/source/ImageWMS";

const layerNames = [
  "Losmasse_Norge",
  "Losmasse_flate",
  "Losmasseflate_SOSI_kode",
];

const superficialDepositsSource = new ImageWMS({
  url: `http://${window.location.hostname}:${import.meta.env.VITE_API_PORT}${import.meta.env.VITE_SUPERFICIALDEPOSITS_URL}`,
  params: {
    SERVICE: "WMS",
    REQUEST: "GetMap",
    LAYERS: layerNames.join(","),
    VERSION: "1.3.0",
  },
  ratio: 1,
  serverType: "mapserver",
});

const SuperficialDepositsLayer = new ImageLayer({
  properties: {
    title: "Løsmasser",
    legendUrls: {
      Losmasse_Norge:
          `http://${window.location.hostname}:${import.meta.env.VITE_API_PORT}${import.meta.env.VITE_LEGEND_SUPERFICIALDEPOSITS_URL}?language=nor&version=1.3.0&service=WMS&request=GetLegendGraphic&sld_version=1.1.0&layer=Losmasse_Norge&format=image/png&STYLE=default`,
      Losmasse_flate:
          `http://${window.location.hostname}:${import.meta.env.VITE_API_PORT}${import.meta.env.VITE_LEGEND_SUPERFICIALDEPOSITS_URL}?language=nor&version=1.3.0&service=WMS&request=GetLegendGraphic&sld_version=1.1.0&layer=Losmasse_flate&format=image/png&STYLE=default`,
    },
  },
  opacity: 0.75,
  visible: false,
  source: superficialDepositsSource,
});

export default SuperficialDepositsLayer;
