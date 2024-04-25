const mongoose = require("mongoose");
const mailSender = require("../utils/mailSender");
const emailTemplate = require("../mail/templates/emailVerificationTemplate")

const OTPSchema = new mongoose.Schema ({
    email:{
        type:String,
        requried:true,
        trim:true,
    }, 

    otp:{
        type:String,
        requried:true,
    },

    createdAt:{
        type:Date,
        default:Date.now(),
        expired:5 * 60,
    }
});

// a function to send the OTP email
async function sendVerificationEmail(email, otp) {
    try{

        const mailResponse = await mailSender(
			email,
			"Verification Email",
			emailTemplate(otp)
		);

        
    } catch(error) {
        console.log("Error occur while sending the mail", error);
        throw error;
    }
}

OTPSchema.pre("save", async function(next) {
    await sendVerificationEmail(this.email, this.otp);
    next();
})

module.exports = mongoose.model("OTP", OTPSchema);