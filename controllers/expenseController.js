const Expense = require("../models/Expense");

// Get All Expenses
const getExpenses = async (req, res) => {
    try {

        const expenses = await Expense.find({
            user_id: req.user.id
        }).sort({ date: -1 });

        res.json(expenses);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};

// Get Single Expense
const getExpenseById = async (req, res) => {

    try {

        const expense = await Expense.findOne({
            _id: req.params.id,
            user_id: req.user.id
        });

        if (!expense) {
            return res.status(404).json({
                message: "Expense not found"
            });
        }

        res.json(expense);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

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

        res.status(500).json({
            message: error.message
        });

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

        if (!expense) {
            return res.status(404).json({
                message: "Expense not found"
            });
        }

        res.json(expense);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

// Delete Expense
const deleteExpense = async (req, res) => {

    try {

        const expense = await Expense.findOneAndDelete({

            _id: req.params.id,
            user_id: req.user.id

        });

        if (!expense) {
            return res.status(404).json({
                message: "Expense not found"
            });
        }

        res.json({
            message: "Deleted successfully"
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

// Expense Summary
const getSummary = async (req, res) => {

    try {

        const expenses = await Expense.find({
            user_id: req.user.id
        });

        let totalSpent = 0;

        const categoryMap = {};
        const monthlyMap = {};

        expenses.forEach(expense => {

            totalSpent += expense.amount;

            // Category Breakdown
            if (!categoryMap[expense.category]) {

                categoryMap[expense.category] = {

                    category: expense.category,
                    total: 0,
                    count: 0

                };

            }

            categoryMap[expense.category].total += expense.amount;
            categoryMap[expense.category].count += 1;

            // Monthly Breakdown
            const date = new Date(expense.date);

            const key = `${date.getFullYear()}-${date.getMonth() + 1}`;

            if (!monthlyMap[key]) {

                monthlyMap[key] = {

                    year: date.getFullYear(),
                    month: date.getMonth() + 1,
                    total: 0,
                    count: 0

                };

            }

            monthlyMap[key].total += expense.amount;
            monthlyMap[key].count += 1;

        });

        res.json({

            total_spent: totalSpent,

            total_transactions: expenses.length,

            category_breakdown: Object.values(categoryMap),

            monthly_breakdown: Object.values(monthlyMap)

        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

module.exports = {

    getExpenses,
    getExpenseById,
    createExpense,
    updateExpense,
    deleteExpense,
    getSummary

};