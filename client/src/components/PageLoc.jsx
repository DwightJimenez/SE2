import React from "react";
import { Link } from "react-router-dom"; // optional depending on how you're routing

const PageLoc = ({ currentPage, showBack = false, backLink = "/" }) => {
  const BackContent = (
    <div className="flex items-center gap-1 text-sm hover:underline ">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="size-5"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M7.49 12 3.74 8.248m0 0 3.75-3.75m-3.75 3.75h16.5V19.5"
        />
      </svg>
      <span>Back</span>
    </div>
  );

  return (
    <div className="flex justify-between items-center border border-gray-300 sticky top-14 z-40 mb-4 p-4 bg-white w-full dark:bg-black rounded-lg shadow-2xl">
      <span className="text-2xl">{currentPage}</span>
      {showBack && (
        typeof backLink === "string" ? (
          <Link to={backLink}>
            {BackContent}
          </Link>
        ) : (
          backLink
        )
      )}
    </div>
  );
};

export default PageLoc;
