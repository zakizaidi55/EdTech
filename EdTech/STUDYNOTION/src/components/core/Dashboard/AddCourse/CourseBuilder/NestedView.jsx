import { useState } from "react"
import { AiFillCaretDown } from "react-icons/ai"
import { FaPlus } from "react-icons/fa"
import { MdEdit } from "react-icons/md"
import { RiDeleteBin6Line } from "react-icons/ri"
import { RxDropdownMenu } from "react-icons/rx"
import { useDispatch, useSelector } from "react-redux"

import {deleteSection,deleteSubSection} from "../../../../../services/operations/courseDetailsAPI"
import { setCourse } from "../../../../../reducers/slices/courseSlice"
import ConfirmationModal from "../../../../common/ConfirmationModal"
import SubSectionModal from "./SubSectionModal"
import { BiSolidDownArrow } from "react-icons/bi"

export default function NestedView({ handleChangeEditSectionName }) {
  const { course } = useSelector((state) => state.course)
  const { token } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  // States to keep track of mode of modal [add, view, edit]
  const [addSubSection, setAddSubsection] = useState(null)
  const [viewSubSection, setViewSubSection] = useState(null)
  const [editSubSection, setEditSubSection] = useState(null)
  // to keep track of confirmation modal
  const [confirmationModal, setConfirmationModal] = useState(null)

  const handleDeleleSection = async (sectionId) => {
    const result = await deleteSection({
      sectionId,
      courseId: course._id,
      token,
    })
    if (result) {
      dispatch(setCourse(result))
    }
    setConfirmationModal(null)
  }

  const handleDeleteSubSection = async (subSectionId, sectionId) => {
    const result = await deleteSubSection({ subSectionId, sectionId, token })
    if (result) {
      // update the structure of course
      const updatedCourseContent = course.courseContent.map((section) =>
        section._id === sectionId ? result : section
      )
      const updatedCourse = { ...course, courseContent: updatedCourseContent }
      dispatch(setCourse(updatedCourse))
    }
    setConfirmationModal(null)
  }

  return (
    <>
      <div className="rounded-lg bg-richblack-700 p-6 px-8" id="nestedViewContainer">
        {
          course?.courseContent?.map((section) => (
            <details>
              <summary className="flex items-center justify-between gap-x-3 border-b-2">
                <div className="flex items-center gap-x-3">
                  <RxDropdownMenu/>
                  <p>{section.sectionName}</p>
                </div>
                <div>
                  <button 
                  onClick={() => handleChangeEditSectionName(section._id, section.sectionName)}
                  className="flex items-center gap-x-3">
                    <MdEdit/>
                  </button>

                  <button
                  onClick={() => {
                    setConfirmationModal({
                      text1:"Delete this section",
                      text2:"All the lectures will be deleted",
                      btn1Text:"Delete",
                      btn2Text:"Cancel",
                      btn1Handler: () => handleDeleleSection(section._id),
                      btn2Handler:() => setConfirmationModal(null),
                    })
                  }}
                  >
                    <RiDeleteBin6Line/>
                  </button>
                  
                  <span> | <BiSolidDownArrow className={`text-xl text-richblack-300 `}/></span>
                </div>
              </summary>
                  {
                    section.subSection.map((data ) => (
                      <div key = {data?.id}
                      onClick={() => setViewSubSection(data)}
                      className="flex items-center justify-between gap-x-3 border-b-2"
                      >
                        <div className="flex items-center gap-x-3">
                          <RxDropdownMenu/>
                          <p>{data.title}</p>
                        </div>

                        <div className="flex items-center gap-x-3">
                          <button onClick={() => setEditSubSection({...data, sectionId:section._id})}>
                            <MdEdit/>
                          </button>

                          <button
                          onClick={() => {
                            setConfirmationModal({
                              text1:"Delete this sub section",
                              text2:"Selected Lecture will be deleted",
                              btn1Text:"Delete",
                              btn2Text:"Cancel",
                              btn1Handler: () => handleDeleleSection(section._id),
                              btn2Handler:() => setConfirmationModal(null),
                            })
                          }}
                          >
                    <RiDeleteBin6Line/>
                  </button>
                        </div>
                      </div>
                    ))
                  }
            </details>
          ))
        }
      </div>
    </>
  )
}