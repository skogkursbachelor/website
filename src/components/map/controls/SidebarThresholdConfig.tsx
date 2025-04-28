import React, { useState, useEffect, useRef } from "react";
import { superficialDepositTypes } from "../../../constants/superficialDepositTypes";

interface Props {
  thresholds: Map<number, { min: number; max: number }>;
  setThresholdsState: (
    thresholds: Map<number, { min: number; max: number }>
  ) => void;
  isLayerSidebarOpen: boolean;
  isLegendSidebarOpen: boolean;
}

const SidebarTresholdConfig: React.FC<Props> = ({
  thresholds,
  setThresholdsState,
  isLayerSidebarOpen,
  isLegendSidebarOpen,
}) => {
  const [isConfigSidebarOpen, setIsConfigSidebarOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<number>(
    superficialDepositTypes[0].code
  );

  const [minValue, setMinValue] = useState<number>(45);
  const [maxValue, setMaxValue] = useState<number>(75);

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
    const selectedThreshold = thresholds.get(Number(event.target.value));
    if (selectedThreshold) {
      setMinValue(selectedThreshold.min);
      setMaxValue(selectedThreshold.max);
    }
  };

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.min(Number(e.target.value), maxValue - 1);
    setMinValue(value);
    updateThresholds(value, maxValue);
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(Number(e.target.value), minValue + 1);
    setMaxValue(value);
    updateThresholds(minValue, value);
  };

  const updateThresholds = (newMin: number, newMax: number) => {
    setThresholdsState(
      new Map(thresholds.set(selectedType, { min: newMin, max: newMax }))
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

      const minPercent = ((minValue - min) / (max - min)) * 100;
      const maxPercent = ((maxValue - min) / (max - min)) * 100;

      // Left (green)
      leftRangeRef.current.style.left = "0%";
      leftRangeRef.current.style.width = `${minPercent}%`;

      // Middle (yellow)
      midRangeRef.current.style.left = `${minPercent}%`;
      midRangeRef.current.style.width = `${maxPercent - minPercent}%`;

      // Right (red)
      rightRangeRef.current.style.left = `${maxPercent}%`;
      rightRangeRef.current.style.width = `${100 - maxPercent}%`;
    }
  }, [minValue, maxValue]);

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
              value={minValue}
              ref={minRef}
              onChange={handleMinChange}
              className="thumb thumb--left"
            />
            <input
              type="range"
              min="0"
              max="100"
              value={maxValue}
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
                value={minValue}
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
                value={maxValue}
                onChange={handleMaxChange}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SidebarTresholdConfig;
