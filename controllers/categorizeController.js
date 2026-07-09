const categorizeMerchant = require("../utils/mlCategorizer");

const categorizeExpense = async (req, res) => {

    try {

        const { merchant } = req.body;

        if (!merchant) {

            return res.status(400).json({
                message: "Merchant is required"
            });

        }

        const category = categorizeMerchant(merchant);

        res.json({

            merchant,

            category,

            confidence: 1.0,

            method: "keyword"

        });

    } catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

};

module.exports = {

    categorizeExpense

};