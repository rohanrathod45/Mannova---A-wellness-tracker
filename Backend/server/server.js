const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const connectDB = require("./config/db");

const app = express();


// ===============================
// DATABASE
// ===============================

connectDB();


// ===============================
// MIDDLEWARE
// ===============================

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://mannova-frontend.onrender.com"
    ],
    credentials: true
  })
);

app.use(express.json());


// ===============================
// ROUTES
// ===============================

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const moodRoutes = require("./routes/moodRoutes");
const journalRoutes = require("./routes/journalRoutes");
const exerciseRoutes = require("./routes/exerciseRoutes");
const chatRoutes = require("./routes/chatRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/moods", moodRoutes);
app.use("/api/journals", journalRoutes);
app.use("/api/exercises", exerciseRoutes);
app.use("/api/chat", chatRoutes);


// ===============================
// TEST ROUTE
// ===============================

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Mannova Backend API is running"
  });
});


// ===============================
// SERVER PORT
// ===============================

const PORT = process.env.PORT || 4000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Mannova Backend running on port ${PORT}`);
});