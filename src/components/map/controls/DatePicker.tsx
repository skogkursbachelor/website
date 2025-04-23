import React from "react";
import ImageLayer from "ol/layer/Image";
import ImageWMS from "ol/source/ImageWMS";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import Feature from "ol/Feature";
import Geometry from "ol/geom/Geometry";

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
            TIME: newDate.toISOString().split("T")[0],
          });
        }
      } else if (source instanceof VectorSource) {
        // Check valid extent
        const extent = source.getExtent();
        if (!extent?.every((v) => isFinite(v))) {
          console.warn("Invalid extent, skipping WFS update");
          return;
        }

        // Update URL with new date
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

        // Update roads layer
        source.clear();
        source.refresh();
      }
    });
  };

  const minDate = new Date("1970-01-01T00:00:00Z");

  // Set maxDate to 9 days into the future
  const maxDate = new Date(new Date().setDate(new Date().getDate() + 9));
  maxDate.setHours(23, 59, 59, 999);

  const handleDateChange = (newDate: Date) => {
    // Ensure date is valid and within range
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
        onClick={() => {
          const prevYear = new Date(date);
          prevYear.setFullYear(prevYear.getFullYear() - 1);
          handleDateChange(prevYear);
        }}
      >
        {"<<<"}
      </button>

      {/* Previous week button */}
      <button
        className="date-picker-button"
        onClick={() => {
          const prevWeek = new Date(date);
          prevWeek.setDate(prevWeek.getDate() - 7);
          handleDateChange(prevWeek);
        }}
      >
        {"<<"}
      </button>

      {/* Previous day button */}
      <button
        className="date-picker-button"
        onClick={() => {
          const prevDay = new Date(date);
          prevDay.setDate(prevDay.getDate() - 1);
          handleDateChange(prevDay);
        }}
      >
        {"<"}
      </button>

      {/* Date input */}
      <input
        type="date"
        value={date.toISOString().split("T")[0]}
        onChange={(e) => {
          const value = e.target.value;
          const parsed = new Date(value);

          if (!value || isNaN(parsed.getTime())) {
            console.warn("Ignored invalid date string:", value);
            return;
          }

          handleDateChange(parsed);
        }}
        min={minDate.toISOString().split("T")[0]}
        max={maxDate.toISOString().split("T")[0]}
      />

      {/* Next day button */}
      <button
        className="date-picker-button"
        onClick={() => {
          const nextDay = new Date(date);
          nextDay.setDate(nextDay.getDate() + 1);
          handleDateChange(nextDay);
        }}
      >
        {">"}
      </button>

      {/* Next week button */}
      <button
        className="date-picker-button"
        onClick={() => {
          const nextWeek = new Date(date);
          nextWeek.setDate(nextWeek.getDate() + 7);
          handleDateChange(nextWeek);
        }}
      >
        {">>"}
      </button>

      {/* Next year button */}
      <button
        className="date-picker-button"
        onClick={() => {
          const nextYear = new Date(date);
          nextYear.setFullYear(nextYear.getFullYear() + 1);
          handleDateChange(nextYear);
        }}
      >
        {">>>"}
      </button>
    </div>
  );
};

export default DatePicker;
