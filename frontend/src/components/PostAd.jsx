import { useState } from "react";
import axios from "axios";
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
import { Camera, Car, MapPin, Gauge } from "lucide-react";

const StyledCard = styled(Card)(({ theme }) => ({
  maxWidth: 900,
  margin: "3rem auto",
  padding: theme.spacing(6),
  boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
  borderRadius: "24px",
  background: "linear-gradient(135deg, #f6f9fc 0%, #ffffff 100%)",
  position: "relative",
  overflow: "visible",
  "&::before": {
    content: '""',
    position: "absolute",
    top: "-20px",
    left: "-20px",
    right: "-20px",
    bottom: "-20px",
    background: "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)",
    zIndex: -1,
    borderRadius: "32px",
    filter: "blur(20px)",
    opacity: 0.7,
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(3),
  borderRadius: "12px",
  padding: "14px 28px",
  fontWeight: "bold",
  textTransform: "none",
  fontSize: "1.1rem",
  background: "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)",
  boxShadow: "0 4px 15px rgba(37, 117, 252, 0.2)",
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "translateY(-3px)",
    boxShadow: "0 6px 20px rgba(37, 117, 252, 0.3)",
  },
}));

const FormTitle = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(5),
  color: "#6a11cb",
  fontWeight: 800,
  textAlign: "center",
  textTransform: "uppercase",
  letterSpacing: "3px",
  fontSize: "2.5rem",
  textShadow: "2px 2px 4px rgba(0, 0, 0, 0.1)",
}));

const StyledFormControl = styled(FormControl)((  ) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: "12px",
    transition: "all 0.3s ease",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    "&:hover": {
      boxShadow: "0 0 0 2px rgba(37, 117, 252, 0.2)",
    },
    "&.Mui-focused": {
      boxShadow: "0 0 0 3px rgba(37, 117, 252, 0.3)",
    },
  },
  "& .MuiInputLabel-root": {
    color: "#6a11cb",
    fontWeight: 600,
  },
}));

const StyledTextField = styled(TextField)(() => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: "12px",
    transition: "all 0.3s ease",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    "&:hover": {
      boxShadow: "0 0 0 2px rgba(37, 117, 252, 0.2)",
    },
    "&.Mui-focused": {
      boxShadow: "0 0 0 3px rgba(37, 117, 252, 0.3)",
    },
  },
  "& .MuiInputLabel-root": {
    color: "#6a11cb",
    fontWeight: 600,
  },
}));

const ImageUploadButton = styled(Button)(() => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  height: "150px",
  borderRadius: "16px",
  border: "3px dashed #6a11cb",
  backgroundColor: "rgba(255, 255, 255, 0.9)",
  color: "#6a11cb",
  transition: "all 0.3s ease",
  fontWeight: "bold",
  fontSize: "1.1rem",
  "&:hover": {
    backgroundColor: "rgba(106, 17, 203, 0.1)",
    transform: "scale(1.02)",
  },
}));

const PostAd = () => {
  const [formData, setFormData] = useState({
    city: "",
    carInfo: "",
    registeredIn: "Un-Registered",
    exteriorColor: "",
    mileage: "",
    price: "",
    adDescription: "",
    mobileNumber: "",
    images: [],
  });

  const [errors, setErrors] = useState({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData((prevState) => ({
      ...prevState,
      images: files.slice(0, 3),
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      if (key !== "images" && !formData[key]) {
        newErrors[key] = "This field is required";
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

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

      const response = await axios.post(
        "http://localhost:3001/postAd",
        formDataToSend,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );
      console.log(response.data);
      setSnackbar({ open: true, message: "Ad posted successfully!", severity: "success" });
    } catch (error) {
      console.error("Error posting ad:", error);
      setSnackbar({ open: true, message: "Error posting ad. Please try again.", severity: "error" });
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <StyledCard>
      <CardContent>
        <FormTitle variant="h4" component="h1">
          Post Your Car Ad
        </FormTitle>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={4}>
            <Grid item xs={12} sm={6}>
              <StyledFormControl fullWidth error={!!errors.city}>
                <InputLabel>City</InputLabel>
                <Select
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  startAdornment={<MapPin size={22} style={{ marginRight: 8, color: "#6a11cb" }} />}
                >
                  <MenuItem value="Lahore">Lahore</MenuItem>
                  <MenuItem value="Karachi">Karachi</MenuItem>
                  <MenuItem value="Islamabad">Islamabad</MenuItem>
                </Select>
                {errors.city && <Typography color="error">{errors.city}</Typography>}
              </StyledFormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <StyledTextField
                fullWidth
                name="carInfo"
                label="Car Info (Make/Model/Version)"
                value={formData.carInfo}
                onChange={handleChange}
                required
                error={!!errors.carInfo}
                helperText={errors.carInfo}
                InputProps={{
                  startAdornment: <Car size={22} style={{ marginRight: 8, color: "#6a11cb" }} />,
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <StyledFormControl fullWidth error={!!errors.registeredIn}>
                <InputLabel>Registered In</InputLabel>
                <Select
                  name="registeredIn"
                  value={formData.registeredIn}
                  onChange={handleChange}
                  required
                >
                  <MenuItem value="Un-Registered">Un-Registered</MenuItem>
                  <MenuItem value="Registered">Registered</MenuItem>
                </Select>
                {errors.registeredIn && <Typography color="error">{errors.registeredIn}</Typography>}
              </StyledFormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <StyledFormControl fullWidth error={!!errors.exteriorColor}>
                <InputLabel>Exterior Color</InputLabel>
                <Select
                  name="exteriorColor"
                  value={formData.exteriorColor}
                  onChange={handleChange}
                  required
                >
                  <MenuItem value="White">White</MenuItem>
                  <MenuItem value="Black">Black</MenuItem>
                  <MenuItem value="Silver">Silver</MenuItem>
                  <MenuItem value="Red">Red</MenuItem>
                </Select>
                {errors.exteriorColor && <Typography color="error">{errors.exteriorColor}</Typography>}
              </StyledFormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <StyledTextField
                fullWidth
                name="mileage"
                label="Mileage (km)"
                type="positive number"
                value={formData.mileage}
                onChange={handleChange}
                required
                error={!!errors.mileage}
                helperText={errors.mileage}
                InputProps={{
                  startAdornment: <Gauge size={22} style={{ marginRight: 8, color: "#6a11cb" }} />,
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <StyledTextField
                fullWidth
                name="price"
                label="Price (PKR)"
                type="positive number"
                value={formData.price}
                onChange={handleChange}
                required
                error={!!errors.price}
                helperText={errors.price}
                InputProps={{
                  startAdornment: <tag size={22} style={{ marginRight: 8, color: "#6a11cb" }} />,
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <StyledTextField
                fullWidth
                name="adDescription"
                label="Ad Description"
                multiline
                rows={4}
                value={formData.adDescription}
                onChange={handleChange}
                required
                error={!!errors.adDescription}
                helperText={errors.adDescription}
              />
            </Grid>

            <Grid item xs={12}>
              <StyledTextField
                fullWidth
                name="mobileNumber"
                label="Mobile Number"
                value={formData.mobileNumber}
                onChange={handleChange}
                required
                error={!!errors.mobileNumber}
                helperText={errors.mobileNumber}
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
                <ImageUploadButton component="span" fullWidth>
                  <Camera size={28} style={{ marginRight: 12 }} />
                  Upload Images (Max 3)
                </ImageUploadButton>
              </label>
              <Typography variant="body2" color="textSecondary" align="center" style={{ marginTop: 8 }}>
                {formData.images.length} image(s) selected
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <StyledButton type="submit" variant="contained" color="primary" fullWidth>
                Submit Ad
              </StyledButton>
            </Grid>
          </Grid>
        </form>
      </CardContent>
      <Snackbar
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={snackbar.message}
        action={
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={handleCloseSnackbar}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      />
    </StyledCard>
  );
};

export default PostAd;
