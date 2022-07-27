/******************
Code by Vamoss
Original code link:
https://openprocessing.org/sketch/1613223

Author links:
http://vamoss.com.br
http://twitter.com/vamoss
http://github.com/vamoss
******************/

//Original code from paperjs, by Jürg Lehni & Jonathan Puckey
//http://paperjs.org/examples/meta-balls/

import p5 from "p5";

const data = [
  {
    id: "hexagons",
    parentId: null,
    x: 0.6026535521730414,
    y: 0.5671328793645689,
    r: 0.294126063650332,
    g: 0.05005226596417489,
    b: 0.20966225220705326,
  },
  {
    id: "21155d7e-2e10-4654-ad21-aaabed29c636",
    parentId: "hexagons",
    x: 0.18209875742161197,
    y: 0.10792255428298847,
    r: 0.772030107962673,
    g: 0.5876241067561825,
    b: 0.3199331770488718,
  },
  {
    id: "f780b331-993f-4f83-94b8-27e3876c95a3",
    parentId: "hexagons",
    x: 0.9077742756819471,
    y: 0.8032346451213832,
    r: 0.8306730917643323,
    g: 0.7683987457785391,
    b: 0.10508621249366312,
  },
  {
    id: "fe8e070a-875b-4ace-8abf-c64d78bc61c0",
    parentId: "f780b331-993f-4f83-94b8-27e3876c95a3",
    x: 0.567437685591117,
    y: 0.16039069121039673,
    r: 0.41841504877384006,
    g: 0.4631853348129453,
    b: 0.8253094920821307,
  },
  {
    id: "bbf2258b-6a73-4a67-b242-a3228e3354d1",
    parentId: "fe8e070a-875b-4ace-8abf-c64d78bc61c0",
    x: 0.8618626721050151,
    y: 0.36060545643847064,
    r: 0.18600936952433234,
    g: 0.8178323072272655,
    b: 0.7036855569603648,
  },
];
// [
//   {
//     id: 0,
//     parentId: null,
//   },
//   {
//     id: 1,
//     parentId: 0,
//   },
//   {
//     id: 2,
//     parentId: 0,
//   },
//   {
//     id: 3,
//     parentId: 1,
//   },
//   {
//     id: 4,
//     parentId: 2,
//   },
//   {
//     id: 5,
//     parentId: 0,
//   },
//   {
//     id: 6,
//     parentId: 0,
//   },
//   {
//     id: 7,
//     parentId: 0,
//   },
//   {
//     id: 8,
//     parentId: 0,
//   },
//   {
//     id: 9,
//     parentId: 0,
//   },
// ];

const minRadius = 20;
const maxRadius = 80;

//metaballs
const handle_len_rate = 1.5;
const maxDistance = 100; //metaball
var connections = [];

var ctx;

//pan
var transX = 0,
  transY = 0,
  draggingMap = false;
var boundBox;

const STATES = { FREE: 0, OVER: 1, PRESSED: 2 };
export const meatballs =
  ({ windowWidth, windowHeight, graphData, selectHandler, saveNewGraphData }) =>
  (sketch) => {
    //  as funções do nativas que o processing pega de hook tem
    //  que ser adicionadas ao objecto sketch passado como argumento
    sketch.setup = () => {
      var canvas = sketch.createCanvas(windowWidth, windowHeight);
      ctx = canvas.drawingContext;

      /*
      //generate random points
      //descending from the original
      var total = sketch.random(5, 10);
      for (var i = 0; i < total; i++) {
        data.push({
          id: data.length,
          parentId: 0, //floor(random(data.length-1))
        });
      }
      //descending from others
      total = sketch.random(10, 50);
      for (var i = 0; i < total; i++) {
        data.push({
          id: data.length,
          parentId: sketch.floor(sketch.random(data.length - 1)),
        });
      }
      /**/

      //add positions, state, color, total children and parent reference
      data.forEach((d) => {
        d.children = data.filter((d2) => d.id === d2.parentId);
        if (d.parentId !== null) {
          d.pos = sketch.createVector(
            sketch.random(sketch.width),
            sketch.random(sketch.height)
          );
          d.parent = data.find((p) => p.id === d.parentId);
          d.color = sketch.color(d.r * 255, d.g * 255, d.b * 255);
        } else {
          d.pos = sketch.createVector(sketch.width / 2, sketch.height / 2);
          d.parent = null;
          d.color = sketch.color(d.r * 255, d.g * 255, d.b * 255);
        }

        d.overColor = sketch.color(
          sketch.constrain(d.color._getRed() + 60, 0, 255),
          sketch.constrain(d.color._getGreen() + 60, 0, 255),
          sketch.constrain(d.color._getBlue() + 60, 0, 255)
        );

        d.pressColor = sketch.color(
          sketch.constrain(d.color._getRed() - 30, 0, 255),
          sketch.constrain(d.color._getGreen() - 30, 0, 255),
          sketch.constrain(d.color._getBlue() - 30, 0, 255)
        );

        d.grow = 0;
        d.growVel = 0;
        d.state = STATES.FREE;
      });

      //calculate size
      var minValue = Math.min.apply(
        Math,
        data.map((d) => d.children.length)
      );
      var maxValue = Math.max.apply(
        Math,
        data.map((d) => d.children.length)
      );
      data.forEach(
        (d) =>
          (d.radius = d.originalRadius =
            sketch.map(
              d.children.length,
              minValue,
              maxValue,
              minRadius,
              maxRadius
            ))
      );

      relaxCircle();
      calculateBoundbox();
    };

    sketch.draw = () => {
      sketch.background(255, 255, 220);
      sketch.translate(transX, transY);

      /*
    //update circles pos
    for(var i = 0; i < data.length; i++){
      var d = data[i];
      if(d.state != STATES.FREE)
        continue;
      
      //noise motion
      var angle = noise(d.id + frameCount/100) * TWO_PI;
      d.pos.x += cos(angle)/10;
      d.pos.y += sin(angle)/10;
    }
    /**/

      //generate connections
      connections.length = 0;
      data.forEach((d) => {
        if (d.parent !== null) {
          //var distance = dist(d.pos.x, d.pos.y, d.parent.pos.x, d.parent.pos.y);
          var path = metaball(d, d.parent, 0.5, handle_len_rate, maxDistance);
          if (path) {
            path.color1 = d.parent.color;
            path.color2 = d.color;
            path.x1 = d.parent.pos.x;
            path.y1 = d.parent.pos.y;
            path.x2 = d.pos.x;
            path.y2 = d.pos.y;
            connections.push(path);
          }
        }
      });

      //draw connections
      sketch.noStroke();
      connections.forEach((path) => {
        sketch.fill(path.color1);
        var gradient = ctx.createLinearGradient(
          path.x1,
          path.y1,
          path.x2,
          path.y2
        );

        // Add three color stops
        gradient.addColorStop(0.2, path.color1.toString());
        gradient.addColorStop(0.8, path.color2.toString());

        // Set the fill style and draw a rectangle
        ctx.fillStyle = gradient;

        sketch.beginShape();
        for (var j = 0; j < 4; j++) {
          if (j == 0) sketch.vertex(path.segments[j].x, path.segments[j].y);
          else if (j % 2 != 0) {
            sketch.vertex(
              path.segments[(j + 1) % 4].x,
              path.segments[(j + 1) % 4].y
            );
          }
          if (j % 2 != 0) continue;
          sketch.bezierVertex(
            path.segments[j].x + path.handles[j].x,
            path.segments[j].y + path.handles[j].y,
            path.segments[(j + 1) % 4].x + path.handles[(j + 1) % 4].x,
            path.segments[(j + 1) % 4].y + path.handles[(j + 1) % 4].y,
            path.segments[(j + 1) % 4].x,
            path.segments[(j + 1) % 4].y
          );
        }
        sketch.endShape();
      });

      //draw circles
      data.forEach((d) => {
        sketch.strokeWeight(4);
        sketch.stroke(d.color);
        if (d.state == STATES.FREE) sketch.fill(255);
        else if (d.state == STATES.OVER) sketch.fill(d.overColor);
        else if (d.state == STATES.PRESSED) sketch.fill(d.pressColor);

        d.grow = sketch.constrain(d.grow + d.growVel, 0, 1);
        var ease = quarticInOut; //d.growVel > 0 ? elasticOut : elasticIn;
        d.radius = d.originalRadius + ease(d.grow) * 20;

        sketch.ellipse(d.pos.x, d.pos.y, d.radius - 4, d.radius - 4);

        sketch.strokeWeight(1);
        sketch.stroke(d.pressColor);
        sketch.ellipse(d.pos.x, d.pos.y, d.radius - 6, d.radius - 6);
      });

      /*
    //draw texts
    noStroke();
    fill(0);
    textAlign(CENTER, CENTER);
    data.forEach(d => {	
      var size = d.radius * 0.8;
      textSize(size);
      text(d.id, d.pos.x, d.pos.y + size/10);
    })	
    */
    };

    sketch.mouseMoved = () => {
      var found = false;
      data.forEach((d) => {
        var distance = sketch.dist(
          d.pos.x,
          d.pos.y,
          sketch.mouseX - transX,
          sketch.mouseY - transY
        );
        if (distance < d.radius / 2 && !found) {
          d.state = STATES.OVER;
          d.growVel = 0.025;
          found = true;
          sketch.cursor(sketch.HAND);
        } else {
          d.state = STATES.FREE;
          d.growVel = -0.05;
        }
      });

      if (!found) {
        sketch.cursor(sketch.ARROW);
      }
    };

    sketch.mouseDragged = () => {
      if (draggingMap) {
        transX += sketch.mouseX - sketch.pmouseX;
        transY += sketch.mouseY - sketch.pmouseY;

        //limit to boundBox
        transX = sketch.min(transX, -boundBox.left);
        transX = sketch.max(transX, sketch.width - boundBox.right);
        transY = sketch.min(transY, -boundBox.top);
        transY = sketch.max(transY, sketch.height - boundBox.bottom);
      } else {
        data.forEach((d) => {
          if (d.state == STATES.PRESSED) {
            d.dragged = true;
            d.pos.x += sketch.mouseX - sketch.pmouseX;
            d.pos.y += sketch.mouseY - sketch.pmouseY;
          }
        });
      }
    };

    sketch.mousePressed = () => {
      var notFound = data.every((d) => {
        var distance = sketch.dist(
          d.pos.x,
          d.pos.y,
          sketch.mouseX - transX,
          sketch.mouseY - transY
        );
        if (distance < d.radius / 2) {
          d.state = STATES.PRESSED;
          d.dragged = false;
          return false;
        }
        return true;
      });
      draggingMap = notFound;
    };

    sketch.mouseReleased = () => {
      draggingMap = false;
      var draggedItem = false;
      data.forEach((d) => {
        draggedItem |= d.dragged;
        if (d.state == STATES.PRESSED && !d.dragged) {
          if (typeof selectHandler === "function") selectHandler(d);
        }
      });
      if (draggedItem) calculateBoundbox();
    };

    function findSpot(parent, item, list, lines) {
      var furtherX = 0;
      var furtherY = 0;
      var furtherDist = 0;
      var found = false;
      var minFurtherDist = 40;
      var maxFurtherDist = 150;
      for (var k = 0; k < 1000 && furtherDist < minFurtherDist; k++) {
        //make a random position around x and y
        var angle = sketch.random(sketch.TWO_PI);
        var radius =
          parent.radius / 2 +
          item.radius / 2 +
          sketch.random(10, maxFurtherDist);
        maxFurtherDist += 0.5;
        var x = parent.pos.x + sketch.cos(angle) * radius;
        var y = parent.pos.y + sketch.sin(angle) * radius;

        //find line intersections
        var lineIntersects = false;
        for (var j = 0; j < lines.length && !lineIntersects; j++) {
          var intersectionPoint = checkLineIntersection(
            parent.pos.x,
            parent.pos.y,
            x,
            y,
            lines[j].x1,
            lines[j].y1,
            lines[j].x2,
            lines[j].y2
          );
          lineIntersects |= intersectionPoint;
        }

        if (!lineIntersects || furtherDist == 0) {
          //what is the closest distance from others?
          var minDist = 99999;
          for (var j = 0; j < list.length; j++) {
            var otherItem = list[j];
            if (item == otherItem) continue;
            var distance =
              sketch.dist(x, y, otherItem.pos.x, otherItem.pos.y) -
              item.radius -
              otherItem.radius;
            if (distance < minDist) {
              minDist = distance;
            }
          }

          //is the minimal distance further than the furthest found?
          if (minDist > furtherDist) {
            if (!lineIntersects) furtherDist = minDist;
            furtherX = x;
            furtherY = y;
            found = true;
          }
        }
      }
      //if(!found) console.log("perfect spot not found");
      item.pos.x = furtherX;
      item.pos.y = furtherY;
    }

    function addItem(item, list, lines, level) {
      item.children.forEach((child) => {
        findSpot(item, child, list, lines);
        list.push(child);
        lines.push({
          x1: item.pos.x,
          y1: item.pos.y,
          x2: child.pos.x,
          y2: child.pos.y,
        });
      });
      item.children.forEach((child) => {
        addItem(child, list, lines, level + 1);
      });
    }

    function relaxCircle() {
      var added = [];
      var lines = [];
      var level = 0;
      added.push(data[0]);
      addItem(data[0], added, lines, level);
    }

    function calculateBoundbox() {
      var minX = sketch.width / 2;
      var maxX = sketch.width / 2;
      var minY = sketch.height / 2;
      var maxY = sketch.height / 2;

      data.forEach((d) => {
        minX = sketch.min(minX, d.pos.x);
        maxX = sketch.max(maxX, d.pos.x);
        minY = sketch.min(minY, d.pos.y);
        maxY = sketch.max(maxY, d.pos.y);
      });

      var margin = 100;
      boundBox = {
        left: sketch.min(minX - margin, 0),
        top: sketch.min(minY - margin, 0),
        right: sketch.max(maxX + margin, sketch.width),
        bottom: sketch.max(maxY + margin, sketch.height),
      };
    }

    //addapted from http://jsfiddle.net/justin_c_rounds/Gd2S2/light/
    function checkLineIntersection(
      line1StartX,
      line1StartY,
      line1EndX,
      line1EndY,
      line2StartX,
      line2StartY,
      line2EndX,
      line2EndY
    ) {
      // if the lines intersect, the result contains the x and y of the intersection (treating the lines as infinite) and booleans for whether line segment 1 or line segment 2 contain the point
      var denominator =
        (line2EndY - line2StartY) * (line1EndX - line1StartX) -
        (line2EndX - line2StartX) * (line1EndY - line1StartY);
      if (denominator == 0) {
        return false;
      }
      var a = line1StartY - line2StartY;
      var b = line1StartX - line2StartX;
      var numerator1 =
        (line2EndX - line2StartX) * a - (line2EndY - line2StartY) * b;
      var numerator2 =
        (line1EndX - line1StartX) * a - (line1EndY - line1StartY) * b;
      a = numerator1 / denominator;
      b = numerator2 / denominator;

      if (a > 0 && a < 1 && b > 0 && b < 1) {
        return true;
      }

      return false;
    }

    function metaball(ball1, ball2, v, handle_len_rate, maxDistance) {
      var radius1 = ball1.radius / 2;
      var radius2 = ball2.radius / 2;
      var center1 = ball1.pos;
      var center2 = ball2.pos;
      var d = center1.dist(center2);
      var u1 = 0;
      var u2 = 0;
      //if (d > maxDistance || d <= abs(radius1 - radius2)) {
      if (d <= sketch.abs(radius1 - radius2)) {
        return;
      } else if (d < radius1 + radius2) {
        // case circles are overlapping
        u1 = sketch.acos(
          (radius1 * radius1 + d * d - radius2 * radius2) / (2 * radius1 * d)
        );
        u2 = sketch.acos(
          (radius2 * radius2 + d * d - radius1 * radius1) / (2 * radius2 * d)
        );
      }
      var angle1 = sketch.atan2(center2.y - center1.y, center2.x - center1.x);
      var angle2 = sketch.acos((radius1 - radius2) / d);
      var angle1a = angle1 + u1 + (angle2 - u1) * v;
      var angle1b = angle1 - u1 - (angle2 - u1) * v;
      var angle2a = angle1 + sketch.PI - u2 - (sketch.PI - u2 - angle2) * v;
      var angle2b = angle1 - sketch.PI + u2 + (sketch.PI - u2 - angle2) * v;
      var p1a = p5.Vector.add(center1, p5.Vector.fromAngle(angle1a, radius1));
      var p1b = p5.Vector.add(center1, p5.Vector.fromAngle(angle1b, radius1));
      var p2a = p5.Vector.add(center2, p5.Vector.fromAngle(angle2a, radius2));
      var p2b = p5.Vector.add(center2, p5.Vector.fromAngle(angle2b, radius2));
      // define handle length by the distance between
      // both ends of the curve to draw
      var d2 = sketch.min(
        v * handle_len_rate,
        sketch.dist(p1a.x, p1a.y, p2a.x, p2a.y) / (radius1 + radius2)
      );
      // case circles are overlapping:
      d2 *= sketch.min(1, (d * 2) / (radius1 + radius2));
      radius1 *= d2;
      radius2 *= d2;
      var path = {
        segments: [p1a, p2a, p2b, p1b],
        handles: [
          p5.Vector.fromAngle(angle1a - sketch.HALF_PI, radius1),
          p5.Vector.fromAngle(angle2a + sketch.HALF_PI, radius2),
          p5.Vector.fromAngle(angle2b - sketch.HALF_PI, radius2),
          p5.Vector.fromAngle(angle1b + sketch.HALF_PI, radius1),
        ],
      };
      return path;
    }

    // https://idmnyu.github.io/p5.js-func/
    function quarticInOut(x) {
      if (x < 0.5) {
        return 8 * x * x * x * x;
      } else {
        var v = x - 1;
        return -8 * v * v * v * v + 1;
      }
    }
  };
