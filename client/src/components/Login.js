import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import "./Auth.css";


const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    otp: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOTPLogin, setIsOTPLogin] = useState(false); // Toggle between OTP and password login

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    if (!isOTPLogin && !formData.password) {
      newErrors.password = "Password is required";
    }
    if (isOTPLogin && !formData.otp) {
      newErrors.otp = "OTP is required";
    }
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();

    if (Object.keys(newErrors).length === 0) {
      setIsSubmitting(true);
      try {
        let response;
        if (isOTPLogin) {
          response = await axios.post(
            `${process.env.REACT_APP_URL}/auth/verify-otp`,
            {
              email: formData.email,
              otp: formData.otp,
            }
          );
        } else {
          response = await axios.post(`${process.env.REACT_APP_URL}/auth/login`, {
            email: formData.email,
            password: formData.password,
          });
        }
        if (response.data.success) {
          login(response.data.user, response.data.token);
          navigate("/dashboard");
        }
      } catch (error) {
        setErrors({
          submit:
            error.response?.data?.message || "An error occurred during login",
        });
      }
      setIsSubmitting(false);
    } else {
      setErrors(newErrors);
    }
  };

  const handleGenerateOTP = async () => {
    if (!formData.email) {
      setErrors({ email: "Email is required" });
      return;
    }
    try {
      await axios.post(`${process.env.REACT_APP_URL}/auth/generate-otp`, {
        email: formData.email,
      });
      alert("OTP sent to your email");
    } catch (error) {
      setErrors({
        submit: error.response?.data?.message || "Error generating OTP",
      });
    }
  };

  return (
    <div className="page-container">
      <div className="auth-container">
      <div className="logo-row">
        <img src="srmFull.png" alt="Left Logo" className="logo left-logo" />
        <img src="ctechFull.png" alt="Right Logo" className="logo right-logo" />
      </div>
        <h1 className="auth-title">SRM VISITOR PASS PORTAL</h1>
        <h2 className="auth-title">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && <div className="error">{errors.email}</div>}
          </div>

          {!isOTPLogin && (
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
              />
              {errors.password && (
                <div className="error">{errors.password}</div>
              )}
            </div>
          )}

          {isOTPLogin && (
            <div className="form-group">
              <label htmlFor="otp">OTP</label>
              <input
                type="text"
                id="otp"
                name="otp"
                value={formData.otp}
                onChange={handleChange}
              />
              {errors.otp && <div className="error">{errors.otp}</div>}
              <button
                type="button"
                onClick={handleGenerateOTP}
                className="otp-button"
              >
                Send OTP
              </button>
            </div>
          )}

          {errors.submit && <div className="error">{errors.submit}</div>}

          <button
            type="submit"
            className="submit-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="auth-link">
          <button
            type="button"
            onClick={() => setIsOTPLogin(!isOTPLogin)}
            className="toggle-button"
          >
            {isOTPLogin ? "Login with Password" : "Login with OTP"}
          </button>
          <br />
          Don't have an account? <Link to="/signup">Sign up</Link>
        </div>
      </div>
      <div className="auth-footer-container">
        {/* Footer */}
        <footer className="auth-footer">
          <p>
            © {new Date().getFullYear()} CTECH, SRMIST, KTR. Contact:{" "}
            <a href="mailto:parkingsrm@gmail.com">parkingsrm@gmail.com</a> |
            Help Desk: <a href="tel:044-4743-2350">044-4743-2350</a>
          </p>
          <p>
            📌 Our Team :- <a href="/documentation">Chronocyon</a>
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Login;
