const User = require("../models/User");
const mailSender = require("../utils/mailSender");


// reset password token
exports.resetPasswordToken = async(req, res) => {
   
    try {
  
        // get email from the req body
        const {email} = req.body;
        // check user for this email, email valdiation
        const user = await User.findOne({email:email});

        if(!user) {
            return res.status(401).json({
                success:false,
                message:'user is not exist',
            })
        }
        // generate token
        const token = crypto.randomUUID();
        // update user by adding token and expirations time
        const updatedDetails = await User.findOneAndUpdate({email:email},
                                                            {
                                                                token:token,
                                                                resetPasswordExpires:Date.now() + 5*60*1000,
                                                            },
                                                            {new:true});
        // create url
        
        const url = `http://localhost:3000/update-password/${token}`;
        // send mail containing the url
        await mailSender(email, "Password Reset Link",
                        `Password Reset Link ${url}`);
        // return response

        return res.json({
            success:true,
            message:'Email sent successfully, please check email and change password',
        })

    } catch(error) {
        console.log("Error in the reset password token");
        return res.status(500).json ({
            success:false,
            message:"Something went wrong, while reset the pass"
        })
    }


}

// reset password

exports.resetPassword = async (req, res) => {
	try {
		const { password, confirmPassword, token } = req.body;

		if (confirmPassword !== password) {
			return res.json({
				success: false,
				message: "Password and Confirm Password Does not Match",
			});
		}
		const userDetails = await User.findOne({ token: token });
		if (!userDetails) {
			return res.json({
				success: false,
				message: "Token is Invalid",
			});
		}
		if (!(userDetails.resetPasswordExpires > Date.now())) {
			return res.status(403).json({
				success: false,
				message: `Token is Expired, Please Regenerate Your Token`,
			});
		}
		const encryptedPassword = await bcrypt.hash(password, 10);
		await User.findOneAndUpdate(
			{ token: token },
			{ password: encryptedPassword },
			{ new: true }
		);
		res.json({
			success: true,
			message: `Password Reset Successful`,
		});
	} catch (error) {
		return res.json({
			error: error.message,
			success: false,
			message: `Some Error in Updating the Password`,
		});
	}
};