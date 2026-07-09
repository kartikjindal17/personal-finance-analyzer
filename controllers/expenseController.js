const Expense = require("../models/Expense");

// Get All Expenses
const getExpenses = async (req, res) => {
    try {
        const expenses = await Expense.find({ user_id: req.user.id }).sort({ date: -1 });
        res.json(expenses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get Single Expense
const getExpenseById = async (req, res) => {
    try {
        const expense = await Expense.findOne({
            _id: req.params.id,
            user_id: req.user.id
        });

        if (!expense)
            return res.status(404).json({ message: "Expense not found" });

        res.json(expense);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create Expense
const createExpense = async (req, res) => {
    try {
        const expense = await Expense.create({
            user_id: req.user.id,
            merchant: req.body.merchant,
            amount: req.body.amount,
            category: req.body.category,
            date: req.body.date,
            description: req.body.description,
            payment_method: req.body.payment_method,
            source: "manual",
            is_anomaly: false
        });

        res.status(201).json(expense);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update Expense
const updateExpense = async (req, res) => {
    try {

        const expense = await Expense.findOneAndUpdate(
            {
                _id: req.params.id,
                user_id: req.user.id
            },
            req.body,
            {
                new: true
            }
        );

        if (!expense)
            return res.status(404).json({ message: "Expense not found" });

        res.json(expense);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete Expense
const deleteExpense = async (req, res) => {

    try {

        const expense = await Expense.findOneAndDelete({
            _id: req.params.id,
            user_id: req.user.id
        });

        if (!expense)
            return res.status(404).json({ message: "Expense not found" });

        res.json({
            message: "Deleted successfully"
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }

};

module.exports = {
    getExpenses,
    getExpenseById,
    createExpense,
    updateExpense,
    deleteExpense
};