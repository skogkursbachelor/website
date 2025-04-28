import React, { useState, useEffect, useRef } from "react";
import { superficialDepositTypes } from "../../../constants/superficialDepositTypes";

interface Props {
  waterSaturationThresholds: Map<number, { min: number; max: number }>;
  setWaterSaturationThresholdsState: (
    waterSaturationThresholds: Map<number, { min: number; max: number }>
  ) => void;
  frostDepthThreshold: number;
  setFrostDepthThresholdState: (frostDepthThreshold: number) => void;
  isLayerSidebarOpen: boolean;
  isLegendSidebarOpen: boolean;
}

const SidebarTresholdConfig: React.FC<Props> = ({
  waterSaturationThresholds,
  setWaterSaturationThresholdsState,
  frostDepthThreshold,
  setFrostDepthThresholdState,
  isLayerSidebarOpen,
  isLegendSidebarOpen,
}) => {
  const [isConfigSidebarOpen, setIsConfigSidebarOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<number>(
    superficialDepositTypes[0].code
  );
  const [waterSaturationMinValue, setWaterSaturationMinValue] =
    useState<number>(45);
  const [waterSaturationMaxValue, setWaterSaturationMaxValue] =
    useState<number>(75);
  const [frostDepthThresholdInput, setFrostDepthThresholdInput] =
    useState<number>(10);

  const minRef = useRef<HTMLInputElement>(null);
  const maxRef = useRef<HTMLInputElement>(null);
  const leftRangeRef = useRef<HTMLDivElement>(null);
  const midRangeRef = useRef<HTMLDivElement>(null);
  const rightRangeRef = useRef<HTMLDivElement>(null);

  const toggleSidebar = () => {
    setIsConfigSidebarOpen((prev) => !prev);
  };

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedType(Number(event.target.value));
    const selectedThreshold = waterSaturationThresholds.get(
      Number(event.target.value)
    );
    if (selectedThreshold) {
      setWaterSaturationMinValue(selectedThreshold.min);
      setWaterSaturationMaxValue(selectedThreshold.max);
    }
  };

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.min(Number(e.target.value), waterSaturationMaxValue - 1);
    setWaterSaturationMinValue(value);
    updateWaterSaturationThresholds(value, waterSaturationMaxValue);
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(Number(e.target.value), waterSaturationMinValue + 1);
    setWaterSaturationMaxValue(value);
    updateWaterSaturationThresholds(waterSaturationMinValue, value);
  };

  const handleFrostDepthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    setFrostDepthThresholdInput(value);
    setFrostDepthThresholdState(value);
  };

  const updateWaterSaturationThresholds = (newMin: number, newMax: number) => {
    setWaterSaturationThresholdsState(
      new Map(
        waterSaturationThresholds.set(selectedType, {
          min: newMin,
          max: newMax,
        })
      )
    );
  };

  useEffect(() => {
    if (
      minRef.current &&
      maxRef.current &&
      leftRangeRef.current &&
      midRangeRef.current &&
      rightRangeRef.current
    ) {
      const min = 0;
      const max = 100;
      const minPercent = ((waterSaturationMinValue - min) / (max - min)) * 100;
      const maxPercent = ((waterSaturationMaxValue - min) / (max - min)) * 100;

      leftRangeRef.current.style.left = "0%";
      leftRangeRef.current.style.width = `${minPercent}%`;

      midRangeRef.current.style.left = `${minPercent}%`;
      midRangeRef.current.style.width = `${maxPercent - minPercent}%`;

      rightRangeRef.current.style.left = `${maxPercent}%`;
      rightRangeRef.current.style.width = `${100 - maxPercent}%`;
    }
  }, [waterSaturationMinValue, waterSaturationMaxValue]);

  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsConfigSidebarOpen(false);
      }
    };
    window.addEventListener("keydown", handleEscapeKey);
    return () => {
      window.removeEventListener("keydown", handleEscapeKey);
    };
  }, []);

  return (
    <div>
      <button
        className={`threshold-config-sidebar-toggle-button ${
          isConfigSidebarOpen ? "open" : ""
        }`}
        onClick={toggleSidebar}
      >
        {"Grenseverdier"}
      </button>

      <div
        className={`threshold-config-sidebar ${
          isConfigSidebarOpen ? "open" : "closed"
        }
          ${
            isConfigSidebarOpen && isLayerSidebarOpen && isLegendSidebarOpen
              ? "shifted-2"
              : ""
          }
          ${
            (isConfigSidebarOpen &&
              isLayerSidebarOpen &&
              !isLegendSidebarOpen) ||
            (isConfigSidebarOpen && !isLayerSidebarOpen && isLegendSidebarOpen)
              ? "shifted-1"
              : ""
          }
        `}
      >
        <h3>Grenseverdier</h3>
        <p>Sett grenseverdier for valgt løsmasse</p>

        <label htmlFor="deposit-type-select">Løsmassetype</label>
        <select
          name="deposit-types"
          id="deposit-type-select"
          onChange={handleSelectChange}
        >
          {superficialDepositTypes
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((type) => (
              <option key={type.code} value={type.code}>
                {`${type.code} - ${type.name}`}
              </option>
            ))}
        </select>

        <label htmlFor="soil-moisture-threshold">
          Velg vannmetningsgrenser (%) for valgt løsmassetype
        </label>

        <div className="range-container">
          <div className="slider">
            <input
              type="range"
              min="0"
              max="100"
              value={waterSaturationMinValue}
              ref={minRef}
              onChange={handleMinChange}
              className="thumb thumb--left"
            />
            <input
              type="range"
              min="0"
              max="100"
              value={waterSaturationMaxValue}
              ref={maxRef}
              onChange={handleMaxChange}
              className="thumb thumb--right"
            />
            <div className="slider__track" />
            <div
              ref={leftRangeRef}
              className="slider__range slider__range--low"
            />
            <div
              ref={midRangeRef}
              className="slider__range slider__range--mid"
            />
            <div
              ref={rightRangeRef}
              className="slider__range slider__range--high"
            />
          </div>

          <div className="slider-value-control">
            <div className="slider-value-control-container">
              <div className="slider-value-control-container-label">Min %</div>
              <input
                className="slider-value-control-container-input"
                type="number"
                min="0"
                max="100"
                value={waterSaturationMinValue}
                onChange={handleMinChange}
              />
            </div>
            <div className="slider-value-control-container">
              <div className="slider-value-control-container-label">Max %</div>
              <input
                className="slider-value-control-container-input"
                type="number"
                min="0"
                max="100"
                value={waterSaturationMaxValue}
                onChange={handleMaxChange}
              />
            </div>
          </div>
        </div>

        <label htmlFor="frost-depth-threshold" style={{ marginTop: "1rem" }}>
          Velg frostdybdegrenser (cm)
        </label>
        <div className="range-container">
          <div className="slider single-slider">
            <input
              id="frost-depth-threshold"
              type="range"
              min="0"
              max="30"
              step="0.1"
              value={frostDepthThresholdInput}
              onChange={handleFrostDepthChange}
              className="thumb"
            />
            <div className="slider__track single-slider" />
          </div>

          <div className="slider-value-control">
            <div className="slider-value-control-container">
              <div className="slider-value-control-container-label">
                Frostdybde (cm)
              </div>
              <input
                className="slider-value-control-container-input"
                type="number"
                min="0"
                max="30"
                step="0.1"
                value={frostDepthThresholdInput}
                onChange={handleFrostDepthChange}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SidebarTresholdConfig;
