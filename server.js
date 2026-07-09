const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

const connectDB = require("./config/db");

const expenseRoutes = require("./routes/expenseRoutes");
const authRoutes = require("./routes/authRoutes");

dotenv.config();

const app = express();

// Connect Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Root Route
app.get("/", (req, res) => {
    res.json({
        status: "ok",
        message: "Expense Tracker API",
    });
});

// Health Check
app.get("/health", (req, res) => {
    res.json({
        status: "ok",
    });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/expenses", expenseRoutes);

// Future Routes (We'll create these later)
// app.use("/api/upload", uploadRoutes);
// app.use("/api/categorize", categorizeRoutes);
// app.use("/api/insights", insightsRoutes);
// app.use("/api/anomaly", anomalyRoutes);
// app.use("/api/prediction", predictionRoutes);
// app.use("/api/suggestions", suggestionRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});