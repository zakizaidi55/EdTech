import "./App.css";
import { Route, Routes } from "react-router-dom";
import  Home  from "./pages/Home";
import { Navbar } from "./components/common/Navbar";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import OpenRoute from "./components/core/Auth/OpenRoute";
import ForgotPassword from "./pages/ForgotPassword";
import UpdatePassword from "./pages/UpdatePassword";
import VerifyEmail from "./pages/VerifyEmail";
import MyProfile from "./components/core/Dashboard/MyProfile";
import About from "./pages/About";
import PrivateRoute from "./components/core/Auth/PrivateRoute";
import Dashboard from "./pages/Dashboard";
import Error from "./pages/Error";
import EnrolledCourses from "./components/core/Dashboard/EnrolledCourses";
import Settings from "./components/core/Dashboard/Settings/index";
import Cart from "./components/core/Dashboard/Cart";
import {ACCOUNT_TYPE} from "./utils/constants";
import { useSelector } from "react-redux";
import Contact from "./pages/Contact";
import AddCourse from "./components/core/Dashboard/AddCourse";


function App() {
  const {user} = useSelector((state) => state.profile);
  // console.log("user:", user?.accountType )
  return (
    <div className="w-screen min-h-screen bg-richblack-900 flex flex-col font-inter ">
    <Navbar/>
    <Routes>
       <Route path="/" element={<Home/>} />
       <Route
           path="signup"
           element={
             <OpenRoute>
               <Signup />
             </OpenRoute>
           }
         />
     <Route
           path="login"
           element={
             <OpenRoute>
              <Login />
             </OpenRoute>
           }
         />
          <Route
           path="forgot-password"
           element={
             <OpenRoute>
               <ForgotPassword/>
             </OpenRoute>
           }
         />

          <Route
           path="update-password/:id"
           element={
             <OpenRoute>
               <UpdatePassword/>
             </OpenRoute>
           }
         />

          <Route
           path="verify-email"
           element={
             <OpenRoute>
               <VerifyEmail/>
             </OpenRoute>
           }
         />

          <Route
           path="about"
           element={
             <OpenRoute>
               <About/>
             </OpenRoute>
           }
         />

        <Route path="contact" element={<Contact/>} />

           <Route
            element ={
              <PrivateRoute>
                <Dashboard/>
              </PrivateRoute>
            }
            >

              <Route path="/dashboard/my-profile" element={<MyProfile />} />
              <Route path="/dashboard/settings" element={<Settings/>}/>
              
              
              {
                user?.accountType === ACCOUNT_TYPE.STUDENT && (
                  <>
                    <Route path="/dashboard/enrolled-courses" element={<EnrolledCourses/>} />
                    <Route path="/dashboard/Cart" element={<Cart/>} />
                  </>
                )
              }

              {
                user?.accountType === ACCOUNT_TYPE.INSTRUCTOR && (
                  <>
                    <Route path="/dashboard/add-course" element={<AddCourse/>} />
                    <Route path="/dashboard/Cart" element={<Cart/>} />
                  </>
                )
              }
           </Route>

        <Route path="*" element={<Error/>}/>
      </Routes>

      
    </div>
  );
}

export default App;
