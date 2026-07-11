const {
    zscoreDetect,
    evaluateZscore
} = require("./zscoreDetector");

const {
    isolationForestDetect,
    evaluateIsolationForest
} = require("./isolationForest");

const detectAnomalies = (expenses) => {

    if (!expenses.length) return [];

    let detected = zscoreDetect(expenses, 3.0);

    detected = isolationForestDetect(detected);

    detected = detected.map(expense => {

        const detectedHigh =
            expense.zscore_anomaly &&
            expense.if_anomaly;

        const detectedMedium =
            expense.zscore_anomaly ||
            expense.if_anomaly;

        return {

            ...expense,

            detected_high: detectedHigh,

            detected_medium: detectedMedium,

            detected: detectedHigh

        };

    });

    const alerts = [];

    detected
        .filter(expense => expense.detected)
        .forEach(expense => {

            let severity = "low";

            if (
                expense.zscore > 3.5 ||
                expense.anomaly_score > 0.6
            ) {

                severity = "high";

            }

            else if (
                expense.zscore > 2.5 ||
                expense.anomaly_score > 0.4
            ) {

                severity = "medium";

            }

            const methods = [];

            if (expense.zscore_anomaly)
                methods.push("z-score");

            if (expense.if_anomaly)
                methods.push("statistical");

            alerts.push({

                merchant:
                    expense.merchant,

                amount:
                    expense.amount,

                category:
                    expense.category,

                date:
                    expense.date,

                severity,

                zscore:
                    expense.zscore,

                anomaly_score:
                    expense.anomaly_score,

                detection_methods:
                    methods,

                message:

                    expense.zscore_deviation ||

                    `Unusual ${expense.category} transaction: ₹${expense.amount.toFixed(0)}`,

                is_labeled_anomaly:
                    Boolean(expense.is_anomaly)

            });

        });

    const order = {

        high: 0,

        medium: 1,

        low: 2

    };

    alerts.sort(

        (a, b) =>

            order[a.severity] -

            order[b.severity]

    );

    return alerts;

};

const getAnomalyMetrics = (expenses) => {

    if (!expenses.length) {

        return {

            labeled_anomalies: 0,

            zscore: null,

            isolation_forest: null,

            summary: null,

            message:
                "No expense data available."

        };

    }

    const labeled =

        expenses.filter(

            e => e.is_anomaly

        ).length;

    const zscore =

        evaluateZscore(expenses);

    const statistical =

        evaluateIsolationForest(expenses);

    return {

        labeled_anomalies:
            labeled,

        zscore,

        isolation_forest:
            statistical,

        summary: {

            best_precision:
                Math.max(
                    zscore.precision,
                    statistical.precision
                ),

            best_recall:
                Math.max(
                    zscore.recall,
                    statistical.recall
                )

        }

    };

};

module.exports = {

    detectAnomalies,

    getAnomalyMetrics

};