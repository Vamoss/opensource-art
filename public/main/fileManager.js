const fs = require("fs");
const path = require("path");

const PATH_TO_FILES = "/data/";
const PATH_TO_TEMP_FILES = "temp/";
const PATH_TO_INITIAL_FILES = "initial/";
const PATH_TO_DERIVED_FILES = "derived/";

/**
 * Checa se o diretorio existe.
 * Cria caso ele não exista ainda.
 *
 * @param {string} dirPath
 */
const ensuresDir = (dirPath) => {
  // Checa se o diretório já existe
  if (!fs.existsSync(dirPath)) {
    // Cria o diretório
    fs.mkdirSync(dirPath);
  }
};

/**
 * Medoto para garantir que a estrutuda de diretórios
 * para salvar as sketches está disponível.
 */
const ensuresFolderStructure = () => {
  ensuresDir(path.join(__dirname, PATH_TO_FILES));
  ensuresDir(path.join(__dirname, `${PATH_TO_FILES}${PATH_TO_TEMP_FILES}`));
  ensuresDir(path.join(__dirname, `${PATH_TO_FILES}${PATH_TO_INITIAL_FILES}`));
  ensuresDir(path.join(__dirname, `${PATH_TO_FILES}${PATH_TO_DERIVED_FILES}`));
};

ensuresFolderStructure();

/**
 * Save a file to the temp folder.
 * @param {*} file
 */
exports.saveTempFile = (file, viewerWin) => {
  const tempDirLocation = path.join(
    __dirname,
    `${PATH_TO_FILES}${PATH_TO_TEMP_FILES}`
  );
  const tempFilesList = fs.readdirSync(tempDirLocation);

  tempFilesList.forEach((tempFileName) => {
    fs.rmSync(`${tempDirLocation}${tempFileName}`);
  });

  return fs.writeFile(
    `${tempDirLocation}/${file.id}`,
    file.content,
    { encoding: "utf-8" },
    (err) => {
      if (err) {
        console.log("Error Saving file:", err.message);
        throw err;
      }
      viewerWin.reload();
    }
  );
};

/**
 * Testa se o diretório existe e cria caso ainda não esteja feito.
 * Cria um novo arquivo.
 */
exports.saveFile = (file) => {
  const fileLocation = path.join(
    __dirname,
    `${PATH_TO_FILES}${PATH_TO_DERIVED_FILES}${file.name}`
  );
  console.log("Saving file at: ", fileLocation);

  fs.mkdirSync(fileLocation);

  /**
   * TODO: mudar a atualização do gráfico pra o
   * próprio metodo.
   */
  const graphDataFileLocation = path.join(
    __dirname,
    `${PATH_TO_FILES}sketchesGraphData.json`
  );

  const graphDataContent = fs.readFileSync(graphDataFileLocation, {
    encoding: "utf-8",
  });

  const graphData = JSON.parse(graphDataContent);

  graphData.links.push({
    source: file.name,
    target: file?.parent?.id,
    value: 1,
  });

  graphData.nodes.push({
    id: file.name,
    group: 2,
  });

  fs.writeFile(
    graphDataFileLocation,
    JSON.stringify(graphData),
    { encoding: "utf-8" },
    (err) => {
      if (err) {
        console.log("Error Saving file:", err.message);
        throw err;
      }
      console.log("GRAPH updated!");
    }
  );

  // FIM DA ATUALIZAÇÃO DO GRÁFICO

  fs.writeFileSync(
    `${fileLocation}/sketch.js`,
    file.content,
    { encoding: "utf-8" },
    (err) => {
      if (err) {
        console.log("Error Saving file:", err.message);
        throw err;
      }
      console.log("Saved!");
    }
  );

  fs.writeFileSync(
    `${fileLocation}/metadata.json`,
    JSON.stringify({ ...file, dir: "derived" }),
    { encoding: "utf-8" },
    (err) => {
      if (err) {
        console.log("Error Saving file:", err.message);
        throw err;
      }
      console.log("Metadada saved!");
    }
  );
};

/**
 * Checa se o arqueivo já existe.
 * Atualiza um arquivo.
 */
exports.updateFile = (file) => {
  const fileLocation = path.join(__dirname, `${PATH_TO_FILES}${file.name}`);

  // Checa se o arquivo existe
  if (!fs.existsSync(fileLocation)) {
    throw new Error("File doesn't exists");
  } else {
    // Atualiza o conteúdo
    console.log("updating file: ", fileLocation);
    fs.writeFile(fileLocation, file.content, { encoding: "utf-8" }, (err) => {
      if (err) throw err;
      console.log("Updated!");
    });
  }
};

exports.getFileList = () => {
  const initial = fs.readdirSync(
    path.join(__dirname, `${PATH_TO_FILES}${PATH_TO_INITIAL_FILES}`)
  );
  const derived = fs.readdirSync(
    path.join(__dirname, `${PATH_TO_FILES}${PATH_TO_DERIVED_FILES}`)
  );

  return {
    initial,
    derived,
  };
};

/**
 * App state
 */

exports.getAppState = (defaultState) => {
  const stateFileLocation = path.join(
    __dirname,
    `${PATH_TO_FILES}appstate.json`
  );

  if (!fs.existsSync(stateFileLocation)) {
    fs.writeFileSync(stateFileLocation, JSON.stringify(defaultState), {
      encoding: "utf-8",
    });
  }

  const fileContent = fs.readFileSync(stateFileLocation, { encoding: "utf-8" });

  return JSON.parse(fileContent);
};

exports.updateAppState = (appState) => {
  const stateFileLocation = path.join(
    __dirname,
    `${PATH_TO_FILES}appstate.json`
  );

  fs.writeFileSync(stateFileLocation, JSON.stringify(appState), {
    encoding: "utf-8",
  });
};

/**
 *
 * Graph data file
 */

exports.getGraphDataFile = () => {
  const graphDataFileLocation = path.join(
    __dirname,
    `${PATH_TO_FILES}sketchesGraphData.json`
  );

  if (!fs.existsSync(graphDataFileLocation)) {
    // set initial object for graphdata
    const defaultGraphData = {
      nodes: [],
      links: [],
    };

    // check all initial sketches
    const initialSketches = fs.readdirSync(
      path.join(__dirname, `${PATH_TO_FILES}${PATH_TO_INITIAL_FILES}`)
    );

    // pras initial só o nome basta pra criar o node no grafico.
    // elas são os pontos iniciais das redes
    initialSketches.forEach((initial) => {
      defaultGraphData.nodes.push({
        id: initial,
        group: 1,
      });
    });

    // check all initial sketches
    const derivedSketches = fs.readdirSync(
      path.join(__dirname, `${PATH_TO_FILES}${PATH_TO_DERIVED_FILES}`)
    );

    // pras derived tem que olhar na metadata dela e ver quem é a parent
    // ai cria o node e já o link pro parent
    derivedSketches.forEach((derived) => {
      const fileMetaPath = `${derived}/metadata.json`;

      defaultGraphData.nodes.push({
        id: derived,
        group: 2,
      });

      const fileMetaContent = fs.readFileSync(
        path.join(
          __dirname,
          `${PATH_TO_FILES}${PATH_TO_DERIVED_FILES}${fileMetaPath}`
        ),
        { encoding: "utf-8" }
      );

      try {
        const fileMeta = JSON.parse(fileMetaContent);
        defaultGraphData.links.push({
          source: derived,
          target: fileMeta.parent?.id,
          value: 1,
        });
      } catch (e) {
        console.log(`error parsing metadata for id ${derived}`);
      }
    });

    fs.writeFileSync(graphDataFileLocation, JSON.stringify(defaultGraphData), {
      encoding: "utf-8",
    });
  }

  const fileContent = fs.readFileSync(graphDataFileLocation, {
    encoding: "utf-8",
  });

  return JSON.parse(fileContent);
};

/**
 * Carrega um arquivo.
 *
 * Retorna null se não encontrar o arquivo
 */
exports.loadFile = (fileData) => {
  if (fileData.dir === null || fileData.id === null) {
    return null;
  }

  const fileContentPath =
    fileData.dir === "temp" ? fileData.id : `${fileData.id}/sketch.js`;

  const fileContent = fs.readFileSync(
    path.join(__dirname, `${PATH_TO_FILES}${fileData.dir}/${fileContentPath}`),
    { encoding: "utf-8" }
  );

  /* Só os derived tem meta, então retorna logo com o fileData mesmo
   * se for de outro diretório
   */
  if (fileData.dir !== "derived") {
    return {
      content: fileContent,
      meta: fileData,
    };
  }

  const fileMetaPath = `${fileData.id}/metadata.json`;

  let fileMeta = fs.readFileSync(
    path.join(__dirname, `${PATH_TO_FILES}${fileData.dir}/${fileMetaPath}`),
    { encoding: "utf-8" }
  );

  try {
    fileMeta = JSON.parse(fileMeta);
  } catch (e) {
    console.log(`error parsing file for id ${fileData.id}`);
  }

  return {
    content: fileContent,
    meta: fileMeta,
  };
};
