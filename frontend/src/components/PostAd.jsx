import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Button,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  Grid,
  Snackbar,
  IconButton,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import { Camera } from "lucide-react";
  
const iconStep1 = "https://wsa1.pakwheels.com/assets/sell-icons/car-221614dec8c0f3717dede556a5daad01.svg";
const iconStep2 = "https://wsa1.pakwheels.com/assets/sell-icons/photos-708994063564767acaca738e1261f90d.svg";
const iconStep3 = "https://wsa4.pakwheels.com/assets/sell-icons/tag-3ba531fca999b37f89be28609fe9e9c0.svg";

const StyledCard = styled(Card)(({ theme }) => ({
  maxWidth: 900,
  margin: "3rem auto",
  padding: theme.spacing(6),
  boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
  borderRadius: "24px",
  background: "linear-gradient(135deg, #f0f4f8 0%, #ffffff 100%)",
  position: "relative",
  overflow: "visible",
  "&::before": {
    content: '""',
    position: "absolute",
    top: "-20px",
    left: "-20px",
    right: "-20px",
    bottom: "-20px",
    zIndex: -1,
    borderRadius: "32px",
    filter: "blur(30px)",
    opacity: 0.5,
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(3),
  borderRadius: "12px",
  padding: "14px 28px",
  fontWeight: "bold",
  textTransform: "none",
  fontSize: "1.1rem",
  // background: "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)",
  backgroundColor:"#C7253E",
  boxShadow: "0 4px 15px rgba(37, 117, 252, 0.2)",
  transition: "all 0.3s ease",
  color: "#fff",
  "&:hover": {
    // background: "linear-gradient(135deg, #2575fc 0%, #6a11cb 100%)",
    transform: "translateY(-2px)",
    boxShadow: "0 6px 20px rgba(37, 117, 252, 0.3)",
  },
}));

const HeaderSection = styled("div")(({ theme }) => ({
  backgroundColor: "#fff",
  padding: theme.spacing(4),
  borderRadius: "12px",
  textAlign: "center",
  boxShadow: "0 5px 15px rgba(0, 0, 0, 0.1)",
  marginBottom: theme.spacing(4),
  marginTop: "110px"
}));

const HeaderText = styled(Typography)(({ theme }) => ({
  color: "#001F3F",
  fontSize: "2rem",
  fontWeight: "bold",
  marginBottom: theme.spacing(2),
}));

const StepSection = styled("div")(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  marginBottom: "2rem",
  textAlign: "center",
  padding: theme.spacing(2),
}));

const Step = styled("div")(() => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  margin: "0 2rem",
}));

const PostAd = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isEditMode = !!location.state?.adData;

  const [formData, setFormData] = useState({
    city: "",
    carInfo: "",
    year: "",
    registeredIn: "Un-Registered",
    exteriorColor: "",
    mileage: "",
    price: "",
    adDescription: "",
    mobileNumber: "",
    images: [],
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    if (isEditMode) {
      const adData = location.state.adData;
      setFormData({
        city: adData.city,
        carInfo: adData.carInfo,
        year: adData.year,
        registeredIn: adData.registeredIn,
        exteriorColor: adData.exteriorColor,
        mileage: adData.mileage,
        price: adData.price,
        adDescription: adData.adDescription,
        mobileNumber: adData.mobileNumber,
        images: adData.images,
      });
    }
  }, [isEditMode, location.state]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "mileage" && value < 0) {
      setSnackbar({
        open: true,
        message: "Mileage cannot be negative.",
        severity: "error",
      });
      return;
    }

    if (name === "price" && value < 0) {
      setSnackbar({
        open: true,
        message: "Price cannot be negative.",
        severity: "error",
      });
      return;
    }

    if (name === "mobileNumber") {
      if (isNaN(value)) {
        setSnackbar({
          open: true,
          message: "Mobile number must only contain numbers.",
          severity: "error",
        });
        return;
      }
      if (value.length > 11) {
        setSnackbar({
          open: true,
          message: "Mobile number cannot be more than 11 digits.",
          severity: "error",
        });
        return;
      }
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData((prevState) => ({
      ...prevState,
      images: files.slice(0, 3),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.mobileNumber.length !== 11) {
      setSnackbar({
        open: true,
        message: "Mobile number must be exactly 11 digits.",
        severity: "error",
      });
      return;
    }

    try {
      const formDataToSend = new FormData();
      for (const key in formData) {
        if (key === "images") {
          formData[key].forEach((image) => {
            formDataToSend.append("images", image);
          });
        } else {
          formDataToSend.append(key, formData[key]);
        }
      }

      if (isEditMode) {
        await axios.put(
          `http://localhost:3001/carAds/${location.state.adData._id}`,
          formData,
          {
            withCredentials: true,
          }
        );
        setSnackbar({
          open: true,
          message: "Ad updated successfully!",
          severity: "success",
        });
      } else {
        await axios.post("http://localhost:3001/postAd", formDataToSend, {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        });
        setSnackbar({
          open: true,
          message: "Ad posted successfully!",
          severity: "success",
        });
      }

      navigate("/my-ads");
    } catch (error) {
      console.error("Error posting/updating ad:", error);
      setSnackbar({
        open: true,
        message: "Error posting/updating ad. Please try again.",
        severity: "error",
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <>
    <Navbar/>
      <HeaderSection>
        <HeaderText>Sell your Car With 3 Easy & Simple Steps!</HeaderText>
        <StepSection>
          <Step>
            <img src={iconStep1} alt="Step 1" style={{ width: "60px" }} />
            <Typography variant="h6">Enter Your Car Information</Typography>
          </Step>
          <Step>
            <img src={iconStep2} alt="Step 2" style={{ width: "60px" }} />
            <Typography variant="h6">Upload Photos</Typography>
          </Step>
          <Step>
            <img src={iconStep3} alt="Step 3" style={{ width: "60px" }} />
            <Typography variant="h6">Enter Your Selling Price</Typography>
          </Step>
        </StepSection>
      </HeaderSection>

      {/* Card and Form Section */}
      <StyledCard>
        <CardContent>
          <Typography variant="h4" component="h1" align="center" gutterBottom>
            {isEditMode ? "Edit Your Ad" : "Car Information"}
          </Typography>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={4}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>City</InputLabel>
                  <Select
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                  >
                    <MenuItem value="Lahore">Lahore</MenuItem>
                    <MenuItem value="Karachi">Karachi</MenuItem>
                    <MenuItem value="Islamabad">Islamabad</MenuItem>
                    <MenuItem value="Rawalpindi">Rawalpindi</MenuItem>
                    <MenuItem value="Badin">Badin</MenuItem>
                    <MenuItem value="Larkana">Larkana</MenuItem>
                    <MenuItem value="Sukkur">Sukkur</MenuItem>
                    <MenuItem value="Hyderabad">Hyderabad</MenuItem>
                    <MenuItem value="Gujranwala">Gujranwala</MenuItem>
                    <MenuItem value="Swat">Swat</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  name="carInfo"
                  label="Car Info"
                  value={formData.carInfo}
                  onChange={handleChange}
                  fullWidth
                  required
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  name="year"
                  label="Car Year"
                  value={formData.year}
                  onChange={handleChange}
                  fullWidth
                  required
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Registered In</InputLabel>
                  <Select
                    name="registeredIn"
                    value={formData.registeredIn}
                    onChange={handleChange}
                  >
                    <MenuItem value="Un-Registered">Un-Registered</MenuItem>
                    <MenuItem value="Registered">Registered</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Exterior Color</InputLabel>
                  <Select
                    name="exteriorColor"
                    value={formData.exteriorColor}
                    onChange={handleChange}
                  >
                    <MenuItem value="White">White</MenuItem>
                    <MenuItem value="Black">Black</MenuItem>
                    <MenuItem value="Silver">Silver</MenuItem>
                    <MenuItem value="Red">Red</MenuItem>
                    <MenuItem value="Blue">Blue</MenuItem>
                    <MenuItem value="Strong Blue Metelic">
                      Strong Blue Metelic
                    </MenuItem>
                    <MenuItem value="Burgundy">Burgundy</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  name="mileage"
                  label="Mileage"
                  type="number"
                  value={formData.mileage}
                  onChange={handleChange}
                  fullWidth
                  required
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  name="price"
                  label="Price (PKR)"
                  type="number"
                  value={formData.price}
                  onChange={handleChange}
                  fullWidth
                  required
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  name="adDescription"
                  label="Ad Description"
                  multiline
                  rows={4}
                  value={formData.adDescription}
                  onChange={handleChange}
                  fullWidth
                  required
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  name="mobileNumber"
                  label="Mobile Number"
                  value={formData.mobileNumber}
                  onChange={handleChange}
                  fullWidth
                  required
                />
              </Grid>

              <Grid item xs={12}>
                <input
                  accept="image/*"
                  style={{ display: "none" }}
                  id="image-upload"
                  multiple
                  type="file"
                  onChange={handleImageChange}
                />
                <label htmlFor="image-upload">
                  <Button
                    component="span"
                    fullWidth
                    variant="outlined"
                    startIcon={<Camera />}
                  >
                    Upload Images (Max 3)
                  </Button>
                </label>
                <Typography align="center">
                  {formData.images.length} image(s) selected
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <StyledButton type="submit" fullWidth variant="contained">
                  {isEditMode ? "Update Ad" : "Submit Ad"}
                </StyledButton>
              </Grid>
            </Grid>
          </form>
        </CardContent>

        <Snackbar
          open={snackbar.open}
          message={snackbar.message}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          action={
            <IconButton
              size="small"
              color="inherit"
              onClick={handleCloseSnackbar}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          }
        />
      </StyledCard>
    </>
  );
};

export default PostAd;
