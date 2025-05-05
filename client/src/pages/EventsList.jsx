import React, { useEffect } from "react";
import axios from "axios";
import moment from "moment";
import AddEvent from "../components/AddEvent";
import PageLoc from "../components/PageLoc";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AuthContext } from "../helpers/AuthContext";
import { useContext } from "react";
const API_URL = import.meta.env.VITE_API_URL;

const fetchEvents = async () => {
  const response = await axios.get(`${API_URL}/events`);
  return response.data.map((event) => ({
    id: event.id,
    title: event.title,
    start: moment.utc(event.start).local().format("YYYY-MM-DD hh:mm A"),
    end: moment.utc(event.end).local().format("YYYY-MM-DD hh:mm A"),
  }));
};

const EventsList = () => {
  const queryClient = useQueryClient();
  const { setEventState } = useContext(AuthContext);

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
      await axios.delete(`${API_URL}/events/${id}`, {
        withCredentials: true,
      });
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
  useEffect(() => {
    setEventState((prevState) => ({
      ...prevState,
      events: events,
    }));
    console.log(events);
  }, [events]);

  if (isLoading) return <p>Loading events...</p>;
  if (isError) return <p>Error loading events.</p>;

  return (
    <div className="p-4 dark:bg-gray-800">
      <PageLoc currentPage="Events List" />
      <AddEvent />
      <div className="overflow-x-auto rounded-box border  bg-white  border-gray-300 shadow-2xl">
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
                <td>{event.title.toUpperCase()}</td>
                <td>{event.start}</td>
                <td>{event.end}</td>
                <td>
                  <button
                    onClick={() => {
                      if (
                        window.confirm(
                          "Are you sure you want to delete this event?"
                        )
                      ) {
                        mutation.mutate(event.id);
                      }
                    }}
                    className="!bg-red-500 p-2 !rounded hover:!bg-red-700"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="w-5 h-5"
                      color="white"
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
