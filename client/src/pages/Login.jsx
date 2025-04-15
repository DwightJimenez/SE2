import React from "react";
import buLogo from "../assets/bu-logo.png";
import { AuthContext } from "../helpers/AuthContext";
import { useContext } from "react";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
// const API_URL = process.env.REACT_APP_API_URL;

const Login = () => {
  const { setAuthState } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    const data = { username: email, password: password };
    axios
      .post(`http://localhost:4001/auth/login`, data, { withCredentials: true })
      .then((response) => {
        if (response.data.error) {
          alert(response.data.error);
        } else {

          setAuthState({
            username: response.data.username,
            id: response.data.id,
            status: true,
            role: response.data.role,
            email: response.data.email,
          });
          console.log("Login Successfully");
          navigate("/");
        }
      })
      .catch((error) => {
        console.error("Login failed:", error);
        alert("Login failed!");
      });
  };

  return (
    <div className="flex w-full max-w-sm mx-auto overflow-hidden bg-white rounded-lg shadow-lg dark:bg-gray-800 lg:max-w-4xl">
      <div className="w-full px-6 py-8 md:px-8 lg:w-1/2">
        <p className="mt-6 text-xl text-center text-gray-600 dark:text-gray-200">
          Welcome back!
        </p>

        <div className="mt-6">
          <label
            className="block mb-2 text-sm font-medium text-gray-600 dark:text-gray-200"
            for="LoggingEmailAddress"
          >
            Email Address
          </label>
          <input
            id="LoggingEmailAddress"
            className="block w-full px-4 py-2 text-gray-700 bg-white border rounded-lg dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring focus:ring-blue-300"
            type="email"
            onChange={(event) => {
              setEmail(event.target.value);
            }}
          />
        </div>

        <div className="mt-4">
          <div className="flex justify-between">
            <label
              className="block mb-2 text-sm font-medium text-gray-600 dark:text-gray-200"
              for="loggingPassword"
            >
              Password
            </label>
            <a
              href="#"
              className="text-xs text-gray-500 dark:text-gray-300 hover:underline"
            >
              Forget Password?
            </a>
          </div>

          <input
            id="loggingPassword"
            className="block w-full px-4 py-2 text-gray-700 bg-white border rounded-lg dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring focus:ring-blue-300"
            type="password"
            onChange={(event) => {
              setPassword(event.target.value);
            }}
          />
        </div>

        <div className="mt-6">
          <button
            className="w-full px-6 py-3 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-primary rounded-lg hover:bg-gray-700 focus:outline-none focus:ring focus:ring-gray-300 focus:ring-opacity-50"
            onClick={handleLogin}
          >
            Sign In
          </button>
        </div>

        <div className="flex w-full flex-col">
          <div className="divider divider-accent">or</div>
        </div>
        <a
          href="#"
          className="flex items-center justify-center mt-2 mb-6 text-gray-600 transition-colors duration-300 transform border rounded-lg dark:border-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600"
        >
          <div className="px-4 py-2">
            <svg className="w-6 h-6" viewBox="0 0 40 40">
              <path
                d="M36.3425 16.7358H35V16.6667H20V23.3333H29.4192C28.045 27.2142 24.3525 30 20 30C14.4775 30 10 25.5225 10 20C10 14.4775 14.4775 9.99999 20 9.99999C22.5492 9.99999 24.8683 10.9617 26.6342 12.5325L31.3483 7.81833C28.3717 5.04416 24.39 3.33333 20 3.33333C10.7958 3.33333 3.33335 10.7958 3.33335 20C3.33335 29.2042 10.7958 36.6667 20 36.6667C29.2042 36.6667 36.6667 29.2042 36.6667 20C36.6667 18.8825 36.5517 17.7917 36.3425 16.7358Z"
                fill="#FFC107"
              />
              <path
                d="M5.25497 12.2425L10.7308 16.2583C12.2125 12.59 15.8008 9.99999 20 9.99999C22.5491 9.99999 24.8683 10.9617 26.6341 12.5325L31.3483 7.81833C28.3716 5.04416 24.39 3.33333 20 3.33333C13.5983 3.33333 8.04663 6.94749 5.25497 12.2425Z"
                fill="#FF3D00"
              />
              <path
                d="M20 36.6667C24.305 36.6667 28.2167 35.0192 31.1742 32.34L26.0159 27.975C24.3425 29.2425 22.2625 30 20 30C15.665 30 11.9842 27.2359 10.5975 23.3784L5.16254 27.5659C7.92087 32.9634 13.5225 36.6667 20 36.6667Z"
                fill="#4CAF50"
              />
              <path
                d="M36.3425 16.7358H35V16.6667H20V23.3333H29.4192C28.7592 25.1975 27.56 26.805 26.0133 27.9758C26.0142 27.975 26.015 27.975 26.0158 27.9742L31.1742 32.3392C30.8092 32.6708 36.6667 28.3333 36.6667 20C36.6667 18.8825 36.5517 17.7917 36.3425 16.7358Z"
                fill="#1976D2"
              />
            </svg>
          </div>

          <span className="w-5/6 px-4 py-3 font-bold text-center">
            Sign in with Google
          </span>
        </a>
      </div>
      <div
        className="w-full  lg:block lg:w-1/2 hidden"
        style={{
          background:
            "linear-gradient(150deg, rgb(51.81, 15.18, 119.84) 0%, rgb(103, 29.24, 150.8) 59.73%, rgb(255, 71, 242.73) 100%)",
        }}
      >
        <div className="flex flex-col justify-center items-center h-full">
          <img src={buLogo} alt="" className="h-auto w-60 my-8" />
          <div className="text-center ">
            <p className="font-normal tracking-wide text-green-50 ">
              WORKFLOW AUTOMATION
              <br />
              SYSTEM for ACScis ORGANIZATION
              <br />
              IN BICOL UNIVERSITY POLANGUI
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
