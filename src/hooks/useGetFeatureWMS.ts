import { useState, useEffect } from "react";
import ImageLayer from "ol/layer/Image";
import { ImageWMS } from "ol/source";
import Map from "ol/Map";

interface QueryResult {
  position: { x: number; y: number } | null;
  features: string[];
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const useWMSFeatureQuery = (
  map: Map | null,
  layers: ImageLayer<ImageWMS>[]
): QueryResult => {
  const [queryPosition, setQueryPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [features, setFeatures] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!map) return;

    const handleMapClick = async (event: any) => {
      const pixel = map.getPixelFromCoordinate(event.coordinate);

      // Reset previous query
      setFeatures([]);
      setQueryPosition({ x: pixel[0], y: pixel[1] });
      setIsOpen(true);

      const visibleLayers = layers.filter((layer) => layer.getVisible());

      const promises = visibleLayers.map(async (layer) => {
        const source = layer.getSource();
        if (source instanceof ImageWMS) {
          let url = source.getFeatureInfoUrl(
            event.coordinate,
            map.getView().getResolution()!,
            "EPSG:3857",
            { INFO_FORMAT: "text/html", REQUEST: "GetFeatureInfo" }
          );

          if (url) {
            try {
              const response = await fetch(url);
              const text = await response.text();
              console.log(text);
              return text;
            } catch (error) {
              console.error("Error fetching feature info:", error);
              return null;
            }
          }
        }
        return null;
      });

      const results: string[] = (await Promise.all(promises)).filter(
        (result): result is string => result !== null
      );
      setFeatures(results);
    };

    map.on("click", handleMapClick);
    return () => {
      map.un("click", handleMapClick);
    };
  }, [map, layers]);

  return { position: queryPosition, features, isOpen, setIsOpen };
};

export default useWMSFeatureQuery;
