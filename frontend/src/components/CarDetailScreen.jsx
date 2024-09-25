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
import { MapPin, MessageCircle } from "lucide-react"; 
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Navbar from "./Navbar";

const CustomRating = ({ label, value, maxValue }) => {
  return (
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
          borderRadius: 4,
          backgroundColor: "#e0e0e0",
        }}
      />
      <Typography variant="body2" sx={{ ml: 2 }}>
        {value}/{maxValue}
      </Typography>
    </Box>
  );
};


CustomRating.propTypes = {
  label: PropTypes.string.isRequired, 
  value: PropTypes.number.isRequired,   
  maxValue: PropTypes.number.isRequired 
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
    <>
      <Navbar />

      <Container maxWidth="lg" sx={{ py: 11, mt: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold" }}>
          {carDetails.carInfo}
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <MapPin size={20} style={{ marginRight: 8 }} />
          <Typography variant="subtitle1">{carDetails.city}</Typography>
        </Box>

        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <Box sx={{ mb: 4 }}>
              <Swiper
                modules={[Navigation, Pagination]}
                navigation
                pagination={{ clickable: true }}
                loop={true}
                style={{ width: "100%", height: "550px" }}
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
              <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
                Car Details
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6} md={3}>
                  <Typography variant="body2" color="text.secondary">
                    Registered In
                  </Typography>
                  <Typography variant="body1">{carDetails.city}</Typography>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Typography variant="body2" color="text.secondary">
                    Color
                  </Typography>
                  <Typography variant="body1">
                    {carDetails.exteriorColor}
                  </Typography>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Typography variant="body2" color="text.secondary">
                    Mileage
                  </Typography>
                  <Typography variant="body1">
                    {carDetails.mileage.toLocaleString()} km
                  </Typography>
                </Grid>

                <Grid item xs={6} md={3}>
                  <Typography variant="body2" color="text.secondary">
                    Year
                  </Typography>
                  <Typography variant="body1">
                    {carDetails.year.toString()}
                  </Typography>
                </Grid>
              </Grid>
            </Box>

            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
                Overall Rating
              </Typography>
              <CustomRating label="Interior" value={4} maxValue={5} />
              <CustomRating label="Exterior & Body" value={3.5} maxValue={5} />
              <CustomRating label="AC/Heater" value={5} maxValue={5} />
            </Box>

            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
                Seller's Comments
              </Typography>
              <Typography variant="body1">{carDetails.adDescription}</Typography>
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ mb: 2 }}>
              <CardContent>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ fontWeight: "bold" }}
                >
                  PKR {parseInt(carDetails.price).toString()}
                </Typography>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ fontWeight: "bold" }}
                >
                  Phone Number 0{parseInt(carDetails.mobileNumber).toString()}
                </Typography>

                <Button
                  variant="outlined"
                  // fullWidth
                  startIcon={<MessageCircle />}
                >
                  Send Message
                </Button>
              </CardContent>
            </Card>

            <Card sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
                  Safety Tips for Transactions
                </Typography>
                <ul>
                  <li>Use a safe location to meet seller</li>
                  <li>Avoid cash transactions</li>
                  <li>Beware of unrealistic offers</li>
                </ul>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default CarDetailScreen;
