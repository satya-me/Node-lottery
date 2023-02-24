const OtpTable = require("../Models/Otp");
require("dotenv").config();
const accountSid = 'ACa92ba8aa3f79a54d165f9637c7a5ae00'; //process.env.TWILIO_SID;
const authToken = '2b106b75bb5a175c30b46bc8a7fb4ec2'; //process.env.TWILIO_TOKEN;
const twilio = require('twilio')(accountSid, authToken);

// console.log(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);

exports.RegOTP = async (req, res) => {
    const to = req.body.phone_number;
    console.log("Calling RegOTP");
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
                    console.log({ message: "verify success", status: true });
                    res.status(200).json({ message: "verify success", status: true });
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
