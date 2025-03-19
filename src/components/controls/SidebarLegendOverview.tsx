import React, { useState, useEffect, useCallback } from "react";
import { Map } from "ol";
import ImageLayer from "ol/layer/Image";
import ImageWMS from "ol/source/ImageWMS";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import Feature from "ol/Feature";
import Geometry from "ol/geom/Geometry";

interface Props {
  map: Map;
  layers: (
    | ImageLayer<ImageWMS>
    | VectorLayer<VectorSource<Feature<Geometry>>, Feature<Geometry>>
  )[];
  isLayerSidebarOpen: boolean;
}

const SidebarLegendOverview: React.FC<Props> = ({
  layers,
  isLayerSidebarOpen,
}) => {
  const [isLegendOpen, setIsLegendOpen] = useState(false);
  const [visibleLayers, setVisibleLayers] = useState<typeof layers>([]);

  // Toggle sidebar open/closed
  const toggleSidebar = () => {
    setIsLegendOpen((prev) => !prev);
  };

  // Use useCallback to memoize the updateVisibleLayers function
  const updateVisibleLayers = useCallback(() => {
    // Use setTimeout to ensure this doesn't run during React's render phase
    setTimeout(() => {
      setVisibleLayers(layers.filter((layer) => layer.getVisible()));
    }, 0);
  }, [layers]);

  // Effect to initialize visible layers and set up event listeners
  useEffect(() => {
    // Initial setup of visible layers
    setVisibleLayers(layers.filter((layer) => layer.getVisible()));

    // Attach event listeners to track visibility changes
    layers.forEach((layer) => {
      layer.on("change:visible", updateVisibleLayers);
    });

    // Cleanup event listeners on unmount
    return () => {
      layers.forEach((layer) => {
        layer.un("change:visible", updateVisibleLayers);
      });
    };
  }, [layers, updateVisibleLayers]); // Re-run if the layers list changes

  // Construct legend URL helper function
  const constructLegendUrl = (
    source: ImageWMS,
    layerName: string
  ): string | null => {
    const params = source.getParams();
    // Extract necessary parameters
    const service = params.SERVICE || "WMS";
    const version = params.VERSION || "1.3.0";
    const request = "GetLegendGraphic";
    const format = "image/png";
    const sldVersion = "1.1.0";
    const crs = "EPSG:3857";
    // Build the URL
    const baseUrl = source.getUrl();
    if (!baseUrl) return null;

    const legendUrl = `${baseUrl}?SERVICE=${service}&VERSION=${version}&REQUEST=${request}&FORMAT=${format}&LAYER=${layerName}&SLD_VERSION=${sldVersion}&CRS=${crs}`;
    return legendUrl;
  };

  return (
    <div>
      <button className="legend-sidebar-toggle-button" onClick={toggleSidebar}>
        {isLegendOpen ? "Skjul Tegnforklaring" : "Vis Tegnforklaring"}
      </button>
      <div
        className={`legend-sidebar ${isLegendOpen ? "open" : "closed"} ${
          isLegendOpen && isLayerSidebarOpen ? "shifted" : ""
        }`}
      >
        <h4>Tegnforklaring</h4>
        <div className="legend-list">
          {visibleLayers.map((layer, index) => {
            const source = layer.getSource();
            if (source instanceof ImageWMS) {
              const params = source.getParams();
              if (!params.LAYERS) {
                return null;
              }
              // Split the layers in the LAYERS parameter into individual layers
              const layersArray = params.LAYERS.split(",");
              return (
                <div key={index} className="legend-item">
                  <h4>{layer.getProperties().title || "Unnamed Layer"}</h4>
                  {layersArray.map((layerName: string, layerIndex: number) => {
                    const legendUrl = constructLegendUrl(source, layerName);
                    return (
                      <div key={layerIndex}>
                        {legendUrl && (
                          <img
                            src={legendUrl}
                            alt={`Legend for ${layerName}`}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            }
            return null;
          })}
        </div>
      </div>
    </div>
  );
};

export default SidebarLegendOverview;
