const RatingAndReview  = require("../models/RatingAndReview");
const Course = require("../models/Course");
const { default: mongoose } = require("mongoose");

// create rating

exports.createRating = async(req, res) => {
    try {
        // get user id
        const userId = req.user.id;
        // fetch data from req body
        const {rating, review, courseId} = req.body;
        // check if user is enrolled or not
        const courseDetails = await Course.findOne({_id:courseId,
                                                    studentsEnrolled:{$eleMatch:{$eq:userId}}});
        if(!courseDetails ) {
            return res.status(404).json({
                succeess:false,
                message:'user is not enrolled for this course',
            })
        }
        // check if user already reviewed the course
        const alreadyReviewed = await RatingAndReview.findOne({user:userId,
                                                        course:courseId,});

        if(alreadyReviewed) {
            return res.status(403).json({
                succeess:false,
                message:'Course is already reviewd by the user',
            })
        }
        // create rating
        const ratingAndReview = await RatingAndReview.create({
                                                        rating, review, course:courseId,
                                                        user:userId,});
        // update course with this rating/review
        const updatedCourseDetails = await Course.findByIdAndUpdate({_id:courseId},
                                        {
                                            $push: {
                                                ratingAndReviews: ratingAndReview._id,
                                            }
                                        },{new:true})
        
        console.log(updatedCourseDetails);
        // return response

        return res.status(200).json({
            success:true,
            message:'Rating and Review created successfully',
            ratingAndReview,
        })
    } catch(error) {
        console.log("Error while creating Rating and Review");
        return res.status(500).json({
            success:false,
            message:"Error in creating the review",
            error:error.message,
        })
    }
}

// getAverageRating

exports.getAverageRating = async(req, res) => {
    try {
        // get course id
        const courseId = req.body.courseId;
        // calculate rating
        const result = await RatingAndReview.aggregate( [
            {
                $match: {
                    course:new mongoose.Types.ObjectId(courseId),
                },
            },
            {
                $group:{
                    _id:null,
                    averageRating:{$avg:"$rating"}
                }
            }
        ])

        if(result.length > 0) {
            return res.status(200).json({
                success:true,
                averageRating:result[0].averageRating,
            })
        }

        // if no review and rating exist
        return res.status(200).json({
            success:true,
            message:"Average Rating is 0, no rating is given till now",
        })
        // return rating
    } catch(error ) {
        console.log("Error while getting average Rating and Review");
        return res.status(500).json({
            success:false,
            message:"Error in Average rating the review",
            error:error.message,
        })  
    }
}

// getAllRating
exports.getAllRating = async(req, res) => {
    try {
        const allReviews = await RatingAndReview.find({})
                                .sort({rating:"desc"})
                                .populate({
                                    path:"user",
                                    select:"firstName lastName email image"
                                })
                                .populate({
                                    path:"course",
                                    select:"courseName",
                                })
                                .exec();
        
        return res.status(200).json({
            success:true,
            message:'All reviews Fetched successfully',
            data:allReviews,
        })

    } catch(error) {
        console.log("Error in the getAllRatingAndReviews");
        return res.status(500).json({
            succeess:true,
            message:'Error in all rating and reviews',
        })
    }
}