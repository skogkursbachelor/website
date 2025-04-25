import { useEffect, useRef, useState } from "react";
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
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (!overlayRef.current) return;
    const overlay = new Overlay({
      element: overlayRef.current,
      stopEvent: true,
      positioning: "top-center",
      offset: [0, 10],
      autoPan: {
        animation: {
          duration: 250,
        },
      },
    });
    map.addOverlay(overlay);
    olOverlayRef.current = overlay;

    const handleDragStart = () => setIsDragging(true);
    const handleDragEnd = () => setIsDragging(false);

    map.on("pointerdrag", handleDragStart);
    map.on("pointermove", handleDragEnd);

    return () => {
      map.removeOverlay(overlay);
      map.un("pointerdrag", handleDragStart);
      map.un("pointermove", handleDragEnd);
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

      if (
        isDragging ||
        !container ||
        container.contains(event.target as Node)
      ) {
        // Prevent closing overlay if dragging or clicking inside the overlay
        return;
      }

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
  }, [map, onClose, isDragging]);

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
    console.log("Feature props:", feature?.getProperties());
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
      erklyngesenterundervann: "Er klyngesenter under vann?",
    };
    return (
      <div className="query-overlay-feature-info">
        {Object.entries(fieldLabels).map(([key, label]) => (
          <div key={key}>
            <strong>{label}:</strong> {props[key].toString() ?? "-"}
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
