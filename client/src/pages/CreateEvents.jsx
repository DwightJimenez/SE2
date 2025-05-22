import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import { useState } from "react";
import { toast } from "sonner";
const API_URL = import.meta.env.VITE_API_URL;

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
        withCredentials: true,
      });
      toast.success("Event created successfully!"); // Show success message
      navigate("/events"); // Redirect to the events page
    } catch (error) {
      console.error("Error creating event:", error);
      toast.error("Error creating event!"); // Show error message
    }
  };

  return (
    <div className="flex flex-col justify-evenly items-center h-full ">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ values, setFieldValue }) => (
          <Form className="flex flex-col w-100 justify-evenly">
            <div className="my-4">
              <Field
                name="title"
                placeholder="Title"
                as="textarea"
                className="textarea textarea-primary w-100 border"
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
                className="input input-primary w-100 border"
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
                className="input input-primary w-100 border"
              />
              <ErrorMessage
                name="end"
                component="div"
                role="alert"
                className="alert alert-error alert-soft"
              />
            </fieldset>

            <button className="btn btn-primary my-4" type="submit">
              Create Event
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default CreateEvents;
