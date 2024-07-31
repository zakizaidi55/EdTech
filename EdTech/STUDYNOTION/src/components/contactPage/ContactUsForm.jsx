import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { apiConnector } from '../../services/apiconnector';
import { contactusEndpoint } from '../../services/apis';
import countrycode from "../../data/countrycode.json"

function ContactUsForm() {
    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState:{errors, isSubmitSuccessful}
    } = useForm();

    useEffect(() => {
      if(isSubmitSuccessful) {
        reset({
          email:"",
          firstname:"",
          lastname:"",
          message:"",
          phonenumber:""
        })
      }
    },[reset,isSubmitSuccessful])

    const submitContackForm = async(data) => {
      console.log("Logging data", data);

      try {
        setLoading(true);
        // const response = await apiConnector("POST", contactusEndpoint.CONTACT_US_API, data);
        const response = {status:"OK"};
        console.log("Logging the response", response);
        setLoading(false);
      } catch(error) {
        console.log("Error while submitting the contact us form", error);
        setLoading(false);
      }
    }
  return (
    <form onSubmit={handleSubmit(submitContackForm)}>
      <div className='flex flex-col gap-14'>
      <div className='flex flex-row gap-5'>
        {/* first name */}
        <div className='flex flex-col'>
          <label htmlFor='firstname'>First Name </label>
          <input
          className='text-black'
            type='text'
            name='firstname'
            id='firstname'
            placeholder='Enter your first Name'
            {...register("firstname", {required:true}) }
            
          />
          {
            errors.firstname && (
              <span>
                Please enter your first Name
              </span>
            )
          }
        </div>
          {/* last name */}
        <div className='flex flex-col'>
          <label htmlFor='lastname'>Last Name </label>
          <input
            className='text-black'
            type='text'
            name='lastname'
            id='lastname'
            placeholder='Enter your Last Name'
            {...register("firstname") }
            
          />
        </div>

      </div>
      

      <div>
          {/* email */}
          <div className='flex flex-col'>
          <label htmlFor='email'>Email Address</label>
          <input
          className='text-black'
            type='email'
            name='email'
            id='email'
            placeholder='Enter Email Address'
            {...register("email", {required:true})}
          />

          {
            errors.email && (
              <span>Please enter your Email address</span>
            )
          }
        </div>

        {/* phone number field */}
        <div className='flex flex-col gap-2'>
        <label htmlFor='phonenumber'>Phone Number</label>
          <div className='flex flex-row gap-5'>
          {/* drop down */}
          <div className='flex w-[80px] gap-5'> 
            <select
            name='dropdown'
            id='dropdown'
            {...register("countrycode", {required:true})}
            >
              {
                countrycode.map((element,index) => {
                  return (
                    <option key={index} value={element.code}>
                      {element.code} - {element.country}
                    </option>
                  )
                })
              }
            </select>
          </div>
          {/* phone number */}
            <div>
              <input
                type='number'
                name='phonenumber'
                id='phonenumber'
                placeholder='Enter the phone number'
                className='text-black'
                {...register("phonenumber",
                {
                required:{value:true, message:"Please enter your phone number"},
                maxLength:{value:10, message:"Invalid phone number"},
                minLength:{value:8, message:"Invalid phone number"}})}
              />
            </div>
          </div> 
          {
            errors.phonenumber && (
              <span>
                {errors.phonenumber.message}
              </span>
            )
          }
          
        </div>

        {/* message */}
        <div className='flex flex-col'>
          <label htmlFor='message'>Message</label>
          <textarea
          className='text-black'
            name='message'
            id='message'
            cols="30"
            rows="7"
            placeholder='Enter your Message Here'
            {...register("message",{required:true})}
          />
          {
            errors.message && (
              <span>
                Please enter your Message
              </span>
            )
          }
        </div>

        <button type='submit'
        className='rounded-md bg-yellow-50 text-center px-16 text-[16px] font-bold text-black'>      
          Send Message
        </button>
      </div>
      </div>
    </form>
  )
}

export default ContactUsForm