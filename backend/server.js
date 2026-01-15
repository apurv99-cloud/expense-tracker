const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const incomeRoutes = require("./routes/incomeRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

const app = express();

// Middleware to handle CORS
app.use(
  cors({
    origin: process.env.CLIENT_URL || "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

require("dotenv").config();

app.use(express.json());

// Connect to MongoDB
connectDB();
// const PORT = 5000;

// API Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/income", incomeRoutes);
app.use("/api/v1/expense", expenseRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);

// server uploads folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

//  Test route for browser check
app.get("/", (req, res) => {
  res.send("Backend server is running successfully!");
});

const PORT = process.env.PORT && 5000;

app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
