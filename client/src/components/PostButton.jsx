import React from "react";
import { useContext } from "react";
import userAvatar from "../assets/user.png";
import { AuthContext } from "../helpers/AuthContext";
import CreatePost from "../pages/CreatePost";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";

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

      <Dialog>
        <DialogTrigger asChild>
          <Button className="btn btn-primary  mx-4 rounded-full grow border text-left text-white flex justify-start items-center">
            What's on your mind?
          </Button>
        </DialogTrigger>
        <DialogContent className="w-auto">
          <DialogHeader>Create Post</DialogHeader>
          <CreatePost />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PostButton;
