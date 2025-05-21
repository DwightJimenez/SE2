import React from "react";
import { Link, useLocation } from "react-router-dom";

const Dock = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path) => (currentPath === path ? "dock-active" : "");

  return (
    <div className="dock">
      <Link to="/" className={isActive("/")}>
        {/* Home Icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="size-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875
              c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504
              1.125-1.125V9.75M8.25 21h8.25"
          />
        </svg>
        <span className="dock-label">Home</span>
      </Link>

      <Link to="/events" className={isActive("/events")}>
        {/* Events Icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25
              2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0
              0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21
              11.25v7.5"
          />
        </svg>
        <span className="dock-label">Events</span>
      </Link>
      <Link to="/evaluation" className={isActive("/evaluation")}>
        {/* Evaluation Icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1
              2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897
              1.13L6 18l.8-2.685a4.5 4.5 0 0 1
              1.13-1.897l8.932-8.931Zm0 0L19.5
              7.125M18 14v4.75A2.25 2.25 0 0 1 15.75
              21H5.25A2.25 2.25 0 0 1 3
              18.75V8.25A2.25 2.25 0 0 1
              5.25 6H10"
          />
        </svg>
        <span className="dock-label">Evaluation</span>
      </Link>
      <Link to="/documents" className={isActive("/documents")}>
        {/* Documents Icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="size-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.5 14.25v-2.625a3.375 3.375 0 0
              0-3.375-3.375h-1.5A1.125 1.125 0 0 1
              13.5 7.125v-1.5a3.375 3.375 0 0
              0-3.375-3.375H8.25m2.25
              0H5.625c-.621 0-1.125.504-1.125
              1.125v17.25c0 .621.504 1.125 1.125
              1.125h12.75c.621 0 1.125-.504
              1.125-1.125V11.25a9 9 0 0 0-9-9Z"
          />
        </svg>
        <span className="dock-label">Documents</span>
      </Link>
    </div>
  );
};

export default Dock;
