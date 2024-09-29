import  { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import axios from "axios";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  borderRadius: "8px",
  boxShadow: 24,
  p: 4,
  textAlign: "center",
};

const EmailVerification = () => {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false); 
  const location = useLocation();

  useEffect(() => {
    const verifyEmail = async () => {
      const params = new URLSearchParams(location.search);
      const token = params.get("token");

      if (token) {
        try {
          const response = await axios.get(`http://localhost:3001/verify-email?token=${token}`);
          setMessage(response.data.message);
          setOpen(true); 
        } catch (error) {
          setMessage("Email verification failed. The link may have expired or is invalid.");
          setOpen(true);
        }
      } else {
        setMessage("Invalid or missing verification token.");
        setOpen(true); 
      }
      setLoading(false);
    };

    verifyEmail();
  }, [location.search]);

  return (
    <div style={{ padding: "50px", textAlign: "center" }}>
      {loading ? (
        <h2>Verifying your email...</h2>
      ) : (
        <>
          <Modal
            open={open}
            onClose={() => setOpen(false)} 
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={modalStyle}>
              <Typography id="modal-modal-title" variant="h6" component="h2">
                {message}
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    setOpen(false);
                  }}
                >
                  Close
                </Button>
                {message === "Email verified successfully!" && (
                  <Link to="/login" style={{ textDecoration: "none", marginLeft: "10px" }}>
                    <Button variant="contained" color="success">
                      Go to Login
                    </Button>
                  </Link>
                )}
              </Box>
            </Box>
          </Modal>
        </>
      )}
    </div>
  );
};

export default EmailVerification;
