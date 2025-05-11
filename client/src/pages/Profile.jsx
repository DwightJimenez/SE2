import React, { useEffect, useContext } from "react";
import UpdatePasswordBtn from "../components/UpdatePasswordBtn";
import userAvatar from "../assets/user.png";
import { AuthContext } from "../helpers/AuthContext";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const Profile = ({ logout }) => {
  const { authState } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="flex flex-col items-center  m-4 gap-4">
      <div className="avatar my-4">
        <div className="ring-primary ring-offset-base-100 w-30 rounded-full ring ring-offset-2">
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
      <div className="divider"></div>
      <div>
        <fieldset className="fieldset">
          <legend className="fieldset-legend">Name</legend>
          <p className="text-sm">{authState.username}</p>
        </fieldset>
        <fieldset className="fieldset">
          <legend className="fieldset-legend">Email</legend>
          <p className="text-sm">{authState.email}</p>
        </fieldset>
      </div>

      <UpdatePasswordBtn />
      <div className="divider"></div>
      <AlertDialog>
        <AlertDialogTrigger>
          <span className="flex justify-evenly gap-4">
            <Button className="bg-red-500 hover:bg-red-700">Logout</Button>
          </span>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to logout?
            </AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleLogout}>Logout</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Profile;
