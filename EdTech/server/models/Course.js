const mongoose = require("mongoose");


const courseSchema = new mongoose.Schema ({
    courseName: {
        type:String,
        trim:true,
        required:true,
    },

    courseDescription:{
        type:String,
        trim:true,
        requried:true,
    },


    instructor:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        requried:true,
    },

    whatYouWillLearn:{
        type:String,
    },

    courseContent : [
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Section"
        }
    ],

    ratingAndReview :[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"RatingAndReview",
        }
    ],

    price:{
        type:Number,
    },

    thumbnail:{
        type:String,
    },

    tag:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Tag",
    },

    studentEnrolled :[ 
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true,
        }
    ],


});

module.exports = mongoose.model("Course", courseSchema);