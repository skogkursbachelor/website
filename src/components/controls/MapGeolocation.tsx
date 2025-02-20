import React, { useEffect, useState } from "react";
import { Map } from "ol";
import Geolocation from "ol/Geolocation";

interface Props {
  map: Map;
}

const GeolocationButton: React.FC<Props> = ({ map }) => {
  const [geolocation, setGeolocation] = useState<Geolocation | null>(null);

  useEffect(() => {
    if (!map) return;

    const geo = new Geolocation({
      trackingOptions: { enableHighAccuracy: false },
      projection: map.getView().getProjection(),
    });

    geo.on("error", (error) => {
      console.error("Geolocation error:", error.message);
    });

    setGeolocation(geo);
  }, [map]);

  const centerOnLocation = () => {
    if (!geolocation) return;

    const cachedPosition = geolocation.getPosition();
    if (cachedPosition) {
      map.getView().animate({ center: cachedPosition, zoom: 12 });
      return;
    }

    geolocation.setTracking(true);

    geolocation.once("change:position", () => {
      const coordinates = geolocation.getPosition();
      if (coordinates) {
        map.getView().animate({ center: coordinates, zoom: 12 });
      }
      geolocation.setTracking(false);
    });
  };

  return (
    <button onClick={centerOnLocation} className="geolocation-button">
      <img src="/geopin.png" width={40} />
    </button>
  );
};

export default GeolocationButton;
