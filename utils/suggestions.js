const {
    getCategoryConcentration,
    getRecurringExpenses,
    getMonthlyTrend
} = require("./patterns");

const {
    detectAnomalies
} = require("./anomalyDetector");

const {
    predictNextDays
} = require("./predictor");

const CATEGORY_BENCHMARKS = {
    Food: 25,
    Shopping: 25,
    Transport: 15,
    Utilities: 10,
    Subscription: 8,
    Health: 10,
    Entertainment: 10,
};

const DEFAULT_BENCHMARK = 15;

const generateSuggestions = (expenses) => {

    if (!expenses || expenses.length === 0) {
        return [];
    }

    const suggestions = [];

    const concentration = getCategoryConcentration(expenses);

    if (concentration) {

        const totals = concentration.categoryTotals;

        const totalSpent = Object.values(totals)
            .reduce((a, b) => a + b, 0);

        Object.entries(totals).forEach(([category, amount]) => {

            const percent = (amount / totalSpent) * 100;

            const benchmark =
                CATEGORY_BENCHMARKS[category] ||
                DEFAULT_BENCHMARK;

            if (percent > benchmark) {

                suggestions.push({

                    type: "category_threshold",

                    severity:
                        percent > benchmark * 1.5
                            ? "high"
                            : "medium",

                    title: `${category} is ${percent.toFixed(1)}% of spending`,

                    message:
                        `${category} exceeds recommended spending.`,

                    recommendation:
                        `Reduce ${category} expenses.`,

                    data: {

                        category,

                        percentage:
                            Number(percent.toFixed(1))

                    }

                });

            }

        });

    }

    const recurring =
        getRecurringExpenses(expenses);

    if (recurring.length) {

        suggestions.push({

            type: "subscription_audit",

            severity: "info",

            title:
                `${recurring.length} recurring subscriptions detected`,

            message:
                "Review subscriptions you no longer use.",

            recommendation:
                "Cancel unnecessary subscriptions.",

            data: recurring

        });

    }

    const anomalies =
        detectAnomalies(expenses);

    anomalies
        .filter(a => a.severity === "high")
        .slice(0, 3)
        .forEach(alert => {

            suggestions.push({

                type: "anomaly_followup",

                severity: "high",

                title:
                    `Verify ₹${alert.amount} transaction`,

                message:
                    alert.message,

                recommendation:
                    "Review this transaction.",

                data: alert

            });

        });

    try {

        const forecast =
            predictNextDays(expenses, 30);

        const trend =
            getMonthlyTrend(expenses);

        if (trend.length) {

            const previous =
                trend[trend.length - 1].total;

            const predicted =
                forecast.total_predicted;

            const increase =
                ((predicted - previous) / Math.max(previous, 1)) * 100;

            if (increase > 10) {

                suggestions.push({

                    type: "forecast_alert",

                    severity:
                        increase > 25
                            ? "high"
                            : "medium",

                    title:
                        `Predicted spending up ${increase.toFixed(1)}%`,

                    message:
                        "Next month spending may increase.",

                    recommendation:
                        "Reduce discretionary expenses.",

                    data: {

                        predicted,

                        previous,

                        increase:
                            Number(increase.toFixed(1))

                    }

                });

            }

        }

    } catch (err) {

    }

    const order = {
        high: 0,
        medium: 1,
        low: 2,
        info: 3
    };

    suggestions.sort(
        (a, b) =>
            order[a.severity] -
            order[b.severity]
    );

    return suggestions;

};

module.exports = {

    generateSuggestions

};