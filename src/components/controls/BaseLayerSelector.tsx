import { useState, useEffect } from "react";
import { Map } from "ol";
import LayerGroup from "ol/layer/Group";
import { Layer } from "ol/layer";

interface Props {
  map: Map;
}

const BaseLayerSelector: React.FC<Props> = ({ map }) => {
  const [layers, setLayers] = useState<Layer[]>([]);

  useEffect(() => {
    if (!map) return;

    const layerGroupTitle = "BaseLayerGroup";
    const layerGroup = map
      .getLayers()
      .getArray()
      .find(
        (group) => group.getProperties().title === layerGroupTitle
      ) as LayerGroup;

    if (layerGroup) {
      const layersArray = layerGroup.getLayers().getArray() as Layer[];
      setLayers(layersArray);
    }
  }, [map]);

  const setActiveLayer = (index: number) => {
    if (!map) return;

    const layerGroupTitle = "BaseLayerGroup";
    const layerGroup = map
      .getLayers()
      .getArray()
      .find(
        (group) => group.getProperties().title === layerGroupTitle
      ) as LayerGroup;

    if (!layerGroup) {
      console.error(`${layerGroupTitle} not found`);
      return;
    }

    const layers = layerGroup.getLayers().getArray();

    // Set visibility of each layer based on index
    layers.forEach((layer, idx) => {
      layer.setVisible(idx === index);
    });
  };

  return (
    <div className="base-layer-selector">
      {layers.map((layer, index) => (
        <button key={index} onClick={() => setActiveLayer(index)}>
          {layer.getProperties().title}
        </button>
      ))}
    </div>
  );
};

export default BaseLayerSelector;
