require("dotenv").config();
const express = require("express");
const cors = require("cors");
const wordRoutes = require("./routes/wordRoutes");
const pool = require("./db");

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*",
  }),
);
app.use(express.json());

app.get("/health", async (req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({ ok: true, message: "Backend is running" });
  } catch (error) {
    res.status(500).json({ ok: false, message: "Database connection failed" });
  }
});

app.use("/api", wordRoutes);

// Centralized error handling for uncaught route errors.
app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).json({ message: "Internal server error" });
});

const port = Number(process.env.PORT || 4000);
app.listen(port, () => {
  console.log(`Backend listening at http://localhost:${port}`);
});
