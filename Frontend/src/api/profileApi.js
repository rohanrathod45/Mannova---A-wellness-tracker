import api from "./api";

// Get logged-in user's profile
export const getMyProfile = async () => {
  const response = await api.get("/api/auth/profile");
  return response.data;
};

// Update profile image
export const updateProfileImage = async (profileImage) => {
  const response = await api.put("/api/auth/profile-image", {
    profileImage,
  });

  return response.data;
};

// Update profile details
export const updateProfile = async (profileData) => {
  const response = await api.put("/api/auth/profile", profileData);
  return response.data;
};