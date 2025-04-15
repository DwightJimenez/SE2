import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../helpers/AuthContext";


const FirstVisitPopup = () => {
  const [step, setStep] = useState(0); // 0 = intro, 1 = google sign in, 2 = set password

  const handleGoogleSignIn = () => {
    // Simulate successful Google sign-in
    setStep(2);
  };

  const handleSetPassword = () => {
    // Validate and save password here
    alert("Password set! Redirecting to dashboard...");
    // Redirect logic here
  };

  return (
    <div className="flex w-screen items-center justify-center bg-base-200">
      {step === 0 && (
        <div
          className="hero min-h-screen"
          style={{
            backgroundImage:
              "url(https://img.daisyui.com/images/stock/photo-1507358522600-9f71e620c44e.webp)",
          }}
        >
          <div className="hero-overlay bg-opacity-60"></div>
          <div className="hero-content text-center text-neutral-content">
            <div className="">
              <h1 className="mb-5 text-5xl font-bold">
                🎉 Welcome to WORKFLOW AUTOMATION SYSTEM for ACScis ORGANIZATION IN BICOL UNIVERSITY POLANGUI!
              </h1>
              <p className="mb-3">👋 First time here? Let’s get you set up.</p>
              <p className="mb-5">
                To ensure your account is secure and ready to use, we need to
                complete a few quick steps. It won’t take long!
              </p>
              <button className="btn btn-primary" onClick={() => setStep(1)}>
                Get Started
              </button>
            </div>
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
          <button
            onClick={handleGoogleSignIn}
            className="flex items-center justify-center px-6 py-3 w-full text-gray-700 transition-colors duration-300 transform border rounded-lg hover:bg-gray-100"
          >
            <svg className="w-6 h-6 mr-2" viewBox="0 0 40 40">
              {/* [Google Icon Paths] */}
            </svg>
            <span>Sign in with Google</span>
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="text-center p-8 bg-white shadow-xl rounded-xl max-w-md w-full">
          <div className="text-2xl font-semibold mb-4">
            Set a New Password
          </div>
          <p className="mb-4 text-sm text-gray-600 italic">
            Please change your default password to keep your account secure.
          </p>
          <div className="space-y-4">
            <input
              type="password"
              placeholder="New Password"
              className="input input-bordered w-full"
            />
            <input
              type="password"
              placeholder="Confirm Password"
              className="input input-bordered w-full"
            />
            <button className="btn btn-primary w-full" onClick={handleSetPassword}>
              Set Password
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FirstVisitPopup;
