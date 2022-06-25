const fs = require("fs");
const path = require("path");

const PATH_TO_FILES = "/files/";

/**
 * Testa se o diretório existe e cria caso ainda não esteja feito.
 * Cria um novo arquivo.
 */
exports.saveFile = (file) => {
  const fileLocation = path.join(__dirname, `${PATH_TO_FILES}${file.name}`);
  console.log("Saving file at: ", fileLocation);

  // Checa se o diretório já existe
  if (!fs.existsSync(path.join(__dirname, PATH_TO_FILES))) {
    // Cria o diretório
    fs.mkdirSync(path.join(__dirname, PATH_TO_FILES));
  }

  fs.writeFile(fileLocation, file.content, { encoding: "utf-8" }, (err) => {
    if (err) {
      console.log("Error Saving file:", err.message);
      throw err;
    }
    console.log("Saved!");
  });
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
  const files = fs.readdirSync(path.join(__dirname, PATH_TO_FILES));
  return files;
};

/**
 * Carrega um arquivo
 */
exports.loadFile = (fileName) => {
  const fileContent = fs.readFileSync(
    path.join(__dirname, `${PATH_TO_FILES}${fileName}`),
    { encoding: "utf-8" }
  );
  return {
    name: fileName,
    content: fileContent,
  };
};
