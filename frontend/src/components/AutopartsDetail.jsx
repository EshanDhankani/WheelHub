import { useState } from "react";
import { useLocation } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  Button,
  Grid,
  Card,
  CardContent,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { ChevronLeft, ChevronRight, MapPin, Phone } from "lucide-react";
import Navbar from "./Navbar";

const ImageSlider = styled(Box)(({ theme }) => ({
  position: "relative",
  width: "100%",
  overflow: "hidden",
  borderRadius: "16px",
  boxShadow: theme.shadows[10],
}));

const SliderButton = styled(Button)(({ theme }) => ({
  position: "absolute",
  top: "50%",
  transform: "translateY(-50%)",
  backgroundColor: "rgba(34, 34, 34, 0.6)",
  color: "rgba(255, 255, 255, 0.9)",
  minWidth: "35px",
  height: "35px",
  padding: "10px",
  borderRadius: "50%",
  boxShadow: theme.shadows[6],
  "&:hover": {
    backgroundColor: "rgba(34, 34, 34, 0.8)",
  },
}));

const QuantityBox = styled(Box)({
  display: "flex",
  gap: "15px",
  justifyContent: "center",
  alignItems: "center",
  marginBottom: "20px",
});

const QuantityButton = styled(Button)({
  borderRadius: "12px",
  minWidth: "40px",
  height: "40px",
  backgroundColor: "rgb(0, 123, 255)",
  color: "#ffffff",
  fontWeight: "bold",
  "&:hover": {
    backgroundColor: "rgb(0, 100, 200)",
  },
});

const StyledCard = styled(Card)(({ theme }) => ({
  border: "1px solid rgba(0, 123, 255, 0.2)",

  borderRadius: "16px",
  boxShadow: theme.shadows[3],
  backgroundColor: theme.palette.background.paper,
}));

const AutopartsDetail = () => {
  const location = useLocation();
  const {
    images,
    accessoryInfo,
    city,
    category,
    condition,
    price,
    mobileNumber,
    accessoryDescription,
  } = location.state;

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [totalPrice, setTotalPrice] = useState(price);

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prevIndex) => (prevIndex - 1 + images.length) % images.length
    );
  };

  const handleIncrease = () => {
    setQuantity((prevQuantity) => prevQuantity + 1);
    setTotalPrice((prevPrice) => prevPrice + price);
  };

  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity((prevQuantity) => prevQuantity - 1);
      setTotalPrice((prevPrice) => prevPrice - price);
    }
  };

  return (
    <>
      <Navbar />

      <Container maxWidth="lg" sx={{ py: 10, mt: 5 }}>
        <Typography
          variant="h4"
          gutterBottom
          sx={{ fontWeight: "bold", color: "rgb(0, 82, 204)" }}
        >
          {accessoryInfo}
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
          <MapPin
            size={22}
            style={{ marginRight: 10, color: "rgb(255, 51, 102)" }}
          />
          <Typography variant="subtitle1">{city}</Typography>
        </Box>

        <Grid container spacing={5}>
          <Grid item xs={12} md={8}>
            <Box sx={{ mb: 5 }}>
              <ImageSlider>
                <img
                  src={`http://localhost:3001/${images[currentImageIndex]}`}
                  alt={accessoryInfo}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    borderRadius: "16px",
                    boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
                  }}
                />
                {images.length > 1 && (
                  <>
                    <SliderButton onClick={prevImage} sx={{ left: 12 }}>
                      <ChevronLeft size={26} />
                    </SliderButton>
                    <SliderButton onClick={nextImage} sx={{ right: 12 }}>
                      <ChevronRight size={26} />
                    </SliderButton>
                  </>
                )}
              </ImageSlider>
            </Box>

            <Box sx={{ mb: 5 }}>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ fontWeight: "bold", color: "rgb(0, 82, 204)" }}
              >
                Product Details
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={6} md={3}>
                  <Typography variant="body2" color="text.secondary">
                    Category
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                    {category}
                  </Typography>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Typography variant="body2" color="text.secondary">
                    Condition
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                    {condition}
                  </Typography>
                </Grid>
              </Grid>
            </Box>

            <Box sx={{ mb: 5 }}>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ fontWeight: "bold", color: "rgb(0, 82, 204)" }}
              >
                Description
              </Typography>
              <Typography variant="body1">{accessoryDescription}</Typography>
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <StyledCard sx={{ mb: 3 }}>
              <CardContent>
                <Typography
                  variant="h5"
                  gutterBottom
                  sx={{ fontWeight: "bold", color: "#D32F2F" }}
                >
                  PKR {totalPrice}
                </Typography>
                <QuantityBox>
                  <QuantityButton onClick={handleDecrease}>-</QuantityButton>
                  <Typography variant="h6">{quantity}</Typography>
                  <QuantityButton onClick={handleIncrease}>+</QuantityButton>
                </QuantityBox>
                <Button
                  variant="contained"
                  fullWidth
                  sx={{
                    mb: 3,
                    textTransform: "none",
                    backgroundColor: "rgb(33, 150, 243)",
                  }}
                >
                  Buy Now
                </Button>

                <Typography variant="h6" sx={{ mt: 1 }}>
                  <Phone style={{ marginRight: 3 }} /> Contact: 0
                  {parseInt(mobileNumber).toString()}
                </Typography>
              </CardContent>
            </StyledCard>

            <StyledCard sx={{ marginTop: 8 }}>
              <CardContent>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ fontWeight: "bold" }}
                >
                  Buy From WheelHub
                </Typography>
                <ul style={{ color: "rgb(255, 51, 102)" }}>
                  <li>100% Genuine Products</li>
                  <li>Hassle Free Buying</li>
                  <li>Money Back Guarantee</li>
                </ul>
              </CardContent>
            </StyledCard>
          </Grid>
        </Grid>
      </Container>
      <Box />
    </>
  );
};

export default AutopartsDetail;
