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

export const meatballs =
  ({ width, height, data, selectHandler }) =>
  (sketch) => {
    let scale = 1; //scale
    const minRadius = 20;
    const maxRadius = 60;

    //metaballs
    const handle_len_rate = 1.5;
    const maxDistance = 100; //metaball
    var connections = [];

    var ctx;

    const STATES = { FREE: 0, OVER: 1, PRESSED: 2 };

    sketch.mouseMoved = () => {
      data.forEach((d) => {
        var distance = sketch.dist(
          d.pos.x,
          d.pos.y,
          sketch.mouseX,
          sketch.mouseY
        );
        if (distance < d.radius / 2) {
          d.state = STATES.OVER;
        } else {
          d.state = STATES.FREE;
        }
      });
    };

    sketch.mouseDragged = () => {
      data.forEach((d) => {
        if (d.state === STATES.PRESSED) {
          d.dragged = true;
          d.pos.x = sketch.mouseX;
          d.pos.y = sketch.mouseY;
        }
      });
    };

    sketch.mousePressed = () => {
      data.forEach((d) => {
        var distance = sketch.dist(
          d.pos.x,
          d.pos.y,
          sketch.mouseX,
          sketch.mouseY
        );
        if (distance < d.radius / 2) {
          d.state = STATES.PRESSED;
          d.dragged = false;
        }
      });
    };

    sketch.mouseReleased = () => {
      data.forEach((d) => {
        if (d.state === STATES.PRESSED && !d.dragged) {
          if (typeof selectHandler === "function") selectHandler(d);
        }
      });
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
            var distance = sketch.dist(x, y, otherItem.pos.x, otherItem.pos.y);
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

    function add(item, list, lines, level) {
      if (!item?.children) {
        return;
      }
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
        add(child, list, lines, level + 1);
      });
    }

    function relaxCircle() {
      var added = [];
      var lines = [];
      var level = 0;
      added.push(data[0]);
      add(data[0], added, lines, level);
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

    sketch.setup = () => {
      var canvas = sketch.createCanvas(width, height);
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
      total = sketch.random(5, 50);
      for (var i = 0; i < total; i++) {
        data.push({
          id: data.length,
          parentId: sketch.floor(sketch.random(data.length - 1)),
        });
      }
      /**/

      //add positions, state, color, total children and parent reference
      data.forEach((d) => {
        d.children = data.filter((d2) => d.id == d2.parentId);
        if (d.parentId !== null) {
          d.pos = sketch.createVector(
            sketch.random(sketch.width),
            sketch.random(sketch.height)
          );
          d.parent = data.find((p) => p.id === d.parentId);
          d.color = d.color = sketch.color(
            sketch.random(255),
            sketch.random(255),
            sketch.random(255)
          );
        } else {
          d.pos = sketch.createVector(sketch.width / 2, sketch.height / 2);
          d.parent = null;
          d.color = sketch.color(
            sketch.random(255),
            sketch.random(255),
            sketch.random(255)
          );
        }
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
          (d.radius = sketch.map(
            d.children.length,
            minValue,
            maxValue,
            minRadius,
            maxRadius
          ))
      );

      relaxCircle();
    };

    sketch.draw = () => {
      sketch.background(40, 42, 54);

      /*
    drawingContext.shadowOffsetX = 0;
    drawingContext.shadowOffsetY = 0;
    drawingContext.shadowBlur = 2;
    drawingContext.shadowColor = 'black';
    */

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
        else if (d.state == STATES.OVER) sketch.fill(200);
        else if (d.state == STATES.PRESSED) sketch.fill(100);
        sketch.ellipse(d.pos.x, d.pos.y, d.radius - 4, d.radius - 4);

        sketch.strokeWeight(1);
        sketch.stroke(50);
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
  };
