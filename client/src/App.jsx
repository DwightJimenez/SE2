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
import { useState } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import AuditLog from "./pages/AuditLog";
import EventsList from "./pages/EventsList";
import Settings from "./pages/Settings";
import Evaluation from "./pages/Evaluation";
import ManageUser from "./pages/ManageUser";

function App() {
  // Load authState from sessionStorage if available
  const [authState, setAuthState] = useState(() => {
    const savedAuthState = sessionStorage.getItem("authState");
    return savedAuthState
      ? JSON.parse(savedAuthState)
      : { username: "", id: 0, status: false, role: "" };
  });

  // 🔹 Use React Query to fetch authentication status
  const { data, isLoading, isError } = useQuery({
    queryKey: ["auth"],
    queryFn: async () => {
      try {
        const response = await axios.get("http://localhost:4001/auth/auth", {
          withCredentials: true,
        });

        if (!response.data.error) {
          const newAuthState = {
            username: response.data.username,
            id: response.data.id,
            status: true,
            role: response.data.role,
          };
          setAuthState(newAuthState);
          sessionStorage.setItem("authState", JSON.stringify(newAuthState)); // 🔹 Save auth state
          return newAuthState;
        }
      } catch (error) {
        sessionStorage.removeItem("authState");
        return { status: false }; // Authentication failed
      }
    },
  });

  // Show loading screen while fetching auth state
  if (isLoading)
    return (
      <div className="w-screen h-screen flex justify-center items-center">
        <span className="loading loading-dots loading-xl"></span>
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
      setAuthState({ username: "", id: 0, status: false, role: "" });
      sessionStorage.removeItem("authState");

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

                  {authState.role === "moderator" && (
                    <>
                      <Route path="/archive" element={<Archive />} />
                      <Route path="/events/lists" element={<EventsList />} />
                      <Route path="/documents" element={<Documents />} />
                      <Route path="/manage-user" element={<ManageUser />} />
                    </>
                  )}
                </Routes>
              </div>
            </>
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
