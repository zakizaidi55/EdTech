import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import ReactStars from "react-rating-stars-component";
import IconBtn from '../../common/IconBtn';
import { createRating } from '../../../services/operations/courseDetailsAPI';

function CourseReviewModal({setReviewModal}) {
    const {user} = useSelector((state) => state.profile);
    const {token} = useSelector((state) => state.auth);
    const{courseEntireData} = useSelector((state) => state.viewCourse);
    const {register, handleSubmit, setValue, formState:{errors}} = useForm();

    useEffect(() => {
        setValue("courseExperience","");
        setValue("courseRating", "");
    }, [])

    const onSubmit = async(data) => {
        await createRating({
            courseId:courseEntireData._id,
            rating:data.courseRating,
            review:data.courseExperience
        }, token)

        setReviewModal(false);
    }


    const ratingChange = (newRating) => {
        setValue("courseRating", newRating);
    }

  return (
    <div>
        <div>
            {/* Modal Header */}
            <div>
                <p>Add Review</p>
                <button onClick={setReviewModal(false)}
                >Close
                    {/* Icon pending */}
                </button>
            </div>
            
            {/* Body */}
            <div>
                <div>
                    <img src={user?.image}
                    alt='user Image'
                    className='aspect-square w-[50px] rounded-full object-cover'
                    />

                    <div>
                        <p>{user?.firstName} {user?.lastName}</p>
                        <p>Posting Publicly</p>
                    </div>
                </div>


                <form onSubmit={handleSubmit(onSubmit)}>
                    <ReactStars
                        count={5}
                        onChange={ratingChange}
                        size={24}
                        activeColor="#ffd700"
                    />

                    <div>
                        <label htmlFor='courseExperience'>
                            Add Your Experience
                        </label>

                        <textarea
                            id='courseExperience'
                            placeholder='Add your Experience here'
                            {...register("courseExperience", {required:true})}
                            className='form-style min-h-[130px] w-full'
                        />

                        {
                            errors.courseExperience && (
                                <span>
                                    Please add your Experience
                                </span>
                            )
                        }
                    </div>

                    <div>
                        <button onClick={() => setReviewModal(false)}
                        >Cancel</button>

                        <IconBtn
                            text="Save"
                        />
                    </div>
                </form> 
            </div>
        </div>
    </div>
  )
}

export default CourseReviewModal