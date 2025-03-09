import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import { useState } from "react";
// const API_URL = process.env.REACT_APP_API_URL;

function CreateEvents() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]); // State to store fetched events
  const initialValues = {
    title: "",
    start: null,
    end: null,
  };

  // Validation schema using Yup
  const validationSchema = Yup.object().shape({
    title: Yup.string().required("You must input a Title!"),
    start: Yup.date()
      .typeError("Please input a valid Start Date and Time")
      .required("You must input a Start Date and Time!"),
    end: Yup.date()
      .typeError("Please input a valid End Date and Time")
      .min(Yup.ref("start"), "End Date/Time must be after Start Date/Time")
      .required("You must input an End Date and Time!"),
  });

  // Function to handle form submission
  const onSubmit = async (data) => {
    const formattedData = {
      ...data,
      start: moment(data.start).format("YYYY-MM-DD HH:mm:ss"),
      end: moment(data.end).format("YYYY-MM-DD HH:mm:ss"),
    };
    try {
      // Send POST request to API to create the event
      await axios.post(`${API_URL}/events`, formattedData, {
        headers: {
          accessToken: sessionStorage.getItem("accessToken"),
        },
      });
      console.log("Event Created Successfully:", formattedData);
      navigate("/events"); // Redirect to the events page
    } catch (error) {
      console.error("Error creating event:", error);
    }
  };

  // Fetch events (currently commented out)
  // useEffect(() => {
  //   const fetchEvents = async () => {
  //     try {
  //       const response = await axios.get(`${API_URL}/events`);
  //       const formattedEvents = response.data.map((event) => ({
  //         ...event,
  //         start: moment.utc(event.start).local().format("YYYY-MM-DD hh:mm A"),
  //         end: moment.utc(event.end).local().format("YYYY-MM-DD hh:mm A"),
  //       }));
  //       setEvents(formattedEvents);
  //     } catch (error) {
  //       console.error("Error fetching events:", error);
  //     }
  //   };

  //   fetchEvents();
  // }, []);

  // Function to delete an event (currently commented out)
  // const deleteEvent = async (id) => {
  //   try {
  //     // Send DELETE request to API to remove the event
  //     await axios.delete(`${API_URL}/events/${id}`, {
  //       headers: {
  //         accessToken: sessionStorage.getItem("accessToken"),
  //       }
  //     });
  //     // Remove the deleted event from the state
  //     setEvents((prevEvents) => prevEvents.filter((event) => event.id !== id));
  //     console.log(`Event with ID ${id} deleted successfully.`);
  //   } catch (error) {
  //     console.error("Error deleting event:", error);
  //   }
  // };

  return (
    <div className="flex justify-center items-center flex-col">
      <p className="text text-xl font-bold">Create an Event</p>
      
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ values, setFieldValue }) => (
          <Form className="flex flex-col w-100">
            <div className="my-4">
              <Field
                name="title"
                placeholder="Title"
                as="textarea"
                className="textarea textarea-primary w-100"
              />
              <ErrorMessage
                name="title"
                component="div"
                role="alert"
                className="alert alert-error alert-soft"
              />
            </div>
            <fieldset className="fieldset">
              <legend className="fieldset-legend">Start Date/Time</legend>

              <DatePicker
                selected={values.start}
                onChange={(date) => setFieldValue("start", date)}
                showTimeSelect
                dateFormat="Pp" // e.g., 11/22/2024 2:30 PM
                placeholderText="Select Start Date and Time"
                className="input input-primary w-100"
              />
              <ErrorMessage
                name="start"
                component="div"
                role="alert"
                className="alert alert-error alert-soft"
              />
            </fieldset>

            <fieldset className="fieldset">
              <legend className="fieldset-legend">End Date/Time</legend>

              <DatePicker
                selected={values.end}
                onChange={(date) => setFieldValue("end", date)}
                showTimeSelect
                dateFormat="Pp"
                placeholderText="Select End Date and Time"
                className="input input-primary w-100"
              />
              <ErrorMessage
                name="end"
                component="div"
                role="alert"
                className="alert alert-error alert-soft"
              />
            </fieldset>

            <button className="btn btn-primary my-4" type="submit">Create Event</button>
          </Form>
        )}
      </Formik>

      {/* Commented out the event deletion section */}
      {/* <h1>Delete Event</h1>
      <ul>
        {events.length > 0 ? (
          events.map((event) => (
            <li key={event.id}>
              <strong>{event.title}</strong> - {event.start} to {event.end}
              <button onClick={() => deleteEvent(event.id)}>Delete</button>
            </li>
          ))
        ) : (
          <p>No events available to delete.</p>
        )}
      </ul> */}
    </div>
  );
}

export default CreateEvents;
