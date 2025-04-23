import React, { useState } from "react";
import { superficialDepositTypes } from "../../../constants/superficialDepositTypes";

interface Props {
  thresholds: Map<number, number>;
  setThresholdsState: (thresholds: Map<number, number>) => void;
  isLayerSidebarOpen: boolean;
  isLegendSidebarOpen: boolean;
}

const SidebarTresholdConfig: React.FC<Props> = ({
  thresholds,
  setThresholdsState,
  isLayerSidebarOpen,
  isLegendSidebarOpen,
}) => {
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<number>(
    superficialDepositTypes[0].code
  );

  // Toggle sidebar open/closed
  const toggleSidebar = () => {
    setIsConfigOpen((prev) => !prev);
  };

  const handleRangeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newThreshold = Number(event.target.value);
    const updated = new Map(thresholds);
    updated.set(selectedType, newThreshold);
    setThresholdsState(updated);
  };

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedType(Number(event.target.value));
  };

  return (
    <div>
      <button
        className="threshold-config-sidebar-toggle-button"
        onClick={toggleSidebar}
      >
        {"Konfigurasjon"}
      </button>
      <div
        className={`threshold-config-sidebar ${isConfigOpen ? "open" : "closed"}
          ${
            isConfigOpen && isLayerSidebarOpen && isLegendSidebarOpen
              ? "shifted-2"
              : ""
          }
          ${
            (isConfigOpen && isLayerSidebarOpen && !isLegendSidebarOpen) ||
            (isConfigOpen && !isLayerSidebarOpen && isLegendSidebarOpen)
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
            .sort((a, b) => a.name.localeCompare(b.name)) // Sort alphabetically by name
            .map((type) => (
              <option key={type.code} value={type.code}>
                {type.name}
              </option>
            ))}
        </select>
        <label htmlFor="soil-moisture-threshold">Jordfuktighetsgrense</label>
        <div className="range-container">
          <input
            type="range"
            id="soil-moisture-threshold"
            min="0"
            max="100"
            step="1"
            value={thresholds.get(selectedType) ?? 75}
            onChange={handleRangeChange}
          />
          <span className="range-value">
            {thresholds.get(selectedType) ?? 75}%
          </span>
        </div>
      </div>
    </div>
  );
};

export default SidebarTresholdConfig;
