import { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Typography, Grid, Card, CardContent, IconButton, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

const MyAds = () => {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteAdId, setDeleteAdId] = useState(null); // For tracking the ad to delete
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false); // For confirmation dialog
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyAds = async () => {
      try {
        const response = await axios.get('http://localhost:3001/myAds', {
          withCredentials: true,
        });
        setAds(response.data.ads);
      } catch (error) {
        console.error('Error fetching ads:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMyAds();
  }, []);

  const handleEditClick = (ad) => {
    navigate(`/edit-car/${ad._id}`);
  };

  const handleDeleteClick = (adId) => {
    setDeleteAdId(adId);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(`http://localhost:3001/carAds/${deleteAdId}`, {
        withCredentials: true,
      });
      // Remove the deleted ad from state
      setAds((prevAds) => prevAds.filter((ad) => ad._id !== deleteAdId));
      setIsDeleteDialogOpen(false);
      setDeleteAdId(null);
    } catch (error) {
      console.error('Error deleting ad:', error);
    }
  };

  const handleDeleteCancel = () => {
    setIsDeleteDialogOpen(false);
    setDeleteAdId(null);
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          backgroundColor: '#f5f7fa',
        }}
      >
        <CircularProgress color="primary" />
      </Box>
    );
  }

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <div
      style={{
        fontFamily: 'Roboto, sans-serif',
        backgroundColor: '#f5f7fa',
        minHeight: '100vh',
        padding: '20px',
      }}
    >
      <Navbar />
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: '20px',
        }}
      >
        <Typography
          variant="h5"
          style={{
            fontWeight: 'bold',
            fontSize: '26px',
            color: 'rgb(0, 123, 255)',
            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.1)',
          }}
        >
          My Ads
        </Typography>
      </Box>

      <Box
        style={{
          display: 'flex',
          flexDirection: 'row',
          padding: '30px',
          justifyContent: 'space-between',
        }}
      >
        <Grid container spacing={4} style={{ flex: 2 }}>
          {ads.map((ad) => (
            <Grid item xs={12} key={ad._id}>
              <Card
                style={{
                  display: 'flex',
                  backgroundColor: '#fff',
                  borderRadius: '15px',
                  boxShadow: '0 6px 18px rgba(0, 0, 0, 0.05)',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'scale(1.03)';
                  e.currentTarget.style.boxShadow = '0 12px 30px rgba(0, 0, 0, 0.15)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = '0 6px 18px rgba(0, 0, 0, 0.05)';
                }}
              >
                {/* Image Slider */}
                <Box sx={{ width: '40%', padding: '10px' }}>
                  <Slider {...sliderSettings}>
                    {ad.images.map((image, index) => (
                      <div key={index}>
                        <img
                          src={`http://localhost:3001/${image}`}
                          alt={`Ad Image ${index + 1}`}
                          style={{
                            width: '100%',
                            height: '220px',
                            objectFit: 'cover',
                            borderRadius: '8px',
                            transition: 'transform 0.3s ease',
                          }}
                          onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
                          onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                        />
                      </div>
                    ))}
                  </Slider>
                </Box>

                {/* Car Details */}
                <CardContent sx={{ width: '60%', padding: '20px 30px' }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: '22px', color: '#333' }}>
                    Car Make or Model: {ad.carInfo}
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#666', marginTop: '10px' }}>
                    Price: {ad.price}
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#666', marginTop: '5px' }}>
                    Mileage: {ad.mileage} km
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#666', marginTop: '5px' }}>
                    Location: {ad.city}
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#666', marginTop: '5px' }}>
                    Exterior Color: {ad.exteriorColor}
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#666', marginTop: '5px' }}>
                    Description: {ad.adDescription}
                  </Typography>

                  <Grid container spacing={2} alignItems="center" style={{ marginTop: '20px' }}>
                    <Grid item>
                      <IconButton size="small" style={{ color: '#007bff' }} onClick={() => handleEditClick(ad)}>
                        <EditIcon />
                      </IconButton>
                    </Grid>
                    <Grid item>
                      <IconButton size="small" style={{ color: '#ff4d4d' }} onClick={() => handleDeleteClick(ad._id)}>
                        <DeleteIcon />
                      </IconButton>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onClose={handleDeleteCancel}>
        <DialogTitle>Delete Ad</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this ad? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="primary">
            No
          </Button>
          <Button onClick={handleDeleteConfirm} color="secondary" autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default MyAds;
