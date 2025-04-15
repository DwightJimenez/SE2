import React from "react";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import defaultAvatar from "../assets/default-avatar.png";

const fetchUser = async () => {
  const response = await axios.get("http://localhost:4001/auth/profile", {
    withCredentials: true,
  });
  return response.data; // Return user data
};

const PostButton = () => {
  const {
    data: user,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["user"],
    queryFn: fetchUser,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

  useEffect(() => {
    if (isError) {
      console.error("Error fetching user data");
    }
  }, [isError]);

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error fetching user data</div>;
  return (
    <div className="flex mb-4 p-4 bg-white max-w-200 dark:bg-black rounded-2xl shadow-lg sticky  border border-gray-300">
      <div
        tabIndex={0}
        role="button"
        className="btn btn-ghost btn-circle avatar"
      >
        <div className="w-10 rounded-full">
          <img
            src={user?.profilePicture || defaultAvatar}
            alt="User Avatar"
            referrerPolicy="no-referrer"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = defaultAvatar;
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
