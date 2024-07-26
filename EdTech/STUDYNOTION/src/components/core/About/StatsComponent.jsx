import React from 'react'

const Stats = [
    {Count:"5K", label:"Active Students"},
    {Count:"200+", label:"Mentors"},
    {Count:"5K", label:"Courses"},
    {Count:"50+", label:"Awards"},

];
const StatsComponent =() => {
  return (
    <div>
        <section>
            <div>
                <div>
                    {
                        Stats.map((index, data) => {
                        return (
                            <div key={index}> 
                                <h1>
                                    {data.Count}
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