import React, { useState } from 'react'
import {sidebarLinks} from "../../../data/dashboard-links";
import {logout} from "../../../services/operations/authAPI";
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import Sidebarlinks from './Sidebarlinks';
import { VscSignOut } from 'react-icons/vsc';
import ConfirmationModal from '../../common/ConfirmationModal';
import { ACCOUNT_TYPE } from '../../../utils/constants';



function Sidebar() {
    
    const {user, loading:profileLoading} = useSelector((state) =>state.profile);
    const {loading:authLoading} = useSelector((state) =>state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [confirmationModal, setConfirmationModal] = useState(null);
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
            {sidebarLinks.map((link) => {
            if (link.type && user?.accountType !== link.type) return null
            return (
              <Sidebarlinks key={link.id} link={link} iconName={link.icon} />
            )
          })}
            </div>
        </div>

        <div className='mx-auto mt-6 mb-6 h-[1px] w-10/12 bg-richblack-600'> </div>
        <div className='flex fle-col'>
            <Sidebarlinks link ={{name:"Setting", path:"/dashboard/settings"}} iconName="VscSettings"/>
            
            <button onClick={() => setConfirmationModal({
                text1:"Are you sure ? ",
                text2:"You will be logged out of your Account",
                btn1Text:"Logout",
                btn2Text:"Cancel",
                btn1Handler: () => dispatch(logout(navigate)),
                btn2Handler: () => setConfirmationModal(null)
            })}
            className='text-sm font-medium text-richblack-300'
            >
            <div className='flex items-center gap-x-2'>
                <VscSignOut className='text-lg'/>
                <span>Logout</span>
            </div>
            </button>
        </div> 
        {
            confirmationModal && <ConfirmationModal modalData={confirmationModal}/>
        }
    </div>
  )
}

export default Sidebar