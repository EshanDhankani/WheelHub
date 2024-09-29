import { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  CardMedia,
  Grid,
  Typography,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Box,
  Chip,
  FormGroup,
  Checkbox,
  FormControlLabel,
  Button,
  Divider,
  TextField,
} from "@mui/material";
import { styled, ThemeProvider, createTheme } from "@mui/material/styles";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";

const theme = createTheme({
  palette: {
    primary: { main: "#000000" },
    secondary: { main: "#f90" },
    background: { default: "#f4f4f4" },
  },
  typography: {
    fontFamily: "Arial, sans-serif",
  },
  components: {
    MuiChip: { styleOverrides: { root: { borderRadius: 4 } } },
    MuiButton: {
      styleOverrides: { root: { borderRadius: 4, textTransform: "none" } },
    },
  },
});

const FullScreenContainer = styled(Box)(() => ({
  marginTop: "100px",
  minHeight: "90vh",
  width: "100%",
  backgroundColor: "#FFFBE6",
  display: "flex",
}));

const Sidebar = styled(Box)(({ theme }) => ({
  width: "230px",
  minHeight: "100vh",
  marginTop: "123px",
  backgroundColor: "#ffffff",
  border: "1px solid #4A4947",
  borderRadius: theme.spacing(1),
  padding: theme.spacing(2),
  position: "fixed",
  left: 0,
  top: 0,
}));

const PageContent = styled(Box)(({ theme }) => ({
  marginLeft: "250px",
  padding: theme.spacing(3),
  width: "calc(100% - 250px)",
  display: "flex",
  flexDirection: "column",
}));

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.spacing(0),
  overflow: "hidden",
  position: "relative",
  backgroundColor: "#FFFBE6",
  boxShadow: "none",
  border: "2px solid #181C14",
  transition: "transform 0.3s, box-shadow 0.3s",
  "&:hover": {
    transform: "translateY(-3px)",
    boxShadow: "0 4px 12px rgba(0.15,0.15,0.15,0.15)",
  },
  borderRight: "2px solid #4A4947",
  borderBottom: "2px solid #4A4947",
}));

const PriceChip = styled(Chip)(({ theme }) => ({
  fontWeight: "bold",
  fontSize: "16px",
  backgroundColor: "#ff5722",
  color: "#fffff",
  borderRadius: 4,
  padding: theme.spacing(0.5),
  position: "absolute",
  top: theme.spacing(2),
  right: theme.spacing(2),
  marginTop: "245px",
}));

const FilterSectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: "bold",
  marginBottom: theme.spacing(1),
  color: theme.palette.primary.main,
  fontSize: "14px",
}));

const StyledFormControlLabel = styled(FormControlLabel)(() => ({
  marginLeft: 0,
  marginRight: 0,
  "& .MuiTypography-root": { fontSize: "14px" },
}));

const RatingBox = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  marginBottom: theme.spacing(1),
}));

const Autoparts = () => {
  const [accessories, setAccessories] = useState([]);
  const [brandFilter, setBrandFilter] = useState("");
  const [capacityFilter, setCapacityFilter] = useState([]);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [filteredAccessories, setFilteredAccessories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const priceOptions = [
    100, 500, 1000, 5000, 10000, 20000, 30000, 50000, 100000,
  ];

  useEffect(() => {
    axios
      .get("http://localhost:3001/api/accessories")
      .then((response) => {
        setAccessories(response.data);
        setFilteredAccessories(response.data);
      })
      .catch((error) => {
        console.error("Error fetching accessories:", error);
      });
  }, []);

  useEffect(() => {
    let filtered = accessories;

    if (brandFilter) {
      filtered = filtered.filter((item) => item.category === brandFilter);
    }

    if (capacityFilter.length > 0) {
      filtered = filtered.filter((item) =>
        capacityFilter.includes(item.condition)
      );
    }

    if (
      minPrice !== "" &&
      maxPrice !== "" &&
      Number(maxPrice) > Number(minPrice)
    ) {
      filtered = filtered.filter(
        (item) =>
          item.price >= Number(minPrice) && item.price <= Number(maxPrice)
      );
    }

    setFilteredAccessories(filtered);
  }, [brandFilter, capacityFilter, minPrice, maxPrice, accessories]);

  const handleSearch = () => {
    const filtered = accessories.filter((item) =>
      item.accessoryInfo.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredAccessories(filtered);
  };

  const handleBrandFilterChange = (event) => {
    setBrandFilter(event.target.value);
  };

  const handleCapacityFilterChange = (event) => {
    const value = event.target.value;
    setCapacityFilter((prev) =>
      prev.includes(value)
        ? prev.filter((cap) => cap !== value)
        : [...prev, value]
    );
  };

  return (
    <ThemeProvider theme={theme}>
      <Navbar />
      <FullScreenContainer>
        <Sidebar>
          <Typography variant="h6" gutterBottom fontWeight="bold">
            SHOW RESULTS BY:
          </Typography>

          <Box mb={2} display="flex" gap={1}>
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              label="Search Products"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleSearch}
              sx={{
                textTransform: "none",
                color: "#fff",
                backgroundColor: theme.palette.secondary.main,
                "&:hover": {
                  backgroundColor: theme.palette.secondary.dark,
                },
              }}
            >
              Go
            </Button>
          </Box>

          <Divider />

          <Box mt={2}>
            <FilterSectionTitle variant="subtitle1">
              CATEGORY
            </FilterSectionTitle>
            <FormControl fullWidth variant="outlined" size="small">
              <InputLabel id="brand-select-label">Select Category</InputLabel>
              <Select
                labelId="brand-select-label"
                value={brandFilter}
                onChange={handleBrandFilterChange}
                label="Select Category"
              >
                <MenuItem value="Interior">Interior</MenuItem>
                <MenuItem value="Exterior">Exterior</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <Divider sx={{ marginY: 2 }} />

          <Box mb={2}>
            <FilterSectionTitle variant="subtitle1">
              CONDITION
            </FilterSectionTitle>
            <FormGroup>
              <StyledFormControlLabel
                control={
                  <Checkbox
                    size="small"
                    checked={capacityFilter.includes("New")}
                    onChange={handleCapacityFilterChange}
                    value="New"
                  />
                }
                label="New"
              />
              <StyledFormControlLabel
                control={
                  <Checkbox
                    size="small"
                    checked={capacityFilter.includes("Used")}
                    onChange={handleCapacityFilterChange}
                    value="Used"
                  />
                }
                label="Used"
              />
            </FormGroup>
          </Box>

          <Divider sx={{ marginY: 2 }} />

          <Box mb={2}>
            <FilterSectionTitle variant="subtitle1">
              PRICE RANGE
            </FilterSectionTitle>
            <FormControl
              fullWidth
              variant="outlined"
              size="small"
              sx={{ mb: 2 }}
            >
              <InputLabel id="min-price-label">Min Price</InputLabel>
              <Select
                labelId="min-price-label"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                label="Min Price"
              >
                {priceOptions.map((price) => (
                  <MenuItem key={price} value={price}>
                    {`PKR ${price}`}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth variant="outlined" size="small">
              <InputLabel id="max-price-label">Max Price</InputLabel>
              <Select
                labelId="max-price-label"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                label="Max Price"
                disabled={minPrice === ""}
              >
                {priceOptions
                  .filter((price) => price > minPrice)
                  .map((price) => (
                    <MenuItem key={price} value={price}>
                      {`PKR ${price}`}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </Box>
        </Sidebar>

        <PageContent>
          {filteredAccessories.length === 0 ? (
            <Typography variant="h6" color="textSecondary">
              No products found.
            </Typography>
          ) : (
            <Grid container spacing={2}>
              {filteredAccessories.map((accessory) => (
                <Grid item xs={12} sm={6} md={3} key={accessory._id}>
                  <Link
                    to={`/details/${accessory._id}`}
                    state={{
                      images: accessory.images,
                      accessoryInfo: accessory.accessoryInfo,
                      city: accessory.city,
                      category: accessory.category,
                      condition: accessory.condition,
                      price: accessory.price,
                      mobileNumber: accessory.mobileNumber,
                      accessoryDescription: accessory.accessoryDescription,
                    }}
                    style={{ textDecoration: "none" }}
                  >
                    <StyledCard>
                      <CardMedia
                        component="img"
                        height="240"
                        image={`http://localhost:3001/${accessory.images[0]}`}
                        alt={accessory.accessoryInfo}
                        sx={{ width: "100%", height: "50%" }}
                      />
                      <CardContent sx={{ padding: 2 }}>
                        <RatingBox>
                          {[1, 2, 3, 4, 5].map((star) => (
                            <span
                              key={star}
                              style={{
                                color: theme.palette.secondary.main,
                                fontSize: 20,
                              }}
                            >
                              ★
                            </span>
                          ))}
                        </RatingBox>
                        <Typography
                          variant="body1"
                          fontWeight="bold"
                          sx={{ fontSize: "14px", marginTop: 1 }}
                        >
                          {accessory.accessoryInfo}
                        </Typography>
                        <PriceChip
                          label={`PKR ${accessory.price.toString()}`}
                        />
                      </CardContent>
                    </StyledCard>
                  </Link>
                </Grid>
              ))}
            </Grid>
          )}
        </PageContent>
      </FullScreenContainer>
    </ThemeProvider>
  );
};

export default Autoparts;
