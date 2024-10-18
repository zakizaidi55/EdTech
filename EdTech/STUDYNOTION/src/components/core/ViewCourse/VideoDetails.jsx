import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { markLectureAsComplete } from '../../../services/operations/courseDetailsAPI';
import { updateCompletedLectures } from '../../../reducers/slices/viewCourseSlice';

function VideoDetails() {

    const {courseId, sectionId, subSectionId} = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const playerRef = useRef();
    const {token} = useSelector((state) => state.auth);
    const location = useLocation();

    const {
        courseSectionData,
        courseEntireData,
        completedLectures,
    } = useSelector((state)=> state.viewCourse);

    const [videoData, setVideoData] = useState([]);
    const [videoEnded, setVideoEnded] = useState(false);
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        const setVideoSpecificDetails = async() =>{
            if(!courseSectionData.length) {
                return;
            }

            if(!courseId && !sectionId && !subSectionId)  {
                navigate("/dashboard/enrolled-courses")
            }

            else{
                // lets assume all three fields are present

                const filteredData = courseSectionData.filter((course) => course._id === sectionId);

                const filteredVideoData = filteredData?.[0].subsection.filter((data) => data._id === subSectionId);

                setVideoData(filteredVideoData[0]);
                setVideoEnded(false);
            }
        }

        setVideoSpecificDetails();
    },[location.pathname, courseSectionData, courseEntireData])

    const isFirstVideo = () => {
        const currentSectionIndex = courseSectionData.findIndex((data) => data._id === sectionId);
        const currentSubSectionIndex = courseSectionData[currentSectionIndex].subSectionId.findIndex((data) = data._id === subSectionId);

        if(currentSectionIndex == 0 && currentSubSectionIndex == 0) {
            return true;
        }

        else {
            return false;
        }
    }

    const isLastVideo = () => {
        const currentSectionIndex = courseSectionData.findIndex((data) => data._id === sectionId);

        const noOfSubSections = courseSectionData[currentSectionIndex].subSection.length;

        const currentSubSectionIndex = courseSectionData[currentSectionIndex].subSectionId.findIndex((data) = data._id === subSectionId);

        if(currentSectionIndex === courseSectionData.lenght && currentSubSectionIndex === noOfSubSections-1) {
            return true;
        }


        else {
            return false;
        }


    }

    const goToNextVideo = () => {
        const currentSectionIndex = courseSectionData.findIndex((data) => data._id === sectionId);

        const noOfSubSections = courseSectionData[currentSectionIndex].subSection.length;

        const currentSubSectionIndex = courseSectionData[currentSectionIndex].subSectionId.findIndex((data) = data._id === subSectionId);

        if(currentSubSectionIndex != noOfSubSections-1) {
            // it means in current section, more videos are present
            const nextSubSectionId = courseSectionData[currentSectionIndex].subSection[currentSectionIndex + 1]._id;

            // move to this video
            navigate(`view-course/${courseId}/section/${sectionId}/$sub-section/${nextSubSectionId}`);
        }

        else {
            // different section
            const nextSectionId = courseSectionData[currentSectionIndex+1];
            const firstSubSectionId = courseSectionData[currentSectionIndex+1].subSection[0]._id;

            // move to this video
            navigate(`/view-course/${courseId}/sectionId/${nextSectionId}/sub-section/${firstSubSectionId}`);
        }

    }

    const goToPrevVideo = () => {
        const currentSectionIndex = courseSectionData.findIndex((data) => data._id === sectionId);

        const noOfSubSections = courseSectionData[currentSectionIndex].subSection.length;

        const currentSubSectionIndex = courseSectionData[currentSectionIndex].subSectionId.findIndex((data) = data._id === subSectionId);

        if(currentSubSectionIndex != 0) {
            // same section previous video
            const prevSubSectionId = courseSectionData[currentSectionIndex].subSection[currentSubSectionIndex-1]._id;
            
            navigate(`view-course/${courseId}/section/${sectionId}/$sub-section/${prevSubSectionId}`);
        }

        else {
            // different section last video
            const prevSectionId = courseSectionData[currentSectionIndex-1]._id;
            const prevSubSectionLength = courseSectionData[currentSectionIndex-1].subSection.length;
            const prevSubSectionId = courseSectionData[currentSectionIndex-1].subSection[prevSubSectionLength-1]._id;

            navigate(`view-course/${courseId}/section/${prevSectionId}/$sub-section/${prevSubSectionId}`)
        }
    }

    const handleLectureCompletion = async() => {
        setLoading(true);

        const res = await markLectureAsComplete();
        // state update
        if(res) {
            dispatch(updateCompletedLectures(subSectionId));
        }
        
        setLoading(false);
    }


  return (
    <div>

    </div>
  )
}

export default VideoDetails