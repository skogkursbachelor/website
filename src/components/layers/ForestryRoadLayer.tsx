import { GeoJSON } from "ol/format";
import { Style, Stroke } from "ol/style";
import { Vector } from "ol/layer";
import VectorSource from "ol/source/Vector";
import { tile } from "ol/loadingstrategy";
import { createXYZ } from "ol/tilegrid";

// Define WFS parameters as variables
const baseUrl = "http://localhost:5173/skogsbilveg";
const service = "WFS";
const version = "2.0.0";
const request = "GetFeature";
const typeName = "ms:skogsbilveg";
const outputFormat = "geojson";
const srsName = "EPSG:3857";

// Create WFS source
const forestryRoadSource = new VectorSource({
  format: new GeoJSON(),
  url: (extent) => {
    const bbox = extent.join(",");
    return `${baseUrl}?service=${service}&version=${version}&request=${request}&typeName=${typeName}&srsName=${srsName}&bbox=${bbox},${srsName}&outputFormat=${outputFormat}&startIndex=0&count=100000`;
  },
  strategy: tile(createXYZ({ tileSize: 512 })),
});

const roadStyle = new Style({
  stroke: new Stroke({
    color: "blue",
    width: 2,
  }),
});

const ForestryRoadsLayer = new Vector({
  properties: { title: "Skogsbilveg" },
  visible: false,
  source: forestryRoadSource,
  style: roadStyle,
  minZoom: 9.5,
});

export default ForestryRoadsLayer;
