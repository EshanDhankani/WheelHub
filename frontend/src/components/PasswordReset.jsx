import { useState } from "react";
import { Button, TextField, Box, Typography } from "@mui/material";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PasswordReset = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");

  const handleResetPassword = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3001/reset-password",
        { token, password }
      );

      console.log("Server response:", response);

      if (response.status === 200) {
        toast.success(
          response.data.message ||
            "Your password has been updated successfully!"
        );
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        toast.error("Failed to reset password. Please try again.");
      }
    } catch (error) {
      console.error("Error in frontend:", error);
      console.log("Error response:", error.response);

      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Server error. Please try again.");
      }
    }
  };

  return (
    <Box
      sx={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: 400,
        bgcolor: "background.paper",
        boxShadow: 24,
        p: 4,
        textAlign: "center",
      }}
    >
      <ToastContainer />
      <Typography variant="h5" component="h2" sx={{ mb: 2 }}>
        Reset Password
      </Typography>
      <TextField
        margin="normal"
        fullWidth
        label="New Password"
        variant="outlined"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        sx={{ mb: 2 }}
      />
      <Button onClick={handleResetPassword} variant="contained" sx={{ mt: 2 }}>
        Update Password
      </Button>
    </Box>
  );
};

export default PasswordReset;
