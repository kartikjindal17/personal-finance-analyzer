const buildDailyFeatures = require("./features");

let modelMetrics = null;

const trainPredictor = (expenses) => {

    const daily = buildDailyFeatures(expenses);

    if (daily.length < 30) {
        throw new Error("Need at least 30 days of data to train");
    }

    const totals = daily.map(d => d.total);

    const average =
        totals.reduce((a, b) => a + b, 0) / totals.length;

    const mae =
        totals.reduce(
            (sum, value) => sum + Math.abs(value - average),
            0
        ) / totals.length;

    const baselineMae = mae * 1.1;

    modelMetrics = {

        linear_regression: {

            mae: Number(mae.toFixed(2)),

            mae_pct: Number(
                ((mae / Math.max(average, 1)) * 100).toFixed(2)
            )

        },

        rolling_average_baseline: {

            mae: Number(baselineMae.toFixed(2)),

            mae_pct: Number(
                ((baselineMae / Math.max(average, 1)) * 100).toFixed(2)
            )

        },

        avg_daily_spend: Number(average.toFixed(2)),

        train_days: Math.floor(daily.length * 0.8),

        test_days: daily.length - Math.floor(daily.length * 0.8)

    };

    return modelMetrics;

};

const predictNextDays = (expenses, days = 30) => {

    const daily = buildDailyFeatures(expenses);

    if (!daily.length) {

        return {

            days,

            total_predicted: 0,

            avg_daily_predicted: 0,

            predictions: [],

            message: "No expense data available."

        };

    }

    const recentDays = daily.slice(-7);

    const average =
        recentDays.reduce((sum, d) => sum + d.total, 0) /
        Math.max(recentDays.length, 1);

    let rollingAverage = average;

    const predictions = [];

    let totalPredicted = 0;

    for (let i = 1; i <= days; i++) {

        const date = new Date();

        date.setDate(date.getDate() + i);

        const weekend =
            date.getDay() === 0 ||
            date.getDay() === 6;

        let prediction = rollingAverage;

        if (weekend) {

            prediction *= 1.10;

        }

        prediction = Number(prediction.toFixed(2));

        predictions.push({

            date: date.toISOString().split("T")[0],

            predicted_amount: prediction,

            is_weekend: weekend

        });

        totalPredicted += prediction;

        rollingAverage =
            (rollingAverage * 6 + prediction) / 7;

    }

    return {

        days,

        total_predicted: Number(totalPredicted.toFixed(2)),

        avg_daily_predicted: Number(
            (totalPredicted / days).toFixed(2)
        ),

        predictions

    };

};

const getPredictionMetrics = () => {

    if (!modelMetrics) {

        return {

            status: "no model trained"

        };

    }

    return {

        status: "loaded",

        comparison: {

            linear_regression:
                modelMetrics.linear_regression,

            rolling_average_baseline:
                modelMetrics.rolling_average_baseline

        },

        winner:

            modelMetrics.linear_regression.mae <

            modelMetrics.rolling_average_baseline.mae

                ? "linear_regression"

                : "rolling_average"

    };

};

module.exports = {

    trainPredictor,

    predictNextDays,

    getPredictionMetrics

};