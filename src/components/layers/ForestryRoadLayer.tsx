import { GeoJSON } from "ol/format";
import { FeatureLike } from "ol/Feature";
import { Style, Stroke } from "ol/style";
import { Vector as VectorLayer } from "ol/layer";
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

let hoveredFeature: FeatureLike | null = null;

// Function to dynamically set style based on feature properties and hover state
export const roadStyle = (feature: FeatureLike) => {
  const kommunenummer: number | undefined = feature.get("kommunenummer");

  let color = "red"; // Default color
  if (kommunenummer && kommunenummer >= 3401 && kommunenummer <= 3454) {
    color = "blue";
  }

  const width = feature === hoveredFeature ? 5 : 2; // Increase width on hover

  return new Style({
    stroke: new Stroke({
      color: color,
      width: width,
    }),
  });
};

export const setHoveredFeature = (feature: FeatureLike | null) => {
  hoveredFeature = feature;
  forestryRoadSource.changed(); // Trigger re-render
};

const ForestryRoadsLayer = new VectorLayer({
  properties: { title: "Skogsbilveg" },
  visible: true,
  source: forestryRoadSource,
  style: roadStyle,
  minZoom: 9.5,
});

export default ForestryRoadsLayer;
