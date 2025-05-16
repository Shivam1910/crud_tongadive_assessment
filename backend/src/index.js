const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const { sequelize } = require("./models");
const dataRoutes = require("./routes/data.routes");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Routes
app.use("/api/data", dataRoutes);

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "Welcome to the Bulk Data Manager API" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    status: "error",
    message: "Something went wrong!",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

// Database connection and server start
async function startServer() {
  try {
    await sequelize.authenticate();
    console.log("Database connection has been established successfully.");

    // Sync database models
    await sequelize.sync();
    console.log("Database models synchronized successfully.");

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Unable to start server:", error);
    process.exit(1);
  }
}

startServer();
