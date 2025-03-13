import React from "react";

const AddDoc = () => {
  return (
    <div className="flex mb-4 p-4 bg-white max-w-200 dark:bg-black rounded-lg shadow-lg sticky">
      <div
        tabIndex={0}
        role="button"
        className="btn btn-ghost btn-circle avatar"
      ></div>
      <button
        className="btn btn-accent  mx-4 rounded-full grow border text-left text-gray-400 flex justify-start items-center"
        popoverTarget="popover-1"
        style={{ anchorName: "--anchor-1" } /* as React.CSSProperties */}
      >
        Add Document
      </button>
    </div>
  );
};

export default AddDoc;
