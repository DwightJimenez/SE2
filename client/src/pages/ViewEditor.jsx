import React, { useState, useEffect, useRef } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import axios from "axios";
import { saveAs } from "file-saver";
import * as quillToWord from "quill-to-word";
import { useParams } from "react-router-dom";
import PageLoc from "../components/PageLoc";

const API_URL = import.meta.env.VITE_API_URL;

function ViewEditor() {
  const [editorContent, setEditorContent] = useState("");
  const [docName, setDocName] = useState("Untitled Document");
  const { id } = useParams();
  const quillRef = useRef(null); // Ref for accessing Quill instance

  // Load version history and editor content from localStorage or server
  useEffect(() => {
    console.log(id);
    fetchVersions(id);
  }, [id]);


  async function fetchVersions(id) {
    const res = await axios.get(`${API_URL}/editor/file/${id}`, {
      withCredentials: true,
    });

    if (res.data.Versions.length > 0) {
      console.log(res.data.Versions[0].content);
      setEditorContent(res.data.Versions[0].content); // Set the editor content from the response
      setDocName(res.data.name); // Set the document name from the response
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
              style={{ width: "100%", height: "100vh" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewEditor;
