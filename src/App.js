import { BrowserRouter, Routes, Route } from "react-router-dom";
import CodeEditor from "./pages/CodeEditor";
import Viewer from "./pages/Viewer";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CodeEditor />} />
        <Route path="/viewer" element={<Viewer />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;
