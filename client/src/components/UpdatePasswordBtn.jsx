import React from "react";
import UpdatePassword from "../pages/UpdatePassword";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";

const UpdatePasswordBtn = () => {
  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <Button className="btn btn-primary">Update Password</Button>
        </DialogTrigger>
        <DialogContent className="w-auto">
          <DialogHeader>Create Post</DialogHeader>
          <UpdatePassword />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UpdatePasswordBtn;
