import React, { useState, useEffect, useRef } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import axios from "axios";
import { diffWords } from "diff";
import { saveAs } from "file-saver";
import DOMPurify from "dompurify";
import * as quillToWord from "quill-to-word";

function generateDiffHTML(oldHTML, newHTML) {
  const diffs = diffWords(oldHTML, newHTML);
  const diffHTML = diffs
    .map((part) => {
      if (part.added) {
        return `<span style="background-color: #bbf7d0;">${part.value}</span>`;
      }
      if (part.removed) {
        return `<span style="background-color: #fecaca;">${part.value}</span>`;
      }
      return part.value;
    })
    .join("");

  // Sanitize the generated diff HTML
  return DOMPurify.sanitize(diffHTML);
}

function Editor() {
  const [editorContent, setEditorContent] = useState("");
  const [commitMessage, setCommitMessage] = useState("");
  const [versions, setVersions] = useState([]);
  const [selectedVersion, setSelectedVersion] = useState(null);
  const [diffContent, setDiffContent] = useState("");
  const [showPreview, setShowPreview] = useState(false);

  const quillRef = useRef(null); // Ref for accessing Quill instance

  // Load version history and editor content from localStorage or server
  useEffect(() => {
    fetchVersions();
    const savedContent = localStorage.getItem("editorContent");
    if (savedContent) {
      setEditorContent(savedContent); // Load the saved content from localStorage
    }
  }, []);

  // Watch for editor content changes and save it to localStorage
  useEffect(() => {
    if (editorContent) {
      localStorage.setItem("editorContent", editorContent); // Save to localStorage
    }
  }, [editorContent]);

  async function fetchVersions() {
    const res = await axios.get("http://localhost:4001/editor/versions", {
      withCredentials: true,
    });

    if (res.data.length > 0) {
      setVersions(res.data);
      // Only set the editor content from the latest version if there is no saved content in localStorage
      if (!localStorage.getItem("editorContent")) {
        setEditorContent(res.data[0].content); // Set the latest version content into the editor
        setSelectedVersion(res.data[0]);
      }
    }
  }

  async function saveVersion() {
    if (!commitMessage.trim()) {
      alert("Please enter a commit message!");
      return;
    }
    await axios.post(
      "http://localhost:4001/editor/save",
      {
        content: editorContent,
        commitMessage,
      },
      { withCredentials: true }
    );
    setCommitMessage("");
    fetchVersions();
  }

  async function rollbackVersion(content) {
    setEditorContent(content);
  }

  const handleVersionClick = (version) => {
    setSelectedVersion(version);
    const html = generateDiffHTML(version.content, editorContent);
    setDiffContent(html);
    setShowPreview(true);
  };

  const modules = {
    toolbar: [
      [{ font: [] }],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ align: [] }],
      ["bold", "italic", "underline", "strike"],
      ["link"],
      [{ color: [] }, { background: [] }],
      ["blockquote", "code-block"],
      [{ script: "sub" }, { script: "super" }],
      [{ indent: "-1" }, { indent: "+1" }],
      [{ direction: "rtl" }],
      ["image"],
      [{ size: ["small", false, "large", "huge"] }], // custom dropdown
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["clean"],
    ],
    clipboard: {
      matchVisual: false,
    },
  };

  const exportToWord = async () => {
    const editor = quillRef.current;
    if (!editor) {
      console.error("Quill editor is not ready yet.");
      return;
    }
    
    const delta = editor.getEditor().getContents(); // get delta contents
    const config = { exportAs: "blob" };
    const blob = await quillToWord.generateWord(delta, config);
    saveAs(blob, "my-document.docx");
  };
  

  return (
    <div className="p-4 flex gap-4">
      <button onClick={exportToWord}>Export To Word</button>
      <ReactQuill
        ref={quillRef} // Attach the ref here
        theme="snow"
        value={editorContent}
        onChange={setEditorContent}
        modules={modules}
        className={showPreview && selectedVersion ? "w-1/2": "w-full"}
      />
      {showPreview && selectedVersion && (
        <div className="p-4 border rounded bg-white shadow w-1/2">
          <div className="flex justify-between items-center">
            <h3 className="font-bold mb-2">Changes Compared to Current</h3>
            <button
              onClick={() => {
                setShowPreview(false);
                setSelectedVersion(null);
              }}
              className="text-red-500 hover:text-red-700"
            >
              Close
            </button>
          </div>

          <ReactQuill
            readOnly={true}
            value={diffContent}
            modules={{ toolbar: false }}
          />

          <button
            onClick={() => rollbackVersion(selectedVersion.content)}
            className="mt-4 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
          >
            Rollback to This Version
          </button>
        </div>
      )}
      <div className="flex flex-col">
        <div className="flex flex-col gap-2 items-center">
          <input
            type="text"
            placeholder="Commit message"
            value={commitMessage}
            onChange={(e) => setCommitMessage(e.target.value)}
            className="border rounded p-2 w-full"
          />
          <div
            onClick={saveVersion}
            className="btn btn-accent text-white px-4 py-2 rounded"
          >
            Save Version
          </div>
        </div>

        <div className="mt-6 relative w-60">
          <h2 className="text-xl font-semibold mb-2">Version History</h2>

          <ul className="timeline timeline-vertical absolute left-50">
            {versions.map((ver, idx) => (
              <li key={idx}>
                {idx !== 0 && <hr />}
                <div className="timeline-middle">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="h-5 w-5"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div
                  className={`timeline-start timeline-box h-25 w-50 ${
                    selectedVersion === ver ? "bg-blue-100" : ""
                  }`}
                  onClick={() => handleVersionClick(ver)}
                >
                  <div className="font-semibold">{ver.commitMessage}</div>
                  <div className="text-gray-500 text-xm">
                    {new Date(ver.timestamp).toLocaleString()}
                  </div>
                </div>
                {idx !== versions.length - 1 && <hr />}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Editor;
