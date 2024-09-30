import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import Navbar from "./navbar";


const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [birthday, setBirthday] = useState(null);
  const [joindate, setJoindate] = useState(null);
  const [name, setName] = useState("");
  const [department, setDepartment] = useState("");
  const [departments, setDepartments] = useState([]);
  const [handphone, sethandphone] = useState(""); // New state for contact

  // validation
  const [validationErrors, setValidationErrors] = useState({});

 


  // Fetch departments from the backend
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axios.get("https://lms-be-beta.vercel.app/api/AllDepartment"); // Replace with your API endpoint
        setDepartments(response.data); // Assuming response data is an array of department names
      } catch (error) {
        console.error("Failed to fetch departments", error);
        toast.error("Failed to load departments");
      }
    };

    fetchDepartments();
  }, []);

  const validateForm = () => {
    const errors = {};

    if (!name.trim()) {
      errors.name = "Name is required";
    }

    if (!birthday) {
      errors.birthday = "Birth Date is required";
    }

    if (!joindate) {
      errors.joindate = "Join Date is required";
    }

    if (!username) {
      errors.username = "Email / Username is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(username)) {
      errors.username = "Invalid email";
    }

    if (!password) {
      errors.password = "Password is required";
    }

    if (!handphone) {
      errors.handphone = "handphone number is required";
    }

    if (!department) {
      errors.department = "Department is required";
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = validateForm();
    if (Object.keys(errors).length === 0) {
      try {
        const response = await axios.post(
          "https://lms-be-beta.vercel.app/api/employeeregister",
          {
            username,
            password,
            birthday,
            joindate,
            name,
            department, // Include the department in the submission
            handphone, // Include contact in the submission
          }
        );

        if (response.status === 201) {
          toast.success("Registration successful");
          // Clear form fields
          setUsername("");
          setPassword("");
          setBirthday(null);
          setJoindate(null);
          setName("");
          setDepartment("");
          sethandphone(""); // Clear contact field
          setValidationErrors({});

          window.location.href = "./login";
        }
      } catch (error) {
        console.error("Registration failed:", error);
        toast.error("Registration failed, please try again");
      }
    } else {
      setValidationErrors(errors);
    }
  };

  return (
    <>
      <Navbar />
      <ToastContainer />
      <div className="container pt-5">
        <div className="row row-grid align-items-center">
          {/* Image Section */}
          <div className="col-12 col-md-5 col-lg-6 text-center">
            <figure className="w-100">
              <img
                src="https://imconnect.in/wp-content/uploads/2024/04/imconnect-employee-location-tracking-app.gif"
                alt="Leave Management"
                className="img-fluid mw-md-120"
              />
            </figure>
          </div>

          {/* Form Section */}
          <div className="col-12 col-md-7 col-lg-6">
            <Card className="shadow-lg registration-card">
              <h1 className="text-center mb-4" style={{ color: "darkblue" }}>
                Register
              </h1>
              <hr />
              <form onSubmit={handleSubmit} className="p-fluid">
                <div>
                  <div className="p-inputgroup flex-1">
                    <span className="p-inputgroup-addon">
                      <i className="pi pi-user"></i>
                    </span>
                    <InputText
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className={validationErrors.name ? "p-invalid" : ""}
                      placeholder="Full Name"
                    />
                  </div>
                  <div>
                    {validationErrors.name && (
                      <small className="p-error">{validationErrors.name}</small>
                    )}
                  </div>
                </div>
                <br />

                {/* New Contact Field */}
                <div>
                  <div className="p-inputgroup flex-1">
                    <span className="p-inputgroup-addon">
                      <i className="pi pi-phone"></i>
                    </span>
                    <InputText
                      value={handphone}
                      onChange={(e) => sethandphone(e.target.value)}
                      className={validationErrors.handphone ? "p-invalid" : ""}
                      placeholder="Contact Number"
                    />
                  </div>
                  {validationErrors.handphone && (
                    <small className="p-error">{validationErrors.handphone}</small>
                  )}
                </div>
                <br />

                <div className="row mb-3">
  <div className="col">
    <span className="p-float-label">
      <Calendar
        id="birthday"
        value={birthday ? new Date(birthday) : null} // Pass a valid Date object or null
        onChange={(e) => {
          if (e.value) {
            const formattedDate = e.value.toISOString().split("T")[0]; // Format to "YYYY-MM-DD"
            setBirthday(formattedDate); // Set formatted date in state
          }
        }}
        dateFormat="dd/mm/yy" // Display format
        className={`custom-calendar ${
          validationErrors.birthday ? "p-invalid" : ""
        }`}
        showIcon
      />
      <label htmlFor="birthday">Birth date</label>
    </span>
    {validationErrors.birthday && (
      <small className="p-error">{validationErrors.birthday}</small>
    )}
  </div>
  
  <div className="col">
    <span className="p-float-label">
      <Calendar
        id="joindate"
        value={joindate ? new Date(joindate) : null} // Pass a valid Date object or null
        onChange={(e) => {
          if (e.value) {
            const formattedDate = e.value.toISOString().split("T")[0]; // Format to "YYYY-MM-DD"
            setJoindate(formattedDate); // Set formatted date in state
          }
        }}
        dateFormat="dd/mm/yy" // Display format
        className={`custom-calendar ${
          validationErrors.joindate ? "p-invalid" : ""
        }`}
        showIcon
      />
      <label htmlFor="joindate">Joined date</label>
    </span>
    {validationErrors.joindate && (
      <small className="p-error">{validationErrors.joindate}</small>
    )}
  </div>
</div>


                {/* Department Dropdown */}
                <div>
                  <Dropdown
                    value={department}
                    options={departments}
                    onChange={(e) => setDepartment(e.value)}
                    placeholder="Select Department"
                    className={validationErrors.department ? "p-invalid" : ""}
                  />
                  {validationErrors.department && (
                    <small className="p-error">
                      {validationErrors.department}
                    </small>
                  )}
                </div>

                <br />

                <div>
                  <div className="p-inputgroup flex-1">
                    <span className="p-inputgroup-addon">
                      <i className="pi pi-user"></i>
                    </span>
                    <InputText
                      id="email"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className={validationErrors.username ? "p-invalid" : ""}
                      placeholder="Enter Email"
                    />
                  </div>
                  <div>
                    {validationErrors.username && (
                      <small className="p-error">
                        {validationErrors.username}
                      </small>
                    )}
                  </div>
                </div>
                <br />

                <div>
                  <div className="p-inputgroup flex-1">
                    <span className="p-inputgroup-addon">
                      <i className="pi pi-lock"></i>
                    </span>
                    <InputText
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={validationErrors.password ? "p-invalid" : ""}
                      placeholder="Password"
                    />
                  </div>
                  {validationErrors.password && (
                    <small className="p-error">
                      {validationErrors.password}
                    </small>
                  )}
                </div>
                <br />

                <Button type="submit" label="Register" className="p-button-primary custom-darkblue-button" />
              </form>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
