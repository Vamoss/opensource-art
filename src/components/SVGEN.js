import React from "react";

const SVGEN = React.forwardRef((props, ref) => {
  return (
    <svg ref={ref} width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M45.1484 12V37.5938H41.7383L28.8535 17.8535V37.5938H25.4609V12H28.8535L41.791 31.793V12H45.1484Z" fill="#fff"/>
      <path d="M21.2598 34.834V37.5938H7.70703V34.834H21.2598ZM8.39258 12V37.5938H5V12H8.39258ZM19.4668 23.0039V25.7637H7.70703V23.0039H19.4668ZM21.084 12V14.7773H7.70703V12H21.084Z" fill="#fff"/>
    </svg>
  );
});

export default SVGEN;
