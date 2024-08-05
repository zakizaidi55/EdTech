import React from 'react'
import {sidebarlinks} from "../../../data/dashboard-links";
import {logout} from "../../../services/operations/authAPI";
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Sidebarlinks from './Sidebarlinks';

function Sidebar() {
    const {user, loading:profileLoading} = useSelector((state) =>state.profile);
    const {loading:authLoading} = useSelector((state) =>state.auth);

    if(profileLoading || authLoading) {
        return (
            <div className='mt-12 '>
                Loading......
            </div>
        )
    }
  return (
    <div>
        <div className='flex min-w-[222px] flex-col border-r-[1px] border-richblack-700 h-[calc[100vh-3.5rem)] bg-richblack-800 py-10'>
            <div className='flex flex-col'>
                {
                    sidebarlinks.map((link) => 
                        {
                            if(Link.type && user?.accountType !== Link?.type) {
                                return null;
                            }

                            return (
                                <Sidebarlinks link={link} iconName={link.icon} key={link.id}/>
                            )
                        }
                    )
                }
            </div>
        </div>

        <div className='mx-auto mt-6 mb-6 h-[1px] w-10/12 bg-richblack-600'> </div>
        <div>
            <Sidebarlinks link ={{name:"Setting", path:"/dashboard/settings"}} iconName="VscSettings"/>
        </div>
    </div>
  )
}

export default Sidebar