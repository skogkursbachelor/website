import React from "react";
import ImageLayer from "ol/layer/Image";
import ImageWMS from "ol/source/ImageWMS";

interface Props {
  date: Date;
  setDate: (date: Date) => void;
  layers: ImageLayer<ImageWMS>[];
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
    </div>
  );
};

export default DatePicker;
