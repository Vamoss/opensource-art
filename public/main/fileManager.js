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

  tempFilesList.forEach((file) => {
    fs.rmSync(`${tempDirLocation}${file}`);
  });

  return fs.writeFile(
    `${tempDirLocation}/${file.name}`,
    file.content,
    { encoding: "utf-8" },
    (err) => {
      if (err) {
        console.log("Error Saving file:", err.message);
        throw err;
      }
      viewerWin.webContents.send("app:reload-viewer", {
        ...file,
        dir: "temp",
      });
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

  fs.writeFile(
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

  fs.writeFile(
    `${fileLocation}/metadata.json`,
    JSON.stringify({
      ...file,
    }),
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
 * Carrega um arquivo.
 *
 * Retorna null se não encontrar o arquivo
 */
exports.loadFile = (fileData) => {
  if (fileData.dir === null || fileData.name === null) {
    return null;
  }

  const filePath =
    fileData.dir === "temp" ? fileData.name : `${fileData.name}/sketch.js`;

  const fileContent = fs.readFileSync(
    path.join(__dirname, `${PATH_TO_FILES}${fileData.dir}/${filePath}`),
    { encoding: "utf-8" }
  );
  return {
    ...fileData,
    content: fileContent,
  };
};
