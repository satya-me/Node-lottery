const mongoose = require("mongoose");

const roleSchema = mongoose.Schema(
    {
        permission_type: { type: String, required: true, unique: true },
        allowedRoutes: { type: Array, required: true },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Roles", roleSchema);
