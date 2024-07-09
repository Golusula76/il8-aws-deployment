import Topbar from "components/Topbar";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog";
import { DialogTrigger } from "@radix-ui/react-dialog";
import Swal from "sweetalert2";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { BookOpenTextIcon, EllipsisVertical } from "lucide-react";
import { useAuthContext } from "hooks/useAuthContext";
import axios from "helper/axios";

const Courses = () => {
  const { user }: any = useAuthContext();
  const [activeTab, setActiveTab] = useState(0);
  const [courseData, setCourseData] = useState([]);

  const [formData, setFormData] = useState({
    course_name: "",
    description: "",
    standards: [
      {
        standard_name: "",
        subjects: [
          {
            subject_name: "",
            modules: [
              {
                module_name: "",
              },
            ],
          },
        ],
      },
    ],
  });

  const handleInputChange = (fieldName: any, value: any) => {
    setFormData((prevData) => ({
      ...prevData,
      [fieldName]: value,
    }));
  };

  const handleStandardChange = (value) => {
    setFormData((prevData) => ({
      ...prevData,
      standards: [{ ...prevData.standards[0], standard_name: value }],
    }));
  };
  
  const handleSubjectChange = (value) => {
    setFormData((prevData) => ({
      ...prevData,
      standards: [{
        ...prevData.standards[0],
        subjects: [{ ...prevData.standards[0].subjects[0], subject_name: value }],
      }],
    }));
  };
  
  const handleModuleChange = (value) => {
    setFormData((prevData) => ({
      ...prevData,
      standards: [{
        ...prevData.standards[0],
        subjects: [{
          ...prevData.standards[0].subjects[0],
          modules: [{ ...prevData.standards[0].subjects[0].modules[0], module_name: value }],
        }],
      }],
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await axios.post("/api/courses_create/", formData , {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      });

      Swal.fire({
        icon: "success",
        title: `Course Created Successfully`,
        showConfirmButton: false,
        timer: 1500,
      });
      // Optionally, reset form or fetch updated course data
      getCourseData();
    } catch (error) {
      console.error("Error Creating User", error);
      Swal.fire({
        icon: "error",
        title: "Error creating course.",
        text: error?.response?.data?.message || "Please try again later.",
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };

  const getCourseData = async () => {
    try {
      const response = await axios.get("api/courses/unique", {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      setCourseData(response?.data?.unique_courses);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getCourseData();
  }, []);

  return (
    <>
      <Topbar heading={"Courses"} />
      <div className="container py-5">
        <Dialog>
          <div className="flex justify-end">
            <DialogTrigger asChild>
              <Button className="bg-teal-900 hover:!bg-blue-900">
                Create Course
              </Button>
            </DialogTrigger>
          </div>
          <DialogContent>
            <DialogHeader>Add courses here</DialogHeader>
            <form onSubmit={handleSubmit} className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="user_name" className="text-right">
                  Course
                </Label>
                <Input
                  id="user_name"
                  name="user_name"
                  type="text"
                  className="col-span-3"
                  value={formData.course_name}
                  onChange={(e) =>
                    handleInputChange("course_name", e.target.value)
                  }
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="standard_name" className="text-right">
                  Standard
                </Label>
                <Input
                  id="standard_name"
                  name="standard_name"
                  type="text"
                  className="col-span-3"
                  value={formData.standards[0].standard_name}
                  onChange={(e) => handleStandardChange(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="subject_name" className="text-right">
                  Subject
                </Label>
                <Input
                  id="subject_name"
                  name="subject_name"
                  type="text"
                  className="col-span-3"
                  value={formData.standards[0].subjects[0].subject_name}
                  onChange={(e) => handleSubjectChange(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="module_name" className="text-right">
                  Module
                </Label>
                <Input
                  id="module_name"
                  name="module_name"
                  type="text"
                  className="col-span-3"
                  value={
                    formData.standards[0].subjects[0].modules[0].module_name
                  }
                  onChange={(e) => handleModuleChange(e.target.value)}
                />
              </div>
              <DialogFooter>
                <Button type="submit">Add</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
        {/* <h1 className="text-2xl font-bold">Courses</h1> */}
      </div>
      <div className="ruby-disp space-x-4 p-4  sm:flex-col sm:p-7 ">
        {courseData.map((tab, index) => (
          <div
            key={index}
            className={`flex m-5 items-center justify-between md:h-20 sm:ml-4 p-4 w-1/3 sm:w-full sm:mb-5 bg-white rounded-lg shadow-md cursor-pointer ${
              index === activeTab ? "border-2 border-gray-300" : "border"
            }`}
            onClick={() => setActiveTab(index)}
          >
            <div className="flex items-center">
              <BookOpenTextIcon className="w-10 h-10 text-gray-600 p-2 rounded-[5px] bg-[#BCBCBC]" />
              <div className="m-5">
                <span className="block font-semibold text-gray-800">{tab}</span>
              </div>
            </div>
            <div className="text-gray-400">
              <EllipsisVertical />
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Courses;
