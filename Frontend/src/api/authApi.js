import api from "./api";

// Signup
export const signupUser = async (userData) => {
  const response = await api.post("/api/auth/signup", userData);
  return response.data;
};

// Login
export const loginUser = async (userData) => {
  const response = await api.post("/api/auth/login", userData);
  return response.data;
};

// Get logged-in user profile
export const getMyProfile = async () => {
  const response = await api.get("/api/auth/profile");
  return response.data;
};