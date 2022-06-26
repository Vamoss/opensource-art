export const initialState = {
  currentSketch: null,
  code: `function setup() {
    createCanvas(400, 400);
  }
  
  function draw() {
    fill(255);
    ellipse(mouseX, mouseY, 80, 80);
  }
  `,
  files: {
    initial: [],
    derived: [],
  },
};

// file to be loaded if no sketch is loaded and nothing is set in the state file
export const defaultState = {
  currentSketch: {
    name: "circle_draw.js",
    dir: "initial",
  },
};
