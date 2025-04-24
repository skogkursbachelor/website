import { useEffect, useRef } from "react";
import Overlay from "ol/Overlay";
import { Map } from "ol";
import { Coordinate } from "ol/coordinate";
import { FeatureLike } from "ol/Feature";
import XMarkIcon from "./XMarkIcon";

interface Props {
  map: Map;
  coordinate: Coordinate | null;
  feature: FeatureLike | null;
  onClose: () => void;
}

const QueryOverlay: React.FC<Props> = ({
  map,
  coordinate,
  feature,
  onClose,
}) => {
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const olOverlayRef = useRef<Overlay | null>(null);

  useEffect(() => {
    if (!overlayRef.current) return;
    const overlay = new Overlay({
      element: overlayRef.current,
      stopEvent: true,
      positioning: "top-center", // Using top-center as you specified
      offset: [0, 10], // Add a small offset for better positioning
      autoPan: {
        animation: {
          duration: 250,
        },
      },
    });
    map.addOverlay(overlay);
    olOverlayRef.current = overlay;
    return () => {
      map.removeOverlay(overlay);
    };
  }, [map]);

  // Set position on coordinate/feature change
  useEffect(() => {
    const overlay = olOverlayRef.current;
    if (overlay) {
      if (coordinate && feature) {
        overlay.setPosition(coordinate);
      } else {
        overlay.setPosition(undefined);
      }
    }
  }, [coordinate, feature]);

  // Close only when clicking on the map
  useEffect(() => {
    // Use a dedicated click listener on the map element
    const mapElement = map.getTargetElement();

    const handleMapClick = (event: MouseEvent) => {
      const container = overlayRef.current;

      // Check if the click is on the map AND not inside the overlay
      if (container && !container.contains(event.target as Node)) {
        // Only close if we clicked directly on the map's canvas element
        const canvasElements = mapElement.getElementsByTagName("canvas");
        for (let i = 0; i < canvasElements.length; i++) {
          if (canvasElements[i].contains(event.target as Node)) {
            onClose();
            break;
          }
        }
      }
    };

    // Add the event listener to the map's container element
    if (mapElement) {
      mapElement.addEventListener("click", handleMapClick);
    }

    return () => {
      if (mapElement) {
        mapElement.removeEventListener("click", handleMapClick);
      }
    };
  }, [map, onClose]);

  // Close sidebar on Escape key press
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEscapeKey);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("keydown", handleEscapeKey);
    };
  }, [onClose]);

  const getFeatureInfo = (feature: FeatureLike | null) => {
    if (!feature) return null;
    const props = feature.getProperties();
    const fieldLabels: Record<string, string> = {
      kommunenummer: "Kommunenummer",
      vegkategori: "Vegkategori",
      vegfase: "Vegfase",
      vegnummer: "Vegnummer",
      strekningnummer: "Strekning",
      delstrekningnummer: "Delstrekning",
      frameter: "Fra meter",
      tilmeter: "Til meter",
      teledybde: "Teledybde (cm)",
      vannmetning: "Vannmetning (%)",
      løsmassekoder: "Løsmassekoder",
      jordtemperatur54cm: "Jordtemp. 54 cm (°C)",
    };
    return (
      <div className="query-overlay-feature-info">
        {Object.entries(fieldLabels).map(([key, label]) => (
          <div key={key}>
            <strong>{label}:</strong>{" "}
            {props[key] !== null && props[key] !== undefined ? props[key] : "–"}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div ref={overlayRef} className="query-overlay">
      <button className="query-overlay-close-button" onClick={onClose}>
        <XMarkIcon color="black" />
      </button>
      {getFeatureInfo(feature)}
    </div>
  );
};

export default QueryOverlay;
