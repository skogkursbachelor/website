import React from "react";
import ImageLayer from "ol/layer/Image";
import ImageWMS from "ol/source/ImageWMS";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import Feature from "ol/Feature";
import Geometry from "ol/geom/Geometry";
import Chevron from "./ChevronIcon";
import ReturnIcon from "./ReturnIcon";

interface Props {
  date: Date;
  setDate: (date: Date) => void;
  layers: (
    | ImageLayer<ImageWMS>
    | VectorLayer<VectorSource<Feature<Geometry>>, Feature<Geometry>>
  )[];
}

const DatePicker: React.FC<Props> = ({ layers, date, setDate }) => {
  const updateLayerDates = (newDate: Date) => {
    layers.forEach((layer) => {
      const source = layer.getSource();
      if (source instanceof ImageWMS) {
        const params = source.getParams();
        if ("TIME" in params) {
          source.updateParams({
            TIME: newDate.toLocaleDateString("sv-SE"),
          });
        }
      } else if (source instanceof VectorSource) {
        const extent = source.getExtent();
        if (!extent?.every((v) => isFinite(v))) {
          return;
        }

        const originalUrl = source.getUrl();
        if (typeof originalUrl === "function") {
          source.setUrl((currentExtent, resolution, projection) => {
            const bbox = currentExtent
              ? currentExtent.join(",")
              : extent.join(",");

            return originalUrl(currentExtent, resolution, projection)
              .replace(/(&time=)[^&]*/, `$1${newDate.toISOString()}`)
              .replace(/(&bbox=)[^&]*/, `$1${bbox},EPSG:3857`);
          });
        }

        source.clear();
        source.refresh();
      }
    });
  };

  const minDate = new Date("1957-09-01T00:00:00Z");
  const maxDate = new Date(new Date().setDate(new Date().getDate() + 9));
  maxDate.setHours(23, 59, 59, 999);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const createShiftedDate = (days: number, years: number = 0) => {
    const newDate = new Date(date);
    if (years) {
      newDate.setFullYear(newDate.getFullYear() + years);
    }
    if (days) {
      newDate.setDate(newDate.getDate() + days);
    }
    return newDate;
  };

  const prevDay = createShiftedDate(-1);
  const prevWeek = createShiftedDate(-7);
  const prevYear = createShiftedDate(0, -1);
  const nextDay = createShiftedDate(1);
  const nextWeek = createShiftedDate(7);
  const nextYear = createShiftedDate(0, 1);

  const isValidDate = (date: Date) => date >= minDate && date <= maxDate;
  const isToday = date.toLocaleDateString() === today.toLocaleDateString();

  const handleDateChange = (newDate: Date) => {
    if (isNaN(newDate.getTime()) || !isValidDate(newDate)) {
      console.warn("Invalid date selected:", newDate.toISOString());
      return;
    }

    setDate(newDate);
    updateLayerDates(newDate);
  };

  return (
    <div className="date-picker">
      <div className="date-picker-group">
        <button
          className="date-picker-button"
          title="Gå ett år tilbake"
          onClick={() => handleDateChange(prevYear)}
          disabled={!isValidDate(prevYear)}
          style={{ cursor: !isValidDate(prevYear) ? "not-allowed" : "pointer" }}
        >
          <Chevron direction="left" count={3} />
        </button>

        <button
          className="date-picker-button"
          title="Gå en uke tilbake"
          onClick={() => handleDateChange(prevWeek)}
          disabled={!isValidDate(prevWeek)}
          style={{ cursor: !isValidDate(prevWeek) ? "not-allowed" : "pointer" }}
        >
          <Chevron direction="left" count={2} />
        </button>

        <button
          className="date-picker-button"
          title="Gå en dag tilbake"
          onClick={() => handleDateChange(prevDay)}
          disabled={!isValidDate(prevDay)}
          style={{ cursor: !isValidDate(prevDay) ? "not-allowed" : "pointer" }}
        >
          <Chevron direction="left" count={1} />
        </button>
      </div>

      <input
        className="date-picker-input"
        type="date"
        value={date.toLocaleDateString("sv-SE")}
        title="Velg dato"
        onChange={(e) => {
          const value = e.target.value;
          const parsed = new Date(value);
          if (!value || isNaN(parsed.getTime())) {
            console.warn("Ignored invalid date string:", value);
            return;
          }
          handleDateChange(parsed);
        }}
        min={minDate.toLocaleDateString("sv-SE")}
        max={maxDate.toLocaleDateString("sv-SE")}
      />

      <div className="date-picker-group">
        <button
          className="date-picker-button"
          title="Gå en dag frem"
          onClick={() => handleDateChange(nextDay)}
          disabled={!isValidDate(nextDay)}
          style={{ cursor: !isValidDate(nextDay) ? "not-allowed" : "pointer" }}
        >
          <Chevron direction="right" count={1} />
        </button>

        <button
          className="date-picker-button"
          title="Gå en uke frem"
          onClick={() => handleDateChange(nextWeek)}
          disabled={!isValidDate(nextWeek)}
          style={{ cursor: !isValidDate(nextWeek) ? "not-allowed" : "pointer" }}
        >
          <Chevron direction="right" count={2} />
        </button>

        <button
          className="date-picker-button"
          title="Gå ett år frem"
          onClick={() => handleDateChange(nextYear)}
          disabled={!isValidDate(nextYear)}
          style={{ cursor: !isValidDate(nextYear) ? "not-allowed" : "pointer" }}
        >
          <Chevron direction="right" count={3} />
        </button>

        <button
          className="date-picker-button"
          title="Tilbakestill til dagens dato"
          onClick={() => handleDateChange(today)}
          disabled={isToday}
          style={{ cursor: isToday ? "not-allowed" : "pointer" }}
        >
          <ReturnIcon color="white" />
        </button>
      </div>
    </div>
  );
};

export default DatePicker;
