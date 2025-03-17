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
      }
    });
  };

  const handleDateChange = (newDate: Date) => {
    // TODO: Validate date range, e.g. there is an error when choosing year 0
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
        onChange={(e) => handleDateChange(new Date(e.target.value))}
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
