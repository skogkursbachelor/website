import React, { useEffect, useState } from "react";
import { Map } from "ol";
import ImageLayer from "ol/layer/Image";
import ImageWMS from "ol/source/ImageWMS";

interface Props {
  map: Map;
  layers: ImageLayer<ImageWMS>[];
}

const SidebarLayerSelector: React.FC<Props> = ({ map, layers }) => {
  const [isOpen, setIsOpen] = useState(true); // Sidebar starts open

  return (
    <div>
      {/* Button to toggle sidebar visibility */}
      <button className="sidebar-toggle-btn" onClick={() => setIsOpen(!isOpen)}>
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
  const [visibility, setVisibility] = useState<boolean[]>(() =>
    layers.map((layer) => layer.getVisible())
  );

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

  const toggleLayer = (index: number) => {
    setVisibility((prevVisibility) => {
      return prevVisibility.map((visible, i) => {
        if (i === index) {
          const newVisibility = !visible;
          layers[i].setVisible(newVisibility);
          return newVisibility;
        }
        return visible;
      });
    });
  };

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
