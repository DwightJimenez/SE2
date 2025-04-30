import "./index.css";
import {
  BrowserRouter,
  Route,
  Routes,
  Navigate,
  useNavigate,
} from "react-router-dom";
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
import Profile from "./pages/Profile";
import FirstVisitPopup from "./pages/FirstVisitPopup";
import Editor from "./pages/Editor";
import CreateDoc from "./pages/CreateDoc";

function App() {
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
      const [authRes, profileRes] = await Promise.all([
        axios.get("http://localhost:4001/auth/auth", { withCredentials: true }),
        axios.get("http://localhost:4001/auth/profile", {
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

      return { status: false };
    },
    staleTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    if (data?.status) setAuthState(data);
  }, [data]);

  // Show loading screen while fetching auth state
  if (isLoading || (data && !authState.status))
    return (
      <div className="w-screen h-screen flex justify-center items-center">
        <span className="loading loading-dots loading-xl text-accent"></span>
      </div>
    );

  // Logout function

  const logout = async () => {
    try {
      await axios.post(
        "http://localhost:4001/auth/logout",
        {},
        { withCredentials: true }
      );
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
    <AuthContext.Provider value={{ authState, setAuthState }}>
      <BrowserRouter>
        <div className="flex h-screen w-screen ">
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
                    <Route path="/profile" element={<Profile />} />
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
                        <Route path="/editor" element={<Editor/>} />
                        <Route path="/editor/:id" element={<Editor/>} />
                        <Route path="/create-document" element={<CreateDoc/>} />
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
      </BrowserRouter>
    </AuthContext.Provider>
  );
}

export default App;
