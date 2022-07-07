/******************
Code by Vamoss
Original code link:
https://www.openprocessing.org/sketch/744884

Author links:
http://vamoss.com.br
http://twitter.com/vamoss
http://github.com/vamoss
******************/

//Original inspiration
//https://twitter.com/AidaInma/status/1161205965305393154

const radius = 50;
const altitude = (Math.sqrt(3) / 2) * radius;
let hexagons, hexagonPattern, rotations;
let changed = -1;

function setup() {
  createCanvas(windowWidth, windowHeight);

  let hexagonMask = createGraphics(radius * 2, radius * 2);
  hexagonMask.beginShape();
  for (let a = 0; a < TWO_PI; a += TWO_PI / 6) {
    let x = sin(a) * radius + radius;
    let y = cos(a) * radius + radius;
    hexagonMask.vertex(x, y);
  }
  hexagonMask.endShape();

  let hexagonLines = createGraphics(radius * 2, radius * 2);
  hexagonLines.noFill();
  hexagonLines.strokeWeight(20);
  hexagonLines.ellipse(radius - altitude, radius - radius / 2, radius, radius);
  hexagonLines.ellipse(radius + altitude * 2, radius, radius * 3, radius * 3);
  hexagonLines.ellipse(
    radius + altitude,
    radius + radius * 1.5,
    radius * 3,
    radius * 3
  );
  hexagonLines.strokeWeight(16);
  hexagonLines.stroke(100, 230, 200);
  hexagonLines.ellipse(radius - altitude, radius - radius / 2, radius, radius);
  hexagonLines.ellipse(radius + altitude * 2, radius, radius * 3, radius * 3);
  hexagonLines.ellipse(
    radius + altitude,
    radius + radius * 1.5,
    radius * 3,
    radius * 3
  );

  hexagonPattern = createGraphics(radius * 2, radius * 2);
  hexagonPattern.image(hexagonMask, 0, 0);
  hexagonPattern.drawingContext.globalCompositeOperation = "source-in";
  hexagonPattern.image(hexagonLines, 0, 0);

  rotations = [];
  hexagons = [];
  for (let x = -radius; x < width; x += altitude * 2) {
    let rowCount = 0;
    for (let y = -radius; y < height; y += radius * 1.5) {
      hexagons.push({
        x: x + (rowCount % 2 == 0 ? 0 : altitude),
        y: y,
        rotation: 0,
      });
      rotations.push((TWO_PI / 6) * floor(random(6)));
      rowCount++;
    }
  }
}

function draw() {
  background(255);
  hexagons.forEach((hexagon, index) => {
    hexagon.rotation += (rotations[index] - hexagon.rotation) * 0.09;
    push();
    translate(hexagon.x + radius, hexagon.y + radius);
    rotate(hexagon.rotation);
    translate(-(hexagon.x + radius), -(hexagon.y + radius));
    image(hexagonPattern, hexagon.x, hexagon.y);
    pop();
  });
}

function findClosest() {
  let closest = 0;
  let closestDistance = 9999;
  hexagons.forEach((hexagon, index) => {
    let d = dist(mouseX, mouseY, hexagon.x + radius, hexagon.y + radius);
    if (d < closestDistance) {
      closestDistance = d;
      closest = index;
    }
  });
  return closest;
}

function mousePressed() {
  changed = findClosest();
  rotations[changed] += TWO_PI / 6;
}

function mouseMoved() {
  let tempChanged = findClosest();
  if (changed != tempChanged) {
    changed = tempChanged;
    rotations[changed] += TWO_PI / 6;
  }
}
