import { Navigate, Outlet, useLocation } from "react-router-dom";

export default function ProtectedRoute() {
  const location = useLocation();

  // Check whether the user has a JWT token
  const token = localStorage.getItem("token");

  // No token = user is not logged in
  if (!token) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  // Token exists = allow access
  return <Outlet />;
}