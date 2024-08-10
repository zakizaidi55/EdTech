import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { getUserEnrolledCourses } from '../../../services/operations/profileAPI';
import ProgressBar from '@ramonak/react-progress-bar';

function EnrolledCourses() {
    const {token} = useSelector((state) => state.auth);

    const [enrolledCourses, setEnrolledCourses] = useState(null);

    const getEnrolledCourses = async() => {
      try {
        const response = await  getUserEnrolledCourses(token);
        setEnrolledCourses(response);
      } catch(error) {
          console.log("unable to fetch the getEnrolled course call")
          console.error(error);
        }
    }

    useEffect(() => {
      getEnrolledCourses();
    },[])
  return (
    <div className='text-white'>
        <div>Enrolled Courses</div>
        {
          !enrolledCourses ? (<div>
            Loading....
          </div>) : enrolledCourses.length ? (<p>You have not enrolled course yet</p>) : 
          (
            <div>
              <div>
                <p>Course Name</p>
                <p>Duration</p>
                <p>Progress</p>
              </div>
              
              {
                enrolledCourses.map((course, index) => (
                  <div>
                    <div>
                      {/* thumbnail */}
                      <img src= {course.thumbnail}/>
                      <div>
                        <p>{course.courseName}</p>
                        <p>{course.description.length }</p>
                        {/* <p>{course.description.length > 50 ? (course.description.substr(0,10)) : (course.description)}</p>  keep this part optional*/} 
                      </div>
                    </div>
                    <div>
                      {course?.totalDuraion}
                    </div>
                    <div>
                      <p>Progress: {course?.progressPercentage || 0} %</p>
                      <ProgressBar
                        completed={course?.progressPercentage || 0}
                        height='8px'
                        isLabelVisible='false'
                      />
                    </div>

                  </div>
                ))
              }
            </div>
            
          )
        }

    </div>
  )
}

export default EnrolledCourses