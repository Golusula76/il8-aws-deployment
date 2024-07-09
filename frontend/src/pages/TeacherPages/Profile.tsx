import { Button } from "@/components/ui/button";
import { Input } from "components";
import Topbar from "components/Topbar";
import axios from "helper/axios";
import { useAuthContext } from "hooks/useAuthContext";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";

const TeacherProfile = () => {
  const { user }: any = useAuthContext();
  const [teacherId, setTeacherId] = useState("");
  const [userData, setUserData] = useState<any>({
    name: "",
    email: "",
    contact_info: {
      primary_number: "",
      secondary_number: "",
      primary_email_id: "",
      secondary_email_id: "",
      current_address: "",
      permanent_address: "",
    },
    dependent: {
      dependent_name: "",
      relation: "",
      date_of_birth: "",
    },
    education: {
      education_level: "",
      institution: "",
      specialization: "",
      field_of_study: "",
      year_of_passing: null,
      percentage: null,
    },
    emergency_contact: {
      emergency_contact_name: "",
      relation: "",
      emergency_contact_number: null,
    },
    languages_spoken: {
      languages: "",
    },
    skill: {
      skill: "",
      certification: "",
      license: "",
    },
  });
  const [show, setShow] = useState(false);

  const getMyData = async () => {
    try {
      const response = await axios.get(`api/teachers/${user.user_id}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      setUserData(response?.data);
      setTeacherId(response?.data?.Teacher_id);
      setShow(true);
    } catch (error) {
      console.error("Error getting Profile", error);
    }
  };

  useEffect(() => {
    getMyData();
  }, []);

  // post Data
  const [formData, setFormData] = useState<any>({
    teacher_data: {
      name: "",
      email: "",
      department: "",
    },
    employee: {
      f_name: "",
      m_name: "",
      l_name: "",
      dob: "",
      gender: "",
      nationality: "",
      marital_status: "",
      citizenship_status: "",
      date_of_hire: "",
      date_of_termination: "",
    },
    teacher_contact_info: {
      primary_number: "",
      secondary_number: "",
      primary_email_id: "",
      secondary_email_id: "",
      current_address: "",
      permanent_address: "",
    },
    dependent: {
      dependent_name: "",
      realtion: "",
      date_of_birth: "",
    },
    education: {
      education_level: "",
      institution: "",
      specialization: "",
      field_of_study: "",
      year_of_passing: "",
      percentage: "",
    },
    skill: {
      skill: "",
      certification: "",
      license: "",
    },
    emergency_contact: {
      emergency_contact_name: "",
      relation: "",
      emergency_contact_number: "",
    },
    languages_spoken: {
      languages: "",
    },
  });

  const handleChange = (section, field, value) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [section]: {
        ...prevFormData[section],
        [field]: value,
      },
    }));
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    axios
      .post("api/teachers/", formData, {
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
      })
      .catch((error) => {
        console.error("Error submitting data:", error);
      });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setUserData({
      ...userData,
      [name]: value,
    });
  };

  const handleNestedInputChange = (e, section) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [section]: {
        ...userData[section],
        [name]: value,
      },
    });
  };

  const handleUpdate = (e: any) => {
    const updateData = {
      teacher_update_data: {
        name: userData.name,
        email: userData.email,
      },
      contact_info: {
        primary_number: userData.contact_info.primary_number,
        secondary_number: userData.contact_info.secondary_number,
        primary_email_id: userData.contact_info.primary_email_id,
        secondary_email_id: userData.contact_info.secondary_email_id,
        current_address: userData.contact_info.current_address,
        permanent_address: userData.contact_info.permanent_address,
      },
      dependent: {
        dependent_name: userData.dependent.dependent_name,
        relation: userData.dependent.relation,
        date_of_birth: userData.dependent.date_of_birth,
      },
      education: {
        education_level: userData.education.education_level,
        institution: userData.education.institution,
        specialization: userData.education.specialization,
        field_of_study: userData.education.field_of_study,
        year_of_passing: userData.education.year_of_passing,
        percentage: userData.education.percentage,
      },
      emergency_contact: {
        emergency_contact_name:
          userData.emergency_contact.emergency_contact_name,
        relation: userData.emergency_contact.relation,
        emergency_contact_number:
          userData.emergency_contact.emergency_contact_number,
      },
      languages_spoken: {
        languages: userData.languages_spoken.languages,
      },
      skill: {
        skill: userData.skill.skill,
        certification: userData.skill.certification,
        license: userData.skill.license,
      },
    };
    e.preventDefault();
    axios
      .put(`/api/teachers/${teacherId}`, updateData, {
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        Swal.fire({
          icon: "success",
          title: `Profile updated successfully`,
          confirmButtonText: "OK",
        });
      })
      .catch((error) => {
        console.log(error);
        Swal.fire({
          title: "Data was not updated successfully",
          icon: "error",
          confirmButtonText: "OK",
        });
      });
  };

  return (
    <>
      <Topbar heading={"Profile"} />

      {/* form get data  */}
      {show ? (
        <form onSubmit={handleUpdate}>
          <div className="flex lg:flex-col">
            <div className="p-5 w-[40%] lg:w-[90%] sm:w-[180%] sm:overflow-x-scroll ">
              <div className="font-semibold	text-[16px] mb-4 ml-1">
                Contact Details
              </div>
              <div className="h-full rounded-[10px] shadow-lg -w-[35%] p-4 text-[14px]">
                <div className="flex justify-between border-b-2 pb-2">
                  <span className="font-semibold w-[30%] text-indigo-500 text-[18px]">
                    Name :
                  </span>
                  <input
                    className="w-[60%]"
                    type="text"
                    value={userData?.name}
                    name="name"
                    onChange={handleInputChange}
                  />
                </div>
                <div className="flex justify-between border-b-2 py-2">
                  <span className="font-semibold w-[30%] text-indigo-500 text-[18px]">
                    Primary Email :
                  </span>
                  <input
                    className="w-[60%]"
                    type="text"
                    value={userData?.contact_info?.primary_email_id}
                    name="primary_email_id"
                    onChange={(e) => handleNestedInputChange(e, "contact_info")}
                  />
                </div>
                <div className="flex justify-between border-b-2 py-2">
                  <span className="font-semibold w-[30%] text-indigo-500 text-[18px]">
                    Secondary Email :
                  </span>
                  <input
                    className="w-[60%]"
                    value={userData?.contact_info?.secondary_email_id || "-"}
                    type="text"
                    name="secondary_email_id"
                    onChange={(e) => handleNestedInputChange(e, "contact_info")}
                  />
                </div>
                <div className="flex justify-between border-b-2 py-2">
                  <span className="font-semibold w-[30%] text-indigo-500 text-[18px]">
                    Address :
                  </span>
                  <input
                    className="w-[60%]"
                    value={userData?.contact_info?.current_address}
                    type="text"
                    name="current_address"
                    onChange={(e) => handleNestedInputChange(e, "contact_info")}
                  />
                </div>
                <div className="flex justify-between border-b-2 py-2">
                  <span className="font-semibold w-[30%] text-indigo-500 text-[18px]">
                    Primary No :
                  </span>
                  <input
                    className="w-[60%]"
                    value={userData?.contact_info?.primary_number}
                    type="number"
                    name="primary_number"
                    onChange={(e) => handleNestedInputChange(e, "contact_info")}
                  />
                </div>
                <div className="flex justify-between border-b-2 py-2">
                  <span className="font-semibold w-[30%] text-indigo-500 text-[18px]">
                    Secondary No :
                  </span>
                  <input
                    className="w-[60%]"
                    value={userData?.contact_info?.secondary_number || "-"}
                    type="number"
                    name="secondary_number"
                    onChange={(e) => handleNestedInputChange(e, "contact_info")}
                  />
                </div>
                <div className="flex justify-between border-b-2 py-2">
                  <span className="font-semibold w-[30%] text-indigo-500 text-[18px]">
                    Date of birth :
                  </span>
                  <input
                    className="w-[60%]"
                    value={userData?.dependent?.date_of_birth || "-"}
                    type="date"
                    name="date_of_birth"
                    onChange={(e) => handleNestedInputChange(e, "dependent")}
                  />
                </div>
                <div className="flex justify-between border-b-2 py-2">
                  <span className="font-semibold w-[30%] text-indigo-500 text-[18px]">
                    Dependant name :
                  </span>
                  <input
                    className="w-[60%]"
                    value={userData?.dependent?.dependent_name || "-"}
                    type="text"
                    name="dependent_name"
                    onChange={(e) => handleNestedInputChange(e, "dependent")}
                  />
                </div>
                <div className="flex justify-between border-b-2 py-2">
                  <span className="font-semibold w-[30%] text-indigo-500 text-[18px]">
                    Language :
                  </span>
                  <input
                    className="w-[60%]"
                    value={userData?.languages_spoken?.languages || "-"}
                    type="text"
                    name="languages"
                    onChange={(e) =>
                      handleNestedInputChange(e, "languages_spoken")
                    }
                  />
                </div>
              </div>
            </div>

            {/* Education Information */}

            <div className="w-[40%] lg:w-[90%] sm:w-[170%] sm:overflow-x-scroll">
              <div className="p-5">
                <div className="font-semibold	text-[16px] mb-4 ml-1">
                  Education Details
                </div>
                <div className=" rounded-[10px] shadow-lg -w-[35%] p-4 text-[14px]">
                  <div className="flex justify-between border-b-2 pb-2">
                    <span className="font-semibold w-[30%] text-indigo-500 text-[18px]">
                      Education :
                    </span>
                    <input
                      className="w-[60%]"
                      type="text"
                      value={userData?.education?.education_level}
                      name="education_level"
                      onChange={(e) => handleNestedInputChange(e, "education")}
                    />
                  </div>
                  <div className="flex justify-between border-b-2 py-2">
                    <span className="font-semibold w-[30%] text-indigo-500 text-[18px]">
                      Study :
                    </span>
                    <input
                      className="w-[60%]"
                      type="text"
                      value={userData?.education?.field_of_study}
                      name="field_of_study"
                      onChange={(e) => handleNestedInputChange(e, "education")}
                    />
                  </div>
                  <div className="flex justify-between border-b-2 py-2">
                    <span className="font-semibold w-[30%] text-indigo-500 text-[18px]">
                      Institution :
                    </span>
                    <input
                      className="w-[60%]"
                      value={userData?.education?.institution || "-"}
                      type="text"
                      name="institution"
                      onChange={(e) => handleNestedInputChange(e, "education")}
                    />
                  </div>
                  <div className="flex justify-between border-b-2 py-2">
                    <span className="font-semibold w-[30%] text-indigo-500 text-[18px]">
                      Specialization :
                    </span>
                    <input
                      className="w-[60%]"
                      value={userData?.education?.specialization}
                      type="text"
                      name="specialization"
                      onChange={(e) => handleNestedInputChange(e, "education")}
                    />
                  </div>
                  <div className="flex justify-between border-b-2 py-2">
                    <span className="font-semibold w-[30%] text-indigo-500 text-[18px]">
                      Percentage :
                    </span>
                    <input
                      className="w-[60%]"
                      value={userData?.education?.percentage}
                      type="number"
                      name="percentage"
                      onChange={(e) => handleNestedInputChange(e, "education")}
                    />
                  </div>
                  <div className="flex justify-between border-b-2 py-2">
                    <span className="font-semibold w-[30%] text-indigo-500 text-[18px]">
                      Passing year :
                    </span>
                    <input
                      className="w-[60%]"
                      value={userData?.education?.year_of_passing || "-"}
                      type="number"
                      name="year_of_passing"
                      onChange={(e) => handleNestedInputChange(e, "education")}
                    />
                  </div>
                </div>
              </div>

              {/* Certification Details */}

              <div className="p-5 ">
                <div className="font-semibold	text-[16px] mb-4 ml-1">Skills</div>
                <div className=" rounded-[10px] shadow-lg -w-[35%] p-4 text-[14px]">
                  <div className="flex justify-between border-b-2 pb-2 text-[14px]">
                    <span className="font-semibold w-[30%] text-indigo-500 text-[18px]">
                      Certification :
                    </span>
                    <input
                      className="w-[60%]"
                      value={userData?.skill?.certification}
                      type="text"
                      name="certification"
                      onChange={(e) => handleNestedInputChange(e, "skill")}
                    />
                  </div>
                  <div className="flex justify-between border-b-2 py-2 text-[14px]">
                    <span className="font-semibold w-[30%] text-indigo-500 text-[18px]">
                      License :
                    </span>
                    <input
                      className="w-[60%]"
                      value={userData?.skill?.license}
                      type="text"
                      name="license"
                      onChange={(e) => handleNestedInputChange(e, "skill")}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="my-[50px] text-center">
            <Button
              size="lg"
              type="submit"
              className="  font-bold max-w-[250px]   z-10 transition hover:bg-white-A700 border bg-deep_orange-500 hover:text-deep_orange-500 border-deep_orange-500"
            >
              Update
            </Button>
          </div>
        </form>
      ) : (
        <form onSubmit={handleSubmit} className="p-[20px]">
          {/* Teacher Data */}
          <div className="flex p-3 border-2 border-[grey] w-[40%] rounded-[10px] mb-3">
            <label>Name:</label>
            <input
              type="text"
              name="name"
              className="border-b-2 border-[black]"
              value={formData.teacher_data.name}
              onChange={(e) =>
                handleChange("teacher_data", "name", e.target.value)
              }
            />
          </div>
          <div className="flex p-3 border-2 border-[grey] w-[40%] rounded-[10px] mb-3">
            <label>Email:</label>
            <input
              type="text"
              name="email"
              value={formData.teacher_data.email}
              onChange={(e) =>
                handleChange("teacher_data", "email", e.target.value)
              }
            />
          </div>
          <div className="flex p-3 border-2 border-[grey] w-[40%] rounded-[10px] mb-3">
            <label>Department:</label>
            <input
              type="text"
              name="department"
              value={formData.teacher_data.department}
              onChange={(e) =>
                handleChange("teacher_data", "department", e.target.value)
              }
            />
          </div>
          {/* Employee */}
          <div className="flex p-3 border-2 border-[grey] w-[40%] rounded-[10px] mb-3">
            <label>First Name :</label>
            <input
              type="text"
              name="f_name"
              value={formData.employee.f_name}
              onChange={(e) =>
                handleChange("employee", "f_name", e.target.value)
              }
            />
          </div>
          <div className="flex p-3 border-2 border-[grey] w-[40%] rounded-[10px] mb-3">
            <label>Middle Name:</label>
            <input
              type="text"
              name="m_name"
              value={formData.employee.m_name}
              onChange={(e) =>
                handleChange("employee", "m_name", e.target.value)
              }
            />
          </div>
          <div className="flex p-3 border-2 border-[grey] w-[40%] rounded-[10px] mb-3">
            <label>Last Name:</label>
            <input
              type="text"
              name="l_name"
              value={formData.employee.l_name}
              onChange={(e) =>
                handleChange("employee", "l_name", e.target.value)
              }
            />
          </div>
          <div className="flex p-3 border-2 border-[grey] w-[40%] rounded-[10px] mb-3">
            <label>DOB:</label>
            <input
              type="date"
              name="dob"
              value={formData.employee.dob}
              onChange={(e) => handleChange("employee", "dob", e.target.value)}
            />
          </div>
          <div className="flex p-3 border-2 border-[grey] w-[40%] rounded-[10px] mb-3">
            <label>Gender:</label>
            <input
              type="text"
              name="gender"
              value={formData.employee.gender}
              onChange={(e) =>
                handleChange("employee", "gender", e.target.value)
              }
            />
          </div>
          <div className="flex p-3 border-2 border-[grey] w-[40%] rounded-[10px] mb-3">
            <label>Nationality:</label>
            <input
              type="text"
              name="nationality"
              value={formData.employee.nationality}
              onChange={(e) =>
                handleChange("employee", "nationality", e.target.value)
              }
            />
          </div>
          <div className="flex p-3 border-2 border-[grey] w-[40%] rounded-[10px] mb-3">
            <label>Marital status:</label>
            <input
              type="text"
              name="marital_status"
              value={formData.employee.marital_status}
              onChange={(e) =>
                handleChange("employee", "marital_status", e.target.value)
              }
            />
          </div>
          <div className="flex p-3 border-2 border-[grey] w-[40%] rounded-[10px] mb-3">
            <label>Citizenship status:</label>
            <input
              type="text"
              name="citizenship_status"
              value={formData.employee.citizenship_status}
              onChange={(e) =>
                handleChange("employee", "citizenship_status", e.target.value)
              }
            />
          </div>
          <div className="flex p-3 border-2 border-[grey] w-[40%] rounded-[10px] mb-3">
            <label>Date of hire:</label>
            <input
              type="date"
              name="date_of_hire"
              value={formData.employee.date_of_hire}
              onChange={(e) =>
                handleChange("employee", "date_of_hire", e.target.value)
              }
            />
          </div>
          <div className="flex p-3 border-2 border-[grey] w-[40%] rounded-[10px] mb-3">
            <label>Date of termination:</label>
            <input
              type="date"
              name="date_of_termination"
              value={formData.employee.date_of_termination}
              onChange={(e) =>
                handleChange("employee", "date_of_termination", e.target.value)
              }
            />
          </div>
          {/* {teacher_contact_info} */}
          <div className="flex p-3 border-2 border-[grey] w-[40%] rounded-[10px] mb-3">
            <label>Primary No:</label>
            <input
              type="text"
              name="primary_number"
              value={formData.teacher_contact_info.primary_number}
              onChange={(e) =>
                handleChange(
                  "teacher_contact_info",
                  "primary_number",
                  e.target.value
                )
              }
            />
          </div>
          <div className="flex p-3 border-2 border-[grey] w-[40%] rounded-[10px] mb-3">
            <label>Secondary No:</label>
            <input
              type="text"
              name="secondary_number"
              value={formData.teacher_contact_info.secondary_number}
              onChange={(e) =>
                handleChange(
                  "teacher_contact_info",
                  "secondary_number",
                  e.target.value
                )
              }
            />
          </div>
          <div className="flex p-3 border-2 border-[grey] w-[40%] rounded-[10px] mb-3">
            <label>Primary email:</label>
            <input
              type="text"
              name="primary_email_id"
              value={formData.teacher_contact_info.primary_email_id}
              onChange={(e) =>
                handleChange(
                  "teacher_contact_info",
                  "primary_email_id",
                  e.target.value
                )
              }
            />
          </div>
          <div className="flex p-3 border-2 border-[grey] w-[40%] rounded-[10px] mb-3">
            <label>Secondary email:</label>
            <input
              type="text"
              name="secondary_email_id"
              value={formData.teacher_contact_info.secondary_email_id}
              onChange={(e) =>
                handleChange(
                  "teacher_contact_info",
                  "secondary_email_id",
                  e.target.value
                )
              }
            />
          </div>
          <div className="flex p-3 border-2 border-[grey] w-[40%] rounded-[10px] mb-3">
            <label>Current Address:</label>
            <input
              type="text"
              name="current_address"
              value={formData.teacher_contact_info.current_address}
              onChange={(e) =>
                handleChange(
                  "teacher_contact_info",
                  "current_address",
                  e.target.value
                )
              }
            />
          </div>
          <div className="flex p-3 border-2 border-[grey] w-[40%] rounded-[10px] mb-3">
            <label>Permanent address :</label>
            <input
              type="text"
              name="primary_number"
              value={formData.teacher_contact_info.permanent_address}
              onChange={(e) =>
                handleChange(
                  "teacher_contact_info",
                  "permanent_address",
                  e.target.value
                )
              }
            />
          </div>
          {/* Dependent */}
          <div className="flex p-3 border-2 border-[grey] w-[40%] rounded-[10px] mb-3">
            <label>Dependent Name:</label>
            <input
              type="text"
              name="dependent_name"
              value={formData.dependent.dependent_name}
              onChange={(e) =>
                handleChange("dependent", "dependent_name", e.target.value)
              }
            />
          </div>
          <div className="flex p-3 border-2 border-[grey] w-[40%] rounded-[10px] mb-3">
            <label>Relation:</label>
            <input
              type="text"
              name="realtion"
              value={formData.dependent.realtion}
              onChange={(e) =>
                handleChange("dependent", "realtion", e.target.value)
              }
            />
          </div>
          <div className="flex p-3 border-2 border-[grey] w-[40%] rounded-[10px] mb-3">
            <label>Date of Birth:</label>
            <input
              type="date"
              name="date_of_birth"
              value={formData.dependent.date_of_birth}
              onChange={(e) =>
                handleChange("dependent", "date_of_birth", e.target.value)
              }
            />
          </div>
          {/* {Education} */}
          <div className="flex p-3 border-2 border-[grey] w-[40%] rounded-[10px] mb-3">
            <label>Education level:</label>
            <input
              type="text"
              name="education_level"
              value={formData.education.education_level}
              onChange={(e) =>
                handleChange("education", "education_level", e.target.value)
              }
            />
          </div>
          <div className="flex p-3 border-2 border-[grey] w-[40%] rounded-[10px] mb-3">
            <label>Institution:</label>
            <input
              type="text"
              name="institution"
              value={formData.education.institution}
              onChange={(e) =>
                handleChange("education", "institution", e.target.value)
              }
            />
          </div>
          <div className="flex p-3 border-2 border-[grey] w-[40%] rounded-[10px] mb-3">
            <label>Specialization:</label>
            <input
              type="text"
              name="specialization"
              value={formData.education.specialization}
              onChange={(e) =>
                handleChange("education", "specialization", e.target.value)
              }
            />
          </div>
          <div className="flex p-3 border-2 border-[grey] w-[40%] rounded-[10px] mb-3">
            <label>Field of study:</label>
            <input
              type="text"
              name="field_of_study"
              value={formData.education.field_of_study}
              onChange={(e) =>
                handleChange("education", "field_of_study", e.target.value)
              }
            />
          </div>
          <div className="flex p-3 border-2 border-[grey] w-[40%] rounded-[10px] mb-3">
            <label>Year of passing:</label>
            <input
              type="number"
              name="year_of_passing"
              value={formData.education.year_of_passing}
              onChange={(e) =>
                handleChange("education", "year_of_passing", e.target.value)
              }
            />
          </div>
          <div className="flex p-3 border-2 border-[grey] w-[40%] rounded-[10px] mb-3">
            <label>Percentage:</label>
            <input
              type="text"
              name="percentage"
              value={formData.education.percentage}
              onChange={(e) =>
                handleChange("education", "percentage", e.target.value)
              }
            />
          </div>
          {/* {Skill} */}
          <div className="flex p-3 border-2 border-[grey] w-[40%] rounded-[10px] mb-3">
            <label>Skill:</label>
            <input
              type="text"
              name="skill"
              value={formData.skill.skill}
              onChange={(e) => handleChange("skill", "skill", e.target.value)}
            />
          </div>
          <div className="flex p-3 border-2 border-[grey] w-[40%] rounded-[10px] mb-3">
            <label>Certification:</label>
            <input
              type="text"
              name="certification"
              value={formData.skill.certification}
              onChange={(e) =>
                handleChange("skill", "certification", e.target.value)
              }
            />
          </div>
          <div className="flex p-3 border-2 border-[grey] w-[40%] rounded-[10px] mb-3">
            <label>License:</label>
            <input
              type="text"
              name="license"
              value={formData.skill.license}
              onChange={(e) => handleChange("skill", "license", e.target.value)}
            />
          </div>
          {/* {Emergency Contact} */}
          <div className="flex p-3 border-2 border-[grey] w-[40%] rounded-[10px] mb-3">
            <label>Emergency Contact Name:</label>
            <input
              type="text"
              name="emergency_contact_name"
              value={formData.emergency_contact.emergency_contact_name}
              onChange={(e) =>
                handleChange(
                  "emergency_contact",
                  "emergency_contact_name",
                  e.target.value
                )
              }
            />
          </div>
          <div className="flex p-3 border-2 border-[grey] w-[40%] rounded-[10px] mb-3">
            <label>Relation:</label>
            <input
              type="text"
              name="relation"
              value={formData.emergency_contact.relation}
              onChange={(e) =>
                handleChange("emergency_contact", "relation", e.target.value)
              }
            />
          </div>
          <div className="flex p-3 border-2 border-[grey] w-[40%] rounded-[10px] mb-3">
            <label>Emergency Contact Number:</label>
            <input
              type="text"
              name="emergency_contact_number"
              value={formData.emergency_contact.emergency_contact_number}
              onChange={(e) =>
                handleChange(
                  "emergency_contact",
                  "emergency_contact_number",
                  e.target.value
                )
              }
            />
          </div>
          {/* {Language spoken} */}
          <div className="flex p-3 border-2 border-[grey] w-[40%] rounded-[10px] mb-3">
            <label>Language Known:</label>
            <input
              type="text"
              name="emergency_contact_number"
              value={formData.languages_spoken.languages}
              onChange={(e) =>
                handleChange("languages_spoken", "languages", e.target.value)
              }
            />
          </div>

          <button
            type="submit"
            className="border-2 border-[grey] py-3 px-6 rounded-[10px] bg-sky-500 hover:bg-sky-700"
          >
            Submit
          </button>
        </form>
      )}

      {/* post form data */}
    </>
  );
};

export default TeacherProfile;
