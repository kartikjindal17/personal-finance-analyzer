const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {

    getInsights,

    getFullInsights,

    weekendPattern,

    recurringPattern,

    merchantPattern

} = require("../controllers/insightsController");

router.get(
    "/",
    protect,
    getInsights
);

router.get(
    "/full",
    protect,
    getFullInsights
);

router.get(
    "/patterns/weekend",
    protect,
    weekendPattern
);

router.get(
    "/patterns/recurring",
    protect,
    recurringPattern
);

router.get(
    "/patterns/merchants",
    protect,
    merchantPattern
);

module.exports = router;