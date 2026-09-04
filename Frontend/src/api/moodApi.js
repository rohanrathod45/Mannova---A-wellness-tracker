import api from "./api";

// Save mood
export const createMood = async (moodData) => {
  const response = await api.post("/api/moods", moodData);
  return response.data;
};

// Get all moods for logged-in user
export const getMoods = async () => {
  const response = await api.get("/api/moods");
  return response.data;
};

// Get one mood
export const getMoodById = async (id) => {
  const response = await api.get(`/api/moods/${id}`);
  return response.data;
};

// Update mood
export const updateMood = async (id, moodData) => {
  const response = await api.put(
    `/api/moods/${id}`,
    moodData
  );

  return response.data;
};

// Delete mood
export const deleteMood = async (id) => {
  const response = await api.delete(
    `/api/moods/${id}`
  );

  return response.data;
};