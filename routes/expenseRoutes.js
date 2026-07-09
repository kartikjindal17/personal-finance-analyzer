const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {

    getExpenses,
    getExpenseById,
    createExpense,
    updateExpense,
    deleteExpense,
    getSummary

} = require("../controllers/expenseController");

// Get all expenses
router.get("/", protect, getExpenses);

// Expense summary
router.get("/summary", protect, getSummary);

// Get single expense
router.get("/:id", protect, getExpenseById);

// Create expense
router.post("/", protect, createExpense);

// Update expense
router.put("/:id", protect, updateExpense);

// Delete expense
router.delete("/:id", protect, deleteExpense);

module.exports = router;