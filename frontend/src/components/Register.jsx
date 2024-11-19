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
import validator from "validator";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";

const Register = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleFieldChange = (field, value) => {
    switch (field) {
      case "firstName":
        setFirstName(value);
        setErrors({ ...errors, firstName: "" });
        break;
      case "lastName":
        setLastName(value);
        setErrors({ ...errors, lastName: "" });
        break;
      case "email":
        setEmail(value);
        setErrors({ ...errors, email: "" });
        break;
      case "password":
        setPassword(value);
        setErrors({ ...errors, password: "" });
        break;
      case "confirmPassword":
        setConfirmPassword(value);
        setErrors({ ...errors, confirmPassword: "" });
        break;
      default:
        break;
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    let validationErrors = {};

    const alphabeticRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$/;

    if (!alphabeticRegex.test(firstName)) {
      validationErrors.firstName = "First name should contain only alphabets.";
    }

    if (!alphabeticRegex.test(lastName)) {
      validationErrors.lastName = "Last name should contain only alphabets.";
    }

    if (!validator.isEmail(email)) {
      validationErrors.email = "Invalid email format.";
    }

    const passwordRegex =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+=[\]{};':"\\|,.<>/?]).{8,}$/;
    if (!passwordRegex.test(password)) {
      validationErrors.password =
        "Password must be at least 8 characters long, and contain at least one uppercase letter, one number, and one special character.";
    }

    if (password !== confirmPassword) {
      validationErrors.confirmPassword =
        "Passwords do not match. Please try again.";
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    axios
      .post("http://localhost:3001/register", {
        firstName,
        lastName,
        email,
        password,
      })
      .then((result) => {
        if (result.data.message === "Already registered") {
          toast.warning("E-mail already registered!");
        } else {
          toast.success(
            "Registered successfully! Please check your email to verify your account.",
            {}
          );
          setTimeout(() => {
            navigate("/login");
          }, 2000);
        }
        setErrors({});
      })
      .catch((err) => {
        console.log(err);
        toast.error("An error occurred. Please try again.");
      });
  };

  return (
    <div>
      <ToastContainer />
      <Grid
        container
        component="main"
        sx={{ height: "109vh", fontFamily: "Poppins, sans-serif" }}
      >
        <Grid item xs={12} sm={8} md={6} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              paddingTop: 8,
              mx: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
            }}
          >
            <Typography
              component="h1"
              sx={{
                fontWeight: "bold",
                fontSize: 64,
                position: "relative",
                alignSelf: "flex-start",
                color:"#333"
              }}
              variant="h5"
            >
              Sign Up
              <Box
                component="span"
                sx={{
                  position: "absolute",
                  left: 0,
                  bottom: -4,
                  height: 6,
                  width: "100%",
                  background:"linear-gradient(120deg, #D52728, #33C0FF, #5733FF, #030947)",
                  borderRadius: "5px",
                }}
              />
            </Typography>
            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit}
              sx={{ mt: 5 }}
            >
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    autoComplete="given-name"
                    name="firstName"
                    required
                    fullWidth
                    id="firstName"
                    label="First Name"
                    autoFocus
                    value={firstName}
                    onChange={(event) =>
                      handleFieldChange("firstName", event.target.value)
                    }
                    error={!!errors.firstName}
                    helperText={errors.firstName}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    id="lastName"
                    label="Last Name"
                    name="lastName"
                    autoComplete="family-name"
                    value={lastName}
                    onChange={(event) =>
                      handleFieldChange("lastName", event.target.value)
                    }
                    error={!!errors.lastName}
                    helperText={errors.lastName}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    value={email}
                    onChange={(event) =>
                      handleFieldChange("email", event.target.value)
                    }
                    error={!!errors.email}
                    helperText={errors.email}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    id="password"
                    value={password}
                    onChange={(event) =>
                      handleFieldChange("password", event.target.value)
                    }
                    autoComplete="new-password"
                    error={!!errors.password}
                    helperText={errors.password}
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
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    name="confirm-password"
                    label="Confirm Password"
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(event) =>
                      handleFieldChange("confirmPassword", event.target.value)
                    }
                    error={!!errors.confirmPassword}
                    helperText={errors.confirmPassword}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }
                            onMouseDown={(event) => event.preventDefault()}
                            edge="end"
                          >
                            {showConfirmPassword ? (
                              <VisibilityOff />
                            ) : (
                              <Visibility />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
              </Grid>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                endIcon={<KeyboardDoubleArrowRightIcon />}
                sx={{
                  mt: 3,
                  mb: 2,
                  background: "#030947",
                  borderRadius: 5,
                  fontWeight: "bold",
                  textTransform: "none",
                }}
              >
                Sign Up
              </Button>

              <Grid container justifyContent="center">
                <Grid item>
                  <Link
                    href="/login"
                    variant="body2"
                    sx={{
                      textTransform: "none",
                      color: "#000000",
                      textDecoration: "none",
                    }}
                  >
                    Already have an account?{" "}
                    <span style={{ color: "#D52728" }}>Sign in</span>
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Grid>
        <Grid
          item
          xs={false}
          sm={4}
          md={6}
          sx={{
            background: "linear-gradient(90deg, #1F1F1F, #12152E, #030947)",
            backgroundSize: "cover",
            paddingTop: 8,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <img src="./assets/logo2.png" alt="Logo" height={540} />
        </Grid>
      </Grid>
    </div>
  );
};

export default Register;
