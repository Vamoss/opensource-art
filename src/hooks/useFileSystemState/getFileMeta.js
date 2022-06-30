// Formato para salvar a metadata de uma sketch
export const getFileMetaData = (fileData, parentFile) => {
  return {
    name: fileData.name,
    id: fileData.id,
    content: fileData.code,
    parent: {
      id: parentFile.id,
      name: parentFile.name,
      dir: parentFile.dir,
    },
  };
};
