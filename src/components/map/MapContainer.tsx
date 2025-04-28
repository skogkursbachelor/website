import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Map as OpenLayersMap } from "ol";
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
import { setWaterSaturationThresholds } from "./layers/ForestryRoadLayer.tsx";
import { setFrostDepthThreshold } from "./layers/ForestryRoadLayer.tsx";
import SidebarThresholdConfig from "./controls/SidebarThresholdConfig.tsx";
import { superficialDepositTypes } from "../../constants/superficialDepositTypes.ts";
import Attribution from "ol/control/Attribution";
import QueryOverlay from "./controls/QueryOverlay.tsx";
import { FeatureLike } from "ol/Feature";

// Map Layers
import FrostDepthLayer from "./layers/FrostDepthLayer.tsx";
import SuperficialDepositsLayer from "./layers/SuperficialDepositsLayer.tsx";
import NibioSoilMoistureLayer from "./layers/NibioSoilMoistureLayer.tsx";
import ForestryRoadLayer, {
  setHoveredFeature,
} from "./layers/ForestryRoadLayer.tsx";
import CopernicusSoilMoistureLayer from "./layers/CopernicusSoilMoistureLayer.tsx";
import SoilSaturationLayer from "./layers/SoilSaturationLayer.tsx";
import { Coordinate } from "ol/coordinate";

const MapContainer: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);

  const [mapInstance, setMapInstance] = useState<OpenLayersMap | null>(null);
  const [date, setDate] = useState(new Date());
  const [isLayerSidebarOpen, setIsLayerSidebarOpen] = useState(false);
  const [isLegendSidebarOpen, setIsLegendSidebarOpen] = useState(false);
  const [waterSaturationThresholdsState, setWaterSaturationThresholdsState] =
    useState<Map<number, { min: number; max: number }>>(() =>
      createDefaultThresholds()
    );
  const [frostDepthThresholdState, setFrostDepthThresholdState] =
    useState<number>(10);
  const [clickCoord, setClickCoord] = useState<Coordinate | null>(null);
  const [clickedFeature, setClickedFeature] = useState<FeatureLike | null>(
    null
  );

  // Define layers
  const layers = [
    SuperficialDepositsLayer,
    FrostDepthLayer,
    SoilSaturationLayer,
    NibioSoilMoistureLayer,
    ForestryRoadLayer,
    CopernicusSoilMoistureLayer,
  ];

  function createDefaultThresholds(): Map<
    number,
    { min: number; max: number }
  > {
    const map = new Map<number, { min: number; max: number }>();
    superficialDepositTypes.forEach((type) => {
      // Set default values for min and max
      map.set(type.code, { min: 45, max: 75 });
    });
    return map;
  }

  useEffect(() => {
    setWaterSaturationThresholds(waterSaturationThresholdsState);
  }, [waterSaturationThresholdsState]);

  useEffect(() => {
    setFrostDepthThreshold(frostDepthThresholdState);
  }, [frostDepthThresholdState]);

  // Initialize the map
  useLayoutEffect(() => {
    if (!mapRef.current) return;

    const attribution = new Attribution({
      collapsible: false,
    });

    const map = new OpenLayersMap({
      target: mapRef.current,
      view: new View({
        center: fromLonLat([10, 59]),
        zoom: 5,
      }),
      controls: [attribution],
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

    map.on("singleclick", (event) => {
      const feature = map.forEachFeatureAtPixel(event.pixel, (feat) => feat, {
        hitTolerance: 5,
      });

      if (feature && feature.get("layerId") === "forestryRoad") {
        setClickCoord(event.coordinate);
        setClickedFeature(feature);
      } else {
        setClickCoord(null);
        setClickedFeature(null);
      }
    });

    return () => map.setTarget(undefined);
  }, []); // Empty dependency array ensures it runs once when the component mounts

  return (
    <div className="map-wrapper">
      <div className="date-picker-container">
        <DatePicker date={date} setDate={setDate} layers={layers} />
      </div>

      <div ref={mapRef} className="map-container">
        {mapInstance && (
          <>
            <BaseLayerGroup map={mapInstance} />
            <MapZoom map={mapInstance} />
            <MapOverview map={mapInstance} />
            <MapScaleLine map={mapInstance} />
            <MapGeolocation map={mapInstance} />
            <BaseLayerSelector map={mapInstance} />
            <SidebarThresholdConfig
              waterSaturationThresholds={waterSaturationThresholdsState}
              setWaterSaturationThresholdsState={
                setWaterSaturationThresholdsState
              }
              setFrostDepthThresholdState={setFrostDepthThresholdState}
              isLayerSidebarOpen={isLayerSidebarOpen}
              isLegendSidebarOpen={isLegendSidebarOpen}
            />
            <SidebarLayerSelector
              map={mapInstance}
              layers={layers}
              setLayerSidebarOpen={setIsLayerSidebarOpen}
            />
            <SidebarLegendOverview
              map={mapInstance}
              layers={layers}
              isLayerSidebarOpen={isLayerSidebarOpen}
              setLegendSidebarOpen={setIsLegendSidebarOpen}
            />
            <QueryOverlay
              map={mapInstance}
              coordinate={clickCoord}
              feature={clickedFeature}
              onClose={() => {
                setClickCoord(null);
                setClickedFeature(null);
              }}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default MapContainer;
