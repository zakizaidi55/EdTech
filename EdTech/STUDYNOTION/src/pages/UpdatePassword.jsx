import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { resetPassword } from '../services/operations/authAPI';
import { Link, useLocation, useParams } from 'react-router-dom';
import { AiFillEyeInvisible, AiFillEye } from "react-icons/ai";

function UpdatePassword() {
    const {loading} = useSelector((state) => state.auth);

    const [formData, setFormData] = useState({
        password:"",
        confirmPassword:""
    })
    
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const dispatch = useDispatch();
    const location = useLocation();
    const{password, confirmPassword} = formData;


    const handleOnChange = (e) => {
        setFormData((prevData) => (
            {
                ...prevData,
                [e.target.name]:e.target.value,
            }
        )
        )
    }

    const handleOnSubmit = (e) => {
        e.preventDefault();
        const token = location.pathname.split('/').at(-1);
        // console.log("printing token in update password page ", token);
        dispatch(resetPassword(password, confirmPassword, token));
    }

  return (
    <div className='text-white'>
        {
            loading ? (
                <div>
                    Loading...
                </div>
            ) : 
            (
                <div>
                    <h1>
                    Choose new password
                    </h1>
                    <p>Almost done. Enter your new password and youre all here </p>
                    <form onSubmit={handleOnSubmit}>
                        <label>
                            <p>New Password <sup>*</sup></p>
                            <input
                                required
                                type={showPassword ? "text": "password"}
                                name='password'
                                value={password}
                                onChange={handleOnChange}
                                className='w-full p-6 bg-richblack-600 text-richblack-5'
                            />

                            <span
                            onClick={() => setShowPassword((prev) => !prev)}
                            >
                                {
                                    showPassword ? <AiFillEyeInvisible fontSize={24}/> : <AiFillEye fontSize={24}/>
                                }
                            </span>
                        </label>

                        <label>
                            <p>Confirm New Password <sup>*</sup></p>
                            <input
                                required
                                type={showConfirmPassword ? "text": "password"}
                                name='confirmPassword'
                                value={confirmPassword}
                                onChange={handleOnChange}
                                className='w-full p-6 bg-richblack-600 text-richblack-5'
                            />

                            <span
                            onClick={() => setShowConfirmPassword((prev) => !prev)}
                            >
                                {
                                    showConfirmPassword ? <AiFillEyeInvisible fontSize={24}/> : <AiFillEye fontSize={24}/>
                                }
                            </span>
                        </label> 
                        <button type='submit'>
                            Reset Password
                        </button>

                    </form>

                    <div>
                        <Link to='/login'>
                            <p>Back to login</p>
                        </Link>
                    </div>
                </div>
            )
        }
    </div>
  )
}

export default UpdatePassword