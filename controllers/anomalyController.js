const Expense = require("../models/Expense");

const {
    detectAnomalies,
    getAnomalyMetrics
} = require("../utils/anomalyDetector");

const {
    trainIsolationForest
} = require("../utils/isolationForest");

const detect = async (req, res) => {

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

        const alerts = detectAnomalies(expenses);

        res.json({

            total_transactions: expenses.length,

            anomalies_detected: alerts.length,

            high: alerts.filter(a => a.severity === "high").length,

            medium: alerts.filter(a => a.severity === "medium").length,

            low: alerts.filter(a => a.severity === "low").length,

            alerts

        });

    } catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

};

const metrics = async (req, res) => {

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

            getAnomalyMetrics(expenses)

        );

    } catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

};

const train = async (req, res) => {

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

        if (expenses.length < 50) {

            return res.json({

                error: `Need at least 50 transactions, found ${expenses.length}`

            });

        }

        const result = trainIsolationForest(expenses);

        res.json(result);

    } catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

};

module.exports = {

    detect,

    metrics,

    train

};