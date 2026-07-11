const trainIsolationForest = (expenses) => {

    return {

        message: "JavaScript statistical anomaly model ready",

        trained_on: expenses.length,

        model: "statistical"

    };

};

const isolationForestDetect = (expenses) => {

    if (!expenses.length) return [];

    const amounts = expenses.map(e => e.amount);

    const mean =
        amounts.reduce((a, b) => a + b, 0) /
        amounts.length;

    const variance =
        amounts.reduce(
            (sum, value) =>
                sum + Math.pow(value - mean, 2),
            0
        ) / amounts.length;

    const std = Math.sqrt(variance);

    return expenses.map(expense => {

        const score =

            std === 0

                ? 0

                : Math.abs(expense.amount - mean) / std;

        return {

            ...expense,

            anomaly_score:
                Number((score / 5).toFixed(3)),

            if_anomaly:
                score > 2.5

        };

    });

};

const evaluateIsolationForest = (expenses) => {

    const detected = isolationForestDetect(expenses);

    const tp = detected.filter(

        e =>

            e.is_anomaly &&

            e.if_anomaly

    ).length;

    const fp = detected.filter(

        e =>

            !e.is_anomaly &&

            e.if_anomaly

    ).length;

    const fn = detected.filter(

        e =>

            e.is_anomaly &&

            !e.if_anomaly

    ).length;

    const precision =
        tp / Math.max(tp + fp, 1);

    const recall =
        tp / Math.max(tp + fn, 1);

    const f1 =
        2 * precision * recall /
        Math.max(precision + recall, 0.001);

    return {

        method: "statistical",

        true_positives: tp,

        false_positives: fp,

        false_negatives: fn,

        precision:
            Number(precision.toFixed(3)),

        recall:
            Number(recall.toFixed(3)),

        f1:
            Number(f1.toFixed(3)),

        total_flagged:
            detected.filter(
                e => e.if_anomaly
            ).length

    };

};

module.exports = {

    trainIsolationForest,

    isolationForestDetect,

    evaluateIsolationForest

};