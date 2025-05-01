import { getTrafficabilityColor } from "./trafficability";

const green = [41, 212, 96];
const yellow = [248, 252, 0];
const red = [248, 34, 0];

describe("getTrafficabilityColor", () => {
  test("returns green when frost depth is above threshold (good trafficability)", () => {
    const result = getTrafficabilityColor(15, 10, 80);
    expect(result).toEqual(green);
  });

  test("returns red when frost depth is below threshold and water saturation is high", () => {
    const result = getTrafficabilityColor(5, 10, 80); // high water saturation
    expect(result).toEqual(red);
  });

  test("returns yellow when frost depth is below threshold and water saturation is moderate", () => {
    const result = getTrafficabilityColor(5, 10, 70); // moderately high water saturation
    expect(result).toEqual(yellow);
  });

  test("returns green when frost depth is below threshold and water saturation is low", () => {
    const result = getTrafficabilityColor(5, 10, 40); // low water saturation
    expect(result).toEqual(green);
  });

  test("uses default frost depth threshold when not provided", () => {
    const result = getTrafficabilityColor(5, undefined as any, 80);
    expect(result).toEqual(red);
  });

  test("uses custom minWaterSaturationThreshold: returns yellow if saturation is above new min", () => {
    const result = getTrafficabilityColor(5, 10, 60, 55, 85);
    expect(result).toEqual(yellow);
  });

  test("uses custom maxWaterSaturationThreshold: returns red if saturation is above new max", () => {
    const result = getTrafficabilityColor(5, 10, 86, 45, 85);
    expect(result).toEqual(red);
  });

  test("returns green if saturation is below custom min threshold", () => {
    const result = getTrafficabilityColor(5, 10, 40, 50, 90);
    expect(result).toEqual(green);
  });

  test("returns yellow when saturation is between custom min and max thresholds", () => {
    const result = getTrafficabilityColor(5, 10, 65, 60, 80);
    expect(result).toEqual(yellow);
  });
});
