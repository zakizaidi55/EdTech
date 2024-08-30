import React from 'react'
import { useForm } from 'react-hook-form'
import IconBtn from '../../../../common/IconBtn';

function CourseBuilderForm() {
    const {register, handleSubmit, setValue, formState:{errors}} = useForm();
  return (
    <div className='text-white'>
        <p>Course Builder</p>
        <form>
            <div>
                <label>Section Name <sup>*</sup></label>
                <input
                    id='sectionName'
                    placeholder='Add section Name'
                    {...register("sectionName", {required:true})}
                    className='w-full'
                />

                {errors.sectionName && (
                    <span>Section name is required</span>
                )}
            </div>

            <div>
                <IconBtn
                    type="submit"
                />
            </div>
        </form>
    </div>
  )
}

export default CourseBuilderForm