const mongoose = require("mongoose");

const statesSchema = mongoose.Schema(
  {
    state_id: { type: Number },
    name: { type: String },
    country_id: { type: Number },
    country_code: { type: String },
    iso2: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("States", statesSchema);
