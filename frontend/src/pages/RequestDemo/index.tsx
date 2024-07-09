import React, { useEffect, useState } from "react";
import profileImg from "assets/profile.jpg";
import { Heading, Button } from "components";
import { useAuthContext } from "hooks/useAuthContext";
import { Link, useNavigate } from "react-router-dom";
import axios from "helper/axios";
import Loading from "assets/Loading.svg";
import Header from "components/Header";
import { Helmet } from "react-helmet";
import Footer from "components/Footer";
import useCourseData from "hooks/useCourseData";
import Swal from "sweetalert2";

const index = () => {
  const { user }: any = useAuthContext();
  const [myData, setMyData] = useState<any>([]);
  const navigate = useNavigate();

  useEffect(() => {
    getMyData();
  }, [user]);

  const getMyData = async () => {
    try {
      const response = await axios.get(`api/get_my_profile`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      setMyData(response?.data?.data);
    } catch (error) {
      console.error("Error getting Profile", error);
    }
  };

  const handleGetAdmissionClick = () => {
    if (myData.is_formsubmited) {
      if (myData.is_payment_done) {
        Swal.fire({
          title: "Access Restricted",
          text: "You have already completed the form submission and payment. Check Dashboard for more information",
          icon: "info",
          confirmButtonText: "OK",
        });
      } else {
        navigate("/payments");
      }
    } else {
      navigate("/getadmission");
    }
  };
  // const [isLoading, setIsLoading] = useState(false);
  const dummyData = [
    {
      course: "Course 1",
      standard: "Standard 3",
      subject: "Subject 1",
      video_link: [
        "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      ],
    },
    {
      course: "Course 2",
      standard: "Standard 2",
      subject: "Subject 2",
      video_link: [
        "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
        "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      ],
    },
    {
      course: "Course 3",
      standard: "Standard 1",
      subject: "Subject 3",
      video_link: [
        "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
      ],
    },
    {
      course: "Course 4",
      standard: "Standard 4",
      subject: "Subject 4",
      video_link: [
        "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      ],
    },
  ];

  const { courses, standards, subjects, isLoading, error } = useCourseData();

  const [demo, setDemo] = useState({
    course: "",
    standard: "",
    subject: "",
  });

  const [videoLinks, setVideoLinks] = useState([]);
  const [videoErr, setVideoErr] = useState(false);

  const handleChange = (fieldName: any, value: any) => {
    setDemo((prevData: any) => ({
      ...prevData,
      [fieldName]: value,
    }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const { course, standard, subject } = demo;
    try {
      const response = await axios.get(
        `api/videos/?course_name=${course}&standard_name=${standard}&subject_name=${subject}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      setVideoErr(false);
      setVideoLinks([]);
      setTimeout(() => {
        setVideoLinks(response.data);
      }, 100);
    } catch (error) {
      console.error("Error Getting Video Links", error);
      setVideoErr(true);
    }

    // return;
    // const selectedData = dummyData.find(
    //   (data) =>
    //     data.course === course &&
    //     data.standard === standard &&
    //     data.subject === subject
    // );
    // if (selectedData) {
    //   console.log("Video Link:", selectedData.video_link);
    //   setVideoErr(false);
    //   setVideoLinks([]);
    //   setTimeout(() => {
    //     setVideoLinks((prevLinks) => [
    //       ...prevLinks,
    //       ...selectedData.video_link,
    //     ]);
    //   }, 100);
    // } else {
    //   setVideoErr(true);
    //   console.log(
    //     "Video link not found for selected course, standard, and subject."
    //   );
    // }
  };

  return (
    <>
      <Helmet>
        <title>Request Demo</title>
      </Helmet>

      <div className="py-8 mx-auto max-w-7xl p-4 lg:py-16">
        <h1 className="mb-5 text-4xl font-bold text-gray-900 dark:text-white">
          Demo
        </h1>
        <div className="flex items-center justify-start gap-4 my-4">
          <div>
            <img
              src={profileImg}
              className="w-28 h-28 rounded-full border"
              alt="Profile"
            />
          </div>
          <div className="flex flex-col gap-1">
            <Heading className="text-black-900">{user.user_name}</Heading>
            <p className="text-gray-500">{user.email_id}</p>
            <p className="text-gray-500">{user.phone_no}</p>
          </div>
        </div>
        <form
          onSubmit={handleSubmit}
          className="flex items-end justify-between w-full"
        >
          <div className="grid grid-cols-4 w-full gap-4 sm:grid-cols-2 sm:gap-6">
            <div className="sm:col-span-2">
              <Heading
                size="md"
                className="block mb-2 text-sm font-bold text-gray-900 dark:text-white-A700"
              >
                Course
              </Heading>
              <select
                name="course"
                id="course"
                className="p-4 bg-teal-900 border border-teal-90 !text-white-A700 text-sm rounded-[20px] focus:ring-white-A700 focus:border-white-A700 block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                onChange={(e) => handleChange("course", e.target.value)}
                required
              >
                <option value="">Select a course...</option>
                {isLoading ? (
                  <option value="loading">Loading...</option>
                ) : (
                  courses.map((course) => (
                    <option key={course.id} value={course.name}>
                      {course.name}
                    </option>
                  ))
                )}
              </select>
            </div>
            <div className="sm:col-span-2">
              <Heading
                size="md"
                className="block mb-2 text-sm font-bold text-gray-900 dark:text-white-A700"
              >
                Standard
              </Heading>
              <select
                name="standard"
                id="standard"
                className="p-4 bg-teal-900 border border-teal-90 !text-white-A700 text-sm rounded-[20px] focus:ring-white-A700 focus:border-white-A700 block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                onChange={(e) => handleChange("standard", e.target.value)}
                required
              >
                <option value="">Select a standard...</option>
                {isLoading ? (
                  <option value="loading">Loading...</option>
                ) : (
                  standards.map((standard) => (
                    <option key={standard.id} value={standard.name}>
                      {standard.name}
                    </option>
                  ))
                )}
              </select>
            </div>
            <div className="sm:col-span-2">
              <Heading
                size="md"
                className="block mb-2 text-sm font-bold text-gray-900 dark:text-white-A700"
              >
                Subject
              </Heading>
              <select
                name="subject"
                id="subject"
                className="p-4 bg-teal-900 border border-teal-90 !text-white-A700 text-sm rounded-[20px] focus:ring-white-A700 focus:border-white-A700 block w-full"
                onChange={(e) => handleChange("subject", e.target.value)}
                required
              >
                <option value="">Select a subject...</option>
                {isLoading ? (
                  <option value="loading">Loading...</option>
                ) : (
                  subjects.map((subject) => (
                    <option key={subject.id} value={subject.name}>
                      {subject.name}
                    </option>
                  ))
                )}
              </select>
            </div>
            <div className="sm:col-span-2 mt-7">
              <Button
                type="submit"
                className="inline-flex items-center w-full h-[53px] text-sm font-medium text-center text-white-A700 bg-deep_orange-500 rounded-[20px] focus:ring-2 focus:ring-deep_orange-500 transition border border-deep_orange-500 hover:bg-white-A700 hover:text-deep_orange-500"
              >
                Submit
              </Button>
            </div>
          </div>
        </form>
        {videoLinks.length > 0 && !videoErr && (
          <>
            {videoLinks?.map((link, index) => (
              <>
                <div key={index} className="w-full text-center my-5">
                  <h2 className="my-10 text-3xl">{link.name}</h2>
                  <video controls className="w-full rounded-lg">
                    <source src={link.url} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              </>
            ))}
            <div className="flex justify-around items-center my-5">
              <Link to="/offlinedemo">
                <Button
                  type="submit"
                  className="inline-flex items-center  h-[53px] text-sm font-medium text-center text-white-A700 bg-deep_orange-500 rounded focus:ring-2 focus:ring-deep_orange-500 transition border border-deep_orange-500 hover:bg-white-A700 hover:text-deep_orange-500"
                >
                  Get Offline Demo
                </Button>
              </Link>
              {/* <Link to="/getadmission"> */}
              <Button
                type="submit"
                className="inline-flex items-center  h-[53px] text-sm font-medium text-center text-white-A700 bg-deep_orange-500 rounded focus:ring-2 focus:ring-deep_orange-500 transition border border-deep_orange-500 hover:bg-white-A700 hover:text-deep_orange-500"
                onClick={handleGetAdmissionClick}
              >
                Get Admission
              </Button>
              {/* </Link> */}
            </div>
          </>
        )}
        {videoErr && (
          <div className="flex flex-col items-center justify-center">
            <h2 className="my-5 text-center text-2xl">
              No Demo Video Available for selected course, standard, and
              subject, You can book offline demo instead
            </h2>
            <Link to="/offlinedemo">
              <Button
                type="submit"
                className="inline-flex items-center  h-[53px] text-sm font-medium text-center text-white-A700 bg-deep_orange-500 rounded focus:ring-2 focus:ring-deep_orange-500 transition border border-deep_orange-500 hover:bg-white-A700 hover:text-deep_orange-500"
              >
                Get Offline Demo
              </Button>
            </Link>
          </div>
        )}
        {!videoLinks.length && !videoErr && (
          <h2 className="my-5 text-center text-xl">
            Kindly Select course, standard, and subject & then{" "}
            <strong>Submit</strong>
          </h2>
        )}
      </div>
    </>
  );
};

export default index;
