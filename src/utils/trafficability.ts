// Good trafficability is represented by green color
const green = [41, 212, 96];

// Yellow indicates caution, meaning the trafficability is moderate
const yellow = [248, 252, 0];

// Red indicates poor trafficability
const red = [248, 34, 0];

/**
 * Determines the color of a road based on frost depth and water saturation.
 * The colors are either green (good trafficability), yellow (moderate trafficability), or red (poor trafficability).
 * @param frostDepth - The depth of frost in cm.
 * @param frostDepthThreshold - The threshold for frost depth (default is 10 cm).
 * @param waterSaturation - The percentage of water saturation.
 * @param minWaterSaturationThreshold - The minimum threshold for water saturation (default is 65%).
 * @param maxWaterSaturationThreshold - The maximum threshold for water saturation (default is 80%).
 * @returns An array representing the RGB color for trafficability.
 */
function getTrafficabilityColor(
  frostDepth: number,
  frostDepthThreshold = 10,
  waterSaturation: number,
  minSaturationThreshold = 65,
  maxSaturationThreshold = 80
): number[] {
  if (frostDepth >= frostDepthThreshold) {
    return green;
  }

  if (waterSaturation >= maxSaturationThreshold) {
    return red;
  }

  if (waterSaturation >= minSaturationThreshold) {
    return yellow;
  }

  return green;
}

export { getTrafficabilityColor };
