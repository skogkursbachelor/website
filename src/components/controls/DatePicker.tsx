import React, { useState } from "react";
interface Props {
  date: Date;
  setDate: (date: Date) => void;
}

const DatePicker: React.FC<Props> = ({ date, setDate }) => {
  return (
    <div className="date-picker">
      {/* Previous day button */}
      <button
        className="date-picker-button"
        onClick={() => {
          const nextDay = new Date(date);
          nextDay.setDate(nextDay.getDate() - 1);
          setDate(nextDay);
        }}
      >
        {"<"}
      </button>
      {/* Date input */}
      <input
        type="date"
        value={date.toISOString().split("T")[0]}
        min="2014-01-01"
        onChange={(e) => setDate(new Date(e.target.value))}
      />
      {/* Next day button */}
      <button
        className="date-picker-button"
        onClick={() => {
          const nextDay = new Date(date);
          nextDay.setDate(nextDay.getDate() + 1);
          setDate(nextDay);
        }}
      >
        {">"}
      </button>
    </div>
  );
};

export default DatePicker;
