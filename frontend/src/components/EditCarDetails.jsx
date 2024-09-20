import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Button,
  CircularProgress,
  TextField,
  Typography,
  Container,
  Grid,
} from '@mui/material';

const EditCarDetails = () => {
  const { id } = useParams(); // Get the car ad id from the URL
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();

  // Fetch car ad details when the component loads
  useEffect(() => {
    const fetchCarAd = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/carAds/${id}`);
        setFormData(response.data); // Populate form with existing car details
        setLoading(false);
      } catch (error) {
        console.error('Error fetching car ad details:', error);
        setLoading(false);
      }
    };
    fetchCarAd();
  }, [id]);

  // Handle input changes for form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };


  const handleSaveChanges = async () => {
    try {
      // Ensure formData contains the correct updated data
      await axios.put(`http://localhost:3001/carAds/${id}`, formData, {
        withCredentials: true,
      });
      alert('Car details updated successfully!');
      navigate('/my-ads'); // Redirect to My Ads page after saving changes
    } catch (error) {
      console.error('Error updating car details:', error); // Ensure proper error handling
      alert('Failed to update car details. Please try again.');
    }
  };
  

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom>Edit Car Ad</Typography>

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Car Info"
            name="carInfo"
            value={formData.carInfo || ''}
            onChange={handleInputChange}
            margin="normal"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Price"
            name="price"
            value={formData.price || ''}
            onChange={handleInputChange}
            margin="normal"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Mileage"
            name="mileage"
            value={formData.mileage || ''}
            onChange={handleInputChange}
            margin="normal"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="City"
            name="city"
            value={formData.city || ''}
            onChange={handleInputChange}
            margin="normal"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Exterior Color"
            name="exteriorColor"
            value={formData.exteriorColor || ''}
            onChange={handleInputChange}
            margin="normal"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Ad Description"
            name="adDescription"
            value={formData.adDescription || ''}
            onChange={handleInputChange}
            margin="normal"
            multiline
            rows={4}
          />
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" color="primary" onClick={handleSaveChanges}>
            Save Changes
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
};

export default EditCarDetails;

