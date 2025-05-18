import React, { useState, useContext, useEffect, useRef } from "react";
import axios from "axios";
import moment from "moment";
import { useCalendarApp, ScheduleXCalendar } from "@schedule-x/react";
import { createEventModalPlugin } from "@schedule-x/event-modal";
import { createViewMonthGrid } from "@schedule-x/calendar";
import { createEventsServicePlugin } from "@schedule-x/events-service";
import "@schedule-x/theme-default/dist/index.css";

import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

const Public = () => {
  const [data, setData] = useState([]);
  const [addedEventIds, setAddedEventIds] = useState(new Set());
  const plugins = [createEventsServicePlugin(), createEventModalPlugin()];
  const [eventData, setEventData] = useState([]);
  const bottomRef = useRef(null);

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

  return (
    <div className="flex flex-col w-screen h-screen">
      <div>
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
                  <a href="#calendar">Events</a>
                </li>
                <li className="hover:text-primary">
                  <a href="#features">Features</a>
                </li>
                <li className="hover:text-primary">
                  <a href="">item 1</a>
                </li>
                <li className="hover:text-primary">
                  <a href="">item 1</a>
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
      </div>
      <div id="home">
        <div className="w-1/4">
          <div className="flex flex-col space-y-4 overflow-y-auto h-[calc(100%-64px)]">
            {data.map((event, index) => {
              const date = new Date(event.start);
              const day = date.getDate();
              const month = date
                .toLocaleString("default", { month: "short" })
                .toUpperCase();
              const startTime = new Date(event.start).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              });
              const endTime = new Date(event.end).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              });

              return (
                <motion.div
                  key={index}
                  className="flex card bg-base-100 border border-primary w-full mb-2 p-0"
                  initial={{ opacity: 0, y: 20 }} // Start offscreen with opacity 0
                  whileInView={{ opacity: 1, y: 0 }} // Animate to visible when in view
                  transition={{ duration: 0.5, delay: index * 0.1 }} // Stagger the animation with a delay
                  viewport={{ once: false, amount: 0.5 }} // Trigger animation when 50% of the element is in the viewport
                >
                  <div className="flex flex-row card-body text-primary gap-4 p-3">
                    <div className="flex flex-col p-2 bg-primary max-h-20 max-w-20 min-w-20 items-center justify-center rounded-box text-neutral-content">
                      <span className="font-mono text-4xl leading-none">
                        {day}
                      </span>
                      <span className="text-sm font-bold">{month}</span>
                    </div>
                    <div className="flex flex-col justify-center gap-1 truncate ">
                      <h2 className="card-title">
                        {event.title.toUpperCase()}
                      </h2>
                      <p className="text-md flex gap-2">
                        <div className="badge badge-secondary p-2 text-white">
                          Start:{" "}
                        </div>
                        {startTime}
                      </p>
                      <p className="text-md flex gap-4">
                        <div className="badge badge-secondary p-2 text-white">
                          End:{" "}
                        </div>
                        {endTime}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
            <div ref={bottomRef} />
          </div>
        </div>
      </div>
      <div id="calendar" className="mt-18">
        <h1 className="text-3xl font-bold text-center mb-4">Upcoming Events</h1>
        <div className="m-6 flex gap-4 justify-center">
          <div className="">
            <ScheduleXCalendar calendarApp={calendar} />
          </div>
        </div>
      </div>
      <div id="features">
        <section className="bg-white dark:bg-gray-900">
          <div className="container px-6 py-10 mx-auto">
            <h1 className="text-2xl font-semibold text-center text-gray-800 capitalize lg:text-3xl dark:text-white">
              explore our <br /> awesome{" "}
              <span className="text-primary">Features</span>
            </h1>

            <div className="grid grid-cols-1 gap-8 mt-8 xl:mt-12 xl:gap-16 md:grid-cols-2 xl:grid-cols-3">
              <div className="flex flex-col items-center p-6 space-y-3 text-center bg-gray-100 rounded-xl dark:bg-gray-800">
                <span className="inline-block p-3 text-blue-500 bg-blue-100 rounded-full dark:text-white dark:bg-blue-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                    />
                  </svg>
                </span>

                <h1 className="text-xl font-semibold text-gray-700 capitalize dark:text-white">
                  Copy & paste components
                </h1>

                <p className="text-gray-500 dark:text-gray-300">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Provident ab nulla quod dignissimos vel non corrupti doloribus
                  voluptatum eveniet
                </p>

                <a
                  href="#"
                  className="flex items-center -mx-1 text-sm text-blue-500 capitalize transition-colors duration-300 transform dark:text-blue-400 hover:underline hover:text-blue-600 dark:hover:text-blue-500"
                >
                  <span className="mx-1">read more</span>
                  <svg
                    className="w-4 h-4 mx-1 rtl:-scale-x-100"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                </a>
              </div>

              <div className="flex flex-col items-center p-6 space-y-3 text-center bg-gray-100 rounded-xl dark:bg-gray-800">
                <span className="inline-block p-3 text-blue-500 bg-blue-100 rounded-full dark:text-white dark:bg-blue-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                    />
                  </svg>
                </span>

                <h1 className="text-xl font-semibold text-gray-700 capitalize dark:text-white">
                  Zero Configuration
                </h1>

                <p className="text-gray-500 dark:text-gray-300">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Provident ab nulla quod dignissimos vel non corrupti doloribus
                  voluptatum eveniet
                </p>

                <a
                  href="#"
                  className="flex items-center -mx-1 text-sm text-blue-500 capitalize transition-colors duration-300 transform dark:text-blue-400 hover:underline hover:text-blue-600 dark:hover:text-blue-500"
                >
                  <span className="mx-1">read more</span>
                  <svg
                    className="w-4 h-4 mx-1 rtl:-scale-x-100"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                </a>
              </div>

              <div className="flex flex-col items-center p-6 space-y-3 text-center bg-gray-100 rounded-xl dark:bg-gray-800">
                <span className="inline-block p-3 text-blue-500 bg-blue-100 rounded-full dark:text-white dark:bg-blue-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                    />
                  </svg>
                </span>

                <h1 className="text-xl font-semibold text-gray-700 capitalize dark:text-white">
                  Simple & clean designs
                </h1>

                <p className="text-gray-500 dark:text-gray-300">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Provident ab nulla quod dignissimos vel non corrupti doloribus
                  voluptatum eveniet
                </p>

                <a
                  href="#"
                  className="flex items-center -mx-1 text-sm text-blue-500 capitalize transition-colors duration-300 transform dark:text-blue-400 hover:underline hover:text-blue-600 dark:hover:text-blue-500"
                >
                  <span className="mx-1">read more</span>
                  <svg
                    className="w-4 h-4 mx-1 rtl:-scale-x-100"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Public;
