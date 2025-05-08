import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../helpers/AuthContext";
import userAvatar from "../assets/user.png";
import Profile from "../pages/Profile";
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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const NavBar = ({ logout }) => {
  const { authState } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
  };

  return (
    <div>
      <div className="flex flex-col w-screen fixed z-50">
        <div className="navbar bg-base-100 shadow-sm dark:bg-black">
          <div className="flex-1">
            <a className="btn btn-ghost text-xl">Software Engineering</a>
          </div>
          <div className="flex gap-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Search"
                className="input input-bordered w-24 md:w-auto"
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6 absolute top-2.5 right-2 w-5 h-5 text-gray-500 cursor-pointer"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                />
              </svg>
            </div>

            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle avatar mx-4"
              >
                <div className="w-10 rounded-full ring-primary ring-offset-base-100 ring ring-offset-2">
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
              <ul
                tabIndex={0}
                className="menu menu-lg dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow border"
              >
                <li>
                  <Sheet>
                    <SheetTrigger>
                      <a className="justify-between">Profile</a>
                    </SheetTrigger>
                    <SheetContent>
                      <SheetHeader>
                        <SheetTitle>Profile</SheetTitle>
                        <Profile />
                      </SheetHeader>
                    </SheetContent>
                  </Sheet>
                </li>

                <li>
                  <AlertDialog>
                    <AlertDialogTrigger>
                      <span className="flex justify-evenly gap-4">
                        <a>Logout</a>
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
                        <AlertDialogAction onClick={handleLogout}>
                          Logout
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
