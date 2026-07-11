const buildDailyFeatures = (expenses) => {

    if (!expenses || expenses.length === 0) {
        return [];
    }

    const dailyMap = {};

    expenses.forEach(expense => {

        const date = new Date(expense.date)
            .toISOString()
            .split("T")[0];

        if (!dailyMap[date]) {
            dailyMap[date] = 0;
        }

        dailyMap[date] += Number(expense.amount);

    });

    const dates = Object.keys(dailyMap).sort();

    const daily = [];

    dates.forEach((date, index) => {

        const currentDate = new Date(date);

        const total = dailyMap[date];

        const previous7 = daily
            .slice(Math.max(0, index - 7), index);

        const previous30 = daily
            .slice(Math.max(0, index - 30), index);

        const rolling7 = previous7.length
            ? previous7.reduce((sum, d) => sum + d.total, 0) / previous7.length
            : 0;

        const rolling30 = previous30.length
            ? previous30.reduce((sum, d) => sum + d.total, 0) / previous30.length
            : 0;

        daily.push({

            date,

            total,

            day_of_week: currentDate.getDay(),

            is_weekend:
                currentDate.getDay() === 0 ||
                currentDate.getDay() === 6,

            day_of_month:
                currentDate.getDate(),

            month:
                currentDate.getMonth() + 1,

            is_payday:
                currentDate.getDate() <= 3,

            is_month_end:
                currentDate.getDate() >= 28,

            rolling_7d:
                Number(rolling7.toFixed(2)),

            rolling_30d:
                Number(rolling30.toFixed(2)),

            lag_1:
                index > 0
                    ? daily[index - 1].total
                    : 0,

            lag_7:
                index >= 7
                    ? daily[index - 7].total
                    : 0

        });

    });

    return daily;

};

module.exports = buildDailyFeatures;