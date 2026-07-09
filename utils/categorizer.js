const KEYWORD_MAP = {
    Food: [
        "swiggy", "zomato", "dominos", "domino", "mcdonalds",
        "burger king", "subway", "starbucks", "ccd",
        "kfc", "pizza hut", "restaurant", "cafe",
        "hotel", "biryani", "bakery", "tea", "coffee"
    ],

    Transport: [
        "uber", "ola", "rapido", "metro",
        "irctc", "bus", "petrol", "diesel",
        "fuel", "fastag", "toll"
    ],

    Subscription: [
        "netflix", "spotify", "amazon prime",
        "hotstar", "youtube premium",
        "adobe", "canva", "dropbox"
    ],

    Shopping: [
        "amazon", "flipkart", "myntra",
        "ajio", "nykaa", "meesho",
        "dmart", "ikea", "lenskart"
    ],

    Utilities: [
        "airtel", "jio", "bsnl",
        "electricity", "gas",
        "water", "recharge"
    ],

    Health: [
        "apollo", "1mg", "pharmacy",
        "hospital", "medical", "gym"
    ],

    Entertainment: [
        "pvr", "inox", "bookmyshow",
        "concert", "wonderla"
    ]
};

const keywordCategorize = (merchant) => {

    const merchantName = merchant.toLowerCase();

    for (const category in KEYWORD_MAP) {

        for (const keyword of KEYWORD_MAP[category]) {

            if (merchantName.includes(keyword)) {

                return category;

            }

        }

    }

    return "Other";

};

module.exports = keywordCategorize;