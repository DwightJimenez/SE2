import React from "react";

const PostButton = () => {
  return (
    <div className="flex mb-4 p-4 bg-white max-w-200 dark:bg-black rounded-2xl shadow-lg sticky">
      <div
        tabIndex={0}
        role="button"
        className="btn btn-ghost btn-circle avatar"
      >
        <div className="w-10 rounded-full">
          <img
            alt="Tailwind CSS Navbar component"
            src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
          />
        </div>
      </div>
      <button
        className="btn btn-primary  mx-4 rounded-full grow border text-left text-white flex justify-start items-center"
        popoverTarget="popover-1"
        style={{ anchorName: "--anchor-1" } /* as React.CSSProperties */}
      >
        What's  on your mind?
      </button>
    </div>
  );
};

export default PostButton;
