import React, { useState } from 'react'
import { useSelector } from 'react-redux'

function EnrolledCourses() {
    const {token} = useSelector((state) => state.auth);

    const [enrolledCourses, setEnrolledCourses] = useState(null);

    const getEnrolledCourses = async() => {
        try {
            // const response = await 
        } catch(error) {

        }
    }
  return (
    <div>
        <div>Enrolled Courses</div>

    </div>
  )
}

export default EnrolledCourses