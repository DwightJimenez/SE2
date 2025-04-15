import React, { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import UpdatePasswordBtn from "../components/UpdatePasswordBtn";
import defaultAvatar from "../assets/default-avatar.png"; // Import default avatar image



// Function to fetch user data
const fetchUser = async () => {
  const response = await axios.get("http://localhost:4001/auth/profile", {
    withCredentials: true,
  });
  return response.data; // Return user data
};


const Profile = () => {

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
    <div className="flex flex-col items-center m-4 gap-4">
      <div className="avatar my-4">
        <div className="ring-primary ring-offset-base-100 w-50 rounded-full ring ring-offset-2">
          <img
            src={user?.profilePicture|| defaultAvatar}
            alt="User Avatar"
            referrerPolicy="no-referrer"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = defaultAvatar;
            }}
          />
        </div>
      </div>
      <p className="text-2xl">{user.username}</p>
      <p className="text-2xl">{user.email}</p>
      <UpdatePasswordBtn />
    </div>
  );
};

export default Profile;
