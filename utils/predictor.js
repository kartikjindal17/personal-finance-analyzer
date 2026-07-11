const {
    categoryConcentration,
    recurringExpenses,
    monthlyTrend
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
    Entertainment: 10
};

const DEFAULT_BENCHMARK = 15;
const SAVINGS_REDUCTION = 20;

const generateSuggestions = (expenses) => {

    if (!expenses || !expenses.length) {
        return [];
    }

    const suggestions = [];

    const concentration = categoryConcentration(expenses);

    if (concentration) {

        const totals = concentration.category_totals;

        const totalSpent = Object.values(totals)
            .reduce((sum, value) => sum + value, 0);

        Object.entries(totals).forEach(([category, amount]) => {

            const percentage = (amount / totalSpent) * 100;

            const benchmark =
                CATEGORY_BENCHMARKS[category] ||
                DEFAULT_BENCHMARK;

            if (percentage > benchmark) {

                const monthlySaving =
                    amount * (SAVINGS_REDUCTION / 100);

                suggestions.push({

                    type: "category_threshold",

                    severity:
                        percentage > benchmark * 1.5
                            ? "high"
                            : "medium",

                    title:
                        `${category} spending is ${percentage.toFixed(1)}%`,

                    message:
                        `${category} exceeds the recommended ${benchmark}% benchmark.`,

                    recommendation:
                        `Reducing ${category} spending by ${SAVINGS_REDUCTION}% could save about ₹${monthlySaving.toFixed(0)}.`,

                    data: {

                        category,

                        percentage:
                            Number(percentage.toFixed(1)),

                        benchmark,

                        monthly_saving:
                            Number(monthlySaving.toFixed(2))

                    }

                });

            }

        });

        if (concentration.top3_percentage > 60) {

            suggestions.push({

                type: "diversification",

                severity:
                    concentration.top3_percentage > 80
                        ? "high"
                        : "medium",

                title:
                    "Most spending is concentrated in a few categories",

                message:
                    `${concentration.top3_categories.join(", ")} account for ${concentration.top3_percentage}% of your spending.`,

                recommendation:
                    "Review your spending distribution across categories.",

                data: concentration

            });

        }

    }

    const recurring = recurringExpenses(expenses);

    if (recurring.length) {

        const totalRecurring =
            recurring.reduce(
                (sum, item) => sum + item.amount,
                0
            );

        suggestions.push({

            type: "subscription_audit",

            severity: "info",

            title:
                `${recurring.length} recurring subscriptions detected`,

            message:
                `Recurring payments total ₹${totalRecurring.toFixed(2)} per month.`,

            recommendation:
                "Review subscriptions that you no longer use.",

            data: recurring

        });

    }

    try {

        const alerts =
            detectAnomalies(expenses);

        alerts
            .filter(alert => alert.severity === "high")
            .slice(0, 3)
            .forEach(alert => {

                suggestions.push({

                    type: "anomaly_followup",

                    severity: "high",

                    title:
                        `Review ₹${alert.amount} transaction`,

                    message:
                        alert.message,

                    recommendation:
                        "Verify this transaction if it looks unusual.",

                    data: alert

                });

            });

    } catch (err) {}

    try {

        const forecast =
            predictNextDays(expenses, 30);

        const trend =
            monthlyTrend(expenses);

        if (
            trend.length &&
            forecast.total_predicted
        ) {

            const previous =
                trend[trend.length - 1].total;

            const predicted =
                forecast.total_predicted;

            const increase =
                ((predicted - previous) /
                    Math.max(previous, 1)) * 100;

            if (increase > 10) {

                suggestions.push({

                    type: "forecast_alert",

                    severity:
                        increase > 25
                            ? "high"
                            : "medium",

                    title:
                        `Forecast spending may increase by ${increase.toFixed(1)}%`,

                    message:
                        "Predicted spending is higher than your recent monthly trend.",

                    recommendation:
                        "Monitor your expenses before month-end.",

                    data: {

                        predicted,

                        previous,

                        increase:
                            Number(increase.toFixed(1))

                    }

                });

            }

        }

    } catch (err) {}

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