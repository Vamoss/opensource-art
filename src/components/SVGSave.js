import React from "react";

const SVGSave = React.forwardRef((props, ref) => {
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
        d="M26.5 29.6723V6H23.5V29.7799L13.0805 18.9596L10.9196 21.0406L25.0214 35.6848L38.6007 21.0192L36.3994 18.981L26.5 29.6723ZM5.5 31H8.5V41.5H41.5V31H44.5V44.5H5.5V31Z"
        fill="#fff"
      />
    </svg>
  );
});

export default SVGSave;
