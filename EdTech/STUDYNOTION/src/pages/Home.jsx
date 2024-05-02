import React from 'react'
import { Link } from 'react-router-dom'
import  {FaArrowRight}  from "react-icons/fa";
import HighlightText from '../components/core/Homepage/HighlightText';
import CTAButton from '../components/core/Homepage/CTAButton';
import Banner from "../assets/Images/banner.mp4"
import CodeBlocks from '../components/core/Homepage/CodeBlocks';

function Home() {
  return (
    <div>
        {/* section 1 */}
        <div className='relative mx-auto flex flex-col w-11/12 max-w-maxContent items-center 
      text-white justify-between'>
            <Link to={"/signup"}>
            <div className=' group mt-16 p-1 mx-auto rounded-full bg-richblack-800 font-bold text-richblack-200
            transition-all duration-200 hover:scale-95 w-fit'>
                <div className='flex flex-row items-center gap-2 rounded-full px-10 py-[5px]
                transition-all duration-200 group-hover:bg-richblack-900'>
                    <p>Become an Instructor</p>
                    <FaArrowRight />
                </div>
            </div>

        </Link>

        <div className='text-center text-4xl font-semibold mt-7'>
            Empower YourJourney with <HighlightText text={"Coding Skill"}/>
        </div>

        <div className='mt-4 w-[90%] text-center text-lg font-bold text-richblack-300'>
          With our online coding courses, you can learn at your own pace, from anywhere in the world, and get access to a wealth of resources, including hands-on projects, quizzes, and personalized feedback from instructors. 
        </div>

        <div className='flex flex-row gap-7 mt-8'>
        <CTAButton active={true} linkto={"/signup"}>
          Learn More
        </CTAButton>

        <CTAButton active={false} linkto={"/login"}>
          Book a Demo
        </CTAButton>

        </div>
        
        <div className='shadow-[20px_20px_0px_0px_rgba(255,255,255)] mx-3 my-12'>
          <video
          muted
          loop
          autoPlay
          src={Banner} type="video/mp4">
            
          </video>
        </div>

        {/* code sectio 1 */}

        <div>
          <CodeBlocks
            position={"lg:flex-row"}
            heading={<div className='text-4xl font-bold'>
              Unlock Your <HighlightText text={"Coding Potentials"}/>
              with our online courses
            </div>}

            subheading={"Our courses are designed and taught by industry experts who have years of experience in coding and are passionate about sharing their knowledge with you."}

            ctabtn1={
              {
                btnText:"Try it yourself",
                linkto:"/signup",
                active:true,
              }
            }

            ctabtn2={
              {
                btnText:"Learn More",
                linkto:"/login",
                active:false,
              }
            }

            codeblock={`<<!DOCTYPE html>\n<html>\nhead><title>Example</title><linkrel="stylesheet"href="styles.css">\n/head>\nbody/>\nh1><ahref="/">Header</a>\n/h1>\nnav><ahref="one/">One</a><ahref="two/">Two</\na><ahref="three/">Three</a>\n/nav>`}
            codeColor={"text-yellow-25"}
          />
        </div>

        </div>

        {/* section 2 */}
        {/* section 3 */}
        {/* footer */}

    </div>
  )
}

export default Home