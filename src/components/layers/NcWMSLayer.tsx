import { useEffect } from "react";
import { Map } from "ol";
import ImageLayer from "ol/layer/Image";
import ImageWMS from "ol/source/ImageWMS";

interface Props {
    map: Map;
}

const SoilMoistureLayer: React.FC<Props> = ({ map }) => {
    useEffect(() => {
        if (!map) return;

        const soilMoistureWMS = new ImageWMS({
            // TODO: Get URL from env or config
            url: "http://10.212.171.219:3030/ncWMS2/wms",
            params: {
                item: "layerDetails",
                layers: "1/sm",
                styles: "raster/default",
                TIME: "2024-04-19T00:00:00.000Z", // Example time
                // TODO: Add time control
            },
            ratio: 1,
        });

        const soilMoistureLayer = new ImageLayer({
            source: soilMoistureWMS,
            opacity: 0.75,
            visible: true,
        });

        map.addLayer(soilMoistureLayer);

        return () => {
            map.removeLayer(soilMoistureLayer);
        };
    }, [map]);

    return null;
};

export default SoilMoistureLayer;
