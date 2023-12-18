import React from "react";

const SVGEN = React.forwardRef((props, ref) => {
  return (
    <svg ref={ref} width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M44.472 13V37.3316H38.623L30.0168 22.1912V37.3316H24.1511V13H30.0168L38.623 28.1404V13H44.472Z" fill="#fff"/>
      <path d="M21.7447 32.8195V37.3316H8.77674V32.8195H21.7447ZM10.8656 13V37.3316H5V13H10.8656ZM20.0735 22.6591V27.0207H8.77674V22.6591H20.0735ZM21.7948 13V17.5287H8.77674V13H21.7948Z" fill="#fff"/>
    </svg>
  );
});

export default SVGEN;
