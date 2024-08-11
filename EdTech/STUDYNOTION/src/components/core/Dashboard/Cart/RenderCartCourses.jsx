import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import ReactStars from "react-rating-stars-component";
import { GiNinjaStar } from 'react-icons/gi';
import { RiDeleteBin6Line } from 'react-icons/ri';

function RenderCartCourses() {
    const {cart} = useSelector((state) => state.cart);
    const dispatch = useDispatch();

  return (
    <div>
        {
            cart.map((course, index) => (
                <div>
                    <div>
                        <img src={course?.thumbnail}/>
                        <div>
                            <p>{course?.courseName}</p>
                            <p>{course?.category?.name}</p>
                            <div>
                                <span>4.8</span>
                                <ReactStars
                                    count={5}
                                    size={20}
                                    edit={false}
                                    activeColor="#ffd700"
                                    emptyIcon={<GiNinjaStar/>}
                                    fullIcon={<GiNinjaStar/>}
                                />
                                <span>{course?.ratingAndReviews?.lenght} Ratings</span>
                            </div>
                        </div>

                    </div>

                    <div>
                        <button
                        onClick={() => dispatch(course._id)}
                        >
                            <RiDeleteBin6Line/>
                            <span>Delete</span>
                        </button>
                        <p>{course?.price}</p>
                    </div>
                </div>
            ))
        }
    </div>
  )
}

export default RenderCartCourses