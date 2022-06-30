// O estado persistente no file system default. Para caso não haja nenhum salvo ainda.
export const defaultPersistentState = {
  // a sketch ativa define qual será a parent caso a atual seja salva
  activeSketch: {
    id: "circle_draw",
    name: "circle_draw",
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
  currentInView: null,
};

export const initialState = {
  ...defaultPersistentState,

  // lista de arquivos pra ter os botões para abri-los
  // depois será substituido pela arvore de herança
  files: {
    initial: [],
    derived: [],
  },
};
