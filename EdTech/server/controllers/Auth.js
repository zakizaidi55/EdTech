const User = require("../models/User");
const OTP = require("../models/OTP");
const otpGenerator = require("otp-generator");

// send OTP
exports.sendOTP = async(req, res) => {
    try {

    const {email} = req.body;

    // check if user already exist
    const checkUserPresent = await User.findOne({email});
    if(checkUserPresent) {
        return res.status(401).json({
            success:false,
            message:'User is already exist',
        })
    }

    // generate OTP
        var otp = otpGenerator.generate(6, {
            upperCaseAlphabets:false,
            specialChars:false,
            lowerCaseAlphabets:false,
        });

        console.log("OTP Generated ", otp);

        // check the OTP is unique or not
        let result = await OTP.findOne({otp:otp}) 

        while(result) {
            otp = otpGenerator.generate(6, {
                upperCaseAlphabets:false,
                specialChars:false,
                lowerCaseAlphabets:false,
            });

            result = await OTP.findOne({otp:otp});
        }

        const otpPayload = {email, otp};

        // create an entry in DB for OTP
        const otpBody = await OTP.create(otpPayload);
        console.log("In the OTP controller");
        console.log("Printing the OTP body", otpBody);

        res.status(200).json({
            success:true,
            message:'OTP send successfully',
        })

    } catch(error) {
        console.error(error);
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    }
    
}



// signUP


// login



// change password
