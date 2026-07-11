const Expense = require("../models/Expense");

const {
    generateInsights,
    getFullAnalysis
} = require("../utils/behavioral");

const {
    toDataFrame,
    weekendVsWeekday,
    recurringExpenses,
    merchantFrequency
} = require("../utils/patterns");

const getInsights = async (req, res) => {

    try {

        const expenses = await Expense.find(
            {
                user_id: req.user.id
            },
            {
                merchant: 1,
                amount: 1,
                category: 1,
                date: 1,
                is_anomaly: 1,
                _id: 0
            }
        );

        const insights = generateInsights(expenses);

        res.json({

            count: insights.length,

            insights

        });

    }

    catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

};

const getFullInsights = async (req, res) => {

    try {

        const expenses = await Expense.find(
            {
                user_id: req.user.id
            },
            {
                merchant: 1,
                amount: 1,
                category: 1,
                date: 1,
                is_anomaly: 1,
                _id: 0
            }
        );

        res.json(

            getFullAnalysis(expenses)

        );

    }

    catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

};

const weekendPattern = async (req, res) => {

    try {

        const expenses = await Expense.find(
            {
                user_id: req.user.id
            },
            {
                merchant: 1,
                amount: 1,
                category: 1,
                date: 1,
                is_anomaly: 1,
                _id: 0
            }
        );

        const data = toDataFrame(expenses);

        res.json(

            weekendVsWeekday(data)

        );

    }

    catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

};

const recurringPattern = async (req, res) => {

    try {

        const expenses = await Expense.find(
            {
                user_id: req.user.id
            },
            {
                merchant: 1,
                amount: 1,
                category: 1,
                date: 1,
                is_anomaly: 1,
                _id: 0
            }
        );

        const data = toDataFrame(expenses);

        res.json({

            recurring:

                recurringExpenses(data)

        });

    }

    catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

};

const merchantPattern = async (req, res) => {

    try {

        const expenses = await Expense.find(
            {
                user_id: req.user.id
            },
            {
                merchant: 1,
                amount: 1,
                category: 1,
                date: 1,
                is_anomaly: 1,
                _id: 0
            }
        );

        const data = toDataFrame(expenses);

        res.json({

            merchants:

                merchantFrequency(data)

        });

    }

    catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

};

module.exports = {

    getInsights,

    getFullInsights,

    weekendPattern,

    recurringPattern,

    merchantPattern

};