import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./AuthContext";

const ProtectedRoute = ({ element }) => {
  const { authState } = useContext(AuthContext);

  return authState.status ? element : <Navigate to="/login" />;
};

export default ProtectedRoute;
