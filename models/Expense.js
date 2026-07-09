const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    merchant: {
      type: String,
      required: true,
      trim: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    category: {
      type: String,
      default: "Uncategorized",
    },

    date: {
      type: Date,
      default: Date.now,
    },

    description: {
      type: String,
      default: "",
    },

    payment_method: {
      type: String,
      default: "",
    },

    is_anomaly: {
      type: Boolean,
      default: false,
    },

    source: {
      type: String,
      default: "manual",
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

module.exports = mongoose.model("Expense", expenseSchema);