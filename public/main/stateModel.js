// esse objeto está copiado também no front.
// depois unificar com o de lá
const defaultState = {
  // a sketch ativa define qual será a parent caso a atual seja salva
  activeSketch: {
    id: "initial",
    name: "initial",
    dir: "initial",
  },

  // o código carregado para o editor
  code: `function setup() {
  createCanvas(400, 400);
}

function draw() {
  fill(255);
  ellipse(mouseX, mouseY, 80, 80);
}
`,

  // a sketch carregada para o visualizador
  currentInView: {
    id: "initial",
    dir: "initial",
  },
};

exports.updateStateToActivateSketchFromFile = (file) => {
  return {
    activeSketch: {
      dir: file.meta.dir,
      name: file.meta.name,
      id: file.meta.id,
    },
    code: file.content,
    currentInView: {
      dir: file.meta.dir,
      id: file.meta.id,
    },
  };
};

exports.getDefaultState = () => defaultState;
