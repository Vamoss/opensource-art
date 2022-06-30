function setup() {
  createCanvas(400, 400);
}

function draw() {
  if (mouseIsPressed) {
    fill(120, 120, 120);
  } else {
    fill(255);
  }
  ellipse(mouseX, mouseY, 80, 80);
}
