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
  setLegendSidebarOpen: (isOpen: boolean) => void;
}

const SidebarLegendOverview: React.FC<Props> = ({
  layers,
  isLayerSidebarOpen,
  setLegendSidebarOpen,
}) => {
  const [isLegendSidebarOpen, setIsLegendSidebarOpen] = useState(false);
  const [visibleLayers, setVisibleLayers] = useState<typeof layers>([]);

  useEffect(() => {
    setLegendSidebarOpen(isLegendSidebarOpen);
  }, [isLegendSidebarOpen, setLegendSidebarOpen]);

  // Toggle sidebar open/closed
  const toggleSidebar = () => {
    setIsLegendSidebarOpen((prev) => !prev);
  };

  // Close sidebar on Escape key press
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsLegendSidebarOpen(false); // Close sidebar
      }
    };

    window.addEventListener("keydown", handleEscapeKey);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("keydown", handleEscapeKey);
    };
  }, []);

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

  return (
    <div>
      <button
        className={`legend-sidebar-toggle-button ${
          isLegendSidebarOpen ? "open" : ""
        }`}
        onClick={toggleSidebar}
      >
        {"Tegnforklaring"}
      </button>
      <div
        className={`legend-sidebar ${isLegendSidebarOpen ? "open" : "closed"} ${
          isLegendSidebarOpen && isLayerSidebarOpen ? "shifted" : ""
        }`}
      >
        <h3>Tegnforklaring</h3>
        <div className="legend-list">
          {visibleLayers.map((layer, index) => {
            const legendUrls = layer.getProperties().legendUrls as Record<
              string,
              string
            >;

            if (legendUrls) {
              return (
                <div key={index} className="legend-item">
                  <h4>{layer.getProperties().title || "Kartlag"}</h4>
                  {Object.entries(legendUrls).map(
                    ([layerName, legendUrl], i) => (
                      <div key={i}>
                        <img
                          src={legendUrl}
                          alt={`Innholdsfortegnelse for ${layerName}`}
                        />
                      </div>
                    )
                  )}
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
