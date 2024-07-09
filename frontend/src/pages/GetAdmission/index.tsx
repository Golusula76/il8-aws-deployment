import { Button, Heading, Input, TextArea } from "components";
import axios from "helper/axios";
import { useAuthContext } from "hooks/useAuthContext";
import React, { useState } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import useCourseData from "hooks/useCourseData";

const index = () => {
  const { user }: any = useAuthContext();
  const navigate = useNavigate();

  const { courses, standards, subjects, isLoading, modules, error } =
    useCourseData();

  const [formData, setFormData] = useState<any>({
    first_name: "",
    middle_name: "",
    last_name: "",
    date_of_birth: "",
    gender: "",
    nationality: "",
    referral: "",
    date_of_joining: "",
    date_of_completion: "",

    s_primary_no: "",
    s_secondary_no: "",
    s_primary_email: "",
    s_secondary_email: "",
    current_address: "",
    permanent_address: "",

    student_class: "",
    school: "",
    year_of_passing: 0,
    percentage: 0,

    p_first_name: "",
    p_middle_name: "",
    p_last_name: "",
    p_guardian: "",
    p_primary_no: "",
    p_primary_email: "",

    id_proof: null,
    address_proof: null,

    course: "",
    standard: "",
    subject: "",
    module: 1,
  });
  const [copyAddress, setCopyAddress] = useState(false);
  const [loading, setLoading] = useState(false);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 50 }, (_, i) => currentYear - i);

  const handleChange = (fieldName: string, value: any) => {
    setFormData((prevData: any) => ({
      ...prevData,
      [fieldName]: value,
    }));

    if (fieldName === "date_of_joining" && value) {
      const selectedDate = new Date(value);

      selectedDate.setFullYear(selectedDate.getFullYear() + 2);

      const formattedDate = selectedDate.toISOString().split("T")[0];

      setFormData((prevData: any) => ({
        ...prevData,
        date_of_completion: formattedDate,
      }));
    }

    if (copyAddress && fieldName === "current_address") {
      setFormData((prevData: any) => ({
        ...prevData,
        permanent_address: value,
      }));
    }
  };

  const handleCheckboxChange = () => {
    setCopyAddress(!copyAddress);
    if (!copyAddress) {
      setFormData((prevData) => ({
        ...prevData,
        permanent_address: prevData.current_address,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formDataToSend = new FormData();

    for (const field in formData) {
      if (field === "id_proof" || field === "address_proof") {
        if (formData[field]) {
          formDataToSend.append(field, formData[field]);
        }
      } else {
        formDataToSend.append(field, formData[field]);
      }
    }

    try {
      setLoading(true);
      const response = await axios.post("api/admission/", formDataToSend, {
        headers: {
          Authorization: "Bearer " + user.token,
          "Content-Type": "multipart/form-data",
        },
      });
      if (response.status === 200) {
        Swal.fire({
          title: "Admission Form Submitted!",
          text: "Kindly Make Payment on Next Page & Wait for Confirmation from the Admission Office.",
          icon: "success",
        }).then((result: { isConfirmed: any }) => {
          if (result.isConfirmed) {
            setLoading(false);
            navigate("/payments");
          }
        });
      }
    } catch (error) {
      setLoading(false);
      console.error("Error Submitting Admission Form", error);
      if (error || error.response.status === 400) {
        Swal.fire({
          title: "Error Submitting Admission Form!",
          text: `${error?.response?.data?.detail}`,
          icon: "error",
        }).then((result: { isConfirmed: any }) => {
          if (result.isConfirmed) {
            navigate("/");
          }
        });
      }
    }
  };

  return (
    <>
      <Helmet>
        <title>Get Admission</title>
      </Helmet>

      <section className="bg-white dark:bg-gray-900 my-10">
        <div className="py-8 px-4 mx-auto max-w-7xl lg:py-16">
          <div className="mb-5">
            <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white">
              Admission Form
            </h1>
            <span className="text-gray-500">
              All fields which are marked with (
              <span className="text-red-500">*</span>) are mandatory
            </span>
          </div>
          <form onSubmit={handleSubmit}>
            <Heading
              size="3xl"
              className="block my-2 text-sm font-extrabold text-gray-900 dark:text-white-A700"
            >
              Student Data
            </Heading>
            <div className="grid grid-cols-3 gap-x-10 gap-y-4 sm:grid-cols-2 sm:gap-6">
              <div className="sm:col-span-2">
                <Heading
                  size="s"
                  className="block my-4 text-sm font-medium text-gray-900 dark:text-white-A700"
                >
                  First Name
                  <span className="text-red-500">
                    <span className="text-red-500">*</span>
                  </span>
                </Heading>
                <Input
                  size="xs"
                  type="text"
                  name="first_name"
                  id="first_name"
                  value={formData?.first_name}
                  onChange={(value: any) => handleChange("first_name", value)}
                  className="bg-teal-900 border border-teal-90 !text-white-A700 text-sm rounded-md focus:ring-white-A700 focus:border-white-A700 block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                  placeholder="Enter Your First Name"
                  required
                />
              </div>
              <div className="sm:col-span-2">
                <Heading
                  size="s"
                  className="block my-4 text-sm font-medium text-gray-900 dark:text-white-A700"
                >
                  Middle Name<span className="text-red-500">*</span>
                </Heading>
                <Input
                  size="xs"
                  type="text"
                  name="middle_name"
                  id="middle_name"
                  value={formData?.middle_name}
                  onChange={(value: any) => handleChange("middle_name", value)}
                  className="bg-teal-900 border border-teal-90 !text-white-A700 text-sm rounded-md focus:ring-white-A700 focus:border-white-A700 block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                  placeholder="Enter Your Middle Name"
                  required
                />
              </div>
              <div className="sm:col-span-2">
                <Heading
                  size="s"
                  className="block my-4 text-sm font-medium text-gray-900 dark:text-white-A700"
                >
                  Last Name<span className="text-red-500">*</span>
                </Heading>
                <Input
                  size="xs"
                  type="text"
                  name="last_name"
                  id="last_name"
                  value={formData?.last_name}
                  onChange={(value: any) => handleChange("last_name", value)}
                  className="bg-teal-900 border border-teal-90 !text-white-A700 text-sm rounded-md focus:ring-white-A700 focus:border-white-A700 block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                  placeholder="Enter Your Last Name"
                  required
                />
              </div>
              <div className="sm:col-span-2">
                <Heading
                  size="s"
                  className="block my-4 text-sm font-medium text-gray-900 dark:text-white-A700"
                >
                  Date of Birth<span className="text-red-500">*</span>
                </Heading>
                <Input
                  size="xs"
                  type="date"
                  name="date_of_birth"
                  id="date_of_birth"
                  value={formData?.date_of_birth}
                  onChange={(value: any) =>
                    handleChange("date_of_birth", value)
                  }
                  className="bg-teal-900 border border-teal-90 !text-white-A700 text-sm rounded-md focus:ring-white-A700 focus:border-white-A700 block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                  placeholder="Enter Your Date of Birth"
                  required
                />
              </div>
              <div className="sm:col-span-2">
                <Heading
                  size="s"
                  className="block my-4 text-sm font-medium text-gray-900 dark:text-white-A700"
                >
                  Gender<span className="text-red-500">*</span>
                </Heading>
                <select
                  name="gender"
                  id="gender"
                  value={formData?.gender}
                  className="p-3 bg-teal-900 border border-teal-90 !text-white-A700 text-sm rounded-[20px] focus:ring-white-A700 focus:border-white-A700 block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                  onChange={(e) => handleChange("gender", e.target.value)}
                  required
                >
                  <option value="">Select a Gender...</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <Heading
                  size="s"
                  className="block my-4 text-sm font-medium text-gray-900 dark:text-white-A700"
                >
                  Nationality<span className="text-red-500">*</span>
                </Heading>
                <Input
                  size="xs"
                  type="text"
                  name="nationality"
                  id="nationality"
                  value={formData?.nationality}
                  onChange={(value: any) => handleChange("nationality", value)}
                  className="bg-teal-900 border border-teal-90 !text-white-A700 text-sm rounded-md focus:ring-white-A700 focus:border-white-A700 block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                  placeholder="Enter Your Nationality"
                  required
                />
              </div>
              <div className="sm:col-span-2">
                <Heading
                  size="s"
                  className="block my-4 text-sm font-medium text-gray-900 dark:text-white-A700"
                >
                  Referred By
                </Heading>
                <Input
                  size="xs"
                  type="text"
                  name="referral"
                  id="referral"
                  value={formData?.referral}
                  onChange={(value: any) => handleChange("referral", value)}
                  className="bg-teal-900 border border-teal-90 !text-white-A700 text-sm rounded-md focus:ring-white-A700 focus:border-white-A700 block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                  placeholder="Enter Your Reference if Any"
                />
              </div>
              <div className="sm:col-span-2">
                <Heading
                  size="s"
                  className="block my-4 text-sm font-medium text-gray-900 dark:text-white-A700"
                >
                  Date of Joining<span className="text-red-500">*</span>
                </Heading>
                <Input
                  size="xs"
                  type="date"
                  name="date_of_joining"
                  id="date_of_joining"
                  value={formData?.date_of_joining}
                  onChange={(value: any) =>
                    handleChange("date_of_joining", value)
                  }
                  className="bg-teal-900 border border-teal-90 !text-white-A700 text-sm rounded-md focus:ring-white-A700 focus:border-white-A700 block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                  placeholder="Enter Your Date of Joining"
                  required
                />
              </div>
              <div className="sm:col-span-2">
                <Heading
                  size="s"
                  className="block my-4 text-sm font-medium text-gray-900 dark:text-white-A700"
                >
                  Date of Completion<span className="text-red-500">*</span>
                </Heading>
                <Input
                  size="xs"
                  type="date"
                  name="date_of_completion"
                  id="date_of_completion"
                  value={formData?.date_of_completion}
                  onChange={(value: any) =>
                    handleChange("date_of_completion", value)
                  }
                  className="bg-teal-900 border border-teal-90 !text-white-A700 text-sm rounded-md focus:ring-white-A700 focus:border-white-A700 block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                  placeholder="Enter Your Date of Completion"
                  required
                />
              </div>
              <div className="sm:col-span-2">
                <Heading
                  size="s"
                  className="block my-4 text-sm font-medium text-gray-900 dark:text-white-A700"
                >
                  ID Proof
                </Heading>
                <input
                  type="file"
                  name="id_proof"
                  id="id_proof"
                  className="p-3 bg-teal-900 border border-teal-90 !text-white-A700 text-sm rounded-[20px] focus:ring-white-A700 focus:border-white-A700 block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                  accept=".pdf,.jgp,.jpeg,.png"
                  onChange={(e: any) =>
                    setFormData({ ...formData, id_proof: e.target.files[0] })
                  }
                />
              </div>
              <div className="sm:col-span-2">
                <Heading
                  size="s"
                  className="block my-4 text-sm font-medium text-gray-900 dark:text-white-A700"
                >
                  Address Proof
                </Heading>
                <input
                  type="file"
                  name="address_proof"
                  id="address_proof"
                  className="p-3 bg-teal-900 border border-teal-90 !text-white-A700 text-sm rounded-[20px] focus:ring-white-A700 focus:border-white-A700 block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                  accept=".pdf,.jgp,.jpeg,.png"
                  onChange={(e: any) =>
                    setFormData({
                      ...formData,
                      address_proof: e.target.files[0],
                    })
                  }
                />
              </div>
            </div>

            <Heading
              size="3xl"
              className="block mt-10 text-sm font-extrabold text-gray-900 dark:text-white-A700"
            >
              Enroll Course Details
            </Heading>
            <div className="grid grid-cols-4 gap-x-10 gap-y-4 sm:grid-cols-2 sm:gap-6">
              <div className="sm:col-span-2">
                <Heading
                  size="s"
                  className="block my-4 text-sm font-medium text-gray-900 dark:text-white-A700"
                >
                  Course<span className="text-red-500">*</span>
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
                      <option key={course.id} value={course.id}>
                        {course.name}
                      </option>
                    ))
                  )}
                </select>
              </div>
              <div className="sm:col-span-2">
                <Heading
                  size="s"
                  className="block my-4 text-sm font-medium text-gray-900 dark:text-white-A700"
                >
                  Standard<span className="text-red-500">*</span>
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
                      <option key={standard.id} value={standard.id}>
                        {standard.name}
                      </option>
                    ))
                  )}
                </select>
              </div>
              <div className="sm:col-span-2">
                <Heading
                  size="s"
                  className="block my-4 text-sm font-medium text-gray-900 dark:text-white-A700"
                >
                  Subject<span className="text-red-500">*</span>
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
                      <option key={subject.id} value={subject.id}>
                        {subject.name}
                      </option>
                    ))
                  )}
                </select>
              </div>
              <div className="sm:col-span-2">
                <Heading
                  size="s"
                  className="block my-4 text-sm font-medium text-gray-900 dark:text-white-A700"
                >
                  Modules<span className="text-red-500">*</span>
                </Heading>
                <select
                  name="module"
                  id="module"
                  className="p-4 bg-teal-900 border border-teal-90 !text-white-A700 text-sm rounded-[20px] focus:ring-white-A700 focus:border-white-A700 block w-full"
                  onChange={(e) => handleChange("module", e.target.value)}
                  required
                >
                  <option value="">Select a Module...</option>
                  {isLoading ? (
                    <option value="loading">Loading...</option>
                  ) : (
                    modules.map((module) => (
                      <option key={module.id} value={module.id}>
                        {module.name}
                      </option>
                    ))
                  )}
                </select>
                {/* <Input
                  size="xs"
                  type="number"
                  pattern="\d*"
                  name="module"
                  id="module"
                  min={0}
                  maxLength={2}
                  value={formData?.module}
                  onFocus={(e: { target: { select: () => any } }) =>
                    e.target.select()
                  }
                  onChange={(value: any) => handleChange("module", value)}
                  className="bg-teal-900 border border-teal-90 !text-white-A700 text-sm rounded-md focus:ring-white-A700 focus:border-white-A700 block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                  placeholder="Number of Enrolled Modules"
                  required
                /> */}
              </div>
            </div>

            <Heading
              size="3xl"
              className="block mt-10 text-sm font-extrabold text-gray-900 dark:text-white-A700"
            >
              Pre Education Information
            </Heading>
            <div className="grid grid-cols-4 gap-x-10 gap-y-4 sm:grid-cols-2 sm:gap-6">
              <div className="sm:col-span-2">
                <Heading
                  size="s"
                  className="block my-4 text-sm font-medium text-gray-900 dark:text-white-A700"
                >
                  Student Class<span className="text-red-500">*</span>
                </Heading>
                <Input
                  size="xs"
                  type="text"
                  name="student_class"
                  id="student_class"
                  value={formData?.student_class}
                  onChange={(value: any) =>
                    handleChange("student_class", value)
                  }
                  className="bg-teal-900 border border-teal-90 !text-white-A700 text-sm rounded-md focus:ring-white-A700 focus:border-white-A700 block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                  placeholder="Enter Your Class"
                  required
                />
              </div>
              <div className="sm:col-span-2">
                <Heading
                  size="s"
                  className="block my-4 text-sm font-medium text-gray-900 dark:text-white-A700"
                >
                  School Name<span className="text-red-500">*</span>
                </Heading>
                <Input
                  size="xs"
                  type="text"
                  name="school"
                  id="school"
                  value={formData?.school}
                  onChange={(value: any) => handleChange("school", value)}
                  className="bg-teal-900 border border-teal-90 !text-white-A700 text-sm rounded-md focus:ring-white-A700 focus:border-white-A700 block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                  placeholder="Enter Your School Name"
                  required
                />
              </div>
              <div className="sm:col-span-2">
                <Heading
                  size="s"
                  className="block my-4 text-sm font-medium text-gray-900 dark:text-white-A700"
                >
                  Year of Passing<span className="text-red-500">*</span>
                </Heading>
                <select
                  value={formData.year_of_passing}
                  onChange={(e) =>
                    handleChange("year_of_passing", e.target.value)
                  }
                  className="p-3 bg-teal-900 border border-teal-90 !text-white-A700 text-sm rounded-[20px] focus:ring-white-A700 focus:border-white-A700 block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                  required
                >
                  <option value="">Select Year of Passing</option>
                  {years.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
              <div className="sm:col-span-2">
                <Heading
                  size="s"
                  className="block my-4 text-sm font-medium text-gray-900 dark:text-white-A700"
                >
                  Percentage<span className="text-red-500">*</span>
                </Heading>
                <Input
                  size="xs"
                  type="number"
                  pattern="\d*"
                  name="percentage"
                  min={0}
                  maxLength={3}
                  id="percentage"
                  value={formData?.percentage}
                  onFocus={(e) => e.target.select()}
                  onChange={(value: any) =>
                    handleChange("percentage", parseInt(value))
                  }
                  className="bg-teal-900 border border-teal-90 !text-white-A700 text-sm rounded-md focus:ring-white-A700 focus:border-white-A700 block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                  placeholder="Enter Percentage (%)"
                  required
                />
              </div>
            </div>

            <Heading
              size="3xl"
              className="block mt-10 text-sm font-extrabold text-gray-900 dark:text-white-A700"
            >
              Contact Information
            </Heading>
            <div className="grid grid-cols-4 gap-x-10 gap-y-4 sm:grid-cols-2 sm:gap-6">
              <div className="sm:col-span-2">
                <Heading
                  size="s"
                  className="block my-4 text-sm font-medium text-gray-900 dark:text-white-A700"
                >
                  Primary Number<span className="text-red-500">*</span>
                </Heading>
                <Input
                  size="xs"
                  type="text"
                  name="s_primary_no"
                  maxLength={10}
                  id="s_primary_no"
                  value={formData?.s_primary_no}
                  onChange={(value: any) => handleChange("s_primary_no", value)}
                  className="bg-teal-900 border border-teal-90 !text-white-A700 text-sm rounded-md focus:ring-white-A700 focus:border-white-A700 block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                  placeholder="Enter Primary Contact Number"
                  required
                />
              </div>
              <div className="sm:col-span-2">
                <Heading
                  size="s"
                  className="block my-4 text-sm font-medium text-gray-900 dark:text-white-A700"
                >
                  Secondary Number
                </Heading>
                <Input
                  size="xs"
                  type="text"
                  name="s_secondary_no"
                  maxLength={10}
                  id="s_secondary_no"
                  value={formData?.s_secondary_no}
                  onChange={(value: any) =>
                    handleChange("s_secondary_no", value)
                  }
                  className="bg-teal-900 border border-teal-90 !text-white-A700 text-sm rounded-md focus:ring-white-A700 focus:border-white-A700 block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                  placeholder="Enter Secondary Contact Number"
                />
              </div>
              <div className="sm:col-span-2">
                <Heading
                  size="s"
                  className="block my-4 text-sm font-medium text-gray-900 dark:text-white-A700"
                >
                  Primary Email<span className="text-red-500">*</span>
                </Heading>
                <Input
                  size="xs"
                  type="email"
                  name="s_primary_email"
                  id="s_primary_email"
                  value={formData?.s_primary_email}
                  onChange={(value: any) =>
                    handleChange("s_primary_email", value)
                  }
                  className="bg-teal-900 border border-teal-90 !text-white-A700 text-sm rounded-md focus:ring-white-A700 focus:border-white-A700 block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                  placeholder="Enter Primary Email"
                  required
                />
              </div>
              <div className="sm:col-span-2">
                <Heading
                  size="s"
                  className="block my-4 text-sm font-medium text-gray-900 dark:text-white-A700"
                >
                  Secondary Email
                </Heading>
                <Input
                  size="xs"
                  type="email"
                  name="s_secondary_email"
                  id="s_secondary_email"
                  value={formData?.s_secondary_email}
                  onChange={(value: any) =>
                    handleChange("s_secondary_email", value)
                  }
                  className="bg-teal-900 border border-teal-90 !text-white-A700 text-sm rounded-md focus:ring-white-A700 focus:border-white-A700 block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                  placeholder="Enter Secondary Email"
                />
              </div>
              <div className="sm:col-span-2 col-span-2">
                <Heading
                  size="s"
                  className="block my-4 text-sm font-medium text-gray-900 dark:text-white-A700"
                >
                  Current Address<span className="text-red-500">*</span>
                </Heading>
                <TextArea
                  size="s"
                  name="current_address"
                  id="current_address"
                  value={formData?.current_address}
                  onChange={(value: any) =>
                    handleChange("current_address", value)
                  }
                  className="bg-teal-900 border border-teal-90 !text-white-A700 rounded-md focus:ring-white-A700 focus:border-white-A700 block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                  placeholder="Enter Current Address"
                  required
                />
              </div>
              <div className="sm:col-span-2 col-span-2">
                <Heading
                  size="s"
                  className="block my-4 text-sm font-medium text-gray-900 dark:text-white-A700"
                >
                  Permanent Address<span className="text-red-500">*</span>
                  <input
                    type="checkbox"
                    checked={copyAddress}
                    onChange={handleCheckboxChange}
                    className="mx-1"
                  />
                  <span>Same as Current</span>
                </Heading>
                <TextArea
                  size="s"
                  name="permanent_address"
                  id="permanent_address"
                  value={formData?.permanent_address}
                  onChange={(value: any) =>
                    handleChange("permanent_address", value)
                  }
                  className="bg-teal-900 border border-teal-90 !text-white-A700 rounded-md focus:ring-white-A700 focus:border-white-A700 block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                  placeholder="Enter Permanent Address"
                  disabled={copyAddress}
                  required
                />
              </div>
            </div>

            <Heading
              size="3xl"
              className="block mt-10 text-sm font-extrabold text-gray-900 dark:text-white-A700"
            >
              Parent Information
            </Heading>
            <div className="grid grid-cols-3 gap-x-10 gap-y-4 sm:grid-cols-2 sm:gap-6">
              <div className="sm:col-span-2">
                <Heading
                  size="s"
                  className="block my-4 text-sm font-medium text-gray-900 dark:text-white-A700"
                >
                  Parent First Name<span className="text-red-500">*</span>
                </Heading>
                <Input
                  size="xs"
                  type="text"
                  name="p_first_name"
                  id="p_first_name"
                  value={formData?.p_first_name}
                  onChange={(value: any) => handleChange("p_first_name", value)}
                  className="bg-teal-900 border border-teal-90 !text-white-A700 text-sm rounded-md focus:ring-white-A700 focus:border-white-A700 block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                  placeholder="Enter Parent's First Name"
                  required
                />
              </div>
              <div className="sm:col-span-2">
                <Heading
                  size="s"
                  className="block my-4 text-sm font-medium text-gray-900 dark:text-white-A700"
                >
                  Parent Middle Name
                </Heading>
                <Input
                  size="xs"
                  type="text"
                  name="p_middle_name"
                  id="p_middle_name"
                  value={formData?.p_middle_name}
                  onChange={(value: any) =>
                    handleChange("p_middle_name", value)
                  }
                  className="bg-teal-900 border border-teal-90 !text-white-A700 text-sm rounded-md focus:ring-white-A700 focus:border-white-A700 block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                  placeholder="Enter Parent's Middle Name"
                />
              </div>
              <div className="sm:col-span-2">
                <Heading
                  size="s"
                  className="block my-4 text-sm font-medium text-gray-900 dark:text-white-A700"
                >
                  Parent Last Name<span className="text-red-500">*</span>
                </Heading>
                <Input
                  size="xs"
                  type="text"
                  name="p_last_name"
                  id="p_last_name"
                  value={formData?.p_last_name}
                  onChange={(value: any) => handleChange("p_last_name", value)}
                  className="bg-teal-900 border border-teal-90 !text-white-A700 text-sm rounded-md focus:ring-white-A700 focus:border-white-A700 block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                  placeholder="Enter Parent's Last Name"
                  required
                />
              </div>
              <div className="sm:col-span-2">
                <Heading
                  size="s"
                  className="block my-4 text-sm font-medium text-gray-900 dark:text-white-A700"
                >
                  Relationship<span className="text-red-500">*</span>
                </Heading>
                <Input
                  size="xs"
                  type="text"
                  name="p_guardian"
                  id="p_guardian"
                  value={formData?.p_guardian}
                  onChange={(value: any) => handleChange("p_guardian", value)}
                  className="bg-teal-900 border border-teal-90 !text-white-A700 text-sm rounded-md focus:ring-white-A700 focus:border-white-A700 block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                  placeholder="Enter Relationship With Parent"
                  required
                />
              </div>
              <div className="sm:col-span-2">
                <Heading
                  size="s"
                  className="block my-4 text-sm font-medium text-gray-900 dark:text-white-A700"
                >
                  Parent's Number<span className="text-red-500">*</span>
                </Heading>
                <Input
                  size="xs"
                  type="text"
                  name="p_primary_no"
                  maxLength={10}
                  id="p_primary_no"
                  value={formData?.p_primary_no}
                  onChange={(value: any) => handleChange("p_primary_no", value)}
                  className="bg-teal-900 border border-teal-90 !text-white-A700 text-sm rounded-md focus:ring-white-A700 focus:border-white-A700 block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                  placeholder="Enter Parent's Contact Number"
                  required
                />
              </div>
              <div className="sm:col-span-2">
                <Heading
                  size="s"
                  className="block my-4 text-sm font-medium text-gray-900 dark:text-white-A700"
                >
                  Parent's Email<span className="text-red-500">*</span>
                </Heading>
                <Input
                  size="xs"
                  type="email"
                  name="p_primary_email"
                  id="p_primary_email"
                  value={formData?.p_primary_email}
                  onChange={(value: any) =>
                    handleChange("p_primary_email", value)
                  }
                  className="bg-teal-900 border border-teal-90 !text-white-A700 text-sm rounded-md focus:ring-white-A700 focus:border-white-A700 block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                  placeholder="Enter Parent's Email"
                  required
                />
              </div>
            </div>

            <div className="w-full flex justify-center my-2">
              <Button
                type="submit"
                disabled={loading}
                className="inline-flex items-center h-12 w-full max-w-xs px-5 py-2 mt-8 sm:mt-6 text-sm font-medium text-center text-white-A700 bg-deep_orange-500 rounded-lg focus:ring-2 focus:ring-deep_orange-500 transition border border-deep_orange-500 hover:bg-white-A700 hover:text-deep_orange-500"
              >
                {loading ? (
                  <>
                    <svg
                      aria-hidden="true"
                      role="status"
                      className="inline mr-3 w-4 h-4 text-white animate-spin"
                      viewBox="0 0 100 101"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                        fill="#E5E7EB"
                      ></path>
                      <path
                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                        fill="currentColor"
                      ></path>
                    </svg>
                    <span>Loading...</span>
                  </>
                ) : (
                  <span>Next</span>
                )}
              </Button>
            </div>
          </form>
        </div>
      </section>
    </>
  );
};

export default index;
