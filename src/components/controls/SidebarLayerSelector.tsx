import React, { useEffect, useState } from "react";
import { Map } from "ol";
import ImageLayer from "ol/layer/Image";
import ImageWMS from "ol/source/ImageWMS";

interface Props {
  map: Map;
  layers: ImageLayer<ImageWMS>[];
}

const SidebarLayerSelector: React.FC<Props> = ({ map, layers }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      {/* Button to toggle sidebar visibility */}
      <button
        className="sidebar-toggle-button"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? "Skjul Kartvalg" : "Vis Kartvalg"}
      </button>

      {/* Sidebar */}
      <div className={`sidebar ${isOpen ? "open" : "closed"}`}>
        <h3>Layer Controls</h3>
        <ToggleLayers map={map} layers={layers} />
      </div>
    </div>
  );
};

export default SidebarLayerSelector;

const ToggleLayers: React.FC<Props> = ({ map, layers }) => {
  // Track visibility for each layer
  const [visibility, setVisibility] = useState<boolean[]>(
    layers.map((layer) => layer.getVisible())
  );

  // Add or remove layers when the map or layers change
  useEffect(() => {
    if (!map || layers.length === 0) return;

    layers.forEach((layer) => {
      if (!map.getLayers().getArray().includes(layer)) {
        map.addLayer(layer);
      }
    });

    return () => {
      layers.forEach((layer) => {
        if (map.getLayers().getArray().includes(layer)) {
          map.removeLayer(layer);
        }
      });
    };
  }, [map, layers]);

  // Toggle visibility of a layer
  const toggleLayer = (index: number) => {
    setVisibility((prevVisibility) => {
      const newVisibility = [...prevVisibility];
      newVisibility[index] = !newVisibility[index];
      layers[index].setVisible(newVisibility[index]);
      return newVisibility;
    });
  };

  useEffect(() => {
    // Update the visibility state if the layers change dynamically
    setVisibility(layers.map((layer) => layer.getVisible()));
  }, [layers]);
  return (
    <div className="layer-list">
      {layers.map((layer, index) => (
        <label key={index} className="layer-item">
          <span>{layer.getProperties().title}</span>
          <input
            type="checkbox"
            checked={visibility[index]}
            onChange={() => toggleLayer(index)}
          />
        </label>
      ))}
    </div>
  );
};
