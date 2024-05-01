import React from 'react'

function HighlightText({text}) {
  return (
    <span className='font-bold text-richblue-500'>
     {/* //bg-gradient-to-b from[] to-[] */}
        {text}
    </span>
  )
}

export default HighlightText 