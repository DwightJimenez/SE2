import React from "react";
import UpdatePassword from "../pages/UpdatePassword";

const UpdatePasswordBtn = () => {
  return (
    <div>
      {/* change popover-1 and --anchor-1 names. Use unique names for each dropdown */}
      {/* For TSX uncomment the commented types below */}
      <button
        className="btn mb-4"
        popoverTarget="popover-1"
        style={{ anchorName: "--anchor-1" } /* as React.CSSProperties */}
      >
        Update Password
      </button>

      <div
        className="dropdown menu w-100 h-80 rounded-box bg-base-100 shadow-sm"
        popover="auto"
        id="popover-1"
        style={{ positionAnchor: "--anchor-1" } /* as React.CSSProperties */}
      >
        <UpdatePassword />
      </div>
    </div>
  );
};

export default UpdatePasswordBtn;
