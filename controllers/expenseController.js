const Expense = require("../models/Expense");

const getExpenses = async (req, res) => {
    try {
        const expenses = await Expense.find({ user_id: req.user.id }).sort({ date: -1 });

        res.json(expenses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createExpense = async (req, res) => {
    try {
        const expense = await Expense.create({
            user_id: req.user.id,
            merchant: req.body.merchant,
            amount: req.body.amount,
            category: req.body.category,
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

module.exports = {
    getExpenses,
    createExpense
};