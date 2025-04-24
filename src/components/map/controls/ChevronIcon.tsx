import React from "react";

interface ChevronProps {
  direction: "left" | "right";
  count: number;
}

const Chevron: React.FC<ChevronProps> = ({ direction, count }) => {
  const spacing = 8;
  const totalWidth = (count - 1) * spacing;
  const baseOffset = -totalWidth / 2;

  const chevrons = [];
  for (let i = 0; i < count; i++) {
    const offset = baseOffset + i * spacing;
    chevrons.push(
      <path
        key={i}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        d={
          direction === "left"
            ? `M${15.75 + offset} 19.5L${8.25 + offset} 12l7.5-7.5`
            : `M${8.25 + offset} 19.5L${15.75 + offset} 12l-7.5-7.5`
        }
      />
    );
  }

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="24"
      height="24"
    >
      {chevrons}
    </svg>
  );
};

export default Chevron;
