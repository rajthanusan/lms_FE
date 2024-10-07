import React, { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import Navbar from "./navbar";
import { Card } from "primereact/card";
import { GoogleLogin } from "@react-oauth/google"; // Google login
 // Assuming this file exists for your custom styles

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

  // Handle login
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
      const response = await axios.post("https://lms-be-beta.vercel.app/api/login", {
        username,
        password,
      });

      if (response.data.message === "Login successful") {
        const user = response.data.userData;

        // Role-based login
        if (user.role === "admin") {
          sessionStorage.setItem("loggedInAdmin", JSON.stringify(user));
          toast.success("Admin login successful!");
          window.location.href = "/Admin"; // Redirect to admin dashboard
        } else if (user.role === "manager") {
          sessionStorage.setItem("loggedInDepartmentManager", JSON.stringify(user));
          toast.success("Manager login successful!");
          window.location.href = "/DManager"; // Redirect to department manager dashboard
        } else {
          sessionStorage.setItem("loggedInUser", JSON.stringify(user));
          toast.success("User login successful!");
          window.location.href = "/Employee"; // Redirect to employee dashboard
        }
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Error logging in. Please try again.");
    }
  };

  // Google login success handler
 // Google login success handler
const handleGoogleLoginSuccess = async (response) => {
  try {
    const result = await axios.post(
      "https://lms-be-beta.vercel.app/api/google-login",
      { token: response.credential }
    );

    // Assuming the user data is returned in result.data.userData
    const user = result.data.userData;

    // Role-based login
    if (user.role === "admin") {
      sessionStorage.setItem("loggedInAdmin", JSON.stringify(user));
      toast.success("Admin login successful!");
      window.location.href = "/Admin"; // Redirect to admin dashboard
    } else if (user.role === "manager") {
      sessionStorage.setItem("loggedInDepartmentManager", JSON.stringify(user));
      toast.success("Manager login successful!");
      window.location.href = "/DManager"; // Redirect to department manager dashboard
    } else {
      sessionStorage.setItem("loggedInUser", JSON.stringify(user));
      toast.success("User login successful!");
      window.location.href = "/Employee"; // Redirect to employee dashboard
    }
  } catch (err) {
    console.error("Google login failed:", err);
    toast.error("Google login failed. Please try again."); // Changed alert to toast for consistency
  }
};

const handleGoogleLoginFailure = (error) => {
  console.error("Google login failed:", error);
  toast.error("Google login failed. Please try again."); // Changed alert to toast for consistency
};


  // Forgot Password - Request Reset
  const handleRequestReset = async () => {
    try {
      const response = await axios.post(
        "https://lms-be-beta.vercel.app/api/request-password-reset",
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

  // Forgot Password - Verify Code
  const handleVerifyCode = async () => {
    try {
      const response = await axios.post(
        "https://lms-be-beta.vercel.app/api/verify-code",
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

  // Forgot Password - Reset Password
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
        "https://lms-be-beta.vercel.app/api/reset-password",
        { email: resetEmail, newPassword }
      );
      if (response.data.success) {
        toast.success("Password reset successful! You can now log in with your new password.");
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
                          type="password"
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="Enter new password"
                        />
                      </div>
                      <div className="p-inputgroup flex-1 mt-3">
                        <span className="p-inputgroup-addon">
                          <i className="pi pi-key"></i>
                        </span>
                        <InputText
                          id="confirmPassword"
                          value={confirmPassword}
                          type="password"
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Confirm new password"
                        />
                      </div>
                      <Button
                        type="submit"
                        label="Reset Password"
                        className="p-button-primary w-100 mt-3"
                        style={{
                          backgroundColor: "darkblue",
                          borderColor: "darkblue",
                          color: "white",
                        }}
                      />
                    </form>
                  )}
                  <Button
                    label="Back to Login"
                    className="p-button-link w-100 mt-3"
                    onClick={() => setShowForgotPassword(false)}
                  />
                </div>
              ) : (
                <form className="p-fluid" onSubmit={handleLogin}>
                  <div className="p-inputgroup flex-1">
                    <span className="p-inputgroup-addon">
                      <i className="pi pi-user"></i>
                    </span>
                    <InputText
                      id="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Username"
                      className={`form-control ${
                        validationErrors.username ? "is-invalid" : ""
                      }`}
                    />
                    {validationErrors.username && (
                      <div className="invalid-feedback">
                        {validationErrors.username}
                      </div>
                    )}
                  </div>
                  <div className="p-inputgroup flex-1 mt-3">
                    <span className="p-inputgroup-addon">
                      <i className="pi pi-lock"></i>
                    </span>
                    <InputText
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Password"
                      className={`form-control ${
                        validationErrors.password ? "is-invalid" : ""
                      }`}
                    />
                    {validationErrors.password && (
                      <div className="invalid-feedback">
                        {validationErrors.password}
                      </div>
                    )}
                  </div>
                  <Button
                    type="submit"
                    label="Login"
                    className="p-button-primary w-100 mt-3"
                    style={{
                      backgroundColor: "darkblue",
                      borderColor: "darkblue",
                      color: "white",
                    }}
                  />
                </form>
              )}

             
                  <div className="google-login mt-1">
                    <GoogleLogin
                      onSuccess={handleGoogleLoginSuccess}
                      onError={handleGoogleLoginFailure}
                      render={(renderProps) => (
                        <Button
                          label="Login with Google"
                          className="p-button-primary w-100 mt-3" // Same class as the other buttons
                          style={{
                            backgroundColor: "darkblue",
                            borderColor: "darkblue",
                            color: "white",
                          }}
                          onClick={renderProps.onClick}
                          disabled={renderProps.disabled} // Disable button if Google login is loading
                        />
                      )}
                    />
                  </div> {!showForgotPassword && (
                <div className="mt-0">
                  <Button
                    label="Forgot Password?"
                    className="p-button-link w-100"
                    onClick={() => setShowForgotPassword(true)}
                  />

                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
