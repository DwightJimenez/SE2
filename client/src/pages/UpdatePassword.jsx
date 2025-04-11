import React, { useState } from "react";
import axios from "axios";

const UpdatePassword = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleUpdatePassword = async () => {
    if (!oldPassword || !newPassword) {
      alert("Please fill in both old and new passwords.");
      return;
    }

    const data = {
      oldPassword,
      newPassword,
    };

    try {
      const response = await axios.put(
        "http://localhost:4001/auth/update-password",
        data,
        { withCredentials: true }
      );

      if (response.status === 200) {
        alert("Password updated successfully!");
      } else {
        alert("Unexpected response from the server.");
      }
    } catch (error) {
      console.error("Update Password failed:", error);
      const message =
        error.response?.data?.message || "Failed to update password.";
      alert(message);
    }
  };

  return (
    <div className="flex flex-col place-items-center gap-5 m-4">
      <fieldset className="fieldset">
        <legend className="fieldset-legend">Old Password</legend>
        <input
          type="password"
          className="input"
          placeholder="Type here"
          onChange={(event) => {
            setOldPassword(event.target.value);
          }}
        />
      </fieldset>
      <fieldset className="fieldset">
        <legend className="fieldset-legend">New Password</legend>
        <input
          type="password"
          className="input"
          placeholder="Type here"
          onChange={(event) => {
            setNewPassword(event.target.value);
          }}
        />
      </fieldset>
      <div className="btn" onClick={handleUpdatePassword}>
        Update
      </div>
    </div>
  );
};

export default UpdatePassword;
