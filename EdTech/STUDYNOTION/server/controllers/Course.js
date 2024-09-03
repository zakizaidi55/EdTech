const Course = require("../models/Course");
// const Tag = require("../models/Tag");
const Category = require("../models/Category");
const User = require("../models/User");
const {uploadImageToCloudinary} = require("../utils/imageUploader");

require("dotenv").config();

// create course handler functions
// exports.createCourse = async(req, res) => {
//     try {

//         // fetch data
//         const {courseName, courseDescription, whatYouWillLearn, price, category, tag} = req.body;

//         // get thumbnail
//         const thumbnail = req.body.thumbnailImage;
        
//         // validations
//         if(!courseName || !courseDescription || !whatYouWillLearn || !price || !category || !tag) {
//             return res.status(400).json({
//                 success:false,
//                 message:"All the fields are mandatory",
//             });
//         }

//         // check for instructor
//         const userId = req.user.id;
//         const instructorDetails = await User.findById(userId);
//         console.log("Instructor Details: ", instructorDetails);

//         if(!instructorDetails)  {
//             return res.status(400).json({
//                 success:false,
//                 message:'Instructor details not found',
//             })
//         }

//         // check given tag details
//         const categorysDetails = await Category.findById(category);
//         if(!categorysDetails) {
//             return res.status(400).json({
//                 success:false,
//                 message:"Tag details is incorrect",
//             })
//         }

//         // upload to the cloudinary
//         const thumbnailImage = await uploadImageToCloudinary(thumbnail, process.env.FOLDER_NAME);


//         // create an entry fot new course
//         const newCourse = await Course.create({
//             courseName,
//             courseDescription,
//             instructor:instructorDetails._id,
//             whatYouWillLearn,
//             price,
//             category:categorysDetails._id,
//             tag:tagDetails._id,
//             thumbnail:thumbnailImage.secure_url,
//         }) 

//         // add the course to the user schema of instructor
//         await User.findByIdAndUpdate({_id:instructorDetails._id},
//             {
//                 $push:{
//                     course:newCourse._id,
//                 }
//             }    
//         );

//         // update the tag schema
//         await Category.findByIdAndUpdate({_id:categorysDetails._id},
//             {
//                 $push:{
//                     course:newCourse._id,
//                 }
//             }
//         );

//         return res.status(202).json({
//             success:true,
//             message:"New course created",
//         })

//     } catch(error) {
//         console.log("Error while creating the course");
//         return res.status(500).json({
//             success:false,
//             message:error.message,
//         })
//     }
// };

exports.createCourse = async (req, res) => {
    try {
      // Get user ID from request object
      const userId = req.user.id
  
      // Get all required fields from request body
      let {
        courseName,
        courseDescription,
        whatYouWillLearn,
        price,
        tag: _tag,
        category,
        status,
        instructions: _instructions,
      } = req.body
      // Get thumbnail image from request files
      const thumbnail = req.files.thumbnailImage
  
      // Convert the tag and instructions from stringified Array to Array
      const tag = JSON.parse(_tag)
      const instructions = JSON.parse(_instructions)
  
      console.log("tag", tag)
      console.log("instructions", instructions)
  
      // Check if any of the required fields are missing
      if (
        !courseName ||
        !courseDescription ||
        !whatYouWillLearn ||
        !price ||
        !tag.length ||
        !thumbnail ||
        !category ||
        !instructions.length
      ) {
        return res.status(400).json({
          success: false,
          message: "All Fields are Mandatory",
        })
      }
      if (!status || status === undefined) {
        status = "Draft"
      }
      // Check if the user is an instructor
      const instructorDetails = await User.findById(userId, {
        accountType: "Instructor",
      })
  
      if (!instructorDetails) {
        return res.status(404).json({
          success: false,
          message: "Instructor Details Not Found",
        })
      }
  
      // Check if the tag given is valid
      const categoryDetails = await Category.findById(category)
      if (!categoryDetails) {
        return res.status(404).json({
          success: false,
          message: "Category Details Not Found",
        })
      }
      // Upload the Thumbnail to Cloudinary
      const thumbnailImage = await uploadImageToCloudinary(
        thumbnail,
        process.env.FOLDER_NAME
      )
      console.log(thumbnailImage)
      // Create a new course with the given details
      const newCourse = await Course.create({
        courseName,
        courseDescription,
        instructor: instructorDetails._id,
        whatYouWillLearn: whatYouWillLearn,
        price,
        tag,
        category: categoryDetails._id,
        thumbnail: thumbnailImage.secure_url,
        status: status,
        instructions,
      })
  
      // Add the new course to the User Schema of the Instructor
      await User.findByIdAndUpdate(
        {
          _id: instructorDetails._id,
        },
        {
          $push: {
            courses: newCourse._id,
          },
        },
        { new: true }
      )
      // Add the new course to the Categories
      const categoryDetails2 = await Category.findByIdAndUpdate(
        { _id: category },
        {
          $push: {
            courses: newCourse._id,
          },
        },
        { new: true }
      )
      console.log("HEREEEEEEEE", categoryDetails2)
      // Return the new course and a success message
      res.status(200).json({
        success: true,
        data: newCourse,
        message: "Course Created Successfully",
      })
    } catch (error) {
      // Handle any errors that occur during the creation of the course
      console.error(error)
      res.status(500).json({
        success: false,
        message: "Failed to create course",
        error: error.message,
      })
    }
  }


exports.getAllCourses = async(req, res) => {
    try {
        const allCorses = await Course.find({}, {courseName:true,
                                                price:true,
                                                thumbnail:true,
                                                instructor:true,
                                                reatingAndReviews:true,
                                                studentEnrolled:true,}).populate("instructor").exec(); 
        

        return res.status(200).json({
            success:true,
            message:'All courses data fetched successfully',
            data:this.showAllCourses,
        })

    } catch(error) {
        console.log("Error while getting all the courses");
        return res.status(500).json ({
            success:false,
            message:error.message,
        })
    }
}


// get course Details
exports.getCourseDetails = async(req, res) => {
    try {
        // get id
        const {courseId} = req.body;
        // find course details
        const courseDetails = await Course.findOne(
                                            {_id:courseId}).populate({
                                                path:"instructor" ,
                                                populate:{
                                                    path:"additionalDetails",
                                                },
                                            })
                                            .populate("category")
                                            .populate("ratingAndReview")
                                            .populate({
                                                path:"courseContent",
                                                populate:{
                                                    path:"subSection",
                                                },
                                            }).exec()

        // validations
        if(!courseDetails) {
            return res.status(400).json({
                success:false,
                message:`Could not find the course with ${courseId}`, 
            })
        }


        // return response
        return res.status(200).json({
            success:true,
            message:'course showed successfully',
            data:courseDetails,
        })
    } catch(error) {
        console.log("Error in getCourseDetails");
        return res.status(500).json({
            success:false,
            message:'error in get course details',
            error:error.message,
        })
    }
}