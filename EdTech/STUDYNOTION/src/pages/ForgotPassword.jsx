import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from "react-router-dom";
import { useDispatch } from 'react-redux';
import {getPasswordResetToken} from "../services/operations/authAPI"

function ForgotPassword() {
    const {loading} = useSelector((state) =>state.auth);

    const [emailSent, setEmailSent] = useState(false);
    const [email, setEmail] = useState("");

    const dispatch = useDispatch();

    const handleOnSubmit = (e) => {
        e.preventDefault();
        dispatch(getPasswordResetToken(email, setEmailSent));
    }

  return (
    <div className='text-white'>
        {
            loading ? (
                <div className='flex justify-center items-center text-richblack-5 font-bold text-3xl'>
                    ...Loading
                </div>
               
            ) : 
            (
                <div>
                    <h1>
                        {
                            !emailSent ? "Reset your password" : "Check your Email"
                        }
                    </h1>

                    <p>
                        {
                            !emailSent ? "Have no fear. We'll email you instructions to reset your password. If you dont have access to your email we can try account recovery" 
                            : `We have sent the reset email to ${email}`
                        }
                    </p>

                    <form onSubmit={handleOnSubmit}>
                        {
                            !emailSent && (
                                <label>
                                    <p>Email Address*</p>
                                    <input
                                        
                                        required
                                        type="email"
                                        name="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Enter email address"
                                        className="form-style w-full text-richblue-900"
                                    />
                                </label>
                            )
                        }

                        <button type='submit'>
                            {
                                !emailSent ? "Reset password" : "Sent Email"
                            }
                        </button>
                    </form>

                    <div>
                        <Link to="/login">
                            <p>Back to Login</p>
                        </Link>
                    </div>

                </div>
            )
        }
    </div>
  )
}

export default ForgotPassword