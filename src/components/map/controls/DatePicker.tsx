import React from "react";
import ImageLayer from "ol/layer/Image";
import ImageWMS from "ol/source/ImageWMS";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import Feature from "ol/Feature";
import Geometry from "ol/geom/Geometry";
import Chevron from "./Chevron";
import ReturnIcon from "./Return";

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
          console.warn("Invalid extent, skipping WFS update");
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

  const minDate = new Date("1970-01-01T00:00:00Z");
  const maxDate = new Date(new Date().setDate(new Date().getDate() + 9));
  maxDate.setHours(23, 59, 59, 999);

  const handleDateChange = (newDate: Date) => {
    if (isNaN(newDate.getTime()) || newDate < minDate || newDate > maxDate) {
      console.warn("Invalid date selected:", newDate.toISOString());
      return;
    }

    setDate(newDate);
    updateLayerDates(newDate);
  };

  return (
    <div className="date-picker">
      {/* Previous year button */}
      <button
        className="date-picker-button"
        title="Gå ett år tilbake"
        onClick={() => {
          const prevYear = new Date(date);
          prevYear.setFullYear(prevYear.getFullYear() - 1);
          handleDateChange(prevYear);
        }}
      >
        <Chevron direction="left" count={3} />
      </button>

      {/* Previous week button */}
      <button
        className="date-picker-button"
        title="Gå en uke tilbake"
        onClick={() => {
          const prevWeek = new Date(date);
          prevWeek.setDate(prevWeek.getDate() - 7);
          handleDateChange(prevWeek);
        }}
      >
        <Chevron direction="left" count={2} />
      </button>

      {/* Previous day button */}
      <button
        className="date-picker-button"
        title="Gå en dag tilbake"
        onClick={() => {
          const prevDay = new Date(date);
          prevDay.setDate(prevDay.getDate() - 1);
          handleDateChange(prevDay);
        }}
      >
        <Chevron direction="left" count={1} />
      </button>

      {/* Date input */}
      <input
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

      {/* Next day button */}
      <button
        className="date-picker-button"
        title="Gå en dag frem"
        onClick={() => {
          const nextDay = new Date(date);
          nextDay.setDate(nextDay.getDate() + 1);
          handleDateChange(nextDay);
        }}
      >
        <Chevron direction="right" count={1} />
      </button>

      {/* Next week button */}
      <button
        className="date-picker-button"
        title="Gå en uke frem"
        onClick={() => {
          const nextWeek = new Date(date);
          nextWeek.setDate(nextWeek.getDate() + 7);
          handleDateChange(nextWeek);
        }}
      >
        <Chevron direction="right" count={2} />
      </button>

      {/* Next year button */}
      <button
        className="date-picker-button"
        title="Gå ett år frem"
        onClick={() => {
          const nextYear = new Date(date);
          nextYear.setFullYear(nextYear.getFullYear() + 1);
          handleDateChange(nextYear);
        }}
      >
        <Chevron direction="right" count={3} />
      </button>

      {/* Reset date button */}
      <button
        className="date-picker-button"
        title="Tilbakestill til dagens dato"
        onClick={() => {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          handleDateChange(today);
        }}
      >
        <ReturnIcon color="white" />
      </button>
    </div>
  );
};

export default DatePicker;
