import React from "react";
import CreateEvents from "../pages/CreateEvents";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const AddEvent = () => {
  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <Button className="btn btn-primary mb-4">
            Add Event
          </Button>
        </DialogTrigger>
        <DialogContent className="w-auto  ">
          <DialogHeader>Create Event</DialogHeader>
          <CreateEvents />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddEvent;
