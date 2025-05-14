import "./index.css";
import { Route, Routes, Navigate, useNavigate } from "react-router-dom";
import NavBar from "./components/NavBar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Sidebar from "./components/Sidebar";
import CalendarApp from "./pages/Events";
import Archive from "./pages/Archive";
import Documents from "./pages/Documents";
import Dock from "./components/Dock";
import { AuthContext } from "./helpers/AuthContext";
import { useState, useEffect } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import AuditLog from "./pages/AuditLog";
import EventsList from "./pages/EventsList";
import Settings from "./pages/Settings";
import Evaluation from "./pages/Evaluation";
import ManageUser from "./pages/ManageUser";
import AddForm from "./pages/AddForm";
import EditForm from "./pages/EditForm";
import UserRating from "./pages/UserRating";
import CreateForm from "./pages/CreateForm";
import FirstVisitPopup from "./pages/FirstVisitPopup";
import Editor from "./pages/Editor";
import CreateDoc from "./pages/CreateDoc";
import ViewEditor from "./pages/ViewEditor";
import { Toaster } from "@/components/ui/sonner";
import Chat from "./pages/Chat";
import { motion, AnimatePresence } from "framer-motion";
const API_URL = import.meta.env.VITE_API_URL;

function App() {
  const navigate = useNavigate();
  const [eventState, setEventState] = useState({
    events: [],
  });
  const [showChat, setShowChat] = useState(false);
  const [authState, setAuthState] = useState({
    username: "",
    id: 0,
    status: false,
    role: "",
    email: "",
    profilePicture: "",
  });

  const { data, isLoading } = useQuery({
    queryKey: ["auth"],
    queryFn: async () => {
      try {
        const [authRes, profileRes] = await Promise.all([
          axios.get(`${API_URL}/auth/auth`, { withCredentials: true }),
          axios.get(`${API_URL}/auth/profile`, {
            withCredentials: true,
          }),
        ]);

        if (!authRes.data.error) {
          return {
            ...authRes.data,
            profilePicture: profileRes.data.profilePicture,
            status: true,
          };
        }
      } catch (err) {
        if (err.response?.status === 401) {
          return { status: false }; // User not logged in
        }
        throw err;
      }
    },
    staleTime: 1000 * 60 * 5,
    retry: false,
  });

  useEffect(() => {
    if (data?.status) setAuthState(data);
  }, [data]);

  useEffect(() => {
    if (authState.status && authState.email === "") {
      navigate("/first-visit");
    }
  }, [authState, navigate]);

  // Show loading screen while fetching auth state
  if (isLoading || (data && !authState.status && data.status))
    return (
      <div className="w-screen h-screen flex justify-center items-center">
        <span className="loading loading-dots loading-xl text-accent"></span>
      </div>
    );

  // Logout function

  const logout = async () => {
    try {
      await axios.post(`${API_URL}/auth/logout`, {}, { withCredentials: true });
      setAuthState({
        username: "",
        id: 0,
        status: false,
        role: "",
        email: "",
        profilePicture: "",
      });

      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{ authState, setAuthState, eventState, setEventState }}
    >
      <div className="flex h-screen w-screen ">
        <Toaster />
        {authState.status ? (
          authState.email === "" ? (
            <Routes>
              <Route path="/first-visit" element={<FirstVisitPopup />} />
              <Route
                path="*"
                element={<Navigate to="/first-visit" replace />}
              />
            </Routes>
          ) : (
            <>
              <NavBar className="fixed" logout={logout} />
              <div className="fixed top-16 left-0 h-full bg-base-100 shadow-sm z-40 max-sm:hidden">
                <Sidebar />
              </div>
              <div className="sm:hidden">
                <Dock />
              </div>

              <div>
                <button
                  onClick={() => setShowChat((prev) => !prev)}
                  className="fixed bottom-4 right-4 z-50 p-3 bg-primary text-white rounded-full shadow-md hover:bg-accent transition-all"
                >
                  {
                    <motion.div
                      key={showChat ? "close" : "chat"}
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      {showChat ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="size-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6 18 18 6M6 6l12 12"
                          />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="size-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 0 1-.825-.242m9.345-8.334a2.126 2.126 0 0 0-.476-.095 48.64 48.64 0 0 0-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0 0 11.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155"
                          />
                        </svg>
                      )}
                    </motion.div>
                  }
                </button>
                <AnimatePresence>
                  {showChat && (
                    <motion.div
                      initial={{ x: "100%", opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: "100%", opacity: 0 }}
                      transition={{ duration: 0.4, ease: "easeInOut" }}
                      className="fixed border w-100 h-100 bg-white right-4 bottom-20 z-10 rounded-lg shadow-lg dark:bg-gray-900"
                    >
                      <Chat />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              {/* Main Content */}
              <div className="flex-grow ml-0 mt-16  bg-white dark:bg-gray-800 sm:ml-64 mx-sm:w-screen">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/post/:id" element={<Home />} />
                  <Route path="/events" element={<CalendarApp />} />
                  <Route path="/audit-log" element={<AuditLog />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/evaluation" element={<Evaluation />} />
                  <Route path="/evaluation/add" element={<AddForm />} />
                  <Route path="/evaluation/:id" element={<EditForm />} />
                  <Route path="/view-editor/:id" element={<ViewEditor />} />
                  <Route
                    path="/evaluation/evaluate/:id"
                    element={<UserRating />}
                  />

                  {(authState.role === "moderator" ||
                    authState.role === "admin") && (
                    <>
                      <Route path="/archive" element={<Archive />} />
                      <Route path="/events/lists" element={<EventsList />} />
                      <Route path="/documents" element={<Documents />} />
                      <Route path="/manage-user" element={<ManageUser />} />
                      <Route path="/create-form" element={<CreateForm />} />
                      <Route path="/editor/:id" element={<Editor />} />
                      <Route path="/create-document" element={<CreateDoc />} />
                    </>
                  )}
                </Routes>
              </div>
            </>
          )
        ) : (
          <div className="flex-grow flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-800">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
          </div>
        )}
      </div>
    </AuthContext.Provider>
  );
}

export default App;
