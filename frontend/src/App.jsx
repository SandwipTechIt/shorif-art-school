import { BrowserRouter as Router, Routes, Route } from "react-router";
import SignIn from "./pages/AuthPages/SignIn";
import NotFound from "./pages/OtherPage/NotFound";
import UserProfiles from "./pages/UserProfiles";

import Blank from "./pages/Blank";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
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
export default function App() {
  return (
    <>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Dashboard Layout */}
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
          </Route>

          {/* Auth Layout */}
          <Route path="/signin" element={<SignIn />} />

          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}
