import React, { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

// Function to fetch user data
const fetchUser = async () => {
  const response = await axios.get("http://localhost:4001/auth/auth", { withCredentials: true });
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
    <div className="flex flex-col items-center m-4">
      <div className="avatar my-4">
        <div className="ring-primary ring-offset-base-100 w-50 rounded-full ring ring-offset-2">
          <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" alt="User Avatar" />
        </div>
      </div>
      <p className="text-2xl">{user.username}</p> {/* Display user's name */}
      
    </div>
  );
};

export default Profile;
