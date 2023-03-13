const OtpTable = require("../Models/Otp");
const User = require("../Models/User");
require("dotenv").config();
const accountSid = process.env.TWILIO_SID;//'ACa92ba8aa3f79a54d165f9637c7a5ae00';
const authToken = process.env.TWILIO_TOKEN;//'2b106b75bb5a175c30b46bc8a7fb4ec2'; 
const twilio = require('twilio')(accountSid, authToken);
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
// console.log(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);

exports.RegOTP = async (req, res) => {
    const to = req.body.phone_number;
    console.log("Calling RegOTP");
    const chk = await User.find({ phone: to });
    if (chk.length > 0) {
        res.status(200).json({ message: `Expected Phone number to be unique`, status: false });
        return;
    } else {
        try {
            // Generate a random 6-digit OTP using the `crypto-random-string` module
            async function generateOTP() {
                // Generate a random number between 100000 and 999999
                const min = 100000;
                const max = 999999;
                return Math.floor(Math.random() * (max - min + 1)) + min;
            }

            const GenOtp = await generateOTP();
            try {
                // Send the OTP to the user's phone number using Twilio
                const resp = await twilio.messages.create({
                    body: `Your OTP for new registration is: ${GenOtp}`,
                    to: to, // Replace with the recipient's phone number
                    from: '+14434999766' //process.env.TWILIO_NUMBER // Replace with your Twilio phone number +1 443 499 9766
                });
                // console.log(GenOtp);
                // console.log(resp);
                // return;
                const existingRecord = await OtpTable.findOne({ phone: to, user_type: "Registration" });

                if (existingRecord) {
                    await OtpTable.deleteMany({ phone: to, user_type: "Registration" });
                }
                const oTp = new OtpTable({
                    phone: to,
                    otp: GenOtp,
                    ref_id: resp.sid,
                    user_type: "Registration",
                });
                const msg = await oTp.save();
                console.log({ message: `OTP sent successfully`, status: true });
                res.status(200).json({ message: `OTP sent successfully`, status: true });

            } catch (error) {
                console.log({ message: 'Failed to send OTP', status: false });

                res.status(500).json({ message: 'Failed to send OTP', status: false });
            }

            // console.log(message.sid);
        } catch (err) {
            console.log({ message: 'Failed to send OTP', status: false });
            res.status(500).json({ message: 'Failed to send OTP', status: false });
        }
    }
    // return;
}

exports.RegOTPVerify = async (req, res) => {
    // 

    const phone = req.body.phone_number;
    const otp = req.body.otp;
    console.log(otp, phone);
    try {
        const oTp = await OtpTable.find({
            phone: phone,
            otp: otp,
        });
        // console.log(oTp.length);
        if (oTp.length >= 1) {
            const _otp_id = oTp[0]._id;
            try {
                if (oTp[0].otp == otp && oTp[0].phone == phone) {
                    const result = await OtpTable.findByIdAndDelete(_otp_id);
                    console.log({ message: "OTP verify success", status: true });
                    res.status(200).json({ message: "OTP verify success", status: true });
                } else {
                    console.log({ message: "Invalid OTP!", status: false });
                    res.status(200).json({ message: "Invalid OTP!", status: false });
                }
            } catch (error) {
                console.error({ message: error });
                res.status(200).json({ message: error });
            }
        } else {
            console.log({ message: "Invalid OTP!", status: false });
            res.status(200).json({ message: "Invalid OTP!", status: false });
        }
    } catch (error) {
        console.log(error);
    }

}

exports.ForgetPassword = async (req, res) => {
    // console.log(req.body);
    async function generateOTP() {
        // Generate a random number between 100000 and 999999
        const min = 100000;
        const max = 999999;
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    const GenOtp = await generateOTP();
    var user_id;
    var query;
    if (req.body.user_id_type === 'email') {
        // console.log(req.body);
        user_id = req.body.user_id;
        query = { email: user_id };
        const chk = await User.findOne(query);

        if (!chk) {
            console.log({ message: `This Email is not registered with us!` });
            res.status(200).json({ message: `This Email is not registered with us!`, status: false });
            return;
        } else {
            try {
                var ref;
                // Send the OTP to the user's Email
                var transporter = nodemailer.createTransport({
                    host: "smtp.gmail.com",
                    port: 587,
                    secure: false, // true for 465, false for other ports
                    auth: {
                        user: "satyajit.team@gmail.com", // generated ethereal user
                        pass: "jilomwtinpflyoyp", // generated ethereal password
                    },
                });

                var mailOptions = {
                    from: '"📧 Lottery App 👻" <kotai.workalert@gmail.com>',
                    to: user_id,
                    subject: "✅ Mail sent using Node.js",
                    text: "That was easy!",

                    html: "Your Password reset OTP is " + GenOtp,
                };

                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log("Email sent: " + info.response);
                        ref.push(info.response);
                    }
                });

                const existingRecord = await OtpTable.findOne({ email: user_id, user_type: "Registration" });

                if (existingRecord) {
                    await OtpTable.deleteMany({ email: user_id, user_type: "Registration" });
                }
                const oTp = new OtpTable({
                    phone: user_id,
                    otp: GenOtp,
                    ref_id: ref,
                    user_type: "Registration",
                });
                const msg = await oTp.save();
                console.log({ message: `OTP sent successfully`, status: true });
                res.status(200).json({ message: `OTP sent successfully`, status: true });

            } catch (error) {
                console.log({ message: 'Failed to send OTP', status: false });

                res.status(500).json({ message: 'Failed to send OTP', status: false });
            }


        }
    }
    if (req.body.user_id_type === 'phone') {
        // console.log(req.body);
        user_id = req.body.user_id;
        query = { phone: user_id };

        const to = user_id;
        console.log("Calling ForgetPassword");
        console.log(req.body);
        const chk = await User.findOne(query);

        if (!chk) {
            console.log({ message: `This number is not registered with us!` });
            res.status(200).json({ message: `This number is not registered with us!`, status: false });
            return;
        } else {
            // Generate a random 6-digit OTP using the `crypto-random-string` module

            try {
                // Send the OTP to the user's phone number using Twilio
                const resp = await twilio.messages.create({
                    body: `Your OTP for new registration is: ${GenOtp}`,
                    to: to, // Replace with the recipient's phone number
                    from: '+14434999766' //process.env.TWILIO_NUMBER // Replace with your Twilio phone number +1 443 499 9766
                });
                const existingRecord = await OtpTable.findOne({ phone: to, user_type: "Registration" });

                if (existingRecord) {
                    await OtpTable.deleteMany({ phone: to, user_type: "Registration" });
                }
                const oTp = new OtpTable({
                    phone: to,
                    otp: GenOtp,
                    ref_id: resp.sid,
                    user_type: "Registration",
                });
                const msg = await oTp.save();
                console.log({ message: `OTP sent successfully`, status: true });
                res.status(200).json({ message: `OTP sent successfully`, status: true });

            } catch (error) {
                console.log({ message: 'Failed to send OTP', status: false });

                res.status(500).json({ message: 'Failed to send OTP', status: false });
            }

        }
    }
    // console.log(query);
    // return;
    // 

}

exports.ForgetPasswordVerify = async (req, res) => {
    // 
}

exports.PasswordReset = async (req, res) => {
    //
    if (req.body.user_id_type == 'email') {
        user_id = req.body.user_id;
        query = { email: user_id };
        User.findOne(query).then((user) => {
            if (user) {
                bcrypt.hash(req.body.password, 10).then((hash) => {
                    User.findOneAndUpdate(
                        query,
                        { password: hash, set_pass: "" },
                        { new: true }
                    ).then((resp) => {
                        // res.redirect(process.env.FRONTEND_HOST);
                        console.log({ message: "Password reset successfully.", status: true });
                        res.status(200).json({ message: "Password reset successfully.", status: true });
                    }).catch((err) => {
                        console.log({ message: "Unable to Update password.", status: false });
                        res.status(200).json({ message: "Unable to Update password.", status: false });
                    });
                });
            } else {
                // res.redirect(process.env.FRONTEND_HOST);
                console.log({ message: "Unaccepted Error!", status: false });
                res.status(200).json({ message: "Unaccepted Error!", status: false });
            }
        });
    }

    if (req.body.user_id_type == 'phone') {
        user_id = req.body.user_id;
        query = { phone: user_id };
        User.findOne(query).then((user) => {
            if (user) {
                bcrypt.hash(req.body.password, 10).then((hash) => {
                    User.findOneAndUpdate(
                        query,
                        { password: hash, set_pass: "" },
                        { new: true }
                    ).then((resp) => {
                        // res.redirect(process.env.FRONTEND_HOST);
                        console.log({ message: "Password reset successfully.", status: true });
                        res.status(200).json({ message: "Password reset successfully.", status: true });
                    }).catch((err) => {
                        console.log({ message: "Unable to Update password.", status: false });
                        res.status(200).json({ message: "Unable to Update password.", status: false });
                    });
                });
            } else {
                // res.redirect(process.env.FRONTEND_HOST);
                console.log({ message: "Unaccepted Error!", status: false });
                res.status(200).json({ message: "Unaccepted Error!", status: false });
            }
        });
    }
}