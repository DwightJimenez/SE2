import React, { useState } from "react";
import axios from "axios";
import PageLoc from "../components/PageLoc";
import AddUser from "../components/AddUser";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AuthContext } from "../helpers/AuthContext";
import { useContext } from "react";
import { Switch } from "@/components/ui/switch";

const API_URL = "http://localhost:4001";

const fetchUsers = async (query = "", role = "") => {
  console.log("Fetching users with:", { query, role });
  const response = await axios.get(
    `${API_URL}/auth/users?q=${query}&role=${role}`,
    {
      withCredentials: true,
    }
  );
  return response.data;
};

function ManageUser() {
  const queryClient = useQueryClient();
  const { authState } = useContext(AuthContext);
  const userRole = authState?.role;
  const [selectedRole, setSelectedRole] = useState("");

  const [searchQuery, setSearchQuery] = useState(""); // Holds search input

  const {
    data: users,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["users", searchQuery, selectedRole], // Dependency on search query
    queryFn: () => fetchUsers(searchQuery, selectedRole),
    staleTime: 1000,
  });
  const toggleRoleMutation = useMutation({
    mutationFn: async ({ userId, newRole }) => {
      await axios.put(
        `${API_URL}/auth/users/${userId}`,
        { role: newRole },
        { withCredentials: true }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]);
    },
  });
  const deleteUserMutation = useMutation({
    mutationFn: async (userId) => {
      await axios.delete(`${API_URL}/auth/users/${userId}`, {
        withCredentials: true,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]);
    },
  });

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleToggleRole = (userId, currentRole) => {
    const newRole = currentRole === "user" ? "moderator" : "user";
    toggleRoleMutation.mutate({ userId, newRole });
  };

  const handleRoleChange = (e) => {
    setSelectedRole(e.target.value);
  };

  const handleUserAdded = () => {
    queryClient.invalidateQueries(["users"]);
  };

  const handleDeleteUser = (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      deleteUserMutation.mutate(userId);
    }
  };

  return (
    <div className="p-4 dark:bg-gray-800">
      <PageLoc currentPage="Manage User" />

      <div className="flex gap-4 ">
        <AddUser onUserAdded={handleUserAdded} />
        <select
          value={selectedRole}
          onChange={handleRoleChange}
          className="select select-bordered w-50 max-w-xs border"
        >
          <option value="">All</option>
          <option value="moderator">Moderators</option>
          <option value="user">Users</option>
        </select>

        {/* Search Input */}
        <input
          type="text"
          placeholder="Search users..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="w- p-2 mb-4 border rounded-md dark:bg-gray-700 dark:text-white"
        />
      </div>

      {isLoading ? (
        <div className="w-200">
          <p className="flex justify-center">Loading users ...</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-box  border border-gray-300 bg-white shodow-2xl">
          <table className="table">
            <thead>
              <tr>
                <th>Username</th>
                <th>Role</th>
                {userRole === "admin" && <th>Action</th>}
              </tr>
            </thead>
            <tbody>
              {users && users.length > 0 ? (
                users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.username}</td>
                    <td>{user.role}</td>
                    <td>
                      {user.id !== 1 && userRole === "admin" && (
                        <div className="flex w-full gap-10">
                          <Switch
                            checked={user.role === "moderator"}
                            onCheckedChange={() =>
                              handleToggleRole(user.id, user.role)
                            }
                             className="cursor-pointer data-[state=checked]:bg-orange-400 data-[state=checked]:border-orange-500"
                          />
                          <div
                            onClick={() => handleDeleteUser(user.id)}
                            className="flex justify-evenly cursor-pointer hover:text-red-500"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth="1.5"
                              stroke="currentColor"
                              className="size-6"
                              color="red"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                              />
                            </svg>
                          </div>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="text-center p-4 text-gray-500">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ManageUser;
