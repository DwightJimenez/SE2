import React from "react";
import { useContext } from "react";
import userAvatar from "../assets/user.png";
import { AuthContext } from "../helpers/AuthContext";


const PostButton = () => {
  const { authState } = useContext(AuthContext);
  return (
    <div className="flex mb-4 p-4 bg-white max-w-200 dark:bg-black rounded-2xl shadow-lg sticky  border border-gray-300">
      <div
        tabIndex={0}
        role="button"
        className="btn btn-ghost btn-circle avatar"
      >
        <div className="w-10 rounded-full">
          <img
            src={authState.profilePicture || userAvatar}
            alt="User Avatar"
            referrerPolicy="no-referrer"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = userAvatar;
            }}
          />
        </div>
      </div>
      <button
        className="btn btn-primary  mx-4 rounded-full grow border text-left text-white flex justify-start items-center"
        popoverTarget="popover-1"
        style={{ anchorName: "--anchor-1" } /* as React.CSSProperties */}
      >
        What's on your mind?
      </button>
      
    </div>
  );
};

export default PostButton;
