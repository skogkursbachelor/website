import { GeoJSON } from "ol/format";
import { FeatureLike } from "ol/Feature";
import { Style, Stroke } from "ol/style";
import { Vector as VectorLayer } from "ol/layer";
import VectorSource from "ol/source/Vector";
import {transformExtent} from "ol/proj";
import {register} from "ol/proj/proj4";
import { bbox as bboxStrategy } from "ol/loadingstrategy";
import proj69 from "proj4";

proj69.defs("EPSG:25833","+proj=utm +zone=33 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs");
register(proj69);

// Define WFS parameters as variables
const baseUrl = "http://localhost:5173/skogsbilveg";
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
    const transformedExtent = transformExtent(extent, "EPSG:3857", "EPSG:25833");
    const bbox = transformedExtent.join(",");
    const date = new Date(Date.now()).toISOString();
    return `${baseUrl}?service=${service}&version=${version}&request=${request}&typeName=${typeName}&srsName=${srsName}&bbox=${bbox},${srsName}&outputFormat=${outputFormat}&startIndex=0&count=100000&time=${date}`;
  },

  strategy: bboxStrategy,
});

let hoveredFeature: FeatureLike | null = null;

// Function to dynamically set style based on feature properties
export const roadStyle = (feature: FeatureLike) => {
  let color: number[] | undefined = feature.get("farge");

    if (!color) {
        color = [255, 0, 255];
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
  visible: false,
  source: forestryRoadSource,
  style: roadStyle,
  minZoom: 9.5,
});

export default ForestryRoadsLayer;
