const computeCategoryStats = (expenses) => {

    const stats = {};

    expenses.forEach(expense => {

        if (!stats[expense.category]) {

            stats[expense.category] = {

                amounts: []

            };

        }

        stats[expense.category].amounts.push(expense.amount);

    });

    Object.keys(stats).forEach(category => {

        const amounts = stats[category].amounts;

        const count = amounts.length;

        const mean =
            amounts.reduce((a, b) => a + b, 0) / count;

        const variance =
            amounts.reduce(
                (sum, value) =>
                    sum + Math.pow(value - mean, 2),
                0
            ) / count;

        const std = Math.sqrt(variance);

        stats[category] = {

            mean,

            std,

            count

        };

    });

    return stats;

};

const zscoreDetect = (expenses, threshold = 2.5) => {

    const stats = computeCategoryStats(expenses);

    return expenses.map(expense => {

        const categoryStats = stats[expense.category];

        if (
            !categoryStats ||
            categoryStats.count < 5 ||
            categoryStats.std === 0
        ) {

            return {

                ...expense,

                zscore: 0,

                zscore_anomaly: false,

                zscore_deviation: ""

            };

        }

        const z =
            (expense.amount - categoryStats.mean) /
            categoryStats.std;

        return {

            ...expense,

            zscore:
                Number(z.toFixed(3)),

            zscore_anomaly:
                z > threshold,

            zscore_deviation:

                z > threshold

                    ? `${z.toFixed(1)}σ above ${expense.category} average (avg ₹${categoryStats.mean.toFixed(0)})`

                    : ""

        };

    });

};

const evaluateZscore = (expenses, threshold = 3.0) => {

    const detected = zscoreDetect(expenses, threshold);

    const tp = detected.filter(

        e =>

            e.is_anomaly &&

            e.zscore_anomaly

    ).length;

    const fp = detected.filter(

        e =>

            !e.is_anomaly &&

            e.zscore_anomaly

    ).length;

    const fn = detected.filter(

        e =>

            e.is_anomaly &&

            !e.zscore_anomaly

    ).length;

    const precision =
        tp / Math.max(tp + fp, 1);

    const recall =
        tp / Math.max(tp + fn, 1);

    const f1 =
        2 * precision * recall /
        Math.max(precision + recall, 0.001);

    return {

        method: "zscore",

        threshold,

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

                e => e.zscore_anomaly

            ).length

    };

};

module.exports = {

    computeCategoryStats,

    zscoreDetect,

    evaluateZscore

};