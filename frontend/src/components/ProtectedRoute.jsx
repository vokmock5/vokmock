import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  // Agar token nahi hai → login par bhej do
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Token hai → page allow
  return children;
};

export default ProtectedRoute;
