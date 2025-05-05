import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../helpers/AuthContext";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { motion } from "framer-motion";
const API_URL = import.meta.env.VITE_API_URL;

const FirstVisitPopup = () => {
  const [step, setStep] = useState(0); // 0 = intro, 1 = google sign in, 2 = set password
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const navigate = useNavigate();
  const { setAuthState } = useContext(AuthContext);

  const handleGoogleSignIn = async (credentialResponse) => {
    try {
      const { credential } = credentialResponse;
      const response = await axios.post(
        `${API_URL}/google/link-google`,
        {
          token: credential,
        },
        {
          withCredentials: true,
        }
      );

      if (response.data && response.data.user) {
        setStep(2);
      }
    } catch (err) {
      console.error(err);
      alert("Google linking failed.");
    }
  };

  const handleSetPassword = async () => {
    if (!newPass || newPass.length < 6)
      return alert("Password must be at least 6 characters.");
    if (newPass !== confirmPass) return alert("Passwords do not match.");

    try {
      const res = await axios.post(
        `${API_URL}/auth/set-password`,
        {
          password: newPass,
        },
        {
          withCredentials: true,
        }
      );

      alert("Password updated!");
      setAuthState((prev) => ({ ...prev, email: res.data.email }));
      navigate("/");
    } catch (err) {
      console.error(err);
      alert("Failed to update password.");
    }
  };

  return (
    <div
      className="flex w-screen items-center justify-center bg-base-200"
      style={{
        background:
          "linear-gradient(150deg, rgb(51.81, 15.18, 119.84) 0%, rgb(103, 29.24, 150.8) 59.73%, rgb(255, 71, 242.73) 100%)",
      }}
    >
      {step === 0 && (
        <div className="hero min-h-screen">
          <div className="hero-overlay bg-opacity-60"></div>
          <div className="hero-content text-center text-neutral-content">
            <motion.div
              className=""
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <h1 className="mb-5 text-5xl font-bold">
                🎉 Welcome to WORKFLOW AUTOMATION SYSTEM for ACScis ORGANIZATION
                IN BICOL UNIVERSITY POLANGUI!
              </h1>
              <p className="mb-3">👋 First time here? Let’s get you set up.</p>
              <p className="mb-5">
                To ensure your account is secure and ready to use, we need to
                complete a few quick steps. It won’t take long!
              </p>
              <button className="btn btn-primary" onClick={() => setStep(1)}>
                Get Started
              </button>
            </motion.div>
          </div>
        </div>
      )}

      {step === 1 && (
        <div className="text-center p-8 bg-white shadow-xl rounded-xl max-w-md w-full">
          <div className="text-xl font-semibold mb-4">
            Sign in with your Gmail
          </div>
          <p className="mb-4 text-sm text-gray-600">
            Link your account for faster, more secure logins.
          </p>
          <GoogleLogin
            onSuccess={(credentialResponse) =>
              handleGoogleSignIn(credentialResponse)
            }
            onError={() => alert("Google login failed")}
          />
        </div>
      )}

      {step === 2 && (
        <div className="text-center p-8 bg-white shadow-xl rounded-xl max-w-md w-full">
          <div className="text-2xl font-semibold mb-4">Set a New Password</div>
          <p className="mb-4 text-sm text-gray-600 italic">
            Please change your default password to keep your account secure.
          </p>
          <div className="space-y-4">
            <input
              type="password"
              placeholder="New Password"
              className="input input-bordered w-full"
              value={newPass}
              onChange={(e) => setNewPass(e.target.value)}
            />
            <input
              type="password"
              placeholder="Confirm Password"
              className="input input-bordered w-full"
              value={confirmPass}
              onChange={(e) => setConfirmPass(e.target.value)}
            />
            <button
              className="btn btn-primary w-full"
              onClick={handleSetPassword}
            >
              Set Password
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FirstVisitPopup;
