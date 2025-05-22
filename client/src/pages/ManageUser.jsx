import React, { useState } from "react";
import axios from "axios";
import PageLoc from "../components/PageLoc";
import AddUser from "../components/AddUser";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AuthContext } from "../helpers/AuthContext";
import { useContext } from "react";
import { Switch } from "@/components/ui/switch";
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

const API_URL = import.meta.env.VITE_API_URL;

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
    deleteUserMutation.mutate(userId);
  };

  return (
    <div className="p-4 ">
      <PageLoc currentPage="Manage User" />

      <div className="flex gap-4 ">
        {userRole === "admin" && <AddUser onUserAdded={handleUserAdded} />}

        <select
          value={selectedRole}
          onChange={handleRoleChange}
          className="select select-bordered w-50 max-w-xs border "
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
          className="w- p-2 mb-4 border rounded-md  "
        />
      </div>

      {isLoading ? (
        <div className="w-200">
          <p className="flex justify-center">Loading users ...</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-box  border border-gray-300 bg-white shodow-2xl">
          <table className="table   ">
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
                          <div className="flex justify-center items-center h-full w-full cursor-pointer hover:text-red-500">
                            <AlertDialog>
                              <AlertDialogTrigger>
                                <span className="flex justify-evenly gap-4">
                                  <Button className="bg-red-500 hover:bg-red-700">
                                    Delete
                                  </Button>
                                </span>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    Are you sure you want to delete?
                                  </AlertDialogTitle>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDeleteUser(user.id)}
                                    className="bg-red-500 hover:bg-red-700"
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
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
