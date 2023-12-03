import { BrowserRouter, Routes, Route } from "react-router-dom";
import { FileSystemProvider } from "./hooks/useFileSystemState";
import CodeEditor from "./pages/CodeEditor";
import MeatBallsPage from "./pages/MeatBallsPage";
import ScreenSaver from "./pages/ScreenSaver";
import Sketches from "./pages/Sketches";
import Viewer from "./pages/Viewer";
import { LocalizationProvider } from "./hooks/useLocalization";

function App() {
  return (
    <BrowserRouter>
      <LocalizationProvider>
        <FileSystemProvider>
          <Routes>
            <Route path="/" element={<CodeEditor />} />
            <Route path="/sketches" element={<Sketches />} />
            <Route path="/force-graph" element={<MeatBallsPage />} />
            <Route path="/viewer" element={<Viewer />} />
            <Route path="/screen-saver" element={<ScreenSaver />} />
          </Routes>
        </FileSystemProvider>
      </LocalizationProvider>
    </BrowserRouter>
  );
}
export default App;
