/******************
Code by Vamoss
Original code link:
https://openprocessing.org/sketch/2107128

Author links:
http://vamoss.com.br
http://twitter.com/vamoss
http://github.com/vamoss
******************/

///Original code from paperjs, by Jürg Lehni & Jonathan Puckey
//http://paperjs.org/examples/meta-balls/

///Original force-graph
//https://editor.p5js.org/JeromePaddick/sketches/bjA_UOPip

import p5 from "p5";

const minRadius = 20;
const maxRadius = 80;

//metaballs
const handle_len_rate = 1.5;
const maxDistance = 100; //metaball
var connections = [];

const gravityConstant = 1.1;
const forceConstant = 500;
const radiusDistributionInfluence = 0.2;
var motionVel = 100;
var center;

var ctx;

//pan
var transX = 0,
  transY = 0,
  draggingMap = false;
var boundBox;

const STATES = { FREE: 0, OVER: 1, PRESSED: 2 };
export const meatballs =
  ({ windowWidth, windowHeight, data, selectHandler }) =>
  (sketch) => {
    //  as funções do nativas que o processing pega de hook tem
    //  que ser adicionadas ao objecto sketch passado como argumento
    sketch.setup = () => {
      var canvas = sketch.createCanvas(windowWidth, windowHeight);
      ctx = canvas.drawingContext;
			center = sketch.createVector(sketch.width/2, sketch.height/2)

      /*
      //generate random points
      //descending from the original
      var total = sketch.random(5, 10);
      for (var i = 0; i < total; i++) {
        data.push({
          id: data.length,
          parentId: i==0?null:0, //floor(random(data.length-1))
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
        d.parent = data.find((p) => p.id === d.parentId);
        if (d.parentId !== null) {
          if(d.x && d.y){
						//for saved data
            d.pos = sketch.createVector(
              d.x * sketch.width,
              d.y * sketch.height
            );
          	d.color = sketch.color(d.r * 255, d.g * 255, d.b * 255);
          }else{
						//for new content (generated content enter this condition)
            // d.pos = findSpot(d);
            d.pos = sketch.createVector(
              d.parent.pos.x + sketch.random(-5, 5),
              d.parent.pos.y + sketch.random(-5, 5)
            );
					  d.color = sketch.color(
							sketch.constrain(d.parent.color._getRed() + sketch.random(-30, 30), 0, 255),
							sketch.constrain(d.parent.color._getGreen() + sketch.random(-30, 30), 0, 255),
							sketch.constrain(d.parent.color._getBlue() + sketch.random(-30, 30), 0, 255)
						);
          }
        } else {
          d.pos = sketch.createVector(sketch.width / 2, sketch.height / 2);
          d.parent = null;
          d.color = sketch.color(sketch.random(255), sketch.random(255), sketch.random(255));
          if (d.id === 'initial') {
            d.pos = sketch.createVector(
              d.x * sketch.width,
              d.y * sketch.height
            );
            d.color = sketch.color(d.r * 255, d.g * 255, d.b * 255);
          }
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
    };

    sketch.draw = () => {
    sketch.background(255, 255, 220);
    sketch.translate(transX, transY);
			
    if(motionVel > 20)
        motionVel -= 5

    /*
    //update circles pos
    for(var i = 0; i < data.length; i++){
        var d = data[i];
        if(d.state !== STATES.FREE)
            continue;

        //noise motion
        var angle = sketch.noise(d.id + sketch.frameCount/100) * sketch.TWO_PI;
        d.pos.x += sketch.cos(angle)/10;
        d.pos.y += sketch.sin(angle)/10;
    }
    /**/
    
    // apply force towards centre
    for(let i = 0; i < data.length; i++){
        let d = data[i];
        d.virtualPos = d.pos.copy().sub(center)
        let gravity = d.virtualPos.copy().mult(-1).mult(gravityConstant)
        d.force = gravity
    }

    // apply repulsive force between nodes
    for(let i = 0; i < data.length; i++){
        let d = data[i];
        for(let j = i+1; j < data.length; j++){
            let d2 = data[j];
            let dir = d2.virtualPos.copy().sub(d.virtualPos)
            let force = dir.div(dir.mag() * dir.mag())
            force.mult(forceConstant*d.radius*radiusDistributionInfluence)
            d.force.add(force.copy().mult(-1))
            if (d2.state === STATES.FREE){
                d2.force.add(force)
            }
        }
    }

    // apply forces applied by connections
    for(let i = 0; i < data.length; i++){
        let d = data[i]
        if (d.parent !== null) {
            let d2 = d.parent
            let dis = d.virtualPos.copy().sub(d2.virtualPos)
            d.force.sub(dis)
            if (d2.state === STATES.FREE){
                d2.force.add(dis)
            }
        }
    }
    
    //update
    for(let i = 0; i < data.length; i++){
        let d = data[i]
        if (d.state === STATES.FREE){
            d.virtualPos.add(d.force.copy().div(motionVel))
            d.pos = d.virtualPos.copy().add(center)
        }
    }

      calculateBoundbox();

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
          if (j === 0) sketch.vertex(path.segments[j].x, path.segments[j].y);
          else if (j % 2 !== 0) {
            sketch.vertex(
              path.segments[(j + 1) % 4].x,
              path.segments[(j + 1) % 4].y
            );
          }
          if (j % 2 !== 0) continue;
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
      data.forEach((d, i) => {
        sketch.strokeWeight(4);
        sketch.stroke(d.color);
        if (d.state === STATES.FREE) sketch.fill(255);
        else if (d.state === STATES.OVER) sketch.fill(d.overColor);
        else if (d.state === STATES.PRESSED) sketch.fill(d.pressColor);

        var pulse = 0;
        if(i === data.length-1){
          pulse = (Math.sin(sketch.frameCount/10)+1)/2 * 30 + 20;
        }
        d.grow = sketch.constrain(d.grow + d.growVel, 0, 1);
        var ease = quarticInOut; //d.growVel > 0 ? elasticOut : elasticIn;
        d.radius = d.originalRadius + ease(d.grow) * 20 + pulse;

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
			if(!ctx) return;
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
          if (d.state === STATES.PRESSED) {
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
      data.forEach((d) => {
        if (d.state === STATES.PRESSED && !d.dragged) {
            if (typeof selectHandler === "function") selectHandler(d);
        }
        d.dragged = false
      });
    };

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