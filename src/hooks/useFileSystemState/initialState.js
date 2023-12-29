// O estado persistente no file system default. Para caso não haja nenhum salvo ainda.
export const defaultPersistentState = {
  // a sketch ativa define qual será a parent caso a atual seja salva
  activeSketch: {
    id: "initial",
    name: "initial",
    dir: "initial",
  },

  // o código carregado para o editor
  code: null,

  // a sketch carregada para o visualizador
  currentInView: null,
  canRunSketch: true,
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
