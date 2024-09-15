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
      .post("http://localhost:3001/login", { email, password })
      .then((result) => {
        if (result.data === "Success") {
          toast.success("Login successfully!", {});
          localStorage.setItem("userEmail", email);
          setTimeout(() => {
            navigate("/usedCars");
          }, 2000);
        } else {
          toast.error("Incorrect credentials! Please try again.");
        }
      })
      .catch(() => {
        toast.error("An error occurred. Please try again.");
      });
  };


  const handleGoogleLogin = () => {
    window.open("http://localhost:3001/auth/google/callback","_self")

    
  };
  
  return (
    <div>
      <ToastContainer />
      <Grid
        container
        component="main"
        sx={{
          height: "109vh",
          overflowY: "hidden",
          fontFamily: "Poppins, sans-serif",
        }}
      >
        <Grid
          item
          xs={false}
          sm={4}
          md={6}
          sx={{
            background: "linear-gradient(90deg, #030947, #12152E,  #1F1F1F)",
            backgroundSize: "cover",
            paddingTop: 8,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <img src="./assets/logo1.png" alt="Logo" />
        </Grid>

        <Grid item xs={12} sm={8} md={6} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              paddingTop: 8,
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
                fontSize: 64,
                position: "relative",
                paddingLeft: 6,
                alignSelf: "flex-start",
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
                  width: "80%",
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
              sx={{ mt: 5}}
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
                        onMouseDown={(event) => event.preventDefault()}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />


<Grid container justifyContent="space-between" sx={{mb: 2}}>
                <Grid item>
                  <Link
                    href="/forgotPassword"
                    variant="body2"
                    sx={{
                      textTransform: "none",
                      color: "#000000",
                      textDecoration: "none",
                      ml: 40
                    }}
                  >
                    Forgot Password?{" "}
                    
                  </Link>
                </Grid>
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
                  borderRadius: 5,
                  textTransform: "none",
                  fontWeight: "bold",
                }}
              >
                Login
              </Button>


              <Button
                  variant="outlined"
                  
                  startIcon={
                    <img
                      src={GoogleIcon}
                      alt="Google logo"
                      style={{ width: "20px", height: "30px" }}
                    />
                  }
                  onClick={handleGoogleLogin}
                  sx={{
                    textTransform: "none",
                    color: "rgba(0, 0, 0)",
                    backgroundColor: "#fff",
                    borderColor: "rgba(0, 0, 0, 0.23)",
                    "&:hover": {
                      backgroundColor: "#f5f5f5",
                      borderColor: "rgba(0, 0, 0, 0.23)",
                    },
                  }}
                >
                  Continue with Google
                </Button>

              <Grid container justifyContent="space-between" sx={{mb: 2}}>
                <Grid item>
                  <Link
                    href="/register"
                    variant="body2"
                    sx={{
                      textTransform: "none",
                      color: "#000000",
                      textDecoration: "none",
                      ml: 28
                    }}
                  >
                    Don't have an account?{" "}
                    <span style={{ color: "#D52728" }}>Sign Up</span>
                  </Link>
                </Grid>

               
              </Grid>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </div>
  );
};

export default Login;
