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
 * @param minWaterSaturationThreshold - The minimum threshold for water saturation (default is 45%).
 * @param maxWaterSaturationThreshold - The maximum threshold for water saturation (default is 75%).
 * @returns An array representing the RGB color for trafficability.
 */
function getTrafficabilityColor(
  frostDepth: number,
  frostDepthThreshold = 10,
  waterSaturation: number,
  minWaterSaturationThreshold = 45,
  maxWaterSaturationThreshold = 75
): number[] {
  let color = green;

  // If frost depth is above the threshold, trafficability is always good
  if (frostDepth < frostDepthThreshold) {
    // Check if the water saturation is above the thresholds for each superficial deposit type
    if (waterSaturation >= maxWaterSaturationThreshold) {
      color = red;
    } else if (waterSaturation >= minWaterSaturationThreshold) {
      color = yellow;
    }
  }

  return color;
}

export { getTrafficabilityColor };
