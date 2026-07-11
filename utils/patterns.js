const dayjs = require("dayjs");

const toDataFrame = (expenses) => {

    return expenses.map(expense => {

        const date = new Date(expense.date);

        return {

            ...expense,

            amount: Number(expense.amount),

            date,

            weekday: date.getDay(),

            isWeekend: date.getDay() === 0 || date.getDay() === 6,

            month: date.getMonth() + 1,

            year: date.getFullYear(),

            day: date.getDate(),

            monthYear: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`

        };

    });

};

const weekendVsWeekday = (expenses) => {

    if (!expenses.length) return null;

    const weekend = expenses.filter(e => e.isWeekend);

    const weekday = expenses.filter(e => !e.isWeekend);

    const weekendDates = new Set(

        weekend.map(e => e.date.toDateString())

    );

    const weekdayDates = new Set(

        weekday.map(e => e.date.toDateString())

    );

    const weekendDays = Math.max(weekendDates.size, 1);

    const weekdayDays = Math.max(weekdayDates.size, 1);

    const weekendTotal = weekend.reduce(

        (sum, e) => sum + e.amount,

        0

    );

    const weekdayTotal = weekday.reduce(

        (sum, e) => sum + e.amount,

        0

    );

    const weekendDailyAvg = weekendTotal / weekendDays;

    const weekdayDailyAvg = weekdayTotal / weekdayDays;

    const ratio = weekendDailyAvg / Math.max(weekdayDailyAvg, 1);

    return {

        weekend_daily_avg: Number(weekendDailyAvg.toFixed(2)),

        weekday_daily_avg: Number(weekdayDailyAvg.toFixed(2)),

        ratio: Number(ratio.toFixed(2)),

        weekend_total: Number(weekendTotal.toFixed(2)),

        weekday_total: Number(weekdayTotal.toFixed(2))

    };

};

const categoryConcentration = (expenses) => {

    if (!expenses.length) return null;

    const totals = {};

    let total = 0;

    expenses.forEach(expense => {

        total += expense.amount;

        totals[expense.category] =

            (totals[expense.category] || 0)

            + expense.amount;

    });

    const sorted = Object.entries(totals)

        .sort((a, b) => b[1] - a[1]);

    const top3 = sorted.slice(0, 3);

    const top3Total = top3.reduce(

        (sum, c) => sum + c[1],

        0

    );

    return {

        top3_categories: top3.map(c => c[0]),

        top3_percentage: Number(

            ((top3Total / total) * 100).toFixed(1)

        ),

        top1_category: sorted.length ? sorted[0][0] : null,

        top1_percentage: sorted.length

            ? Number(

                ((sorted[0][1] / total) * 100).toFixed(1)

            )

            : 0,

        category_totals: totals

    };

};

const merchantFrequency = (expenses, top = 5) => {

    if (!expenses.length) return [];

    const now = new Date();

    const currentMonth = now.getMonth() + 1;

    const currentYear = now.getFullYear();

    const prev = new Date();

    prev.setMonth(prev.getMonth() - 1);

    const previousMonth = prev.getMonth() + 1;

    const previousYear = prev.getFullYear();

    const current = expenses.filter(e =>
        e.month === currentMonth &&
        e.year === currentYear
    );

    const previous = expenses.filter(e =>
        e.month === previousMonth &&
        e.year === previousYear
    );

    const currentCount = {};

    const previousCount = {};

    current.forEach(e => {

        currentCount[e.merchant] =

            (currentCount[e.merchant] || 0)

            + 1;

    });

    previous.forEach(e => {

        previousCount[e.merchant] =

            (previousCount[e.merchant] || 0)

            + 1;

    });

    return Object.entries(currentCount)

        .sort((a, b) => b[1] - a[1])

        .slice(0, top)

        .map(([merchant, visits]) => {

            const previousVisits =

                previousCount[merchant] || 0;

            const totalSpent = current

                .filter(e => e.merchant === merchant)

                .reduce((s, e) => s + e.amount, 0);

            return {

                merchant,

                visits_this_month: visits,

                visits_last_month: previousVisits,

                change_pct: Number(

                    (((visits - previousVisits) /

                        Math.max(previousVisits, 1)) * 100)

                        .toFixed(1)

                ),

                total_spent: Number(totalSpent.toFixed(2))

            };

        });

};
// Monthly Trend
const monthlyTrend = (expenses) => {

    if (!expenses.length) return [];

    const monthlyMap = {};

    expenses.forEach(expense => {

        if (!monthlyMap[expense.monthYear]) {

            monthlyMap[expense.monthYear] = {

                month_year: expense.monthYear,

                total: 0,

                count: 0

            };

        }

        monthlyMap[expense.monthYear].total += expense.amount;

        monthlyMap[expense.monthYear].count += 1;

    });

    return Object.values(monthlyMap)
        .sort((a, b) => a.month_year.localeCompare(b.month_year))
        .slice(-6)
        .map(item => ({

            month_year: item.month_year,

            total: Number(item.total.toFixed(2)),

            count: item.count

        }));

};


// Recurring Expenses
const recurringExpenses = (expenses) => {

    if (!expenses.length) return [];

    const merchantMap = {};

    expenses.forEach(expense => {

        if (!merchantMap[expense.merchant]) {

            merchantMap[expense.merchant] = [];

        }

        merchantMap[expense.merchant].push(expense);

    });

    const recurring = [];

    Object.keys(merchantMap).forEach(merchant => {

        const records = merchantMap[merchant];

        const uniqueMonths = new Set(
            records.map(r => r.monthYear)
        );

        if (uniqueMonths.size < 2) return;

        const amounts = records.map(r => r.amount);

        const average =
            amounts.reduce((a, b) => a + b, 0) /
            amounts.length;

        const variance =
            amounts.reduce(
                (sum, value) =>
                    sum + Math.pow(value - average, 2),
                0
            ) / amounts.length;

        const std = Math.sqrt(variance);

        const cv = std / average;

        if (cv < 0.10) {

            recurring.push({

                merchant,

                amount: Number(average.toFixed(2)),

                months_detected: uniqueMonths.size,

                category: records[0].category,

                total_paid: Number(
                    amounts.reduce((a, b) => a + b, 0).toFixed(2)
                )

            });

        }

    });

    recurring.sort((a, b) => b.amount - a.amount);

    return recurring.slice(0, 10);

};


// Highest Spending Month
const highestSpendMonth = (expenses) => {

    if (!expenses.length) return null;

    const trend = monthlyTrend(expenses);

    if (!trend.length) return null;

    const highest = [...trend].sort(
        (a, b) => b.total - a.total
    )[0];

    const lowest = [...trend].sort(
        (a, b) => a.total - b.total
    )[0];

    const current = trend[trend.length - 1];

    const rank = [...trend]
        .sort((a, b) => b.total - a.total)
        .findIndex(t => t.month_year === current.month_year) + 1;

    return {

        highest_month: highest.month_year,

        highest_amount: highest.total,

        lowest_month: lowest.month_year,

        lowest_amount: lowest.total,

        current_month_rank: rank

    };

};


module.exports = {

    toDataFrame,

    weekendVsWeekday,

    categoryConcentration,

    merchantFrequency,

    monthlyTrend,

    recurringExpenses,

    highestSpendMonth

};