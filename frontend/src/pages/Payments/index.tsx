import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import profileImg from "assets/profile.jpg";
import qrcode from "assets/QRCode.png";
import { Heading, Input } from "components";
import { useAuthContext } from "hooks/useAuthContext";
import { Button } from "@/components/ui/button";
import FormatPrice from "helper/FormatPrice";
import Swal from "sweetalert2";
import axios from "helper/axios";
import { useNavigate } from "react-router-dom";

const Payments = () => {
  const navigate = useNavigate();
  const [batchSize, setBatchSize] = useState<number>(0);
  const [batchData, setBatchData] = useState<any>([]);
  const [amount, setAmount] = useState<number>(0);
  const [feesAmoutCh, setFeesAmoutCh] = useState<boolean>(false);
  const [years, setYears] = useState<number>(0);
  const [paymentMode, setPaymentMode] = useState<string>("");
  const [paymentInfo, setPaymentInfo] = useState<string>("");
  const [otherInfo, setOtherInfo] = useState<string>("");
  const { user }: any = useAuthContext();
  const [loading, setLoading] = useState<boolean>(false);
  const [reqData, setReqData] = useState<any>([]);
  const [courseData, setCourseData] = useState<any>({
    course: "",
    standard: "",
    subject: "",
    module: "",
  });

  const [finalData, setFinalData] = useState({
    course_id: 0,
    standard_id: 0,
    subject_id: 0,
    module_id: 0,
    batch_id: 0,
    years: 0,
    amount: 0,
    payment_mode: "",
    payment_info: "",
    other_info: "",
  });

  useEffect(() => {
    fetchReqData();
    getBatches();
  }, [user]);

  // useEffect(() => {
  //   getFees();
  // }, [batchSize !== 0, reqData]);

  const getBatches = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/batches/`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      });
      setBatchData(await response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching batches", error);
      setLoading(false);
    }
  };

  const getFees = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `api/fees/bycriteria?course_id=${reqData?.course_details?.courses?.id}&standard_id=${reqData?.course_details?.standards?.id}&year=${years}&subject_id=${reqData?.course_details?.subjects?.id}&module_id=${reqData?.course_details?.modules?.id}&batch_id=${batchSize}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      setAmount(response?.data?.amount);
      setFeesAmoutCh(true);
      setLoading(false);
    } catch (error) {
      console.error("Error Fetching Fees Data", error);
      setLoading(false);
      setFeesAmoutCh(false);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error?.response?.data?.detail,
      });
    }
  };

  const fetchReqData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/admission/${user.user_id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      });
      setReqData(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error Fetching ReqData", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const courseResponse = await axios.get(
          `api/courses/${reqData?.course_details?.courses?.id}`
        );
        const standardResponse = await axios.get(
          `api/standards/${reqData?.course_details?.standards?.id}`
        );
        const subjectResponse = await axios.get(
          `api/subjects/${reqData?.course_details?.subjects?.id}`
        );
        const moduleResponse = await axios.get(
          `api/modules/${reqData?.course_details?.modules?.id}`
        );
        setCourseData({
          course: courseResponse.data.name,
          standard: standardResponse.data.name,
          subject: subjectResponse.data.name,
          module: moduleResponse.data.name,
        });
      } catch (error) {
        console.error("An error occurred", error);
      }
    };
    fetchData();
  }, [reqData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (paymentMode === "online") {
      if (paymentInfo === "") {
        Swal.fire({
          title: "Please Enter Payment Details",
          icon: "error",
        });
        return;
      }
    }

    const finalData = {
      course_id: reqData?.course_details?.courses?.id,
      standard_id: reqData?.course_details?.standards?.id,
      subject_id: reqData?.course_details?.subjects?.id,
      module_id: reqData?.course_details?.modules?.id,
      batch_id: batchSize,
      years: years,
      amount: amount,
      payment_mode: paymentMode,
      payment_info: paymentInfo,
      other_info: otherInfo,
    };

    try {
      setLoading(true);
      const response = await axios.post(`api/payments/insert/`, finalData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      });
      setLoading(false);
      Swal.fire({
        icon: "success",
        // title: "Payment Successful",
        text: "Thank you for Enrolling to ILATE, Kindly Wait for the Response from Admission Office",
      }).then((result: { isConfirmed: any }) => {
        if (result.isConfirmed) {
          setLoading(false);
          navigate("/");
        }
      });
    } catch (error) {
      console.error("Error in Payment", error);
      setLoading(false);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error?.response?.data?.detail,
      });
    }
  };
  // const handleSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   if (paymentMode === "online") {
  //     if (batchSize === 0) {
  //       Swal.fire({
  //         title: "Please Select Batch Size",
  //         icon: "error",
  //       });
  //       return;
  //     }
  //     if (paymentInfo === "") {
  //       Swal.fire({
  //         title: "Please Enter Payment Details",
  //         icon: "error",
  //       });
  //       return;
  //     }
  //   }
  //   if (paymentMode === "offline") {
  //     if (batchSize === 0) {
  //       Swal.fire({
  //         title: "Please Select Batch Size",
  //         icon: "error",
  //       });
  //       return;
  //     }
  //     setPaymentInfo((prev) => (prev = ""));
  //   }
  // };

  const handleFees = async (e: React.FormEvent) => {
    e.preventDefault();
    if (batchSize !== 0 && years !== 0) {
      getFees();
    } else {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Please Select Batch Size and Years",
      });
      return;
    }
  };
  return (
    <>
      <Helmet>
        <title>Payments</title>
      </Helmet>
      <section className="container mx-auto my-10">
        <div className="grid grid-cols-2 sm:grid-cols-1">
          <div className="py-8 px-4 lg:py-16 md:col-span-1">
            <div className="mb-5">
              <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white">
                Payment
              </h1>
              <p className="text-gray-500 mt-2">
                Some Data Has Been Taken From Admission Form You Have Submitted
              </p>
            </div>
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
            <div>
              <h2 className="text-xl font-bold mb-3">
                You Have Enrolled for Below Criterias
              </h2>
              <p className="my-2">
                Course : <strong>{courseData.course}</strong>
              </p>
              <p className="my-2">
                Standard : <strong>{courseData.standard}</strong>
              </p>
              <p className="my-2">
                Subject : <strong>{courseData.subject}</strong>
              </p>
              <p className="my-2">
                Modules : <strong>{courseData.module}</strong>
              </p>
            </div>
            <h2 className="text-xl font-bold mt-4 mb-2">
              Kindly Fill Below Details
            </h2>
            <form onSubmit={handleFees}>
              <div className="flex justify-start items-center">
                <Heading
                  size="s"
                  className="w-full max-w-max mr-4 text-sm font-medium text-gray-900 dark:text-white-A700"
                >
                  Batch Size<span className="text-red-500">*</span>
                </Heading>
                <select
                  name="batchSize"
                  id="batchSize"
                  value={batchSize}
                  className="p-3 my-2 bg-teal-900 border border-teal-90 !text-white-A700 text-sm rounded-[20px] focus:ring-white-A700 focus:border-white-A700 block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                  onChange={(e) => {
                    setBatchSize(parseInt(e.target.value));
                    setPaymentMode("");
                    setPaymentInfo("");
                    setYears(0);
                    setAmount(0);
                  }}
                  required
                >
                  <option value="0">
                    Select a Batch Size You Want to Apply For...
                  </option>
                  {loading ? (
                    <option value={0}>Loading...</option>
                  ) : (
                    batchData?.map((batch: any) => (
                      <option key={batch.id} value={batch.id}>
                        {batch.size}
                      </option>
                    ))
                  )}
                </select>
              </div>
              <div className="flex justify-start items-center my-5">
                <Heading
                  size="s"
                  className="mr-4 w-full max-w-max text-sm font-medium text-gray-900 dark:text-white-A700"
                >
                  Number of Years
                  <span className="text-red-500">*</span>
                </Heading>
                <select
                  name="years"
                  id="years"
                  value={years}
                  className="p-3 my-2 bg-teal-900 border border-teal-90 !text-white-A700 text-sm rounded-[20px] focus:ring-white-A700 focus:border-white-A700 block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                  onChange={(e) => {
                    setYears(parseInt(e.target.value));
                    setPaymentMode("");
                    setPaymentInfo("");
                    setAmount(0);
                  }}
                  required
                >
                  <option value="0">
                    Select Number of Years Admission Taking For...
                  </option>
                  <option value="1">1 Year</option>
                  <option value="2">2 Years</option>
                </select>
                {/* <Input
                size="xs"
                type="text"
                name="years"
                id="years"
                value={years}
                onChange={(value: number) => {
                  setYears(value);
                  setPaymentMode("");
                  setPaymentInfo("");
                }}
                className="w-full max-w-6xl bg-teal-900 border border-teal-90 !text-white-A700 text-sm rounded-md focus:ring-white-A700 focus:border-white-A700 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                placeholder="Enter Number of Years Admission Taking For"
                required
              /> */}
              </div>
              <Button
                variant="ilate"
                className="rounded-[20px]"
                size="lg"
                type="submit"
              >
                Save
              </Button>
            </form>
            {/* {batchSize !== 0 && years !== 0 && years !== null && years > 0 && ( */}
            {amount !== 0 && feesAmoutCh && batchSize !== 0 && years !== 0 && (
              <>
                <h2 className="text-xl font-bold my-2">
                  Fees Amount :{" "}
                  <span className="text-2xl">
                    <FormatPrice price={amount ? amount : 0} />
                  </span>
                  <p className="text-xs text-gray-500 font-medium">
                    Fees Has Been Calculated Based on the Criteria and Batch
                    Size You've Selected
                  </p>
                </h2>
                <div className="my-4 flex">
                  <label className="flex items-center mx-2">
                    <input
                      type="radio"
                      name="payment_method"
                      value="offline"
                      checked={paymentMode === "offline"}
                      onChange={() => {
                        setPaymentMode("offline");
                        setPaymentInfo("");
                        setOtherInfo("");
                      }}
                      required
                    />
                    <span className="ml-1 text-sm">Pay Offline</span>
                  </label>
                  <label className="flex items-center mx-2">
                    <input
                      type="radio"
                      name="payment_method"
                      value="online"
                      checked={paymentMode === "online"}
                      onChange={() => {
                        setPaymentMode("online");
                        setPaymentInfo("");
                        setOtherInfo("");
                      }}
                      required
                    />
                    <span className="ml-1 text-sm">Pay Online</span>
                  </label>
                </div>
                {paymentMode === "" && (
                  <>
                    <p>
                      Kindly Select Payment Method
                      <span className="text-red-500">*</span>
                    </p>
                  </>
                )}
              </>
            )}

            {batchSize !== 0 && paymentMode === "online" ? (
              <>
                <div className="grid gap-3 grid-cols-2">
                  <div className="border border-black-900 rounded-md flex flex-col gap-4 justify-center items-center p-4">
                    <div className="text-center">
                      <h2 className="text-xl font-bold">
                        Pay Via Bank Details
                      </h2>
                      <p className="text-sm text-gray-600">
                        Enter bank details as follows & pay
                      </p>
                    </div>
                    <table className="table-fixed border border-black-900 w-full h-full">
                      <tbody>
                        <tr>
                          <td className="border border-black-900 p-2 font-bold">
                            Account Name
                          </td>
                          <td className="border border-black-900 p-2">ILATE</td>
                        </tr>
                        <tr>
                          <td className="border border-black-900 p-2 font-bold">
                            Account No.
                          </td>
                          <td className="border border-black-900 p-2">
                            50200055073020
                          </td>
                        </tr>
                        <tr>
                          <td className="border border-black-900 p-2 font-bold">
                            Bank
                          </td>
                          <td className="border border-black-900 p-2">
                            HDFC BANK
                          </td>
                        </tr>
                        <tr>
                          <td className="border border-black-900 p-2 font-bold">
                            Branch
                          </td>
                          <td className="border border-black-900 p-2">
                            KANDIVALI EAST - THAKUR COMPLEX
                          </td>
                        </tr>
                        <tr>
                          <td className="border border-black-900 p-2 font-bold">
                            IFSC Code
                          </td>
                          <td className="border border-black-900 p-2">
                            HDFC0000182
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="border border-black-900 rounded-md flex flex-col gap-2 justify-center items-center p-4">
                    <div className="text-center">
                      <h2 className="text-xl font-bold">Pay Via UPI</h2>
                      <p className="text-sm text-gray-600">
                        Scan QR Code To Pay
                      </p>
                    </div>
                    <img src={qrcode} alt="qr_code" />
                  </div>
                </div>
                <div className="flex max-w-6xl justify-start items-center my-5">
                  <Heading
                    size="s"
                    className="w-full max-w-max mr-4 text-sm font-medium text-gray-900 dark:text-white-A700"
                  >
                    Payment Details<span className="text-red-500">*</span>
                  </Heading>
                  <Input
                    size="xs"
                    type="text"
                    name="paymentInfo"
                    id="paymentInfo"
                    value={paymentInfo}
                    onChange={(value: string) => setPaymentInfo(value)}
                    className="w-full max-w-6xl bg-teal-900 border border-teal-90 !text-white-A700 text-sm rounded-md focus:ring-white-A700 focus:border-white-A700 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                    placeholder="Enter Transaction ID or Check Number"
                    required
                  />
                </div>
                <div className="flex max-w-6xl justify-start items-center my-5">
                  <Heading
                    size="s"
                    className="w-full max-w-max mr-4 text-sm font-medium text-gray-900 dark:text-white-A700"
                  >
                    Other Information (Optional)
                  </Heading>
                  <Input
                    size="xs"
                    type="text"
                    name="otherInfo"
                    id="otherInfo"
                    value={otherInfo}
                    onChange={(value: string) => setOtherInfo(value)}
                    className="w-full max-w-6xl bg-teal-900 border border-teal-90 !text-white-A700 text-sm rounded-md focus:ring-white-A700 focus:border-white-A700 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                    placeholder="Enter Payment Related or any Other Information "
                    required
                  />
                </div>
                <div className="flex justify-center my-5">
                  <Button
                    variant="ilate"
                    className="rounded-[20px]"
                    size="lg"
                    type="submit"
                    onClick={handleSubmit}
                  >
                    Submit
                  </Button>
                </div>
              </>
            ) : (
              batchSize !== 0 &&
              paymentMode === "offline" && (
                <>
                  <div className="flex max-w-6xl justify-start items-center my-5">
                    <Heading
                      size="s"
                      className="w-full max-w-max mr-4 text-sm font-medium text-gray-900 dark:text-white-A700"
                    >
                      Other Information (Optional)
                    </Heading>
                    <Input
                      size="xs"
                      type="text"
                      name="otherInfo"
                      id="otherInfo"
                      value={otherInfo}
                      onChange={(value: string) => setOtherInfo(value)}
                      className="w-full max-w-6xl bg-teal-900 border border-teal-90 !text-white-A700 text-sm rounded-md focus:ring-white-A700 focus:border-white-A700 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                      placeholder="Enter Payment Related or any Other Information "
                      required
                    />
                  </div>
                  <Button
                    variant="ilate"
                    className="rounded-[20px]"
                    size="lg"
                    type="submit"
                    onClick={handleSubmit}
                  >
                    Submit
                  </Button>
                </>
              )
            )}
            {/* : (
              paymentMode === "" &&
              batchSize !== 0 &&
              years > 0 &&
              years && (
                <>
                  <p>
                    Kindly Select Payment Method
                    <span className="text-red-500">*</span>
                  </p>
                </>
              )
            )} */}
          </div>
          <div className="py-8 px-10 lg:py-16 mt-10 md:col-span-1">
            <p className="mb-5 font-bold text-lg">Payment Terms & Conditions</p>
            <ul className="flex flex-col items-start justify-center gap-4 text-sm text-gray-500">
              <li>
                <strong>Payment Methods: </strong>We accept payments through
                online channels such as bank transfers, credit/debit cards, as
                well as cash and cheque payments.
              </li>
              <li>
                <strong>Payment Schedule: </strong>Fees are due at the beginning
                of each month/term/semester.
              </li>
              <li>
                <strong>Late Payment Policy: </strong>Any payments not received
                by the due date may be subject to a late fee or penalty.
              </li>
              <li>
                <strong>Invoice Issuance: </strong>Invoices will be provided for
                all payments made, either electronically or in hard copy, upon
                request.
              </li>
              <li>
                <strong>Refund Policy: </strong>Refunds may be issued in certain
                circumstances, subject to our refund policy. Please refer to our
                refund policy for more details.
              </li>
              <li>
                <strong>Currency: </strong>All payments must be made in Indian
                Rupees (INR), unless otherwise specified.
              </li>
              <li>
                <strong>Payment Confirmation: </strong>Upon successful payment,
                you will receive a payment confirmation via email or SMS.
              </li>
              <li>
                <strong>Contact Information: </strong>For any payment-related
                queries or concerns, please feel free to reach out to our
                dedicated payment support team at accounts@ilate.com.
              </li>
              <li>
                <strong>Dispute Resolution: </strong>In the event of any payment
                disputes or discrepancies, please contact us immediately for
                prompt resolution.
              </li>
              <li>
                <strong>Terms Acceptance: </strong>By enrolling in our classes
                and making payments, you agree to abide by the above payment
                terms and conditions.
              </li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
};

export default Payments;
