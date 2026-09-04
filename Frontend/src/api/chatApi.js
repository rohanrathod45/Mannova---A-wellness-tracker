import axios from "axios";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:4000";

export const sendChatMessage = async (message, history = []) => {
  const token = localStorage.getItem("token");

  const response = await axios.post(
    `${API_URL}/api/chat`,
    {
      message,
      history,
    },
    {
      headers: {
        "Content-Type": "application/json",
        ...(token
          ? {
              Authorization: `Bearer ${token}`,
            }
          : {}),
      },
    }
  );

  return response.data;
};