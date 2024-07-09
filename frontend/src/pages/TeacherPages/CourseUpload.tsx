import Topbar from "components/Topbar";
import React from "react";
import { Input } from "@/components/ui/input";
import { TextArea } from "components";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

const CourseUpload = () => {
  return (
    <>
      {/* <div className="container py-5 sm:text-left sm:m-[-12px]">My Courses</div> */}
      <div className="mx-10 md:mx-6 md:mt-6 xs:mr-6 mt-10 sm:mb-8 sm:ml-4 my-56 mr-6 border-2 border-[black] p-5 rounded-[20px] md:w-[170%] xs:w-[125%] sm:w-[90%] sm:p-3 sm:mx-5">
        <div className="flex sm:flex-col gap-5  sm:gap-0  justify-between  ">
          <div className="w-[30%]">
            <div>
              <h1 className="text-start font-semibold mb-3">Courses</h1>
              <input
                type="text"
                className="flex mb-12 sm:mb-4 h-12 !bg-[#002D51] sm:w-[330%]  text-white-A700 !rounded-md border !border-slate-200 bg-white !px-3 !py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:ring-offset-slate-950 dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-300"
              />
            </div>
            <div>
              <h1 className="text-start font-semibold mb-3">Standard</h1>
              <input
                type="text"
                className="flex h-12 mb-12 sm:mb-4 !bg-[#002D51] sm:w-[330%] text-white-A700 !rounded-md border !border-slate-200 bg-white !px-3 !py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:ring-offset-slate-950 dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-300"
              />
            </div>
            <div>
              <h1 className="text-start font-semibold mb-3">Subject</h1>
              <input
                type="text"
                className="flex mb-12 h-12 sm:mb-4 !bg-[#002D51] sm:w-[330%]  text-white-A700 !rounded-md border !border-slate-200 bg-white !px-3 !py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:ring-offset-slate-950 dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-300"
              />
            </div>
          </div>
          <div className="w-[30%]">
            <div>
              <h1 className="text-start font-semibold mb-3">Lesson name</h1>
              <input
                type="text"
                className="flex  mb-12 h-12 sm:mb-4 !bg-[#002D51] sm:w-[330%]  text-white-A700 !rounded-md border !border-slate-200 bg-white !px-3 !py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:ring-offset-slate-950 dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-300"
              />
            </div>
            <div>
              <h1 className="text-start font-semibold mb-3">Module</h1>
              <input
                type="text"
                className="flex h-12 mb-12 sm:mb-4 !bg-[#002D51] sm:w-[330%]  text-white-A700 !rounded-md border !border-slate-200 bg-white !px-3 !py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:ring-offset-slate-950 dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-300"
              />
            </div>
            <div>
              <div>
                <h1 className="text-start font-semibold mb-3">Description</h1>
                <input
                  type="text"
                  className="flex h-12 mb-12 sm:mb-4 !bg-[#002D51] sm:w-[330%]  text-white-A700 !rounded-md border !border-slate-200 bg-white !px-3 !py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:ring-offset-slate-950 dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-300"
                />
              </div>
            </div>
          </div>
          <div className="max-w-md mx-auto p-6">
            <h2 className="text-2xl font-bold mb-4 text-center sm:text-[20px]">
              Upload files
            </h2>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <div className="mb-4">
                <svg
                  className="mx-auto h-12 w-12 text-blue-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
              </div>
              <p className="text-lg mb-2 text-center ">
                <input
                  className=" sm:text-[11px] flex  justify-center p-3"
                  type="file"
                  placeholder="browse files"
                />
              </p>
              <p className="text-sm text-gray-500 sm:text-[10px]">
                Supported formats: JPEG, PNG, GIF, MP4, PDF, PSD, Word
              </p>
            </div>
          </div>
          {/* <button></button> */}
        </div>
        <div className="flex-none">
          <Button
            size="lg"
            className="flex my-0 mx-auto  z-10 transition hover:bg-white-A700 border hover:text-deep_orange-500 border-deep_orange-500 bg-deep_orange-500"
          >
            Add Content
          </Button>
        </div>
      </div>
    </>
  );
};

export default CourseUpload;
