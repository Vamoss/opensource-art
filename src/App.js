import { BrowserRouter, Routes, Route } from "react-router-dom";
import { FileSystemProvider } from "./hooks/useFileSystemState";
import CodeEditor from "./pages/CodeEditor";
import ForceGraphPage from "./pages/ForceGraphPage";
import MeatBallsPage from "./pages/MeatBallsPage";
import Sketches from "./pages/Sketches";
import Viewer from "./pages/Viewer";

function App() {
  return (
    <BrowserRouter>
      <FileSystemProvider>
        <Routes>
          <Route path="/" element={<CodeEditor />} />
          <Route path="/sketches" element={<Sketches />} />
          <Route path="/force-graph" element={<MeatBallsPage />} />
          <Route path="/viewer" element={<Viewer />} />
        </Routes>
      </FileSystemProvider>
    </BrowserRouter>
  );
}
export default App;
