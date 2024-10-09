const { default: mongoose, Mongoose } = require("mongoose");
const {instance} = require("../config/razorpay");
const Course = require("../models/Course");
const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const { courseEnrollmentEmail } = require("../mail/templates/courseEnrollmentEmail");


// capture the payment and initiate the razorpay order

exports.capturePayment = async(req, res) => {
    const {courses} = eeq.body;
    const userId = req.user.id;

    if(courses.length === 0) {
        return res.json({
            success:false,
            message:"Please provide course Id",
        })
    }

    let totalAmount = 0;

    for(const course_id of courses) {
        let course;

        try {
            course = await Course.findById(course_id);
            if(!course) {
                res.status(200).json({
                    success:false,
                    message:"Could not find the course",
                })
            }

            const uid = new Mongoose.Types.ObjectId(userId);

            if(course.studentsEnrolled.include(uid)) {
                // already enrolled to the course
                return res.status(200).json({
                    success:false,
                    message:"Student is already enrolled",
                })
            }

            totalAmount += course.price;

        } catch(error) {
            console.log("Issue in Capture Payment");
            console.log(error);

            return res.status(500).json({
                success:false,
                message:error.message,
            })
        }
    }


    const options = {
        amount : totalAmount * 100,
        currency: "INR",
        receipt: Math.random(Data.now()).toString(),
    }

    // create order
    try {
        const paymentResponse = await instance.orders.create(option);
        res.statue({
            success:true,
            message:paymentResponse,
        })
    } catch(error) {
        console.log("Error while payment response");
        console.log(error);

        return res.status(500).json({
            success:false,
            message:"Could not initiate order",
        })
    } 

}


exports.verifyPayment = async(req, res) => {
    const razorpay_order_id = req.body?.razorpay_order_id;
    const razorpay_payment_id = req.body?.razorpay_payment_id;
    const razorpay_signature = req.body?.razorpay_signature;

    const courses = req.body?.courses;
    const userId = req.user.id;

    if(!razorpay_order_id || 
    !razorpay_payment_id ||
    !razorpay_signature ||
    !userId || !courses) {
        return res.status(200).json({
            success:false,
            message:"Payment failed",
        })
    }
    
    let body = razorpay_order_id + "|"  + razorpay_payment_id;
    const expectedSignature = crypto.createHmac("sha256", process.env.RAZORPAY_SERCET).digest("hex");
    
    if(expectedSignature === razorpay_signature) {
        // enrolled the student
        await enrolledStudent(courses, userId,res);

        // return res
        return res.status(200).json({
            success:true,
            message:"Payment Verified"
        })
    }

    return res.status(404).json({
        success:false,
        message:"Payment Failed"
    })

}


const enrolledStudent = async(courses, userId, res) => {
    
    if(!courses || !userId) {
        return res.status(400).json({
            success:false,
            message:"Please provide data course or user id"
        })
    }

    for(const courseId in courses) {
        try {   
            const enrolledCourse = await Course.findOneAndUpdate({_id:courseId},
                {$push:{studentsEnrolled:userId}},
                {new:true},
            )
    
            if(!enrolledCourse) {
                return res.status(500).json({
                    success:false,
                    message:"Course not found",
                })
            }
    
            // find the student and add to the course to their enrolled courses
    
            const enrolledStudent = await User.findByIdAndUpdate({_id:userId},
                {$push: {courses:courseId}},
                {new:true},
            )
    
            // send the mail
    
            const emailResponse = await mailSender(enrolledStudent.email, 
                `Successfully Enrolled into the course ${enrolledCourse.courseName}`,
                courseEnrollmentEmail(enrolledCourse.courseName, `${enrolledStudent.firstName}`)
                
            )
    
            console.log("Email sent Successfully", emailResponse.response);
        } catch(error) {
            console.log("error while enrolling the student");
            return res.status(500).json({
                success:false,
                message:error.message,
            })
        }
    } 
}



// exports.capturePayment = async(req, res) => {
//     // get courseID and userID
//     const {course_Id} = req.body;
//     const userId = req.user.id;
//     // validations
//     // valid courseID
//     if(!course_Id) {
//         return res.json({
//             suceess:false,
//             message:'Please provide valid course id',
//         })
//     }
//     // valid courseDetails
//     let course;
//     try {
//         course = await Course.findById(course_Id);
//         if(!course ) {
//             return res.json({
//                 success:false,
//                 message:"Could not find the course",
//             });
//         }

//         // user already purchased the same course
//         const uid = new mongoose.Types.ObjectId(userId);
//         if(course.studentsEnrolled.includes(uid)) {
//             return res.status(200).json ({
//                 success:false,
//                 message:'Student is already enrolled',
//             })
//         }

//     } catch (error) {
//         console.log("Error while finding the course");
//         return res.status(500).json({
//             success:false,
//             message:error.message,
//         })
//     }
//     // order create
//     const amount = course.price;
//     const currency = "INR";

//     const options = {
//         amount : amount*100,
//         currency,
//         receipt:Math.random(Date.now()).toString(),
//         notes:{
//             courseId:course_Id,
//             userId,
//         }

//     }
//     try {
//         // initiase the payment using razorpay
//         const paymentResponse = await instance.orders.create(options);
//         console.log(paymentResponse);
//         // return Response
//         return res.status(200).json({
//             success:true,
//             courseName:course.courseName,
//             courseDescription:course.courseDescription,
//             thumbnail:course.thumbnail,
//             orderId:paymentResponse.id,
//         })
        
//     } catch(error) {
//         console.log("Error while capturing the payment");
//         return res.status(500).json({
//             success:false,
//             message:'could not initiate the order',
//         })
//     }

    
// };

// // verify signature of razorpay and server

// exports.verifySignature = async(req, res) => {
//     const webhookSecret = "12345678";
    
//     const signature = req.header["x-razorpay-signature"];

//     const shasum = crypto.creteHmac("sha256", webhookSecret);

//     shasum.update(JSON.stringify(req.body));
//     const digest = shasum.digest("hex");

//     if(signature === digest) {
//         console.log("Payment is authorised");

//         const {courseId, userId} = req.body.payloads.payment.entity.notes;

//         try {
//             // fulfill the action
//             // find the course and enrolled in it
//             const enrolledCourse = await Course.findOneAndUpdate(
//                                             {_id:courseId},
//                                             {$push:{studentEnrolled:userId}},
//                                             {new:true},
//             );

//             if(!enrolledCourse) {
//                 return res.status(500).json({
//                     success:false,
//                     message:'Could not found',
//                 })
//             }

//             console.log(enrolledCourse);

//             // find the student and add the course to their list enrolled courses
//             const enrolledStudent  = await User.findOneAndUpdate({_id:userId},
//                                                                 {$push:{course:courseId}},
//                                                                 {new:true},
//             );

//             console.log(enrolledStudent);

//             const emailResponse = await mailSender(enrolledStudent.email,
//                                                     "congratulations from codehelp",
//                                                     "Congratulations you are onborderd into new codehelp course"
//                                                     );


//             console.log(emailResponse);

//             return res.status(200).json({
//                 success:true,
//                 message:"Signature verified and course added"
//             })
//         } catch (error) {
//             console.log("Error while verifying the signature");
//             return res.status(500).json({
//                 success:false,
//                 message:error.message,
//             })
//         }
//     }

//     else {
//         return res.staus(400).json({
//             success:false,
//             message:"Invalid request",
//         })
//     }


// }
