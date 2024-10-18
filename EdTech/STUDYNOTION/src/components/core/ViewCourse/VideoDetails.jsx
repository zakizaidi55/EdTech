import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { markLectureAsComplete } from '../../../services/operations/courseDetailsAPI';
import { updateCompletedLectures } from '../../../reducers/slices/viewCourseSlice';
import {BigPlayButton, Player} from "video-react";
import 'video-react/dist/video-react.css'; // import css
import { AiFillPlayCircle  } from 'react-icons/ai';
import IconBtn from '../../common/IconBtn';

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
        const currentSectionIndex = courseSectionData.findIndex((data) => data._id === sectionId)
        const currentSubSectionIndex = courseSectionData[currentSectionIndex].subSectionId.findIndex((data) => data._id === subSectionId);

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

        const currentSubSectionIndex = courseSectionData[currentSectionIndex].subSectionId.findIndex((data) => data._id === subSectionId);

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

        const currentSubSectionIndex = courseSectionData[currentSectionIndex].subSectionId.findIndex((data) => data._id === subSectionId);

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

        const currentSubSectionIndex = courseSectionData[currentSectionIndex].subSectionId.findIndex((data) => data._id === subSectionId);

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
    <div className="flex flex-col gap-5 text-white">
      {!videoData ? (
       <div>
        No video Found
       </div>
      ) : (
        <Player
          ref={playerRef}
          aspectRatio="16:9"
          playsInline
          onEnded={() => setVideoEnded(true)}
          src={videoData?.videoUrl}
        >
          <BigPlayButton position="center" />
          {/* Render When Video Ends */}
          {videoEnded && (
            <div
              style={{
                backgroundImage:
                  "linear-gradient(to top, rgb(0, 0, 0), rgba(0,0,0,0.7), rgba(0,0,0,0.5), rgba(0,0,0,0.1)",
              }}
              className="full absolute inset-0 z-[100] grid h-full place-content-center font-inter"
            >
              {!completedLectures.includes(subSectionId) && (
                <IconBtn
                  disabled={loading}
                  onclick={() => handleLectureCompletion()}
                  text={!loading ? "Mark As Completed" : "Loading..."}
                  customClasses="text-xl max-w-max px-4 mx-auto"
                />
              )}
              <IconBtn
                disabled={loading}
                onclick={() => {
                  if (playerRef?.current) {
                    // set the current time of the video to 0
                    playerRef?.current?.seek(0)
                    setVideoEnded(false)
                  }
                }}
                text="Rewatch"
                customClasses="text-xl max-w-max px-4 mx-auto mt-2"
              />
              <div className="mt-10 flex min-w-[250px] justify-center gap-x-4 text-xl">
                {!isFirstVideo() && (
                  <button
                    disabled={loading}
                    onClick={goToPrevVideo}
                    className="blackButton"
                  >
                    Prev
                  </button>
                )}
                {!isLastVideo() && (
                  <button
                    disabled={loading}
                    onClick={goToNextVideo}
                    className="blackButton"
                  >
                    Next
                  </button>
                )}
              </div>
            </div>
          )}
        </Player>
      )}

      <h1 className="mt-4 text-3xl font-semibold">{videoData?.title}</h1>
      <p className="pt-2 pb-6">{videoData?.description}</p>
    </div>
  )
}

export default VideoDetails