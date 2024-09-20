import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Grid,
  Container,
  Box,
  CircularProgress,
  Chip,
  Paper,
  IconButton,
  Divider,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField,
  Button,
  ThemeProvider,
  createTheme,
  Autocomplete,
} from "@mui/material";
import { MapPin, Car, Gauge, Search, MessageCircle } from "lucide-react";
import Navbar from "./Navbar";

// Custom theme for enhanced visual style
const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2", 
    },
    secondary: {
      main: "#f50057", 
    },
  },
  typography: {
    fontFamily: "'Poppins', 'Roboto', sans-serif", 
    h3: {
      fontWeight: 700,
      color: "#030947",
    },
    h5: {
      fontWeight: 600,
    },
    body1: {
      fontWeight: 400,
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
          "&:hover": {
            transform: "translateY(-5px)",
            boxShadow: "0 12px 20px rgba(0,0,0,0.1)",
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: "12px 24px",
          boxShadow: "0px 6px 15px rgba(0,0,0,0.1)",
          "&:hover": {
            backgroundColor: "#1558a6",
            boxShadow: "0px 8px 20px rgba(0,0,0,0.15)",
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          borderRadius: 4,
          background: "#f5f5f5",
        },
      },
    },
  },
});

const UsedCars = () => {
  const [carAds, setCarAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const [makeModel, setMakeModel] = useState("");
  const [city, setCity] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [filteredCarAds, setFilteredCarAds] = useState([]);

  const [cityOptions, setCityOptions] = useState([]);

  const priceOptions = [
    { value: 500000, label: "5 Lacs" },
    { value: 1000000, label: "10 Lacs" },
    { value: 1500000, label: "15 Lacs" },
    { value: 2000000, label: "20 Lacs" },
    { value: 2500000, label: "25 Lacs" },
    { value: 3000000, label: "30 Lacs" },
    { value: 4000000, label: "40 Lacs" },
    { value: 5000000, label: "50 Lacs" },
    { value: 7500000, label: "75 Lacs" },
    { value: 10000000, label: "1 Crore" },
    { value: 15000000, label: "1.5 Crore" },
    { value: 20000000, label: "2 Crore" },
  ];

  useEffect(() => {
    const fetchCarAds = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:3001/carAds");
        setCarAds(response.data);
        setFilteredCarAds(response.data);

        const uniqueCities = [...new Set(response.data.map((ad) => ad.city))];
        setCityOptions(uniqueCities);

        setError(null);
      } catch (error) {
        console.error("Error fetching car ads:", error);
        setError("Failed to fetch car ads. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCarAds();
  }, []);

  const handleSearch = () => {
    const filtered = carAds.filter((ad) => {
      const matchesMakeModel =
        !makeModel ||
        ad.carInfo.toLowerCase().includes(makeModel.toLowerCase());
      const matchesCity = !city || ad.city.toLowerCase() === city.toLowerCase();
      const matchesMinPrice = !minPrice || ad.price >= parseInt(minPrice);
      const matchesMaxPrice = !maxPrice || ad.price <= parseInt(maxPrice);
      return (
        matchesMakeModel && matchesCity && matchesMinPrice && matchesMaxPrice
      );
    });
    setFilteredCarAds(filtered);
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  const handleCarClick = (carId) => {
    navigate(`/car/${carId}`);
  };

  const handleMinPriceChange = (e) => {
    const selectedMinPrice = e.target.value;
    setMinPrice(selectedMinPrice);

    if (maxPrice && parseInt(maxPrice) <= parseInt(selectedMinPrice)) {
      setMaxPrice("");
    }
  };

  const getFilteredMaxPriceOptions = () => {
    if (!minPrice) return priceOptions;
    return priceOptions.filter(
      (option) => option.value === "" || option.value > parseInt(minPrice)
    );
  };

  // Get unique make and models for autocomplete
  const makeModelOptions = [
    ...new Set(carAds.map((ad) => ad.carInfo.toLowerCase())),
  ];

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

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ mb: 4 }}>
          <Navbar />
        </Box>

        <Typography variant="h3" gutterBottom align="center" sx={{ mb: 6 }}>
          Used Cars Marketplace
        </Typography>

        <Paper
          elevation={3}
          sx={{
            p: 3,
            mb: 4,
            borderRadius: 2,
            backgroundColor: "#fafafa",
          }}
        >
          <Grid container spacing={2} alignItems="flex-end">
            <Grid item xs={12} sm={6} md={3}>
              <Autocomplete
                freeSolo
                options={makeModelOptions.filter((option) =>
                  makeModel.length >= 1
                    ? option.startsWith(makeModel.toLowerCase())
                    : false
                )}
                inputValue={makeModel}
                onInputChange={(event, newValue) => setMakeModel(newValue)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Make and Model"
                    variant="outlined"
                    fullWidth
                    onKeyPress={handleKeyPress}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>City</InputLabel>
                <Select
                  value={city}
                  label="City"
                  onChange={(e) => setCity(e.target.value)}
                  onKeyPress={handleKeyPress}
                >
                  <MenuItem value="">All Cities</MenuItem>
                  {cityOptions.map((city) => (
                    <MenuItem key={city} value={city}>
                      {city}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Min Price</InputLabel>
                <Select
                  value={minPrice}
                  label="Min Price"
                  onChange={handleMinPriceChange}
                  onKeyPress={handleKeyPress}
                >
                  {priceOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Max Price</InputLabel>
                <Select
                  value={maxPrice}
                  label="Max Price"
                  onChange={(e) => setMaxPrice(e.target.value)}
                  onKeyPress={handleKeyPress}
                >
                  {getFilteredMaxPriceOptions().map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                startIcon={<Search />}
                onClick={handleSearch}
                sx={{ height: "56px", fontWeight: "bold" }}
              >
                Search
              </Button>
            </Grid>
          </Grid>
        </Paper>

        <Grid container spacing={4}>
          {filteredCarAds.map((ad) => (
            <Grid item key={ad._id} xs={12} sm={6} md={4}>
              <Card
                onClick={() => handleCarClick(ad._id)}
                sx={{ cursor: "pointer" }}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={`http://localhost:3001/${ad.images[0]}`}
                  alt={ad.carInfo}
                />
                <CardContent>
                  <Typography variant="h5" component="h2" gutterBottom>
                    {ad.carInfo}
                  </Typography>
                  <Box display="flex" alignItems="center" mb={1}>
                    <MapPin size={18} color="#666" />
                    <Typography variant="body1" sx={{ ml: 1 }}>
                      {ad.city}
                    </Typography>
                  </Box>
                  <Box display="flex" alignItems="center" mb={2}>
                    <Car size={18} color="#666" />
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      sx={{ ml: 1 }}
                    >
                      {ad.year}
                    </Typography>
                    <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
                    <Gauge size={18} color="#666" />
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      sx={{ ml: 1 }}
                    >
                      {ad.kms} km
                    </Typography>
                  </Box>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Chip
                      label={`PKR ${ad.price.toLocaleString()}`}
                      color="primary"
                      size="medium"
                      sx={{
                        backgroundColor: "#f50057",
                        color: "#fff",
                        fontSize: "1rem",
                        fontWeight: "bold",
                        padding: "10px",
                      }}
                    />
                    <IconButton color="primary" aria-label="contact seller">
                      <MessageCircle />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </ThemeProvider>
  );
};

export default UsedCars;
