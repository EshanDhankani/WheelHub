import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Grid,
  Button,
  Card,
  CardContent,
  LinearProgress,
} from "@mui/material";
import { MapPin, MessageCircle, Phone } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Navbar from "./Navbar";

const CustomRating = ({ label, value, maxValue }) => (
  <Box sx={{ mb: 2, display: "flex", alignItems: "center" }}>
    <Typography variant="subtitle1" sx={{ flex: 1, fontWeight: "bold" }}>
      {label}
    </Typography>
    <LinearProgress
      variant="determinate"
      value={(value / maxValue) * 100}
      sx={{
        height: 8,
        width: "70%",
        borderRadius: 5,
        backgroundColor: "#e0e0e0",
        "& .MuiLinearProgress-bar": {
          borderRadius: 5,
          background: "linear-gradient(to right, #76c7c0, #84fab0)",
        },
      }}
    />
    <Typography variant="body2" sx={{ ml: 2 }}>
      {value}/{maxValue}
    </Typography>
  </Box>
);

CustomRating.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
  maxValue: PropTypes.number.isRequired,
};

const CarDetailScreen = () => {
  const [carDetails, setCarDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchCarDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:3001/carAds/${id}`);
        setCarDetails(response.data);
        setError(null);
      } catch (error) {
        console.error("Error fetching car details:", error);
        setError("Failed to fetch car details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCarDetails();
  }, [id]);

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 8, textAlign: "center" }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 8, textAlign: "center" }}>
        <Typography color="error">{error}</Typography>
      </Container>
    );
  }

  if (!carDetails) {
    return (
      <Container maxWidth="lg" sx={{ py: 8, textAlign: "center" }}>
        <Typography>Car details not found.</Typography>
      </Container>
    );
  }

  return (
    <Box
      sx={{
        background: "linear-gradient(to right, #2c3e50, #bdc3c7)",
        minHeight: "100vh",
        pt: 2,
      }}
    >
      {/* Include Navbar within the Content Layout */}
      <Container maxWidth="lg" sx={{ mb: 9 }}>
        <Navbar />
      </Container>

      {/* Main Container with Background and Padding */}
      <Container
        maxWidth="lg"
        sx={{
          background: "#fff",
          borderRadius: 4,
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
          p: 4,
        }}
      >
        {/* Header Section */}
        <Box
          sx={{
            background: "linear-gradient(45deg, #6DD5FA, #2980B9, #6DD5FA)",
            boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
            p: 3,
            textAlign: "center",
            color: "#fff",
            mb: 5,
            borderRadius: 2,
          }}
        >
          <Typography
            variant="h2"
            sx={{ fontWeight: "bold", letterSpacing: 1.5 }}
          >
            {carDetails.carInfo}
          </Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              mt: 2,
            }}
          >
            <MapPin size={32} style={{ marginRight: 8 }} />
            <Typography variant="h5">{carDetails.city}</Typography>
          </Box>
        </Box>

        {/* Main Car Details and Image Section */}
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            {/* Image Carousel */}
            <Box
              sx={{
                mb: 6,
                overflow: "hidden",
                borderRadius: 4,
                boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
              }}
            >
              <Swiper
                modules={[Navigation, Pagination]}
                navigation
                pagination={{ clickable: true }}
                loop={true}
                style={{ width: "100%", height: "500px" }}
              >
                {carDetails.images.map((image, index) => (
                  <SwiperSlide key={index}>
                    <img
                      src={`http://localhost:3001/${image}`}
                      alt={`${carDetails.carInfo} - Image ${index + 1}`}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </Box>

            {/* Car Details */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>
                Car Details
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6} md={3}>
                  <Typography
                    variant="subtitle1"
                    sx={{ display: "flex", alignItems: "center" }}
                  >
                    Registered In
                  </Typography>
                  <Typography variant="h6">{carDetails.city}</Typography>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Typography variant="subtitle1">Color</Typography>
                  <Typography variant="h6">
                    {carDetails.exteriorColor}
                  </Typography>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Typography variant="subtitle1">Mileage</Typography>
                  <Typography variant="h6">
                    {carDetails.mileage.toLocaleString()} km
                  </Typography>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Typography variant="subtitle1">Year</Typography>
                  <Typography variant="h6">{carDetails.year}</Typography>
                </Grid>
              </Grid>
            </Box>

            {/* Overall Rating Section */}
            <Box sx={{ mb: 4 }}>
              <Typography
                variant="h5"
                gutterBottom
                sx={{ fontWeight: "bold", color: "#2E3B4E" }}
              >
                Overall Rating
              </Typography>
              <CustomRating label="Interior" value={4} maxValue={5} />
              <CustomRating label="Exterior & Body" value={3.5} maxValue={5} />
              <CustomRating label="AC/Heater" value={5} maxValue={5} />
            </Box>

            {/* Seller's Comments Section */}
            <Card
              sx={{
                mb: 4,
                borderRadius: 4,
                boxShadow: "0 4px 8px rgba(0,0,0,0.4)",
              }}
            >
              <CardContent>
                <Typography
                  variant="h5"
                  gutterBottom
                  sx={{ fontWeight: "bold", color: "#1976D2" }}
                >
                  Seller's Comments
                </Typography>
                <Typography variant="body1">
                  {carDetails.adDescription}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Price and Contact Section */}
          <Grid item xs={12} md={4}>
            <Card
              sx={{
                mb: 4,
                p: 3,
                borderRadius: 4,
                boxShadow: "0 10px 16px rgba(0,0,0,0.4)",
              }}
            >
              <CardContent>
                <Typography
                  variant="h4"
                  sx={{ fontWeight: "bold", color: "#D32F2F" }}
                >
                  PKR {parseInt(carDetails.price).toLocaleString()}
                </Typography>
                <Typography variant="h6" sx={{ mt: 1 }}>
                  <Phone style={{ marginRight: 8 }} /> Contact: 0
                  {parseInt(carDetails.mobileNumber).toString()}
                </Typography>
                <Button
                  variant="contained"
                  fullWidth
                  sx={{ mt: 2, background: "#1976D2", color: "#fff" }}
                  startIcon={<MessageCircle />}
                >
                  Send Message
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default CarDetailScreen;
