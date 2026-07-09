const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const categorizeRoutes = require("./routes/categorizeRoutes");

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

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {

    console.log(`Server running on port ${PORT}`);

});