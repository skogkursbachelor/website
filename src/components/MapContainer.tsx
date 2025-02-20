import { useLayoutEffect, useRef, useState } from "react";
import Map from "ol/Map";
import View from "ol/View";
import { fromLonLat } from "ol/proj";
import "ol/ol.css";
import BaseLayerGroup from "./layers/BaseLayerGroup.tsx";
import MapZoom from "./controls/MapZoom.tsx";
import MapOverview from "./controls/MapOverview.tsx";
import MapScaleLine from "./controls/MapScaleLine.tsx";
import SuperficialDepositsLayer from "./layers/SuperficialDepositsLayer.tsx";
import SoilMoistureLayer from "./layers/NcWMSLayer.tsx";
import BaseLayerSelector from "./controls/BaseLayerSelector.tsx";
import SidebarLayerSelector from "./controls/SidebarLayerSelector.tsx";
import FrostDepthLayer from "./layers/FrostDepthLayer.tsx";
import MapGeolocation from "./controls/MapGeolocation.tsx";
import NibioSoilMoistureLayer from "./layers/NibioSoilMoistureLayer.tsx";

const MapContainer: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapInstance, setMapInstance] = useState<Map | null>(null);

  useLayoutEffect(() => {
    if (!mapRef.current) return;

    const map = new Map({
      target: mapRef.current,
      view: new View({
        center: fromLonLat([10, 59]),
        zoom: 5,
      }),
      controls: [], // Disable default controls
    });

    setMapInstance(map);

    return () => map.setTarget(undefined);
  }, []); // Empty dependency array ensures it runs once when the component mounts

  return (
    <div>
      <div ref={mapRef} className="map-container" />
      {mapInstance && (
        <>
          <BaseLayerGroup map={mapInstance} />
          <MapZoom map={mapInstance} />
          <MapOverview map={mapInstance} />
          <MapScaleLine map={mapInstance} />
          <MapGeolocation map={mapInstance} />
          <BaseLayerSelector map={mapInstance} />
          <SidebarLayerSelector
            map={mapInstance}
            layers={[
              SuperficialDepositsLayer,
              SoilMoistureLayer,
              FrostDepthLayer,
              NibioSoilMoistureLayer,
            ]}
          />
        </>
      )}
    </div>
  );
};

export default MapContainer;
