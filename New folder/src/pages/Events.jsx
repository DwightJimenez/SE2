import React, { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";
import { useCalendarApp, ScheduleXCalendar } from "@schedule-x/react";
import { createEventModalPlugin } from "@schedule-x/event-modal";
import {
  createViewDay,
  createViewMonthAgenda,
  createViewMonthGrid,
  createViewWeek,
} from "@schedule-x/calendar";
import { createEventsServicePlugin } from "@schedule-x/events-service";
import "@schedule-x/theme-default/dist/index.css";
import { createResizePlugin } from "@schedule-x/resize";
import PageLoc from "../components/PageLoc";
import AddEvent from "../components/AddEvent";
// const API_URL = process.env.REACT_APP_API_URL;

function CalendarApp() {
  const [data, setData] = useState([]);
  const [addedEventIds, setAddedEventIds] = useState(new Set());
  const plugins = [
    createEventsServicePlugin(),
    createEventModalPlugin(),
    createResizePlugin(60),
  ];

  const calendar = useCalendarApp(
    {
      views: [
        createViewDay(),
        createViewWeek(),
        createViewMonthGrid(),
        createViewMonthAgenda(),
      ],
      events: [],
    },
    plugins
  );

  // Fetch events from API
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(`${API_URL}/events`);
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

  return (
    <div className="flex flex-col">
      <PageLoc currentPage="Events"/>
      <AddEvent />
      <ScheduleXCalendar calendarApp={calendar} />
    </div>
  );
}

export default CalendarApp;
