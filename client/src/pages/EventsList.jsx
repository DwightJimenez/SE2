import React from "react";
import axios from "axios";
import moment from "moment";
import AddEvent from "../components/AddEvent";
import PageLoc from "../components/PageLoc";
import { useQuery, useMutation } from "@tanstack/react-query";

const fetchEvents = async () => {
  const response = await axios.get(`http://localhost:4001/events`);
  return response.data.map((event) => ({
    id: event.id,
    title: event.title,
    start: moment.utc(event.start).local().format("YYYY-MM-DD hh:mm A"),
    end: moment.utc(event.end).local().format("YYYY-MM-DD hh:mm A"),
  }));
};

const EventsList = () => {
  const {
    data: events,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["events"],
    queryFn: fetchEvents,
    staleTime: 1000,
  });
  const deleteEvent = async (id) => {
    try {
      // Send DELETE request to API to remove the event
      await axios.delete(`http://localhost:4001/events/${id}`, {withCredentials: true});
      console.log("Event Deleted Successfully:", id);
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };
  const mutation = useMutation({
    mutationFn: deleteEvent,
    onSuccess: () => {
      // After successful deletion, refresh the events list
      queryClient.invalidateQueries(["events"]);
    },
  });

  if (isLoading) return <p>Loading events...</p>;
  if (isError) return <p>Error loading events.</p>;

  return (
    <div>
      <PageLoc currentPage="Events List" />
      <AddEvent />
      <ul></ul>
      <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
        <table className="table">
          {/* head */}
          <thead>
            <tr>
              <th>Title</th>
              <th>Start Date/Time</th>
              <th>End Date/Time</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {events?.map((event) => (
              <tr key={event.id}>
                <td>{event.title}</td>
                <td>{event.start}</td>
                <td>{event.end}</td>
                <td>
                  <button
                    onClick={() => mutation.mutate(event.id)}
                    className="!bg-red-500 p-2 !rounded hover:!bg-red-700"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EventsList;
