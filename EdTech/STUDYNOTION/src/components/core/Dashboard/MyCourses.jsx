import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import { fetchInstructorCourses } from '../../../services/operations/courseDetailsAPI';
import IconBtn from '../../common/IconBtn';
import CourseTable from './InstructorCourses/CourseTable';

function MyCourses() {
    const {token} = useSelector((state) => state.auth);
    const navigate = useNavigate(); 
    const[courses, setCourses] = useState([]);

    useEffect(() => {
        const fetchCourses = async() => {
            const result = await fetchInstructorCourses(token);

            if(result) {
                // console.log("PRINTING THE INSTRUCTOR COURSES", result);
                setCourses(result);

            }
        }

        fetchCourses();
    }, [])
    

  return (
    <div>
        <div>
            <h1>My Courses</h1>
            <IconBtn
                
            />
        </div>

        {
            courses && <CourseTable courses = {courses} setCourses = {setCourses}/>
        
        }
    </div>
  )
}

export default MyCourses