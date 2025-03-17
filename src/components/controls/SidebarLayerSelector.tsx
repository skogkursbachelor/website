import React, { useEffect, useState } from "react";
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
}

const SidebarLayerSelector: React.FC<Props> = ({ map, layers }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button
        className="sidebar-toggle-button"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? "Skjul Kartvalg" : "Vis Kartvalg"}
      </button>

      <div className={`sidebar ${isOpen ? "open" : "closed"}`}>
        <h3>Layer Controls</h3>
        <ToggleLayers map={map} layers={layers} />
      </div>
    </div>
  );
};

export default SidebarLayerSelector;

const ToggleLayers: React.FC<Props> = ({ map, layers }) => {
  const [visibility, setVisibility] = useState<boolean[]>(
    layers.map((layer) => layer.getVisible())
  );

  useEffect(() => {
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
      const newVisibility = [...prevVisibility];
      newVisibility[index] = !newVisibility[index];
      layers[index].setVisible(newVisibility[index]);
      return newVisibility;
    });
  };

  useEffect(() => {
    setVisibility(layers.map((layer) => layer.getVisible()));
  }, [layers]);

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
