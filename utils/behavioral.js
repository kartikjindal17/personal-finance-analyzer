const {
    toDataFrame,
    weekendVsWeekday,
    categoryConcentration,
    merchantFrequency,
    monthlyTrend,
    recurringExpenses,
    highestSpendMonth
} = require("./patterns");

const generateInsights = (expenses) => {

    const data = toDataFrame(expenses);

    if (!data.length) return [];

    const insights = [];

    // Weekend Pattern
    const weekend = weekendVsWeekday(data);

    if (weekend && weekend.ratio > 1.2) {

        insights.push({

            type: "weekend_pattern",

            severity: "info",

            message:
                `Weekend spending is ${weekend.ratio}× your weekday average`,

            sub:
                `Weekend daily avg: ₹${weekend.weekend_daily_avg.toFixed(0)} vs Weekday: ₹${weekend.weekday_daily_avg.toFixed(0)}`,

            data: weekend

        });

    }

    // Category Concentration
    const concentration = categoryConcentration(data);

    if (concentration && concentration.top3_percentage > 60) {

        insights.push({

            type: "concentration",

            severity:
                concentration.top3_percentage > 80
                    ? "warning"
                    : "info",

            message:
                `Top 3 categories = ${concentration.top3_percentage}% of your expenses`,

            sub:
                concentration.top3_categories.join(", "),

            data: concentration

        });

    }

    if (concentration && concentration.top1_percentage > 35) {

        insights.push({

            type: "dominant_category",

            severity: "warning",

            message:
                `${concentration.top1_category} alone = ${concentration.top1_percentage}% of total spending`,

            sub:
                "Consider reviewing this category",

            data: {

                category:
                    concentration.top1_category,

                percentage:
                    concentration.top1_percentage

            }

        });

    }

    // Merchant Frequency
    const merchants = merchantFrequency(data);

    merchants.slice(0, 2).forEach(merchant => {

        if (merchant.change_pct > 30) {

            insights.push({

                type: "merchant_spike",

                severity: "info",

                message:
                    `${merchant.merchant} visits up ${merchant.change_pct}% vs last month`,

                sub:
                    `${merchant.visits_this_month} visits · ₹${merchant.total_spent.toFixed(0)} spent`,

                data: merchant

            });

        }

    });

    // Recurring
    const recurring = recurringExpenses(data);

    if (recurring.length) {

        const total = recurring.reduce(

            (sum, r) => sum + r.amount,

            0

        );

        insights.push({

            type: "recurring",

            severity: "info",

            message:
                `₹${total.toFixed(0)}/month in recurring charges detected`,

            sub:
                recurring
                    .slice(0, 3)
                    .map(r => r.merchant)
                    .join(", "),

            data: {

                recurring,

                total

            }

        });

    }

    // Highest Month
    const highest = highestSpendMonth(data);

    if (highest && highest.current_month_rank === 1) {

        insights.push({

            type: "monthly_high",

            severity: "warning",

            message:
                "This is your highest spending month on record",

            sub:
                `₹${highest.highest_amount.toFixed(0)} total`,

            data: highest

        });

    }

    // Monthly Trend
    const trend = monthlyTrend(data);

    if (trend.length >= 2) {

        const last = trend[trend.length - 1].total;

        const previous = trend[trend.length - 2].total;

        const change =
            ((last - previous) / Math.max(previous, 1)) * 100;

        if (Math.abs(change) > 20) {

            insights.push({

                type: "monthly_change",

                severity:
                    change > 20
                        ? "warning"
                        : "info",

                message:
                    `Spending ${change > 0 ? "up" : "down"} ${Math.abs(change).toFixed(1)}% vs last month`,

                sub:
                    `₹${last.toFixed(0)} this month vs ₹${previous.toFixed(0)} last month`,

                data: {

                    current: last,

                    previous,

                    change_pct:
                        Number(change.toFixed(1))

                }

            });

        }

    }

    return insights;

};

const getFullAnalysis = (expenses) => {

    const data = toDataFrame(expenses);

    if (!data.length) {

        return {

            insights: [],

            patterns: {}

        };

    }

    return {

        insights: generateInsights(expenses),

        patterns: {

            weekend_vs_weekday:
                weekendVsWeekday(data),

            category_concentration:
                categoryConcentration(data),

            merchant_frequency:
                merchantFrequency(data),

            monthly_trend:
                monthlyTrend(data),

            recurring_expenses:
                recurringExpenses(data),

            highest_spend_month:
                highestSpendMonth(data)

        }

    };

};

module.exports = {

    generateInsights,

    getFullAnalysis

};