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
  Card,
  CardContent,
  LinearProgress,
} from "@mui/material";
import { MapPin, Phone } from "lucide-react";
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
          backgroundColor: "linear-gradient(142deg, #030950, #12175F, #2F1F2F)",
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

  const sellerName = carDetails.userId?.name || "Unknown Seller";

  return (
    <Box
      sx={{
        background: "linear-gradient(142deg, #030950, #12175F, #2F1F2F)",
        minHeight: "100vh",
        pt: 2,
      }}
    >
      <Container maxWidth="lg" sx={{ mb: 9 }}>
        <Navbar />
      </Container>

      <Container
        maxWidth="lg"
        sx={{
          background: "#fff",
          borderRadius: 4,
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
          p: 4,
        }}
      >
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

        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
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

            <Box sx={{ mb: 4 }}>
              <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>
                Car Details
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={6} md={3}>
                  <Typography variant="subtitle1">Registered In</Typography>
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
                <Grid item xs={12}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    Seller Comments
                  </Typography>
                  <Typography variant="h6">
                    {carDetails.adDescription}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          </Grid>

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
                  variant="h6"
                  sx={{ fontWeight: "bold", mb: 2 }}
                >
                  Seller: {sellerName}
                </Typography>
                <Typography
                  variant="h4"
                  sx={{ fontWeight: "bold", color: "#D32F2F" }}
                >
                  PKR {parseInt(carDetails.price).toLocaleString()}
                </Typography>
                <Typography variant="h6" sx={{ mt: 1 }}>
                  <Phone style={{ marginRight: 8 }} /> Contact:{" "}
                  {carDetails.mobileNumber}
                </Typography>
              </CardContent>
            </Card>

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
                  variant="h6"
                  sx={{ fontWeight: "bold", color: "#D32F2F" }}
                >
                  Safety Tips for Transactions
                </Typography>
                <Typography variant="body1">
                  1. Use a safe location to meet the seller. <br />
                  2. Avoid cash transactions. <br />
                  3. Beware of unrealistic offers.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default CarDetailScreen;
