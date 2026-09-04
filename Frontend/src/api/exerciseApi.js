import api from "./api";

// Complete an exercise
export const completeExercise = async (exerciseData) => {
  const response = await api.post(
    "/api/exercises",
    exerciseData
  );

  return response.data;
};


// Get completed exercises
export const getCompletedExercises = async () => {
  const response = await api.get(
    "/api/exercises"
  );

  return response.data;
};


// Delete completed exercise
export const deleteCompletedExercise = async (id) => {
  const response = await api.delete(
    `/api/exercises/${id}`
  );

  return response.data;
};