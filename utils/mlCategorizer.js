const keywordCategorize = require("./categorizer");

const categorizeMerchant = (merchant) => {

    return keywordCategorize(merchant);

};

module.exports = categorizeMerchant;