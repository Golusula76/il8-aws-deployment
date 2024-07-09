import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "../helper/axios";

export const useSignup = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const signup = async (
    user_name: any,
    user_email: any,
    user_password: any,
    phone_no: any
  ) => {
    setError(null);
    setIsLoading(true);
    try {
      const response = await axios.post(`api/insert/lms_user`, {
        user_name,
        user_email,
        user_password,
        phone_no,
      });
      if (response.data.status_code === 500) {
        throw new Error("Email Already in Use");
      }
      if (response.data.status_code === 400) {
        throw new Error(response.data.detail);
      }
      setIsLoading(false);
      Swal.fire({
        title: "Account Created!",
        text: "Kindly Login to Continue.",
        icon: "success",
      }).then((result: { isConfirmed: any }) => {
        if (result.isConfirmed) {
          navigate("/login");
        }
      });
      // localStorage.setItem("user", JSON.stringify(response.data));
      // dispatch({ type: "LOGIN", payload: response.data });
    } catch (error) {
      setError(error);
      setIsLoading(false);
    }
  };

  return { signup, isLoading, error, setError };
};
