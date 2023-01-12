const mongoose = require("mongoose");

const ticketSchema = mongoose.Schema(
  {
    ticket_name: { type: String, required: true },
    ticket_price: { type: Number, required: true },
    discount_percentage: { type: Number, required: false },
    currency: { type: String, required: true },
    ticket_quantity: { type: Number, required: true },
    time_left: { type: Number, required: false },
    main_image: { type: String, required: true },
    list_image: { type: Object, required: true },
    description: { type: String, required: true },
    status: { type: Boolean, required: true },
    is_promo: { type: Boolean, required: true },
    flag: { type: String, required: false },
    category: { type: String, required: true },
    brand: { type: String, required: false },
    is_banner: { type: Boolean, required: false },
  },
  { timestamps: true }
);

// ticketSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Ticket", ticketSchema);
