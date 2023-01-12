const mongoose = require("mongoose");

const configSchema = mongoose.Schema(
  {
    currency: { type: String },
    language: { type: String },
    site_maintenance: { type: Boolean, default: false },
    site_maintenance_admin: { type: Boolean, default: false },
  },
  { timestamps: true }
);


module.exports = mongoose.model("Config", configSchema);
