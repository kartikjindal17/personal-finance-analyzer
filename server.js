const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const categorizeRoutes = require("./routes/categorizeRoutes");
const insightsRoutes = require("./routes/insightsRoutes");
const anomalyRoutes = require("./routes/anomalyRoutes");
const predictionRoutes = require("./routes/predictionRoutes");
const suggestionsRoutes = require("./routes/suggestionsRoutes");

dotenv.config();

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {

    res.json({

        status: "ok",

        message: "Expense Tracker API"

    });

});

app.get("/health", (req, res) => {

    res.json({

        status: "ok"

    });

});

app.use("/api/auth", authRoutes);

app.use("/api/expenses", expenseRoutes);

app.use("/api/upload", uploadRoutes);

app.use("/api/categorize", categorizeRoutes);

app.use("/api/insights", insightsRoutes);

app.use("/api/anomaly", anomalyRoutes);
app.use("/api/prediction", predictionRoutes);
app.use("/api/suggestions", suggestionsRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {

    console.log(`Server running on port ${PORT}`);

});