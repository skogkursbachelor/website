import ImageLayer from "ol/layer/Image";
import ImageWMS from "ol/source/ImageWMS";

const nibioSoilMoistureSource = new ImageWMS({
  url: `http://${window.location.hostname}:${import.meta.env.VITE_API_PORT}${
    import.meta.env.VITE_PROBABLESOILMOISTURE_URL
  }`,
  params: {
    SERVICE: "WMS",
    REQUEST: "GetMap",
    LAYERS: "markfuktighetsklasser",
    VERSION: "1.3.0",
  },
  ratio: 1,
  serverType: "mapserver",
  attributions: 'Kartdata: © <a href="https://www.nibio.no/">NIBIO</a>',
});

const NibioSoilMoistureLayer = new ImageLayer({
  properties: {
    title: "Markfuktighet",
    legendUrls: {
      markfuktighetsklasser: `http://${window.location.hostname}:${
        import.meta.env.VITE_API_PORT
      }${
        import.meta.env.VITE_LEGEND_PROBABLESOILMOISTURE_URL
      }?language=nor&version=1.3.0&service=WMS&request=GetLegendGraphic&sld_version=1.1.0&layer=markfuktighetsklasser&format=image/png&STYLE=default`,
    },
  },
  opacity: 0.75,
  visible: false, // Set default visibility to false
  source: nibioSoilMoistureSource,
  minZoom: 14.76,
});

export default NibioSoilMoistureLayer;
