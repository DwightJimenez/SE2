import React, { useState } from "react";
import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;

const UpdatePassword = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleUpdatePassword = async () => {
    if (!oldPassword || !newPassword) {
      alert("Please fill in both old and new passwords.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.put(
        `${API_URL}/auth/update-password`,
        { oldPassword, newPassword },
        { withCredentials: true }
      );

      if (response.status === 200) {
        alert("Password updated successfully!");
        setOldPassword("");
        setNewPassword("");
      } else {
        alert("Unexpected response from the server.");
      }
    } catch (error) {
      console.error("Update Password failed:", error);
      const message =
        error.response?.data?.message || "Failed to update password.";
      alert(message);
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col place-items-center gap-5 m-4">
      {/* Old Password */}
      <div className="relative w-80">
        <fieldset className="fieldset">
          <legend className="fieldset-legend">Old Password</legend>
          <input
            type={showOld ? "text" : "password"}
            className="input w-full pr-10 border"
            placeholder="Type here"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />
        </fieldset>
        <div
          className="absolute right-3 top-13.5 -translate-y-1/2 cursor-pointer text-gray-600"
          onClick={() => setShowOld((prev) => !prev)}
        >
          {showOld ? (
            // Eye Open
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
                d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
              />
            </svg>
          ) : (
            // Eye Off
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
                d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
              />
            </svg>
          )}
        </div>
      </div>

      {/* New Password */}
      <div className="relative w-80">
        <fieldset className="fieldset">
          <legend className="fieldset-legend">New Password</legend>
          <input
            type={showNew ? "text" : "password"}
            className="input w-full pr-10 border"
            placeholder="Type here"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </fieldset>
        <div
          className="absolute right-3 top-13.5 -translate-y-1/2 cursor-pointer text-gray-600"
          onClick={() => setShowNew((prev) => !prev)}
        >
          {showNew ? (
            // Eye Open
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
                d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
              />
            </svg>
          ) : (
            // Eye Off
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
                d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
              />
            </svg>
          )}
        </div>
      </div>

      <button
        className="btn"
        onClick={handleUpdatePassword}
        disabled={!oldPassword || !newPassword || loading}
      >
        {loading ? "Updating..." : "Update"}
      </button>
    </div>
  );
};

export default UpdatePassword;
