import React from "react";
import buLogo from "../assets/bu-logo.png";
import { AuthContext } from "../helpers/AuthContext";
import { useContext } from "react";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
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
  const handleGoogleLogin = async (credentialResponse) => {
    try {
      const { credential } = credentialResponse;

      const response = await axios.post(
        "http://localhost:4001/google/google-login", // Replace with your backend API
        { token: credential },
        { withCredentials: true }
      );

      if (response.data.user) {
        setAuthState({
          username: response.data.user.username,
          id: response.data.user.id,
          status: true,
          role: response.data.user.role,
          email: response.data.user.email,
        });
        console.log("Google Login Successful");
        navigate("/");
      }
    } catch (error) {
      console.error("Google login failed:", error);
      alert("Google login failed!");
    }
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

        <GoogleLogin
          onSuccess={handleGoogleLogin}
          onError={() => console.log("Login Failed")}
        />
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
