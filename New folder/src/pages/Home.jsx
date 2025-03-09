import React from "react";
import CreatePost from "./CreatePost";
import PostButton from "../components/PostButton";

const Home = () => {
  return (
    <div className="flex flex-col">
      <div className="">
        {/* change popover-1 and --anchor-1 names. Use unique names for each dropdown */}
        {/* For TSX uncomment the commented types below */}
        <PostButton />

        <div
          className="dropdown menu w-160 h-100 rounded-box bg-base-100 shadow-sm "
          popover="auto"
          id="popover-1"
          style={{ positionAnchor: "--anchor-1" } /* as React.CSSProperties */}
        >
          <CreatePost />
        </div>
      </div>
      <div className="card lg:card-side bg-base-100 shadow-sm max-w-200">
        <figure>
          <img
            src="https://img.daisyui.com/images/stock/photo-1494232410401-ad00d5433cfa.webp"
            alt="Album"
          />
        </figure>
        <div className="card-body">
          <h2 className="card-title">Title</h2>
          <p>Click the button to listen on Spotiwhy app.</p>
          <div className="card-actions justify-end">
            <input
              type="text"
              placeholder="Comment"
              className="input input-primary"
            />
            <button className="btn btn-primary">Send</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
