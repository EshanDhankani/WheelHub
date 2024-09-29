import { useState } from "react";
import { Modal, Button, TextField, Box, Typography } from "@mui/material";
import PropTypes from "prop-types";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ForgotPassword = ({ open, handleClose }) => {
  const [email, setEmail] = useState("");

  const handleSendLink = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3001/forgot-password",
        { email }
      );
      toast.success(response.data.message);
    } catch (error) {
      toast.error("Failed to send reset link");
      console.error("Error:", error);
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
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
        }}
      >
        <ToastContainer />
        <Typography variant="h6" component="h2">
          Forgot Password
        </Typography>
        <TextField
          margin="normal"
          fullWidth
          label="Email Address"
          variant="outlined"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Button onClick={handleSendLink} variant="contained" sx={{ mt: 2 }}>
          Send Reset Link
        </Button>
      </Box>
    </Modal>
  );
};

ForgotPassword.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
};

export default ForgotPassword;
