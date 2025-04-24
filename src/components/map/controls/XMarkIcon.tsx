import React from "react";

interface XMarkIconProps {
  color?: string;
  strokeWidth?: number;
}

const XMarkIcon: React.FC<XMarkIconProps> = ({
  color = "currentColor",
  strokeWidth = 1.5,
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={strokeWidth}
      stroke={color}
      width="24"
      height="24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 18 18 6M6 6l12 12"
      />
    </svg>
  );
};

export default XMarkIcon;
