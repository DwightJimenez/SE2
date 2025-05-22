import React from "react";
import CreateUser from "../pages/CreateUser";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";

const AddUser = ({ onUserAdded }) => {
  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <Button className="btn btn-primary">Add User</Button>
        </DialogTrigger>
        <DialogContent className="w-auto dark:bg-black dark:text-white">
          <DialogHeader>Add User</DialogHeader>
          <CreateUser onUserAdded={onUserAdded} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddUser;
