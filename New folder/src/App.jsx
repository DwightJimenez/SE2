import "./App.css";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
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
import { useNavigate } from "react-router-dom";

function App() {

  const [authState, setAuthState] = useState({
    username: "",
    id: 0,
    status: false,
    role: "",
  });

  useEffect(() => {
    const token = sessionStorage.getItem("accessToken");
    if (token) {
      axios
        .get("http://localhost:3006/auth/auth", {
          headers: { accessToken: token },
        })
        .then((response) => {
          if (!response.data.error) {
            setAuthState({
              username: response.data.username,
              id: response.data.id,
              status: true,
              role: response.data.role,
            });
          }
        })
        .catch(() => setAuthState((prev) => ({ ...prev, status: false })));
    }
  }, []);

  const logout = () => {
    sessionStorage.removeItem("accessToken");
    setAuthState({ username: "", id: 0, status: false, role: "" });
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ authState, setAuthState }}>
      <BrowserRouter>
        <div className="flex h-screen w-screen">
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
              <div className="flex-grow ml-0 mt-16 p-4 bg-gray-100 dark:bg-gray-800 sm:ml-64 mx-sm:w-screen">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/post/:id" element={<Home />} />
                  <Route path="/events" element={<CalendarApp />} />
                  <Route path="/documents" element={<Documents />} />
                  <Route path="/roles" element={<Home />} />
                  <Route path="/archive" element={<Archive />} />
                  <Route path="/audit-log" element={<Home />} />
                  <Route path="/registration" element={<Home />} />
                </Routes>
              </div>
            </>
          ) : (
            /* If not authenticated, show only the login page */
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
