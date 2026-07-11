const Expense = require("../models/Expense");

const {
    trainPredictor,
    predictNextDays,
    getPredictionMetrics
} = require("../utils/predictor");

const train = async (req, res) => {

    try {

        const expenses = await Expense.find(
            { user_id: req.user.id },
            {
                merchant: 1,
                amount: 1,
                category: 1,
                date: 1,
                _id: 0
            }
        );

        const metrics = trainPredictor(expenses);

        res.json({

            message: "Predictor trained",

            metrics

        });

    } catch (error) {

        res.status(400).json({

            error: error.message

        });

    }

};

const forecast = async (req, res) => {

    try {

        const days = Number(req.query.days) || 30;

        const expenses = await Expense.find(
            { user_id: req.user.id },
            {
                merchant: 1,
                amount: 1,
                category: 1,
                date: 1,
                _id: 0
            }
        );

        const result = predictNextDays(expenses, days);

        res.json(result);

    } catch (error) {

        res.status(400).json({

            error: error.message

        });

    }

};

const metrics = (req, res) => {

    try {

        res.json(

            getPredictionMetrics()

        );

    } catch (error) {

        res.status(500).json({

            error: error.message

        });

    }

};

module.exports = {

    train,

    forecast,

    metrics

};