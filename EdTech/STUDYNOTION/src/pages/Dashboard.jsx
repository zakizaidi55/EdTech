import React, { useState } from 'react'
import { Outlet } from 'react-router-dom';


function Dashboard() {
    const {loading:authLoading} = useState((state) => state.auth);
    const {loading:profileLoading} = useState((state) => state.profile);


    if(profileLoading || authLoading) {
        return (
            <div>
                <p className='mt-12'>
                    Loading.....
                </p>
            </div>
        )
    }


  return (
    <div className=' relative flex min-h-[calc(100vh-3.5rem)]'>
        <Sidebar/>
        <div className='h-[calc(100vh-3.5)] overflow-auto'>
        <div className='mx-auto w-11/12 max-w-[100px] py-10'>
            <Outlet/>
        </div>

        </div>
    </div>
  )
}

export default Dashboard