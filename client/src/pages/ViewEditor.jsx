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

function ViewEditor() {
  const [editorContent, setEditorContent] = useState("");
  const [selectedVersion, setSelectedVersion] = useState(null);
  const [diffContent, setDiffContent] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [docName, setDocName] = useState("Import Document");
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
        <div className="flex flex-col w-full gap-4">
          <button className="btn w-fit" onClick={exportToWord}>
            Export To Word
          </button>
          <div className="flex">
            <ReactQuill
              ref={quillRef} // Attach the ref here
              value={editorContent}
              onChange={setEditorContent}
              modules={{ toolbar: false }}
              readOnly={true}
              className="w-full"
              style={{ width: "100%" , height: "100vh" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewEditor;
