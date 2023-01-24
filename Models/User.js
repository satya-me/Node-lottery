const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = mongoose.Schema(
  {
    full_name: { type: String, required: [true, "Name is required"] },
    // last_name: { type: String, required: [true, "Name is required"] },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: [true, "Email is unique"],
      validate: {
        validator: function (email) {
          return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(
            email
          );
        },
        message: "Invalid email format",
      },
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      unique: true,
      validate: {
        validator: function (phone) {
          return /^\d{10}$/.test(phone);
        },
        message:
          "Invalid phone number format. Please enter a 10-digit phone number.",
      },
    },
    dob: {
      type: Date,
      required: [true, "DOB is required"],
      validate: {
        validator: function (value) {
          // Check if the user is 18 or older
          const age = new Date(Date.now() - value.getTime());
          const ageInYears = age.getUTCFullYear() - 1970;
          return ageInYears >= 21;
        },
        message: "Sorry, you must be 21 or older to register.",
      },
    },
    country: { type: String, required: [true, "Country is required"] },
    state: { type: String },
    password: { type: String, required: true },
    set_pass: { type: String },
  },
  { timestamps: true }
);

// userSchema.plugin(uniqueValidator);
// userSchema.plugin(uniqueValidator, { message: 'Email already in use. Please choose another.' });
userSchema.plugin(uniqueValidator, {
  message: "Error, expected {PATH} to be unique.",
});

module.exports = mongoose.model("User", userSchema);
