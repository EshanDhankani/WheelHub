import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Grid,
  Chip,
  Button,
} from '@mui/material';
import { MapPin, Car, Gauge, Phone } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

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
        console.error('Error fetching car details:', error);
        setError('Failed to fetch car details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchCarDetails();
  }, [id]);

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
        <Typography color="error">{error}</Typography>
      </Container>
    );
  }

  if (!carDetails) {
    return (
      <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
        <Typography>Car details not found.</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Typography variant="h3" gutterBottom sx={{ fontWeight: 'bold', color: '#1976d2' }}>
        {carDetails.carInfo}
      </Typography>
      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Box sx={{ aspectRatio: '4/3', width: '100%', overflow: 'hidden' }}>
            <Swiper
              modules={[Navigation, Pagination]}
              navigation
              pagination={{ clickable: true }}
              loop={true}
              style={{ width: '100%', height: '100%' }}
            >
              {carDetails.images.map((image, index) => (
                <SwiperSlide key={index} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <img 
                    src={`http://localhost:3001/${image}`} 
                    alt={`${carDetails.carInfo} - Image ${index + 1}`}
                    style={{ 
                      width: '100%', 
                      height: '100%', 
                      objectFit: 'contain',
                      backgroundColor: '#f0f0f0' // Light gray background
                    }}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </Box>
        </Grid>
        <Grid item xs={12} md={4}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <MapPin size={24} style={{ marginRight: 8, color: '#1976d2' }} />
              <Typography variant="h6">{carDetails.city}</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Car size={24} style={{ marginRight: 8, color: '#1976d2' }} />
              <Typography variant="h6">{carDetails.registeredIn} | {carDetails.exteriorColor}</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Gauge size={24} style={{ marginRight: 8, color: '#1976d2' }} />
              <Typography variant="h6">{carDetails.mileage.toLocaleString()} km</Typography>
            </Box>
            <Chip 
             
              label={`PKR ${parseInt(carDetails.price).toLocaleString()}`}
              color="primary"
              sx={{ fontWeight: 'bold', fontSize: '1.2rem', py: 1 }}
            />
            <Button 
              variant="contained" 
              startIcon={<Phone size={24} />}
              href={`tel:${carDetails.mobileNumber}`}
              sx={{ py: 1, fontSize: '1.2rem' }}
            >
              Call Seller
            </Button>
          </Box>
        </Grid>
      </Grid>
      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>Description</Typography>
        <Typography>{carDetails.adDescription}</Typography>
      </Box>
    </Container>
  );
};

export default CarDetailScreen;