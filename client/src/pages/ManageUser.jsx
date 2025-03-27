import React from "react";
import axios from "axios";
import PageLoc from "../components/PageLoc";
import AddUser from "../components/AddUser";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const API_URL = "http://localhost:4001";

const fetchUsers = async () => {
  const response = await axios.get(`${API_URL}/auth/users`);
  return response.data;
};

function ManageUser() {
  const queryClient = useQueryClient();
  const authState = JSON.parse(sessionStorage.getItem("authState"));
  const userRole = authState?.role;

  const {
    data: users,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
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

  const handleToggleRole = (userId, currentRole) => {
    const newRole = currentRole === "user" ? "moderator" : "user";
    toggleRoleMutation.mutate({ userId, newRole });
  };
  const handleUserAdded = () => {
    queryClient.invalidateQueries(["users"]);
  };
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

  const handleDeleteUser = (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      deleteUserMutation.mutate(userId);
    }
  };

  if (isLoading) return <p>Loading users...</p>;
  if (isError) return <p>Error loading users.</p>;

  if (userRole !== "moderator") {
    return <div>Access denied. You must be an admin to view this page.</div>;
  }

  return (
    <div>
      <PageLoc currentPage="Manage User" />
      <AddUser onUserAdded={handleUserAdded} />
      <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
        <table className="table">
          <thead>
            <tr>
              <th>Username</th>
              <th>Role</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {users?.map((user) => (
              <tr key={user.id}>
                <td>{user.username}</td>
                <td>{user.role}</td>
                <td>
                  {user.id !== 1 && (
                    <div className="flex w-full justify-evenly">
                      <input
                        type="checkbox"
                        defaultChecked={user.role === "moderator"}
                        onChange={() => handleToggleRole(user.id, user.role)}
                        className="toggle border-indigo-600 bg-indigo-500 checked:bg-orange-400 checked:text-orange-800 checked:border-orange-500"
                      />
                      <div
                        onClick={() => handleDeleteUser(user.id)}
                        className="flex justify-evenly"
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
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ManageUser;
