import { useLayoutEffect, useRef, useState } from "react";
import Map from "ol/Map";
import View from "ol/View";
import { fromLonLat } from "ol/proj";
import "ol/ol.css";
import BaseLayerGroup from "./layers/BaseLayerGroup.tsx";
import MapZoom from "./controls/MapZoom.tsx";
import MapOverview from "./controls/MapOverview.tsx";
import MapScaleLine from "./controls/MapScaleLine.tsx";
import BaseLayerSelector from "./controls/BaseLayerSelector.tsx";
import SidebarLayerSelector from "./controls/SidebarLayerSelector.tsx";
import SidebarLegendOverview from "./controls/SidebarLegendOverview.tsx";
import MapGeolocation from "./controls/MapGeolocation.tsx";
import DatePicker from "./controls/DatePicker.tsx";
import useWMSFeatureQuery from "../../hooks/useGetFeatureWMS.ts";

// Map Layers
import FrostDepthLayer from "./layers/FrostDepthLayer.tsx";
import SuperficialDepositsLayer from "./layers/SuperficialDepositsLayer.tsx";
import SoilMoistureLayer from "./layers/NcWMSLayer.tsx";
import NibioSoilMoistureLayer from "./layers/NibioSoilMoistureLayer.tsx";
import ForestryRoadLayer, {
  setHoveredFeature,
} from "./layers/ForestryRoadLayer.tsx";
import Overlay from "./controls/Overlay.tsx";
import CopernicusSoilMoistureLayer from "./layers/CopernicusSoilMoistureLayer.tsx";

const MapContainer: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapInstance, setMapInstance] = useState<Map | null>(null);
  const [date, setDate] = useState(new Date());
  const [isLayerSidebarOpen, setIsLayerSidebarOpen] = useState(false);

  // Define layers
  const layers = [
    SuperficialDepositsLayer,
    FrostDepthLayer,
    SoilMoistureLayer,
    NibioSoilMoistureLayer,
    ForestryRoadLayer,
    CopernicusSoilMoistureLayer,
  ];

  // Initialize the map
  useLayoutEffect(() => {
    if (!mapRef.current) return;

    const map = new Map({
      target: mapRef.current,
      view: new View({
        center: fromLonLat([10, 59]),
        zoom: 5,
      }),
      controls: [], // Disable default controls
      layers: layers,
    });

    setMapInstance(map);

    // Pointer move event for hover effect
    map.on("pointermove", (event) => {
      const feature = map.forEachFeatureAtPixel(event.pixel, (feat) => feat, {
        hitTolerance: 10,
      });
      setHoveredFeature(feature || null);
    });

    return () => map.setTarget(undefined);
  }, []); // Empty dependency array ensures it runs once when the component mounts

  /*
  // Hook for querying WMS feature info
  const { position, features, isOpen, setIsOpen } = useWMSFeatureQuery(
    mapInstance,
    layers
  );
  */

  return (
    <div className="map-wrapper">
      <div className="date-picker-container">
        <DatePicker date={date} setDate={setDate} layers={layers} />
      </div>

      {/* Make sure all elements are inside this div */}
      <div ref={mapRef} className="map-container">
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
              layers={layers}
              setLayerSidebarOpen={setIsLayerSidebarOpen}
            />
            <SidebarLegendOverview
              map={mapInstance}
              layers={layers}
              isLayerSidebarOpen={isLayerSidebarOpen}
            />
            {/*
            {isOpen && position && (
              <Overlay
                isOpen={isOpen}
                initialPosition={{ x: 300, y: -150 }}
                onClose={() => setIsOpen(false)}
              >
                {features.length > 0 ? (
                  <div>
                    <h3>Objektinformasjon</h3>
                    {features.map((feature, index) => (
                      <iframe
                        key={index}
                        srcDoc={feature}
                        title={`Feature-${index}`}
                        style={{
                          width: "100%",
                          height: "100%",
                          border: "none",
                        }}
                      />
                    ))}
                  </div>
                ) : (
                  <p>Ingen data</p>
                )}
              </Overlay>
            )}*/}
          </>
        )}
      </div>
    </div>
  );
};

export default MapContainer;
