import { Image as ImageLayer } from "ol/layer";
import { ImageWMS } from "ol/source";

const frostDepthSource = new ImageWMS({
  url: `http://${window.location.hostname}:${import.meta.env.VITE_API_PORT}${
    import.meta.env.VITE_SENORGEWMS_URL
  }`,
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
  attributions:
    '© <a href="https://www.geodata.no">Geodata</a>, <a href="https://www.kartverket.no">Kartverket</a>, Geovekst, kommuner, <a href="https://www.openstreetmap.org/copyright">OSM</a> | Data: <a href="https://www.nve.no">NVE</a>, <a href="https://met.no">MET</a> | Kilde: <a href="https://www.senorge.no">SeNorge</a>',
});

const FrostDepthLayer = new ImageLayer({
  properties: {
    title: "Teledyp",
    legendUrls: {
      gwb_frd: `http://${window.location.hostname}:${
        import.meta.env.VITE_API_PORT
      }${import.meta.env.VITE_LEGEND_FROSTDEPTH_URL}`,
    },
  },
  opacity: 0.75,
  visible: false,
  source: frostDepthSource,
});

export default FrostDepthLayer;
