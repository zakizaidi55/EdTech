const { default: mongoose } = require("mongoose");
const {instance} = require("../config/razorpay");
const Course = require("../models/Course");
const User = require("../models/User");
const mailSender = require("../utils/mailSender");
// const {courseEnrollmentEmail} = requestAnimationFrame


// capture the payment and initiate the razorpay order

exports.capturePayment = async(req, res) => {
    // get courseID and userID
    const {course_Id} = req.body;
    const userId = req.user.id;
    // validations
    // valid courseID
    if(!course_Id) {
        return res.json({
            suceess:false,
            message:'Please provide valid course id',
        })
    }
    // valid courseDetails
    let course;
    try {
        course = await Course.findById(course_Id);
        if(!course ) {
            return res.json({
                success:false,
                message:"Could not find the course",
            });
        }

        // user already purchased the same course
        const uid = new mongoose.Types.ObjectId(userId);
        if(course.studentsEnrolled.includes(uid)) {
            return res.status(200).json ({
                success:false,
                message:'Student is already enrolled',
            })
        }

    } catch (error) {
        console.log("Error while finding the course");
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    }
    // order create
    const amount = course.price;
    const currency = "INR";

    const options = {
        amount : amount*100,
        currency,
        receipt:Math.random(Date.now()).toString(),
        notes:{
            courseId:course_Id,
            userId,
        }

    }
    try {
        // initiase the payment using razorpay
        const paymentResponse = await instance.orders.create(options);
        console.log(paymentResponse);
        // return Response
        return res.status(200).json({
            success:true,
            courseName:course.courseName,
            courseDescription:course.courseDescription,
            thumbnail:course.thumbnail,
            orderId:paymentResponse.id,
        })
        
    } catch(error) {
        console.log("Error while capturing the payment");
        return res.status(500).json({
            success:false,
            message:'could not initiate the order',
        })
    }

    
};

// verify signature of razorpay and server

exports.verifySignature = async(req, res) => {
    const webhookSecret = "12345678";
    
    const signature = req.header["x-razorpay-signature"];

    const shasum = crypto.creteHmac("sha256", webhookSecret);

    shasum.update(JSON.stringify(req.body));
    const digest = shasum.digest("hex");

    if(signature === digest) {
        console.log("Payment is authorised");

        const {courseId, userId} = req.body.payloads.payment.entity.notes;

        try {
            // fulfill the action
            // find the course and enrolled in it
            const enrolledCourse = await Course.findOneAndUpdate(
                                            {_id:courseId},
                                            {$push:{studentEnrolled:userId}},
                                            {new:true},
            );

            if(!enrolledCourse) {
                return res.status(500).json({
                    success:false,
                    message:'Could not found',
                })
            }

            console.log(enrolledCourse);

            // find the student and add the course to their list enrolled courses
            const enrolledStudent  = await User.findOneAndUpdate({_id:userId},
                                                                {$push:{course:courseId}},
                                                                {new:true},
            );

            console.log(enrolledStudent);

            const emailResponse = await mailSender(enrolledStudent.email,
                                                    "congratulations from codehelp",
                                                    "Congratulations you are onborderd into new codehelp course"
                                                    );


            console.log(emailResponse);

            return res.status(200).json({
                success:true,
                message:"Signature verified and course added"
            })
        } catch (error) {
            console.log("Error while verifying the signature");
            return res.status(500).json({
                success:false,
                message:error.message,
            })
        }
    }

    else {
        return res.staus(400).json({
            success:false,
            message:"Invalid request",
        })
    }


}
