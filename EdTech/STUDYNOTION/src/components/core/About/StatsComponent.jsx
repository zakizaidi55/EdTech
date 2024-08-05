import React from 'react'

const Stats = [
    {count:"5K", label:"Active Students"},
    {count:"200+", label:"Mentors"},
    {count:"5K", label:"Courses"},
    {count:"50+", label:"Awards"},

];
const StatsComponent =() => {
  return (
    <div>
        <section>
            <div>
                <div className='flex gap-x-5'>
                    {
                        Stats.map((data, index) => {
                            return (
                                <div key={index}>
                                    <h1>
                                        {data.count}
                                    </h1>

                                    <h2>
                                        {data.label}
                                    </h2>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        </section>
    </div>
  )
}

export default StatsComponent