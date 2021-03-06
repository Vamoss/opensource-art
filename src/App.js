import { BrowserRouter, Routes, Route } from "react-router-dom";
import { FileSystemProvider } from "./hooks/useFileSystemState";
import CodeEditor from "./pages/CodeEditor";
import ForceGraphPage from "./pages/ForceGraphPage";
import Sketches from "./pages/Sketches";
import Viewer from "./pages/Viewer";

function App() {
  return (
    <FileSystemProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<CodeEditor />} />
          <Route path="/sketches" element={<Sketches />} />
          <Route path="/force-graph" element={<ForceGraphPage />} />
          <Route path="/viewer" element={<Viewer />} />
        </Routes>
      </BrowserRouter>
    </FileSystemProvider>
  );
}
export default App;
