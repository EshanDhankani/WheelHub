import { useState } from "react";
import Axios from "axios";
import { useNavigate } from "react-router-dom";
import "./PasswordResetForm.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    Axios.post("http://localhost:3001/forgot-password", {
      email,
    })
      .then((response) => {
        if (response.data.Status) {
          alert("check your email for reset password link");
          navigate("/login");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="password-reset-container">
      <div className="password-reset-box">
        <h2>Forgot your password?</h2>
        <p>Enter your Email and we’ll help you reset your password.</p>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Enter Email"
            className="email-input"
            autoComplete="off"
            onChange={(e) => setEmail(e.target.value)}
          />
          <button className="continue-button">Continue</button>
        </form>
        <a href="/login" className="return-link">
          Return to Log In
        </a>
      </div>
    </div>
  );
};

export default ForgotPassword;
