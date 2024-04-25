const Section = require("../models/Section");
const Course = require("../models/Course");

exports.createSection = async(req, res) => {
    try {
        // data fetch
        const [sectionName, courseId] = req.body;
        // data validations
        if(!courseId || !sectionName) {
            return res.status(400).json({
                success:false,
                message:'Missing properties'
            })
        }
        // create section
        const newSection = await Section.create({sectionName});
        // update the course with section object id
        const updatedCourseDetails = await Course.findByIdAndUpdate(courseId,
                                                    {
                                                        $push:{
                                                            courseContent:newSection._id,
                                                        }
                                                    },{new:true},
                                                    )
        // return res 
        return res.status(202).json({
            success:true,
            message:'Section is created successfully',
        })
    } catch (error) {
        console.log("Error while creating the section");
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    }
};


exports.updateSection = async(req, res) => {
    try {
        // fetch data
        const {sectionName,sectionId} = req.body;
        // data validations
        if(!sectionName || !sectionId) {
            return res.status(404).json({
                success:false,
                message:'Data is missing',
            })
        }
        // update the data
        const section = await Section.findByIdAndUpdate(sectionId, {sectionName}, {new:true});
        // return res
        return res.status(202).json({
            success:true,
            message:'Section is updated successfully',
        })
    } catch(error) {
        console.log("Error while updating the section");
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    }
};



exports.deleteSection = async(req, res) => {
    try {
        // get id -> assuming that we are sending ID in params
        const {sectionId} = req.params 

        // use findByID and delete
        await Section.findByIdAndDelete(sectionId);

        // return res
        return res.status(200).json({
            success:true,
            message:"Section deleted successfully",
        });

    } catch(error) {
        console.log("Error while deleting the section");
        return res.status(500).json({
            success:false,
            message:"Unabel to delete section",
            error:error.message

        })
    }
}