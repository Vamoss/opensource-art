import React from "react";

const SVGCode = React.forwardRef((props, ref) => {
  return (
    <svg
      ref={ref}
      width="50"
      height="50"
      viewBox="0 0 50 50"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M0 26.0213L14.6656 39.6006L16.7038 37.3993L4.36942 25.9785L16.7252 14.0804L14.6442 11.9194L0 26.0213ZM17.5537 45.6023L28.5537 5.60229L31.4463 6.39776L20.4463 46.3978L17.5537 45.6023ZM32.9595 37.5202L35.0404 39.6812L49.6847 25.5793L35.0191 12L32.9809 14.2013L45.3153 25.6221L32.9595 37.5202Z"
        fill="#fff"
      />
    </svg>
  );
});

export default SVGCode;
