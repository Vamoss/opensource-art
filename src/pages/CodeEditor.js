import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { useFileSystem } from "../hooks/useFileSystemState";
import SideBar from "../components/SideBar";

const CodeEditor = () => {
  const { code, updateCode } = useFileSystem();

  const onChange = (value) => {
    updateCode(value);
  };

  return (
    <main className="container">
      <SideBar />
      <section className="code-container">
        <CodeMirror
          value={code}
          height="50%"
          extensions={[javascript()]}
          onChange={onChange}
        />
      </section>
    </main>
  );
};

export default CodeEditor;
