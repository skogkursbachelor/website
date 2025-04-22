import { getTrafficabilityColor } from "./trafficability";

const green = [0, 255, 0];
const yellow = [255, 255, 0];
const red = [255, 0, 0];

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
    const result = getTrafficabilityColor(5, 10, 50); // low water saturation
    expect(result).toEqual(green);
  });

  test("uses default frost depth threshold when not provided", () => {
    const result = getTrafficabilityColor(5, undefined as any, 80);
    expect(result).toEqual(red);
  });
});
