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

const minRadius = 30;
const maxRadius = 100;

const gravityConstant = 1.1;
const forceConstant = 2000;
var motionVel = 10;
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
      var total = sketch.random(15, 20);
      for (var i = 0; i < total; i++) {
        data.push({
          id: data.length,
          parentId: i==0?null:0, //floor(random(data.length-1))
        });
      }
      //descending from others
      total = sketch.random(80, 100);
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
              d.parent.pos.x + sketch.random(-20, 20),
              d.parent.pos.y + sketch.random(-20, 20)
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

        d.colorString = d.color.toString();
        d.overColorString = d.overColor.toString();
        d.pressColorString = d.pressColor.toString();
        d.virtualPos = {x:0, y:0}
        d.force = {x:0, y:0}
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

      // apply force towards centre
      for(let i = 0; i < data.length; i++){
          let d = data[i];
          d.virtualPos.x = d.pos.x - center.x
          d.virtualPos.y = d.pos.y - center.y

          //gravity
          d.force.x = d.virtualPos.x * -gravityConstant
          d.force.y = d.virtualPos.y * -gravityConstant
      }

      // apply repulsive force between nodes
      for(let i = 0; i < data.length; i++){
          const d = data[i];
          for(let j = i+1; j < data.length; j++){
            const d2 = data[j];
            const dirX = d2.virtualPos.x - d.virtualPos.x
            const dirY = d2.virtualPos.y - d.virtualPos.y
            var magnitude = magSq(dirX, dirY);
            if(magnitude === 0) magnitude = 0.001;
            const forceX = (dirX / magnitude) * forceConstant
            const forceY = (dirY / magnitude) * forceConstant
            d.force.x -= forceX * (d2.originalRadius)/minRadius
            d.force.y -= forceY * (d2.originalRadius)/minRadius
            d2.force.x += forceX * (d.originalRadius)/minRadius
            d2.force.y += forceY * (d.originalRadius)/minRadius
          }
      }

      // apply forces applied by connections
      for(let i = 0; i < data.length; i++){
          const d = data[i]
          if (d.parent !== null) {
              let d2 = d.parent
              const dirX = (d.virtualPos.x - d2.virtualPos.x)/((d2.children.length+10)/10)
              const dirY = (d.virtualPos.y - d2.virtualPos.y)/((d2.children.length+10)/10)
              d.force.x -= dirX
              d.force.y -= dirY
              d2.force.x += dirX
              d2.force.y += dirY
          }
      }

      //update
      for(let i = 0; i < data.length; i++){
          const d = data[i]
          if (d.state === STATES.FREE){
            d.virtualPos.x += d.force.x / motionVel
            d.virtualPos.y += d.force.y / motionVel
            d.pos.x = d.virtualPos.x + center.x
            d.pos.y = d.virtualPos.y + center.y
          }
      }

      calculateBoundbox();

      //draw connections
      ctx.lineWidth = 5;
      data.forEach((d) => {
				if(!sketch.isVisible(d))
          return;
        if (d.parent !== null) {
          ctx.strokeStyle = d.colorString;
          ctx.beginPath();
          ctx.moveTo(d.parent.pos.x, d.parent.pos.y);
          ctx.lineTo(d.pos.x, d.pos.y);
          ctx.stroke();
        }
      });

      //draw circles
      ctx.lineWidth = 4;
      data.forEach((d, i) => {
				if(!sketch.isVisible(d))
          return;
        ctx.strokeStyle = d.colorString;
        if (d.state === STATES.FREE) ctx.fillStyle = "rgb(255, 255, 255)";
        else if (d.state === STATES.OVER) ctx.fillStyle = d.overColorString;
        else if (d.state === STATES.PRESSED) ctx.fillStyle = d.pressColorString;

        var pulse = 0;
        if(i === data.length-1){
          pulse = (Math.sin(sketch.frameCount/10)+1)/2 * 30 + 20;
        }
        d.grow = sketch.constrain(d.grow + d.growVel, 0, 1);
        var ease = quarticInOut; //d.growVel > 0 ? elasticOut : elasticIn;
        d.radius = d.originalRadius + ease(d.grow) * 20 + pulse;

        ctx.beginPath();
        ctx.ellipse(d.pos.x, d.pos.y, d.radius * 0.5 - 4, d.radius * 0.5 - 4, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fill();
      });

      /*
      //draw texts
      sketch.noStroke();
      sketch.fill(0);
      sketch.textAlign(sketch.CENTER, sketch.CENTER);
      data.forEach(d => {	
        var size = d.radius * 0.8;
        sketch.textSize(size);
        // sketch.text(d.id, d.pos.x, d.pos.y + size/10);
        sketch.text(d.children.length, d.pos.x, d.pos.y + size/10);
      })	
      /**/
    };
		
		sketch.isVisible = d => {
			const border = -50;
			return d.pos.x > border-transX && d.pos.x < sketch.width-border-transX
					&& d.pos.y > border-transY && d.pos.y < sketch.height-border-transY
		}

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
            if (!d.dragged) {
              d.dragged = 1;
            } else {
              d.dragged++;
            }
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
          d.dragged = 0;
          return false;
        }
        return true;
      });
      draggingMap = notFound;
    };

    sketch.mouseReleased = () => {
      draggingMap = false;
      data.forEach((d) => {
        if (d.state === STATES.PRESSED && d.dragged < 10) {
          if (typeof selectHandler === "function") selectHandler(d);
        }
        d.dragged = 0
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

    // https://idmnyu.github.io/p5.js-func/
    function quarticInOut(x) {
      if (x < 0.5) {
        return 8 * x * x * x * x;
      } else {
        var v = x - 1;
        return -8 * v * v * v * v + 1;
      }
    }
    
    function magSq(x, y){
      return x * x + y * y;
    }
  };