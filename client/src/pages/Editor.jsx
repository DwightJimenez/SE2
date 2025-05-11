import React, { useState, useEffect, useRef } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import axios from "axios";
import { diffWords } from "diff";
import { saveAs } from "file-saver";
import DOMPurify from "dompurify";
import * as quillToWord from "quill-to-word";
import { useParams } from "react-router-dom";
import PageLoc from "../components/PageLoc";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const API_URL = import.meta.env.VITE_API_URL;

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
  const [docName, setDocName] = useState("Untitled Document");
  const { id } = useParams();
  const quillRef = useRef(null); // Ref for accessing Quill instance

  // Load version history and editor content from localStorage or server
  useEffect(() => {
    console.log(id);
    fetchVersions(id);
    const savedContent = localStorage.getItem(`editorContent-${id}`);

    if (savedContent) {
      setEditorContent(savedContent); // Load the saved content from localStorage
    }
  }, [id]);

  // Watch for editor content changes and save it to localStorage
  useEffect(() => {
    if (editorContent) {
      localStorage.setItem(`editorContent-${id}`, editorContent); // Save to localStorage
    }
  }, [editorContent]);

  async function fetchVersions(id) {
    const res = await axios.get(`${API_URL}/editor/file/${id}`, {
      withCredentials: true,
    });

    if (res.data.Versions.length > 0) {
      setVersions(res.data.Versions);
      setDocName(res.data.name); // Set the document name from the response
      // Only set the editor content from the latest version if there is no saved content in localStorage
      if (!localStorage.getItem(`editorContent-${id}`)) {
        setEditorContent(res.data.Versions[0].content); // Set the latest version content into the editor
        setSelectedVersion(res.data.Versions[0]); // Set the latest version as selected
      }
    }
  }

  async function saveVersion(id) {
    if (!commitMessage.trim()) {
      alert("Please enter a commit message!");
      return;
    }
    console.log("id wtf", id);
    await axios.post(
      `${API_URL}/editor/save`,
      {
        content: editorContent,
        commitMessage,
        fileId: id,
      },
      { withCredentials: true }
    );
    setCommitMessage("");
    fetchVersions(id);
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
    <div className="p-4 flex flex-col">
      <PageLoc
        currentPage={docName}
        backLink="/create-document" 
        showBack={true}
      />
      <div className="flex">
        {/* left */}
        <div className="flex flex-col">
          <button className="btn w-fit" onClick={exportToWord}>
            Export To Word
          </button>
          <div className="flex gap-4">
            <ReactQuill
              ref={quillRef} // Attach the ref here
              theme="snow"
              value={editorContent}
              onChange={setEditorContent}
              modules={modules}
              className={showPreview && selectedVersion ? "w-1/2" : "w-full"}
            />
            {showPreview && selectedVersion && (
              <div className="p-4 border rounded bg-white shadow w-1/2">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold mb-2">
                    Changes Compared to Current
                  </h3>
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
          </div>
        </div>


        {/* right */}
        <div className="flex flex-col p-4 border-accent w-90 h-130">
          <div className="flex flex-col gap-2 justify-end p-4">
            <input
              type="text"
              placeholder="Commit message"
              value={commitMessage}
              onChange={(e) => setCommitMessage(e.target.value)}
              className="border rounded p-2 w-full"
            />
            <div
              onClick={() => saveVersion(id)}
              className="btn btn-accent text-white px-4 py-2 rounded"
            >
              Save Version
            </div>
          </div>
          <h2 className="text-xl font-semibold">Version History</h2>
          <div className="flex flex-col items-end w-60 p-4 overflow-y-scroll">
            
            <div className="w-full h-full flex flex-col items-end">
              <ul className="timeline timeline-vertical timeline-compact w-full">
                {versions.map((ver, idx) => (
                  <li key={idx}>
                    {idx !== 0 && <hr className="bg-accent"/>}
                    <div className="timeline-middle">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="h-5 w-5 text-accent"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div
                            className={`timeline-start timeline-box h-25 w-50 cursor-pointer border border-tertiary flex flex-col justify-evenly ${
                              selectedVersion === ver ? "bg-blue-100" : ""
                            }`}
                            onClick={() => handleVersionClick(ver)}
                          >
                            <div className="font-semibold">
                              {ver.commitMessage}
                            </div>
                            <div className="text-gray-500 text-xs">
                              {new Date(ver.timestamp).toLocaleString()}
                            </div>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent side="left" className="w-50 p-4">
                          <p>Committed by: {ver.User.username}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    {idx !== versions.length - 1 && <hr className="bg-accent"/>}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Editor;
