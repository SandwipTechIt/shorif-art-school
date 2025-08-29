import { Routes, Route } from "react-router";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { setContext } from "./context/authContext";
import { ScrollToTop } from "./components/common/ScrollToTop";
import SignIn from "./pages/AuthPages/SignIn";
import SignOut from "./pages/AuthPages/SignOut";
import NotFound from "./pages/OtherPage/NotFound";
import UserProfiles from "./pages/UserProfiles";

import Blank from "./pages/Blank";
import AppLayout from "./layout/AppLayout";
import Home from "./pages/Dashboard/Home";
import AddCourse from "./pages/course/addCourse";
import AllCourses from "./pages/course/allCourse";
import EditCourse from "./pages/course/editCourse";

import AddStudent from "./pages/student/addStudent";
import AllStudents from "./pages/student/allStudent";
import InActiveStudent from "./pages/student/inActiveStudent";
import PassedStudent from "./pages/student/passedStudent";
import ShowStudent from "./pages/student/showStudent";
import EditStudent from "./pages/student/editStudent";


import AddPayment from "./pages/payment/addPayment";
import AllPayment from "./pages/payment/allPayment";



import MainMessage from "./pages/message/mainMessage";
import WhatsappMessage from "./pages/message/whatsappMessage";
import MessageTemplete from "./pages/message/messageTemplete";
import SendDueMessage from "./pages/message/sendDueMessage.jsx";


export default function App() {
  const { state } = setContext();
  return (
    <>
        <ScrollToTop />
        <Routes>
          {/* Dashboard Layout */}
          {state.islogin ? (
            <Route element={<AppLayout />}>
              <Route index path="/" element={<Home />} />

              {/* Others Page */}
              <Route path="/profile" element={<UserProfiles />} />
              <Route path="/blank" element={<Blank />} />
              <Route path="/course/all" element={<AllCourses />} />
              <Route path="/course/add" element={<AddCourse />} />
              <Route path="/course/edit/:id" element={<EditCourse />} />
              {/* Student routes */}
              <Route path="/student/active" element={<AllStudents />} />
              <Route path="/student/inactive" element={<InActiveStudent />} />
              <Route path="/student/completed" element={<PassedStudent />} />
              <Route path="/student/all" element={<AllStudents />} />
              <Route path="/student/add" element={<AddStudent />} />
              <Route path="/student/view/:id" element={<ShowStudent />} />
              <Route path="/student/edit/:id" element={<EditStudent />} />
              {/* Payment routes */}
              <Route path="/payment/add" element={<AddPayment />} />
              <Route path="/payment/all" element={<AllPayment />} />
              {/* Message routes */}
              <Route path="/message/main" element={<MainMessage />} />  
              <Route path="/message/whatsapp" element={<WhatsappMessage />} />
              <Route path="/message/templete" element={<MessageTemplete />} />
              <Route path="/message/due" element={<SendDueMessage />} />
              {/* Auth Layout */}
              <Route path="/SignOut" element={<SignOut />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          ) : (
            <Route path="*" element={<SignIn />} />
          )}
        </Routes>
      <ToastContainer 
        position="top-right"
        style={{ marginTop: '80px' }}
        className="md:w-auto w-full max-w-sm"
        toastClassName="md:text-base text-sm md:p-4 p-3 md:max-w-md max-w-xs"
        bodyClassName="md:text-base text-sm"
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
}
