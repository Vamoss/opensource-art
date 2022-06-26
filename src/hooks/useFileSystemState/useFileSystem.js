import { useContext } from "react";
import { FileSystemContext } from "./FileSystemContext";

export const useFileSystem = () => useContext(FileSystemContext);
