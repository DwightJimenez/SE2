import React, { useEffect, useContext } from "react";
import UpdatePasswordBtn from "../components/UpdatePasswordBtn";
import userAvatar from "../assets/user.png";
import { AuthContext } from "../helpers/AuthContext";

const Profile = () => {
  const { authState } = useContext(AuthContext);

  return (
    <div className="flex flex-col items-center m-4 gap-4">
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
      <div className="divider divider-accent"></div>
      <fieldset className="fieldset">
        <legend className="fieldset-legend">Page title</legend>
        <input type="text" className="input" placeholder="My Fucking page" />
        <p className="label">You can edit page title later on from settings</p>
      </fieldset>
      <label className="label">Title</label>
      <p className="text-sm">{authState.username}</p>
      <label className="label">Title</label>
      <p className="text-sm">{authState.email}</p>
      <UpdatePasswordBtn />
    </div>
  );
};

export default Profile;
