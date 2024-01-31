const User = require("../models/User");
const OTP = require("../models/OTP");
const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");

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

exports.signUp = async(req, res) => {
    try {
    // data fetch
    const {
        firstName,
        lastName,
        email, 
        password,
        confirmPassword,
        accountType,
        contactNumber,
        otp
    } = req.body;
    // validations
    if(!firstName || !lastName || !email || !password
        || confirmPassword || contactNumber || otp) {
            return res.status(403).json({
                success:false,
                message:"All fields are mandatory",
            })
    }
    // 2 password match

    if(password !== confirmPassword) {
        return res.status(400).json({
            success:false,
            message:"password and confirm password does not match",
        })
    }
    // check user already exist
    const existingUser = await User.findOne({email});
    if(existingUser) {
        return res.status(401).json({
            success:false,
            message:"User is already exist",
        });
    }
    // find the most recent otp stored in the databae
    const recentOtp = await OTP.findOne({email}).sort({createdAt:-1}).limit(1);
    console.log(recentOtp);
    // validate the OTP
    if(recentOtp.length == 0) {
        // OTP not found
        return res.status(400).json({
            success:false,
            message:'OTP not found',
        });
    }
    else if(otp !== recentOtp) {
        return res.status(400).json({
            success:false,
            message:"Invalid OTP ",
        });
    }
    // hash the password
    const hasedPassword = await bcrypt.hash(password, 10);
    // create the entry

    const profileDetails = await Profile.create({
        gender:null,
        dateOfBirth:null,
        about:null,
        contactNumber:null,

    })

    const user = await User.create({
        firstName,
        lastName,
        email,
        contactNumber,
        password:hasedPassword,
        accountType,
        additionalDetails:profileDetails._id,
        image:`https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
    })
    // return the response
    return res.status(200).json({
        success:true,
        message:'User is registered successsfully'
    })
    } catch(error) {
        console.log("Error while registering the user");
        return res.status(400).json({
            success:false,
            error:error,
        })
    }
    
    
}

// login



// change password
