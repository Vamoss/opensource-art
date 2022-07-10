import React from "react";

const SVGArrow = React.forwardRef((props, ref) => {
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
        d="M16.5 40.4523L41.25 26.1629C41.9167 25.778 41.9167 24.8158 41.25 24.4308L16.5 10.1414C15.8334 9.75654 15 10.2377 15 11.0075L15 39.5863C15 40.3561 15.8333 40.8372 16.5 40.4523ZM43.25 29.627C46.5833 27.7025 46.5833 22.8912 43.25 20.9667L18.5 6.67733C15.1667 4.75283 11 7.15847 11 11.0075L11 39.5863C11 43.4353 15.1667 45.8409 18.5 43.9164L43.25 29.627Z"
        fill="#fff"
      />
    </svg>
  );
});

export default SVGArrow;
