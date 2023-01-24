const mongoose = require("mongoose");

const categorySchema = mongoose.Schema(
  {
    name: { type: String, unique: true, required: true },
    image: { type: String, required: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Category", categorySchema);
