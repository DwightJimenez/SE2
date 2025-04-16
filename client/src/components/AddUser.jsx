import React from "react";
import CreateUser from "../pages/CreateUser";
import Modal from "./Modal";

const AddUser = ({onUserAdded}) => {
  return (
    <div>
      {/* change popover-1 and --anchor-1 names. Use unique names for each dropdown */}
      {/* For TSX uncomment the commented types below */}
      <button
        className="btn mb-4"
        popoverTarget="popover-1"
        style={{ anchorName: "--anchor-1" } /* as React.CSSProperties */}
      >
        Add
      </button>

      <div
        className="dropdown menu w-110 h-100 rounded-box bg-base-100 shadow-sm"
        popover="auto"
        id="popover-1"
        style={{ positionAnchor: "--anchor-1" } /* as React.CSSProperties */}
      >
        <CreateUser onUserAdded={onUserAdded}/>
      </div>
    </div>
  );
};

export default AddUser;
