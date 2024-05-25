import React from 'react'
import { Link, matchPath, useLocation } from 'react-router-dom';
import logo from "../../assets/Logo/Logo-Full-Light.png";
import {NavbarLinks} from "../../data/navbar-links"


export const Navbar = () => {
    const location = useLocation(); 

    const matchRoute = (route) => {
        return matchPath({path:route}, location.pathname)
    }

  return (
    <div className='flex h-14 items-center justify-center border-b-[1px] border-b-richblack-700'>
        <div className='flex w-11/12 max-w-maxContent items-center justify-between '>

        <Link to="/">   
            <img src={logo} width={160} height={42} loading='lazy'/>
        </Link>

        {/* nav links */}
        {/*<nav>
            <ul className='flex gap-x-6 text-richblack-25'>
                {
                    NavbarLinks.map((link, index) => {
                        return (
                             <li key={index}>
                                {
                                    link.title === "Catalog" ? (<div></div>) : (
                                        <Link to={link?.path}>
                                            <p className=`{}`>
                                                {link.title}
                                            </p>
                                        </Link>
                                    )
                                }
                            </li> 
                        )
                    })
                }             
            
            </ul>
        </nav>*/}

        </div>
    </div>
  )
}
