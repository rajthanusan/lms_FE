import React, { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import Navbar from "./navbar";
import { Card } from "primereact/card";
import { useNavigate } from "react-router-dom"; // Import useNavigate for routing

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [resetEmail, setResetEmail] = useState("");
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isCodeVerified, setIsCodeVerified] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const navigate = useNavigate(); // Initialize useNavigate for redirection

  const handleLogin = async (e) => {
  e.preventDefault();
  setValidationErrors({});

  // Validate input
  if (!username || !password) {
    setValidationErrors({
      username: !username ? "Username is required" : "",
      password: !password ? "Password is required" : "",
    });
    return;
  }

  try {
    // Send login request to the API
    const response = await axios.post("http://localhost:8085/api/login", {
      username,
      password,
    });

    // Check if login was successful
    if (response.data.message === "Login successful") {
      const user = response.data.userData; // Adjust according to your response structure

      // Storing user data in session storage based on role
      if (user.role === 'admin') {
        sessionStorage.setItem('loggedInAdmin', JSON.stringify(user));
        toast.success("Admin login successful!");

        window.location.href = "/homeadmin"; // Redirect to admin home
      } else if (user.role === 'manager') {
        sessionStorage.setItem('loggedInDepartmentManager', JSON.stringify(user));
        toast.success("Manager login successful!");

        window.location.href ='/homedepartmentmanager'; // Redirect to department manager home
      } else {
        sessionStorage.setItem('loggedInUser', JSON.stringify(user));
        toast.success("User login successful !");
        window.location.href ='/homeuser';
         // Redirect to user home
      }
    } else {
      toast.error(response.data.message); // Display error message from server
    }
  } catch (error) {
    console.error("Login error:", error);
    toast.error("Error logging in. Please try again."); // Handle error
  }
};

  const handleRequestReset = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8085/api/request-password-reset",
        { email: resetEmail }
      );
      if (response.data.success) {
        toast.success("Verification code sent to your email!");
        setIsCodeSent(true);
      } else {
        toast.error("Error sending verification code.");
      }
    } catch (error) {
      console.error("Error sending verification code:", error);
      toast.error("Error sending verification code. Please try again.");
    }
  };

  const handleVerifyCode = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8085/api/verify-code",
        { email: resetEmail, code: resetCode }
      );
      if (response.data.success) {
        toast.success("Verification code verified!");
        setIsCodeVerified(true);
      } else {
        toast.error("Invalid verification code.");
      }
    } catch (error) {
      toast.error("Error verifying code.");
      console.error("Error:", error);
    }
  };

  const handleResetPassword = async () => {
    if (newPassword !== confirmPassword) {
      toast.error("Passwords don't match.");
      return;
    }

    if (!isCodeVerified) {
      toast.error("Please verify the code before resetting your password.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8085/api/reset-password",
        { email: resetEmail, newPassword }
      );
      if (response.data.success) {
        toast.success(
          "Password reset successful! You can now log in with your new password."
        );
        resetForm();
        setShowForgotPassword(false);
      } else {
        toast.error("Password reset failed.");
      }
    } catch (error) {
      toast.error("Error resetting password.");
      console.error("Error:", error);
    }
  };

  const resetForm = () => {
    setResetEmail("");
    setResetCode("");
    setNewPassword("");
    setConfirmPassword("");
    setIsCodeSent(false);
    setIsCodeVerified(false);
  };

  return (
    <>
      <Navbar />
      <ToastContainer />
      <div className="container pt-5">
        <div className="row row-grid align-items-center">
          <div className="col-12 col-md-5 col-lg-6 text-center">
            <figure className="w-100">
              <img
                src="https://imconnect.in/wp-content/uploads/2024/04/imconnect-employee-location-tracking-app.gif"
                alt="Login"
                className="img-fluid mw-md-120"
              />
            </figure>
          </div>

          <div className="col-12 col-md-7 col-lg-6">
            <Card className="shadow-lg registration-card">
              <h1 className="text-center mb-4" style={{ color: "darkblue" }}>
                {showForgotPassword ? "Forgot Password" : "Login"}
              </h1>
              <hr />
              {showForgotPassword ? (
                <div>
                  {!isCodeSent ? (
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleRequestReset();
                      }}
                      className="p-fluid"
                    >
                      <div className="p-inputgroup flex-1">
                        <span className="p-inputgroup-addon">
                          <i className="pi pi-envelope"></i>
                        </span>
                        <InputText
                          id="resetEmail"
                          value={resetEmail}
                          onChange={(e) => setResetEmail(e.target.value)}
                          placeholder="Enter your email"
                        />
                      </div>
                      <Button
                        type="submit"
                        label="Send Reset Code"
                        className="p-button-primary w-100 mt-3"
                        style={{
                          backgroundColor: "darkblue",
                          borderColor: "darkblue",
                          color: "white",
                        }}
                      />
                    </form>
                  ) : !isCodeVerified ? (
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleVerifyCode();
                      }}
                      className="p-fluid"
                    >
                      <div className="p-inputgroup flex-1">
                        <span className="p-inputgroup-addon">
                          <i className="pi pi-lock"></i>
                        </span>
                        <InputText
                          id="resetCode"
                          value={resetCode}
                          onChange={(e) => setResetCode(e.target.value)}
                          placeholder="Enter the verification code"
                        />
                      </div>
                      <Button
                        type="button"
                        label="Verify Code"
                        className="p-button-primary w-100 mt-3"
                        style={{
                          backgroundColor: "darkblue",
                          borderColor: "darkblue",
                          color: "white",
                        }}
                        onClick={handleVerifyCode}
                      />
                    </form>
                  ) : (
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleResetPassword();
                      }}
                      className="p-fluid"
                    >
                      <div className="p-inputgroup flex-1">
                        <span className="p-inputgroup-addon">
                          <i className="pi pi-key"></i>
                        </span>
                        <InputText
                          id="newPassword"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="Enter new password"
                          type="password"
                        />
                      </div>
                      <div className="p-inputgroup flex-1 mt-2">
                        <span className="p-inputgroup-addon">
                          <i className="pi pi-key"></i>
                        </span>
                        <InputText
                          id="confirmPassword"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Confirm new password"
                          type="password"
                        />
                      </div>
                      <Button
                        type="button"
                        label="Reset Password"
                        className="p-button-primary w-100 mt-3"
                        style={{
                          backgroundColor: "darkblue",
                          borderColor: "darkblue",
                          color: "white",
                        }}
                        onClick={handleResetPassword}
                      />
                    </form>
                  )}
                  <div className="mt-4">
                    <p>
                      Remembered your password?{" "}
                      <button
                        type="button"
                        onClick={() => setShowForgotPassword(false)}
                        className="link-button"
                      >
                        Login here.
                      </button>
                    </p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleLogin}>
                  <div className="p-inputgroup flex-1 mb-3">
                    <span className="p-inputgroup-addon">
                      <i className="pi pi-user"></i>
                    </span>
                    <InputText
                      id="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Username"
                      required
                    />
                  </div>
                  {validationErrors.username && (
                    <small className="p-error">{validationErrors.username}</small>
                  )}
                  <div className="p-inputgroup flex-1 mb-3">
                    <span className="p-inputgroup-addon">
                      <i className="pi pi-lock"></i>
                    </span>
                    <InputText
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Password"
                      type="password"
                      required
                    />
                  </div>
                  {validationErrors.password && (
                    <small className="p-error">{validationErrors.password}</small>
                  )}
                  <Button
                    type="submit"
                    label="Login"
                    className="p-button-primary w-100"
                    style={{
                      backgroundColor: "darkblue",
                      borderColor: "darkblue",
                      color: "white",
                    }}
                  />
                  <div className="mt-3 text-center">
                    <button
                      type="button"
                      onClick={() => setShowForgotPassword(true)}
                      className="link-button"
                    >
                      Forgot Password?
                    </button>
                  </div>
                </form>
              )}
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
