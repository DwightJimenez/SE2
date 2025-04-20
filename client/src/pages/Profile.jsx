import React, { useEffect, useContext } from "react";
import UpdatePasswordBtn from "../components/UpdatePasswordBtn";
import userAvatar from "../assets/user.png";
import { AuthContext } from "../helpers/AuthContext";

const Profile = () => {
  const { authState } = useContext(AuthContext);

  return (
    <div className="flex flex-col items-center m-4 gap-4">
      <div className="avatar my-4">
        <div className="ring-primary ring-offset-base-100 w-50 rounded-full ring ring-offset-2">
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
      <p className="text-2xl">{authState.username}</p>
      <p className="text-2xl">{authState.email}</p>
      <UpdatePasswordBtn />
    </div>
  );
};

export default Profile;
