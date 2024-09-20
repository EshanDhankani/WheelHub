import "bootstrap/dist/css/bootstrap.min.css";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import GoogleIcon from "/google-icon.svg";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();

    axios
      .post(
        "http://localhost:3001/login",
        { email, password },
        { withCredentials: true }
      )
      .then((result) => {
        if (result.data === "Success") {
          toast.success("Login successfully!", {});
          localStorage.setItem("userEmail", email);

          axios
            .get("http://localhost:3001/currentUser", { withCredentials: true })
            .then((response) => {
              console.log("User Details:", response.data);
              setTimeout(() => {
                navigate("/usedCars");
              }, 2000);
            })
            .catch((error) => {
              console.error(
                "Error fetching user details:",
                error.response ? error.response.data : error.message
              );
            });
        } else {
          toast.error("Incorrect credentials! Please try again.");
        }
      })
      .catch(() => {
        toast.error("An error occurred. Please try again.");
      });
  };

  const handleGoogleLogin = () => {
    window.open("http://localhost:3001/auth/google/callback", "_self");
  };

  return (
    <div>
      <ToastContainer />
      <Grid
        container
        component="main"
        sx={{
          height: "100vh",
          fontFamily: "Poppins, sans-serif",
        }}
      >
        <Grid
          item
          xs={false}
          sm={4}
          md={6}
          sx={{
            background: "linear-gradient(135deg, #030947, #12152E, #1F1F1F)",
            backgroundSize: "cover",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            boxShadow: "inset 0 0 15px rgba(0, 0, 0, 0.3)",
          }}
        >
          <img src="./assets/logo1.png" alt="Logo" />
        </Grid>

        <Grid item xs={12} sm={8} md={6} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography
              component="h1"
              sx={{
                fontWeight: "bold",
                fontSize: 48,
                position: "relative",
                paddingLeft: 6,
                alignSelf: "flex-start",
                color: "#333",
              }}
              variant="h5"
            >
              Login
              <Box
                component="span"
                sx={{
                  position: "absolute",
                  left: 0,
                  bottom: -5,
                  height: 6,
                  width: "75%",
                  background:
                    "linear-gradient(120deg, #D52728, #33C0FF, #5733FF, #030947)",
                  borderRadius: "5px",
                  marginLeft: 6,
                }}
              />
            </Typography>

            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit}
              sx={{ mt: 5, width: "100%" }}
            >
              <TextField
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                focused
                autoComplete="email"
                onChange={(event) => setEmail(event.target.value)}
                sx={{ my: 2 }}
              />
              <TextField
                required
                fullWidth
                name="password"
                label="Password"
                type={showPassword ? "text" : "password"}
                id="password"
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="new-password"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Grid container justifyContent="flex-end" sx={{ mb: 2 }}>
                <Link
                  href="/forgotPassword"
                  variant="body2"
                  sx={{
                    textTransform: "none",
                    color: "#555",
                    textDecoration: "none",
                  }}
                >
                  Forgot Password?
                </Link>
              </Grid>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                endIcon={<KeyboardDoubleArrowRightIcon />}
                sx={{
                  mt: 2,
                  mb: 2,
                  background: "#030947",
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: "bold",
                  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
                  "&:hover": {
                    background: "#12152E",
                    boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.3)",
                  },
                }}
              >
                Login
              </Button>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mt: 2,
                  mb: 2,
                }}
              >
                <Box
                  sx={{ flex: 1, height: "1px", backgroundColor: "#d1d1d1" }}
                />
                <Typography variant="body2" sx={{ color: "#555", mx: 2 }}>
                  Or
                </Typography>
                <Box
                  sx={{ flex: 1, height: "1px", backgroundColor: "#d1d1d1" }}
                />
              </Box>

              <Grid container spacing={2} justifyContent="center">
                <Grid item>
                  <IconButton
                    onClick={handleGoogleLogin}
                    sx={{
                      backgroundColor: "#fff",
                      borderRadius: "50%",
                      boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                      width: "50px",
                      height: "50px",
                      "&:hover": {
                        boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.15)",
                      },
                    }}
                  >
                    <img
                      src={GoogleIcon}
                      alt="Google logo"
                      style={{ width: "24px", height: "24px" }}
                    />
                  </IconButton>
                </Grid>

                <Grid item></Grid>
              </Grid>

              <Grid container justifyContent="center" sx={{ mt: 4 }}>
                <Typography
                  variant="body2"
                  sx={{
                    textTransform: "none",
                    color: "#000000",
                    textDecoration: "none",
                  }}
                >
                  Don&apos;t have an account yet?{" "}
                  <Link
                    href="/register"
                    variant="body2"
                    sx={{
                      color: "#D52728",
                      textDecoration: "none",
                      "&:hover": {},
                    }}
                  >
                    Create an account
                  </Link>
                </Typography>
              </Grid>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </div>
  );
};

export default Login;
