import React, { useState, useContext, useEffect, useRef } from "react";
import axios from "axios";
import moment from "moment";
import { useCalendarApp, ScheduleXCalendar } from "@schedule-x/react";
import { createEventModalPlugin } from "@schedule-x/event-modal";
import { createViewMonthGrid } from "@schedule-x/calendar";
import { createEventsServicePlugin } from "@schedule-x/events-service";
import "@schedule-x/theme-default/dist/index.css";
import PublicPost from "./PublicPost";

import PublicNav from "../components/PublicNav";

const API_URL = import.meta.env.VITE_API_URL;

const Public = () => {
  const [data, setData] = useState([]);
  const [addedEventIds, setAddedEventIds] = useState(new Set());
  const plugins = [createEventsServicePlugin(), createEventModalPlugin()];
  const [eventData, setEventData] = useState([]);
  const bottomRef = useRef(null);
  const [page, setPage] = useState(1);

  const calendar = useCalendarApp(
    {
      views: [createViewMonthGrid()],
      events: [],
    },
    plugins
  );

  // Fetch events from API
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(`${API_URL}/events`);
        console.log(response.data);
        const formattedEvents = response.data.map((event) => ({
          id: event.id,
          title: event.title,
          start: moment.utc(event.start).local().format("YYYY-MM-DD HH:mm"),
          end: moment.utc(event.end).local().format("YYYY-MM-DD HH:mm"),
        }));
        setData(formattedEvents);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, []);

  // Add events to the calendar
  useEffect(() => {
    data.forEach((event) => {
      if (!addedEventIds.has(event.id)) {
        calendar.eventsService.add(event);
        setAddedEventIds((prev) => new Set(prev).add(event.id));
      }
    });
  }, [data, calendar, addedEventIds]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(`${API_URL}/events`);
        const now = moment(); // current local time
        const formattedEvents = response.data
          .filter((event) =>
            moment.utc(event.start).local().isSameOrAfter(now, "day")
          ) // keep today and future
          .map((event) => ({
            id: event.id,
            title: event.title,
            start: moment.utc(event.start).local().format("YYYY-MM-DD HH:mm"),
            end: moment.utc(event.end).local().format("YYYY-MM-DD HH:mm"),
          }));
        setEventData(formattedEvents);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY); // Capture scroll position
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [eventData]);

  const pageChange = async (input) => {
   setPage(input);
  }

  return (
    <div className="flex flex-col w-screen h-screen">
      <PublicNav page={pageChange}/>
      {page === 1 && (
        <div id="home">
          <PublicPost />
        </div>
      )}

      {page === 2 && (
        <div id="calendar">
          <h1 className="text-3xl font-bold text-center mb-4">
            Upcoming Events
          </h1>
          <div className="m-6 flex gap-4 justify-center">
            <div className="">
              <ScheduleXCalendar calendarApp={calendar} />
            </div>
          </div>
        </div>
      )}
      
    </div>
  );
};

export default Public;
