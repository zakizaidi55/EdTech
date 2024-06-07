import React, { useState } from 'react'
import { useSelector } from 'react-redux'

function ForgotPassword() {
    const {loading} = useSelector((state) =>state.auth);

    const [emailSent, setEmailSent] = useState(false);
    const [email, setEmail] = useState("");
  return (
    <div>
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
                            : `We have sent the reset email to${email}`
                        }
                    </p>

                    <form>
                         
                    </form>

                </div>
            )
        }
    </div>
  )
}

export default ForgotPassword