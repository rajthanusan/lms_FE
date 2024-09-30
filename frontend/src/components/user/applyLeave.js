import React, { useState, useEffect, Fragment, useCallback } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Container from "react-bootstrap/Container"; // Ensure this is correct
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "../common/navbar";
import { Calendar } from "primereact/calendar";
import { Card } from "primereact/card";

const ApplyLeave = () => {
  const [leave, setLeave] = useState("");
  const [startdate, setStartdate] = useState("");
  const [enddate, setEnddate] = useState("");
  const [comments, setComments] = useState("");
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [approvedLeaves, setApprovedLeaves] = useState([]);
  const [leaveLimits, setLeaveLimits] = useState({});
  const [errors, setErrors] = useState({});
  const loggedInUser = sessionStorage.getItem("loggedInUser");
  const username = loggedInUser ? JSON.parse(loggedInUser).username : "";

  // Move fetchLeaveRequests definition above useEffect
  const fetchLeaveRequests = useCallback(() => {
    axios
      .get("https://lms-be-beta.vercel.app/api/LeaveView/")
      .then((result) => {
        const filteredData = result.data.data.filter(
          (item) => item.username === username
        );
        setApprovedLeaves(filteredData); // Set the approved leaves here
      })
      .catch((error) => {
        console.log(error);
      });
  }, [username]);

  useEffect(() => {
    fetchLeaveTypes();
    fetchLeaveRequests(); // Now this is defined before use
  }, [fetchLeaveRequests]); // No change here

  const fetchLeaveTypes = () => {
    axios
      .get("https://lms-be-beta.vercel.app/api/getLeavetype")
      .then((result) => {
        setLeaveTypes(result.data);
        const limits = {};
        result.data.forEach((item) => {
          limits[item.leave_type_name] = item.total_days || 0; // Default to 0 if total_days is undefined
        });
        setLeaveLimits(limits);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // Calculate approved leave count based on leave types
  const approvedLeaveCount = leaveTypes.map((type) => {
    const approvedCount = approvedLeaves.filter(
      (item) =>
        item.leave_type === type.leave_type_name && item.status === "approved"
    ).length; // Use approvedLeaves instead of data
    return {
      leave_type_name: type.leave_type_name,
      approved: approvedCount,
      total: leaveLimits[type.leave_type_name] || 0, // Fallback to 0 if leave limit is undefined
    };
  });

  const handleSave = () => {
    const validationErrors = {};
    let isValid = true;

    if (!leave) {
      validationErrors.leave = "Please select a leave type.";
      isValid = false;
    }

    if (!startdate) {
      validationErrors.startdate = "Please select a start date.";
      isValid = false;
    }

    if (!enddate) {
      validationErrors.enddate = "Please select an end date.";
      isValid = false;
    }

    if (!comments) {
      validationErrors.comments = "Please provide comments.";
      isValid = false;
    }

    if (!isValid) {
      setErrors(validationErrors);
      return;
    }

    // Check if the approved count has reached the limit
    const currentLeave = approvedLeaveCount.find(
      (item) => item.leave_type_name === leave
    );
    const approvedCount = currentLeave ? currentLeave.approved : 0;
    const totalAllowed = leaveLimits[leave] || 0;

    if (approvedCount >= totalAllowed) {
      toast.error(
        `You can't apply for more than ${totalAllowed} ${leave} days as the limit has been reached.`
      );
      return;
    }

    const url = "https://lms-be-beta.vercel.app/api/Leaveapply";
    const leaveData = {
      leave: leave,
      startdate: startdate, // No need to convert since it's already in "YYYY-MM-DD" format
enddate: enddate,     // No need to convert since it's already in "YYYY-MM-DD" format// Convert date to ISO format
      comments: comments,
      username: username, // Get username from session
      status: "Pending",
    };

    axios
      .post(url, leaveData)
      .then(() => {
        fetchLeaveRequests(); // Refresh approved leaves after submitting
        clear();
        toast.success("Leave request has been created");
        setErrors({});
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  const clear = () => {
    setLeave("");
    setStartdate("");
    setEnddate("");
    setComments("");
  };

  return (
    <Fragment>
      <Navbar user />
      <ToastContainer /> <br />
      <Container>
        <div className="container pt-5">
          <div className="row row-grid align-items-center">
            {/* Image Section */}
            <div className="col-12 col-md-5 col-lg-6 text-center">
              <figure className="w-100">
                <img
                  src="https://media.licdn.com/dms/image/C4D12AQH3moW8i3ewrw/article-cover_image-shrink_600_2000/0/1628589993746?e=2147483647&v=beta&t=x0r-d-0VMlcRA_l3hQGm6RBCel5ZrQrV1KkIE6N167g"
                  alt="Leave Management"
                  className="img-fluid mw-md-120"
                />
              </figure>
            </div>

            {/* Form Section */}
            <div className="col-12 col-md-7 col-lg-6 custom-card-height">
              <Card className="shadow-lg rounded bg-light registration-card ">
                <h1 className="text-center mb-4 text-darkblue">
                  Apply For Leave
                </h1>
                <hr />
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSave();
                  }}
                >
                  <div className="mb-3">
                    <label className="form-label">Leave Type</label>
                    <select
                      className="form-select"
                      value={leave}
                      onChange={(e) => setLeave(e.target.value)}
                    >
                      <option value="">--Select Leave Type--</option>
                      {leaveTypes.map((item) => (
                        <option
                          key={item.leave_type_name}
                          value={item.leave_type_name}
                        >
                          {item.leave_type_name}
                        </option>
                      ))}
                    </select>
                    {errors.leave && (
                      <div className="text-danger">{errors.leave}</div>
                    )}
                  </div>

                  <div className="row mb-3" style={{ paddingTop: "4px" }}>
  <div className="col">
    <span className="p-float-label">
      <Calendar
        id="startdate"
        value={startdate ? new Date(startdate) : null} // Pass a valid Date object or null
        onChange={(e) => {
          if (e.value) {
            const formattedDate = e.value.toISOString().split("T")[0]; // Format to "YYYY-MM-DD"
            setStartdate(formattedDate); // Set formatted date in state
          }
        }}
        dateFormat="dd/mm/yy" // Display format for the calendar
        showIcon
      />
      <label htmlFor="startdate">Start date</label>
    </span>
    {errors.startdate && (
      <div className="text-danger">{errors.startdate}</div>
    )}
  </div>
  
  <div className="col">
    <span className="p-float-label">
      <Calendar
        id="enddate"
        value={enddate ? new Date(enddate) : null} // Pass a valid Date object or null
        onChange={(e) => {
          if (e.value) {
            const formattedDate = e.value.toISOString().split("T")[0]; // Format to "YYYY-MM-DD"
            setEnddate(formattedDate); // Set formatted date in state
          }
        }}
        dateFormat="dd/mm/yy" // Display format for the calendar
        showIcon
      />
      <label htmlFor="enddate">End date</label>
    </span>
    {errors.enddate && (
      <div className="text-danger">{errors.enddate}</div>
    )}
  </div>
</div>



                  <div className="mb-3">
                    <label className="form-label">Request Comments</label>
                    <textarea
                      className="form-control"
                      placeholder="Comments"
                      value={comments}
                      onChange={(e) => setComments(e.target.value)}
                      rows={2}
                    />
                    {errors.comments && (
                      <div className="text-danger">{errors.comments}</div>
                    )}
                  </div>
                  <button
                    type="submit"
                    className="custom-darkblue-button btn btn-primary w-100"
                  >
                    Create
                  </button>
                  {/* Approved Leave Count Display */}
                  {leave && (
                    <div className="mt-3 text-center">
                      <p className="text-darkblue">
                        Approved Leaves:{" "}
                        {approvedLeaveCount.find(
                          (item) => item.leave_type_name === leave
                        )?.approved || 0}{" "}
                        / {leaveLimits[leave] || 0}
                      </p>
                      <p className="text-darkblue">
                        {approvedLeaveCount.find(
                          (item) => item.leave_type_name === leave
                        )?.approved >= (leaveLimits[leave] || 0)
                          ? `You have reached the limit for ${leave}.`
                          : `You can still apply for ${
                              leaveLimits[leave] -
                              (approvedLeaveCount.find(
                                (item) => item.leave_type_name === leave
                              )?.approved || 0)
                            } more ${leave}(s).`}
                      </p>
                    </div>
                  )}
                </form>
              </Card>
            </div>
          </div>
        </div>
      </Container>
    </Fragment>
  );
};

export default ApplyLeave;
