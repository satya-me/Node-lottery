const mongoose = require("mongoose");

const ticketSchema = mongoose.Schema(
  {
    ticket_name: { type: String, required: [true, "Ticket name is required!"] },
    ticket_price: {
      type: Number,
      required: [false, "Ticket Price is required!"],
    },
    discount_percentage: { type: Number, required: false },
    currency: { type: String, required: [false, "Currency name is required!"] },
    ticket_quantity: {
      type: Number,
      required: [false, "Quantity is required!"],
    },
    time_left: { type: Number, required: false },
    main_image: { type: String, required: [true, "Image is required!"] },
    list_image: { type: Array },
    description: { type: String, required: false },

    // description_body: { type: String, required: false },
    // key_feature: { type: String, required: false },

    highlights: { type: Array, required: false },

    specification: { type: Object, required: false },

    status: { type: String, required: [false, "Status is required!"] },
    is_promo: { type: Boolean, required: false },
    flag: { type: String, required: false },
    category: { type: String, required: [true, "Category is required!"] },
    brand: { type: String, required: false },
    is_banner: { type: Boolean, required: false },
    banner_image: { type: String, required: false },
    country_id: { type: Object, required: false },
    rounds: { type: Object },
  },
  { timestamps: true }
);

// ticketSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Ticket2", ticketSchema);
