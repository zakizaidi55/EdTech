const User = require("../models/User");
const OTP = require("../models/OTP");
const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

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

exports.login = async(req, res) => {
    try {
        // get data from req body
        const {email, password} = req.body;
        
        // validations
        if(!email || !password) {
            return res.status(403).json({
                success:false,
                messagae:"All fields are mandatory",
            });
        }
        // user check exist or not
        const user = await User.findOne({email}).populate("additionalDetails");

        if(!user) {
            return res.status(401).json({
                success:false,
                message:"User is not exist",
            })
        }

        // generate the JWT, after password matching
        if(await bcrypt.compare(password, user.password)) {
            const payload = {
                email:user.email,
                id:user._id,
                role:user.role,
            }
            const token = jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn:"2h "
            });
            user.token = token;
            user.password = undefined;

            // create cookie and send response
            const options = {
                expires: new DataTransfer(Date.now() + 3*24*60*60*100),
                httpOnly:true,
            }
            res.cookie("token", token, options).status(200).json({
                success:true,
                token,
                user,
                message:"User logged in successfully",
            })
        }

        else {
            return res.status(401).json({
                success:false,
                message:'Password is incorrect',
            })
        }

        

    } catch(error) {
        console.log("Error while login the user");
        return res.status(400).json({
            success:false,
            error:error,
        });
    }
}

// change password


exports.changePassword = async (req, res) => {
	try {
		// Get user data from req.user
		const userDetails = await User.findById(req.user.id);

		// Get old password, new password, and confirm new password from req.body
		const { oldPassword, newPassword, confirmNewPassword } = req.body;

		// Validate old password
		const isPasswordMatch = await bcrypt.compare(userDetails.password);
		if (!isPasswordMatch) {
			// If old password does not match, return a 401 (Unauthorized) error
			return res.status(401).json({
                    success: false, 
                    message: "The password is incorrect"
                });
		}

		// Match new password and confirm new password
		if (newPassword !== confirmNewPassword) {
			// If new password and confirm new password do not match, return a 400 (Bad Request) error
			return res.status(400).json({
				success: false,
				message: "The password and confirm password does not match",
			});
		}

		// Update password
		const encryptedPassword = await bcrypt.hash(newPassword, 10);
		const updatedUserDetails = await User.findByIdAndUpdate(req.user.id,{ password: encryptedPassword },{ new: true });

		// Send notification email
		try {
			const emailResponse = await mailSender(
				updatedUserDetails.email,
				passwordUpdated(
					updatedUserDetails.email,
					`Password updated successfully for ${updatedUserDetails.firstName} ${updatedUserDetails.lastName}`
				)
			);
			console.log("Email sent successfully:", emailResponse.response);
		} catch (error) {
			// If there's an error sending the email, log the error and return a 500 (Internal Server Error) error
			console.error("Error occurred while sending email:", error);
			return res.status(500).json({
				success: false,
				message: "Error occurred while sending email",
				error: error.message,
			});
		}

		// Return success response
		return res
			.status(200)
			.json({ success: true, message: "Password updated successfully" });
	} catch (error) {
		// If there's an error updating the password, log the error and return a 500 (Internal Server Error) error
		console.error("Error occurred while updating password:", error);
		return res.status(500).json({
			success: false,
			message: "Error occurred while updating password",
			error: error.message,
		});
	}
};
