import  { useEffect, useState } from "react";
import { TextField, Button, Grid, Typography, Container, Box } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";


const theme = createTheme({
  typography: {
    fontFamily: "Poppins, sans-serif",
  },
  palette: {
    primary: {
      main: "#030947",
    },
  },
});

const ProfileEdit = () => {
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: ""
  });

const navigate = useNavigate();


  useEffect(() => {
    const userEmail = localStorage.getItem("userEmail");
    if (userEmail) {
      axios
        .get(`http://localhost:3001/user?email=${userEmail}`)
        .then((response) => {
          const { email, name, password } = response.data;
          const [firstName, lastName] = name.split(" ");
          setProfileData({ firstName, lastName, email, password });
        })
        .catch((error) => {
          console.error("Error fetching user data", error);
        });
    }
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setProfileData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    axios
      .post("http://localhost:3001/updateUser", profileData)
      .then((response) => {
        console.log("Profile updated successfully:", response.data);
        toast.success("Profile updated successfully!", {});
      })
      .catch((error) => {
        console.error("Error updating profile:", error);
        toast.error("Error updating profile:");
      });
  };

  const handleDelete = () => {
    axios
      .delete(`http://localhost:3001/deleteUser?email=${profileData.email}`)
      .then((response) => {
        console.log("Profile deleted successfully:", response.data);
        toast.success("Profile deleted successfully!", {});
        localStorage.removeItem("userEmail");
        setTimeout(() => {
            navigate("/login");
          }, 2000);      })
      .catch((error) => {
        console.error("Error deleting profile:", error);
        toast.error("Error deleting profile:");
      });
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="md">
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography component="h1" variant="h5" alignSelf="flex-start" fontWeight="600">
            Edit profile
          </Typography>
          <Box component="form" noValidate sx={{ mt: 3 }} onSubmit={handleSubmit}>
            <ToastContainer />
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="fname"
                  name="firstName"
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  value={profileData.firstName}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  autoComplete="lname"
                  value={profileData.lastName}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email"
                  name="email"
                  autoComplete="email"
                  value={profileData.email}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  value={profileData.password}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} display="flex" justifyContent="flex-end">
                {/* Add other buttons or components as needed */}
              </Grid>
            </Grid>
            <Box display="flex" justifyContent="space-between" sx={{ mt: 3 }}>
              <Box>
                <Button variant="outlined" sx={{ mr: 2 }}>
                  Cancel
                </Button>
                <Button type="submit" variant="contained" color="primary">
                  Save
                </Button>
              </Box>
              <Button onClick={handleDelete} variant="contained" color="primary" sx={{ background: '#D52728' }}>
                Delete
              </Button>
            </Box>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default ProfileEdit;
