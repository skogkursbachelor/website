import React, { useEffect, useState } from "react";
import { Map } from "ol";
import ImageLayer from "ol/layer/Image";
import ImageWMS from "ol/source/ImageWMS";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import Feature from "ol/Feature";
import Geometry from "ol/geom/Geometry";

interface SidebarProps {
  map: Map;
  layers: (
    | ImageLayer<ImageWMS>
    | VectorLayer<VectorSource<Feature<Geometry>>, Feature<Geometry>>
  )[];
  setLayerSidebarOpen: (isOpen: boolean) => void;
}

const SidebarLayerSelector: React.FC<SidebarProps> = ({
  map,
  layers,
  setLayerSidebarOpen,
}) => {
  const [isLayerSidebarOpen, setIsLayerSidebarOpen] = useState(false);

  useEffect(() => {
    setLayerSidebarOpen(isLayerSidebarOpen);
  }, [isLayerSidebarOpen, setLayerSidebarOpen]);

  // Close sidebar on Escape key press
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsLayerSidebarOpen(false); // Close sidebar
      }
    };

    window.addEventListener("keydown", handleEscapeKey);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("keydown", handleEscapeKey);
    };
  }, []);

  const toggleSidebar = () => {
    setIsLayerSidebarOpen((prev) => !prev);
  };

  return (
    <div>
      <button
        className={`layer-sidebar-toggle-button ${
          isLayerSidebarOpen ? "open" : ""
        }`}
        onClick={toggleSidebar}
      >
        {"Kartvalg"}
      </button>
      <div
        className={`layer-sidebar ${isLayerSidebarOpen ? "open" : "closed"}`}
      >
        <h3>Kartvalg</h3>
        <ToggleLayers map={map} layers={layers} />
      </div>
    </div>
  );
};

interface ToggleLayerProps {
  map: Map;
  layers: (
    | ImageLayer<ImageWMS>
    | VectorLayer<VectorSource<Feature<Geometry>>, Feature<Geometry>>
  )[];
}

const ToggleLayers: React.FC<ToggleLayerProps> = ({ map, layers }) => {
  const [visibility, setVisibility] = useState<boolean[]>(
    layers.map((layer) => layer.getVisible())
  );

  useEffect(() => {
    // Add layers to map if not already added
    layers.forEach((layer) => {
      if (!map.getLayers().getArray().includes(layer)) {
        map.addLayer(layer);
      }
    });

    // Cleanup function to remove layers when component unmounts
    return () => {
      layers.forEach((layer) => {
        if (map.getLayers().getArray().includes(layer)) {
          map.removeLayer(layer);
        }
      });
    };
  }, [map, layers]);

  // Initialize visibility state when layers change
  useEffect(() => {
    setVisibility(layers.map((layer) => layer.getVisible()));
  }, [layers]);

  // Apply visibility changes to the actual layers
  useEffect(() => {
    layers.forEach((layer, index) => {
      if (layer.getVisible() !== visibility[index]) {
        // Use setTimeout to ensure this runs after React's render phase
        setTimeout(() => {
          layer.setVisible(visibility[index]);
        }, 0);
      }
    });
  }, [visibility, layers]);

  // Toggle handler that only updates React state
  const toggleLayer = (index: number) => {
    setVisibility((prevVisibility) => {
      const newVisibility = [...prevVisibility];
      newVisibility[index] = !newVisibility[index];
      return newVisibility;
    });
  };

  return (
    <div className="layer-list">
      {layers.map((layer, index) => (
        <label key={index} className="layer-item">
          <span>{layer.getProperties().title}</span>
          <input
            type="checkbox"
            checked={visibility[index] || false}
            onChange={() => toggleLayer(index)}
          />
        </label>
      ))}
    </div>
  );
};

export default SidebarLayerSelector;
