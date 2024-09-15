import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Container,
  Box,
  CircularProgress,
  Button,
  Chip,
  Paper,
  IconButton,
  Divider,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField
} from '@mui/material';
import { MapPin, Car, Gauge, Phone, Search } from 'lucide-react';

const UsedCars = () => {
  const [carAds, setCarAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const [makeModel, setMakeModel] = useState('');
  const [city, setCity] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [filteredCarAds, setFilteredCarAds] = useState([]);
  
  const [cityOptions, setCityOptions] = useState([]);

  const priceOptions = [
    { value: '', label: 'Any' },
    { value: 500000, label: '5 Lacs' },
    { value: 1000000, label: '10 Lacs' },
    { value: 1500000, label: '15 Lacs' },
    { value: 2000000, label: '20 Lacs' },
    { value: 2500000, label: '25 Lacs' },
    { value: 3000000, label: '30 Lacs' },
    { value: 4000000, label: '40 Lacs' },
    { value: 5000000, label: '50 Lacs' },
    { value: 7500000, label: '75 Lacs' },
    { value: 10000000, label: '1 Crore' },
    { value: 15000000, label: '1.5 Crore' },
    { value: 20000000, label: '2 Crore' },
  ];

  useEffect(() => {
    const fetchCarAds = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:3001/carAds');
        setCarAds(response.data);
        setFilteredCarAds(response.data);
        
        const uniqueCities = [...new Set(response.data.map(ad => ad.city))];
        setCityOptions(uniqueCities);
        
        setError(null);
      } catch (error) {
        console.error('Error fetching car ads:', error);
        setError('Failed to fetch car ads. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchCarAds();
  }, []);

  const handleSearch = () => {
    const filtered = carAds.filter(ad => {
      const matchesMakeModel = !makeModel || ad.carInfo.toLowerCase().includes(makeModel.toLowerCase());
      const matchesCity = !city || ad.city.toLowerCase() === city.toLowerCase();
      const matchesMinPrice = !minPrice || ad.price >= parseInt(minPrice);
      const matchesMaxPrice = !maxPrice || ad.price <= parseInt(maxPrice);
      return matchesMakeModel && matchesCity && matchesMinPrice && matchesMaxPrice;
    });
    setFilteredCarAds(filtered);
  };

  const handleCarClick = (carId) => {
    navigate(`/car/${carId}`);
  };

  const handleMinPriceChange = (e) => {
    const selectedMinPrice = e.target.value;
    setMinPrice(selectedMinPrice);
    // Reset max price if it's less than the new min price
    if (maxPrice && parseInt(maxPrice) <= parseInt(selectedMinPrice)) {
      setMaxPrice('');
    }
  };

  const getFilteredMaxPriceOptions = () => {
    if (!minPrice) return priceOptions;
    return priceOptions.filter(option => option.value === '' || option.value > parseInt(minPrice));
  };

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

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Typography variant="h3" gutterBottom align="center" sx={{ mb: 6, fontWeight: 'bold', color: '#1976d2' }}>
        Used Cars Marketplace
      </Typography>

      {/* Custom Search Bar */}
      <Paper
        component="form"
        sx={{
          p: '2px 4px',
          display: 'flex',
          alignItems: 'center',
          width: '100%',
          mb: 4
        }}
      >
        <TextField
          placeholder="Make and Model"
          value={makeModel}
          onChange={(e) => setMakeModel(e.target.value)}
          sx={{ flexGrow: 1 }}
        />
        <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
        <FormControl sx={{ m: 1, minWidth: 120 }}>
          <InputLabel>City</InputLabel>
          <Select
            value={city}
            label="City"
            onChange={(e) => setCity(e.target.value)}
          >
            <MenuItem value="">Any</MenuItem>
            {cityOptions.map((city) => (
              <MenuItem key={city} value={city}>{city}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
        <FormControl sx={{ m: 1, minWidth: 120 }}>
          <InputLabel>Min Price</InputLabel>
          <Select
            value={minPrice}
            label="Min Price"
            onChange={handleMinPriceChange}
          >
            {priceOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl sx={{ m: 1, minWidth: 120 }}>
          <InputLabel>Max Price</InputLabel>
          <Select
            value={maxPrice}
            label="Max Price"
            onChange={(e) => setMaxPrice(e.target.value)}
          >
            {getFilteredMaxPriceOptions().map((option) => (
              <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <IconButton type="button" sx={{ p: '10px' }} aria-label="search" onClick={handleSearch}>
          <Search />
        </IconButton>
      </Paper>

      {/* Results Count */}
      <Typography variant="subtitle1" sx={{ mb: 2 }}>
        {filteredCarAds.length} results found
      </Typography>

      {/* Car Ads Grid */}
      <Grid container spacing={4}>
        {filteredCarAds.map((ad) => (
          <Grid item key={ad._id} xs={12} sm={6} md={4}>
            <Card 
              sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 6px 12px rgba(0,0,0,0.15)',
                },
                cursor: 'pointer',
              }}
              onClick={() => handleCarClick(ad._id)}
            >
              <img 
                src={`http://localhost:3001/${ad.images[0]}`} 
                alt={ad.carInfo}
                style={{ width: '100%', height: '200px', objectFit: 'cover' }}
              />
              <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <Typography gutterBottom variant="h5" component="h2" sx={{ fontWeight: 'bold', color: '#333' }}>
                    {ad.carInfo}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <MapPin size={18} style={{ marginRight: 8, color: '#1976d2' }} />
                    <Typography variant="body2" color="text.secondary">
                      {ad.city}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Car size={18} style={{ marginRight: 8, color: '#1976d2' }} />
                    <Typography variant="body2" color="text.secondary">
                      {ad.registeredIn} | {ad.exteriorColor}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Gauge size={18} style={{ marginRight: 8, color: '#1976d2' }} />
                    <Typography variant="body2" color="text.secondary">
                      {ad.mileage.toLocaleString()} km
                    </Typography>
                  </Box>
                </div>
                <div>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 2 }}>
                    <Chip  
                      label={`PKR ${parseInt(ad.price).toLocaleString()}`}
                      color="primary"
                      sx={{ fontWeight: 'bold', fontSize: '1rem' }}
                    />
                    <Button 
                      variant="outlined" 
                      startIcon={<Phone size={16} />}
                      href={`tel:${ad.mobileNumber}`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      Call Seller
                    </Button>
                  </Box>
                </div>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default UsedCars;