const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/User");

// auth
exports.auth = async(req, res, next) => {
    try {
        // extract token
        const token = req.cookies.token || req.body.token || req.header("Authorization").replace("Bearer ","");
        
        if(!token) {
            return res.status(401).json({
                success:false,
                messge:"Token is missing",
            })
        }

        // verify the token
        try {

            const decode = await jwt.verify(token, process.env.JWT_SECRET);
            // console.log(decode);
            req.user = decode;
        
        } catch(error) {
            // issue in verification
            console.log("Issue in verification");
            return res.status(401).json({
                success:false,
                message:"token is invalid"
            })
        }
        next();
    } catch(error) {
        console.log("Issue in validating the token");
        return res.status(401).json({
            success:false,
            message:"something went wrong while validating the token",
        })
    }
}

// isStudent
exports.isStudent = async(req, res, next) => {
    try {

        if(req.user.accountType !== "Student") {
            return res.status(401).json({
                success:false,
                message:"This is the protected route for the student",
            });
        }      
        
        next();

    } catch(error) {
        console.log("Issue in verifyin the user role in student");
        return res.status(500).json({
            success:false,
            message:"User role cannot be verified, please try again",
        })
    }
}

// isInstructor

exports.isInstructor = async(req, res, next) => {
    try {

        if(req.user.accountType !== "Instructor") {
            return res.status(401).json({
                success:false,
                message:"This is the protected route for the Instructor",
            });
        }      
        
        next();

    } catch(error) {
        console.log("Issue in verifyin the user role in Instructor");
        return res.status(500).json({
            success:false,
            message:"User role cannot be verified, please try again",
        })
    }
}

// isAdmin
exports.isAdmin = async(req, res, next) => {
    try {

        if(req.user.accountType !== "Admin") {
            return res.status(401).json({
                success:false,
                message:"This is the protected route for the Admin",
            });
        }      
        
        next();

    } catch(error) {
        console.log("Issue in verifyin the user role in Admin");
        return res.status(500).json({
            success:false,
            message:"User role cannot be verified, please try again",
        })
    }
}