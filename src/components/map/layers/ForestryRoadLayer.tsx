import { GeoJSON } from "ol/format";
import { FeatureLike } from "ol/Feature";
import { Style, Stroke } from "ol/style";
import { Vector as VectorLayer } from "ol/layer";
import VectorSource from "ol/source/Vector";
import { transformExtent } from "ol/proj";
import { register } from "ol/proj/proj4";
import { bbox as bboxStrategy } from "ol/loadingstrategy";
import proj69 from "proj4";
import { getTrafficabilityColor } from "../../../utils/trafficability";

proj69.defs(
  "EPSG:25833",
  "+proj=utm +zone=33 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs"
);
register(proj69);

let currentThresholds = new Map<number, number>();

export const setThresholds = (thresholdMap: Map<number, number>) => {
  currentThresholds = thresholdMap;
  forestryRoadSource.changed();
  console.log("Thresholds updated:", currentThresholds);
};

// Define WFS parameters as variables
const baseUrl = `http://${window.location.hostname}:${
  import.meta.env.VITE_API_PORT
}${import.meta.env.VITE_FORESTRYROADS_URL}`;
const service = "WFS";
const version = "2.0.0";
const request = "GetFeature";
const typeName = "ms:skogsbilveg";
const outputFormat = "geojson";
const srsName = "EPSG:25833";

// Create WFS source
const forestryRoadSource = new VectorSource({
  format: new GeoJSON(),
  url: (extent) => {
    const transformedExtent = transformExtent(
      extent,
      "EPSG:3857",
      "EPSG:25833"
    );
    const bbox = transformedExtent.join(",");
    const date = new Date(Date.now()).toISOString();
    return `${baseUrl}?service=${service}&version=${version}&request=${request}&typeName=${typeName}&srsName=${srsName}&bbox=${bbox},${srsName}&outputFormat=${outputFormat}&startIndex=0&count=100000&time=${date}`;
  },
  strategy: bboxStrategy,
  attributions:
    'Kartdata: © <a href="https://www.kartverket.no">Kartverket</a>, <a href="https://www.geodata.no">Geodata</a>, Geovekst, kommuner, <a href="https://www.openstreetmap.org/copyright">OSM</a>, <a href="https://www.ngu.no">NGU</a> | Data: <a href="https://www.nve.no">NVE</a>, <a href="https://met.no">MET</a> | Kilder: <a href="https://www.senorge.no">SeNorge</a>',
});

// Add id to features on load
forestryRoadSource.on("addfeature", (e) => {
  const feature = e.feature;
  if (feature) {
    if (!feature.getId()) {
      const roadNumber = `${feature.get("kommunenummer")}-${feature.get(
        "vegnummer"
      )}-${feature.get("strekningnummer")}`;
      feature.setId(`${roadNumber}`);
    }
    feature.set("layerId", "forestryRoad");
  }
});

let hoveredFeature: FeatureLike | null = null;

// Function to dynamically set style based on feature properties
const roadStyle = (feature: FeatureLike) => {
  const frostDepth = feature.get("teledybde");
  const soilSaturation = feature.get("vannmetning");
  const depositType = feature.get("løsmassekoder");
  //const soilTemperature = feature.get("Jordtemperatur54cm");

  const threshold = currentThresholds.get(depositType) ?? 75;

  const color = getTrafficabilityColor(
    frostDepth,
    10,
    soilSaturation,
    threshold
  );

  // Increase width on hover
  const width = feature === hoveredFeature ? 6 : 3;

  return [
    new Style({
      stroke: new Stroke({
        color: color,
        width: width,
      }),
    }),
  ];
};

export const setHoveredFeature = (feature: FeatureLike | null) => {
  hoveredFeature = feature;
  forestryRoadSource.changed(); // Trigger re-render
  console.log(
    "teledyp:",
    feature?.get("teledybde"),
    "vannmetning",
    feature?.get("vannmetning")
  );
};

const ForestryRoadsLayer = new VectorLayer({
  properties: { title: "Skogsbilveg" },
  visible: false,
  source: forestryRoadSource,
  style: roadStyle,
  minZoom: 9.5,
});

export default ForestryRoadsLayer;
