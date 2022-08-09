/******************
Code by Vamoss
Original code link:
https://openprocessing.org/sketch/1617307
Author links:
http://vamoss.com.br
http://twitter.com/vamoss
http://github.com/vamoss
******************/

//Concept from the book:
//Walkscapes - O caminhar como Prática Estética

const sujeitos = [
  { palavra: "computador", genero: "m" },
  { palavra: "ser humano", genero: "m" },
  { palavra: "código", genero: "m" },
  { palavra: "arte", genero: "f" },
  { palavra: "ideia", genero: "f" },
  { palavra: "conhecimento", genero: "m" },
];

/*
%s = sujeito
%ad = artigo definido (o, a)
%ai = artigo indefinido (um, uma)
%pd3 = pronome demonstrativo 3a pessoa (aquele, aquela)
%pp3 = pronome possessivo 3a pessoa (seu, sua)
*/
const frases = [
  "Quem programa [%ad] [%s]?",
  "Quem programa [%ai] [%s]?",
  "O que torna [%ai] [%s] interessante?",
  "O que acontece quando [%ad] [%s] quebra?",
  "O que acontece quando altero [%pd3] [%s]?",
  "O que torna [%ad] [%pp3] [%s] original?",
  "Quão alterad[%ad] [%ai] [%s] precisa ser pra ser [%ai] nov[%ad] [%s]?",
  "Existe [%ai] [%s] completamente nov[%ad]?",
  "De onde surgiu [%ad] [%s] que escrevi?",
  "Quem veio antes? A arte ou o código?",
  "[%ai] [%s] consegue ser aleatório?",
  "[%ai] [%s] consegue repetir a mesma tarefa sempre?",
  "[%ai] [%s] consegue ser aleatório?",
  "Quem decidiu programar [%ad] [%s]?",
  "Você já tentou programar [%ai] [%s]?",
];

//text
var message, font, mappedSize, textY, fadeIn;

//noise particles
var intensity, timeSum;
var particles = [];

var textColor = 0;
var noiseColor = 255;

function preload() {
  font = loadFont("./assets/OpenSans-ExtraBold.ttf");
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  for (var i = 0; i < 500; i++) {
    particles.push({
      x: random(width),
      y: random(height),
      v: random(5, 20), //vel
    });
  }

  mappedSize = map(width, 400, 900, 50, 110);
  textSize(mappedSize);
  textLeading(mappedSize * 1.05);
  textFont(font);
  newMessage();
}

function newMessage() {
  var sujeito = random(sujeitos);
  var _s = sujeito.palavra;
  var _ad = "o";
  var _ai = "um";
  var _pd3 = "aquele";
  var _pp3 = "seu";
  if (sujeito.genero == "f") {
    _ad = "a";
    _ai = "uma";
    _pd3 = "aquela";
    _pp3 = "sua";
  }

  message = random(frases);
  message = message.replaceAll("[%s]", _s);
  message = message.replaceAll("[%ad]", _ad);
  message = message.replaceAll("[%ai]", _ai);
  message = message.replaceAll("[%pd3]", _pd3);
  message = message.replaceAll("[%pp3]", _pp3);

  message = wrapText(message, width - 40);

  var textHeight = textLeading() * (message.split("\n").length - 1);
  textY = random(textLeading(), height - textHeight - textLeading());

  setTimeout(newMessage, 7000);
  fadeIn = 0;

  if (textColor == 255) {
    textColor = 0;
    noiseColor = 255;
  } else {
    textColor = 255;
    noiseColor = 0;
  }
}

function draw() {
  intensity = noise(frameCount / 50);
  timeSum -= intensity;

  strokeWeight(2);
  stroke(noiseColor);
  particles.forEach((p, i) => {
    var pX = p.x;
    var pY = p.y;
    p.x -= intensity * p.v;
    p.y += (noise(p.x / 100, intensity * 5 + frameCount / 50) - 0.447) * 10;
    line(p.x, p.y, pX, pY);
    if (p.x < 0) {
      p.x = width;
      p.y = random(height);
    }
  });

  noStroke();
  fill(textColor, fadeIn < 255 ? ++fadeIn : fadeIn);
  text(message, 20, textY);
}

// wraps text to a specified width (will flow to any height necessary to fit
// all the text), can optionally indent first/other lines and will hyphenate
// very large words (can also specify a particular hyphen character if desired)
// via: https://stackoverflow.com/a/45614206/1167783
function wrapText(s, w) {
  // if short enough, just send it back as is
  var outputLines = "";
  if (textWidth(s) <= w) {
    outputLines = s;
  }

  // otherwise, split it!
  else {
    var words = s.split(" ");
    var currentLine = "";
    for (var i = 0; i < words.length; i++) {
      var word = words[i];

      // check width, if not too long yet then add the current word
      // and keep going through the string
      var lineWidth = textWidth(currentLine + " " + word);
      if (lineWidth < w) {
        currentLine += word + " ";
      }
      // if too long, end current line and start a new one
      else {
        outputLines += currentLine + "\n";
        currentLine = word + " ";
      }
    }
    outputLines += currentLine;
  }
  return outputLines;
}
