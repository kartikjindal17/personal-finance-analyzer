const Expense = require("../models/Expense");
const { generateSuggestions } = require("../utils/suggestions");

const getSuggestions = async (req, res) => {

    try {

        const expenses = await Expense.find(
            { user_id: req.user.id },
            {
                merchant: 1,
                amount: 1,
                category: 1,
                date: 1,
                is_anomaly: 1,
                _id: 0
            }
        );

        const suggestions = generateSuggestions(expenses);

        res.json({

            count: suggestions.length,

            high_priority: suggestions.filter(
                s => s.severity === "high"
            ).length,

            medium_priority: suggestions.filter(
                s => s.severity === "medium"
            ).length,

            info: suggestions.filter(
                s => s.severity === "info"
            ).length,

            suggestions

        });

    } catch (error) {

        res.status(500).json({

            error: error.message

        });

    }

};

module.exports = {

    getSuggestions

};