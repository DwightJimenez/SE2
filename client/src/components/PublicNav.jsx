import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const PublicNav = ({ page }) => {
  return (
    <div className="flex flex-col w-screen fixed z-50">
      <div className="navbar bg-base-100 shadow-sm dark:bg-black">
        <div className="flex-1">
          <a className="btn btn-ghost text-xl">
            ACSciS Workflow Automation System
          </a>
        </div>
        <div className="flex-1">
          <ul className="menu menu-horizontal p-0 gap-4 cursor-pointer">
            <li className="hover:text-primary">
              <a href="#home" onClick={() => page(1)}>
                Home
              </a>
            </li>
            <li className="hover:text-primary">
              <a href="#calendar" onClick={() => page(2)}>
                Calendar
              </a>
            </li>
            </ul>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Link to="/login">
              <Button>Log in</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicNav;
