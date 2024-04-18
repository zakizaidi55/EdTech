const SubSection = require("../models/SubSection");
const Section = require("../models/Section");
const { uploadImageToCloudinary } = require("../utils/imageUploader");

require("dotenv").config();

// create subsection
exports.createSubSection = async (req, res) => {
    try {
        // fetch data
        const {sectionId, title, timeDuration, description} = req.body;
        // extract file
        const video = req.files.videoFile;
        // validations
        if(!sectionId || !title || !timeDuration || !description || !video ) {
            return res.status(400).json({
                success:false,
                message:"All fields are mandatory",
            });
        }
        // upload video to the cloudinary
        const uploadDetails = await uploadImageToCloudinary(video,process.env.FOLDER_NAME);
        // create subsection
        const subSectionDetails = await SubSection.create({
            title:title,
            timeDuration:timeDuration,
            description:description,
            videoUrl:uploadDetails.secure_url,
        })
        // push the subsection id to section id
        const updatedSection = await Section.findByIdAndUpdate({id:sectionId},
                                                            {
                                                                $push:{
                                                                    subSection:subSectionDetails._id,
                                                                }    
                                                            },
                                                            {new:true});
                                                            // HW:log updated section here, after adding populate query
        // return res


    } catch(error) {    
        console.log("Error while creating the subsection");
        return res.status(500).json({
            success:false,
            message:"Subsection is not created successfully",
            error:error.message,
        })
    }
}

// update sub section
exports.updateSubSection = async (req, res) => {
	try {
		const {sectionId, title, timeDuration, description} = req.body;
		const section = await SubSection.findByIdAndUpdate(
			sectionId,
			{ title },
            {timeDuration},
            {description},
			{ new: true }
		);
		res.status(200).json({
			success: true,
			message: section,
		});
	} catch (error) {
		console.error("Error updating section:", error);
		res.status(500).json({
			success: false,
			message: "Internal server error",
		});
	}
};



// Delete sub section
exports.deleteSubSection = async (req, res) => {
	try {
		const { sectionId } = req.params;
		await SubSection.findByIdAndDelete(sectionId);
		res.status(200).json({
			success: true,
			message: "Section deleted",
		});
	} catch (error) {
		console.error("Error deleting section:", error);
		res.status(500).json({
			success: false,
			message: "Internal server error",
		});
	}
};