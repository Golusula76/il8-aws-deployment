import React, { useState, useEffect } from "react";
import { useRoutes, Navigate } from "react-router-dom";
import NotFound from "pages/NotFound";
import Aboutus from "pages/Aboutus";
import ContactUs from "pages/ContactUs";
import LoginPage from "pages/LoginPage";
import SignUpPage from "pages/SignUpPage";
import Home from "pages/Home";
import GetAdmission from "pages/GetAdmission";
import RequestDemo from "pages/RequestDemo";
import OfflineDemo from "pages/OfflineDemo";
import { useAuthContext } from "hooks/useAuthContext";
import Payments from "pages/Payments";
import TeacherAttendance from "pages/TeacherPages/Attendance";
import TeacherProfile from "pages/TeacherPages/Profile";
import TeacherCourses from "pages/TeacherPages/Courses";
import TeacherDashboard from "pages/TeacherPages/Dashboard";
import TeacherAnnouncements from "pages/TeacherPages/Announcement";
import ViewContent from "pages/TeacherPages/ViewContent";
import CourseUpload from "pages/TeacherPages/CourseUpload";

const UserRoutes = () => {
  const { user } = useAuthContext();

  const [loggedIn, setLoggedIn] = useState(null);

  useEffect(() => {
    const loggedUser = localStorage.getItem("user");
    setLoggedIn(Boolean(loggedUser));
  }, []);

  const protectedRoutes = [
    {
      path: "/getadmission",
      element: user ? <GetAdmission /> : <Navigate to="/login" />,
    },
    {
      path: "/requestdemo",
      element: user ? <RequestDemo /> : <Navigate to="/login" />,
    },
    {
      path: "/offlinedemo",
      element: user ? <OfflineDemo /> : <Navigate to="/login" />,
    },
    {
      path: "/payments",
      element: user ? <Payments /> : <Navigate to="/login" />,
    },
    // {
    //   path: "/dashboard/profile",
    //   element: user ? <TeacherDashboard /> : <Navigate to="/login" />,
    // },
    {
      path: "/dashboard/mycourses",
      element: user ? <TeacherCourses /> : <Navigate to="/login" />,
    },
    {
      path: "/dashboard/myattendance",
      element: user ? <TeacherAttendance /> : <Navigate to="/login" />,
    },
    {
      path: "/dashboard/user",
      element: user ? <TeacherProfile /> : <Navigate to="/login" />,
    },
    {
      path: "/dashboard/myannouncements",
      element: user ? <TeacherAnnouncements /> : <Navigate to="/login" />,
    },
    {
      path: "/content",
      element: user ? <ViewContent /> : <Navigate to="/login" />,
    },
    {
      path: "/uploadcontent",
      element: user ? <CourseUpload /> : <Navigate to="/login" />,
    }
  ];

  const getProtectedElement = (element: any, path: any) => {
    return user ? element : <Navigate to="/login" state={{ from: path }} />;
  };

  let element = useRoutes([
    { path: "/", element: <Home /> },
    {
      path: "login",
      element: !user ? <LoginPage /> : <Navigate to={"/"} />,
    },
    // {
    //   path: "parentlogin",
    //   element: !user ? <ParentLoginPage /> : <Navigate to={"/"} />,
    // },
    {
      path: "signup",
      element: !user ? <SignUpPage /> : <Navigate to={"/"} />,
    },
    {
      path: "aboutus",
      element: <Aboutus />,
    },
    {
      path: "contactus",
      element: <ContactUs />,
    },
    ...protectedRoutes.map((route) => ({
      ...route,
      element: getProtectedElement(route.element, route.path),
    })),
    { path: "*", element: <NotFound /> },
  ]);

  return loggedIn !== null && element;
};

export default UserRoutes;
