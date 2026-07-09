const fs = require("fs");
const csv = require("csv-parser");
const Expense = require("../models/Expense");
const categorizeMerchant = require("../utils/mlCategorizer");

const uploadCSV = async (req, res) => {

    try {

        if (!req.file) {

            return res.status(400).json({
                message: "Please upload a CSV file"
            });

        }

        const records = [];

        fs.createReadStream(req.file.path)

            .pipe(csv())

            .on("data", (row) => {

                records.push(row);

            })

            .on("end", async () => {

                try {

                    let totalAmount = 0;

                    records.forEach(record => {

                        totalAmount += Number(record.amount || 0);

                    });

                    const averageAmount = records.length
                        ? totalAmount / records.length
                        : 0;

                    const expenses = records.map(record => {

                        const amount = Number(record.amount || 0);

                        const category = categorizeMerchant(
                            record.merchant || ""
                        );

                        return {

                            user_id: req.user.id,

                            merchant: record.merchant,

                            amount,

                            category,

                            date: record.date
                                ? new Date(record.date)
                                : new Date(),

                            description:
                                record.description || "",

                            payment_method:
                                record.payment_method || "Unknown",

                            source: "csv",

                            is_anomaly:
                                amount > averageAmount * 5 &&
                                amount > 1000

                        };

                    });

                    await Expense.insertMany(expenses);

                    fs.unlinkSync(req.file.path);

                    res.json({

                        message: "Upload successful",

                        inserted: expenses.length

                    });

                }

                catch (error) {

                    res.status(500).json({

                        message: error.message

                    });

                }

            });

    }

    catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

};

module.exports = {

    uploadCSV

};