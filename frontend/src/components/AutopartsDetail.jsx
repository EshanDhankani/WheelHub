import { useState } from "react";
import { useLocation } from "react-router-dom";
import { Box, Typography, Button, Card, CardContent, CardMedia } from "@mui/material";
import { styled } from "@mui/material/styles";
import { ChevronLeft, ChevronRight } from "lucide-react";


const ProductContainer = styled(Box)({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  maxWidth: "1200px",
  margin: "30px auto",
  padding: "30px",
  gap: "40px",
  background: "linear-gradient(to right, rgb(238, 242, 255), rgb(255, 249, 242))",
  borderRadius: "16px",
  boxShadow: "0px 6px 24px rgba(0, 0, 0, 0.12)",
});

const ImageSlider = styled(Box)({
  position: "relative",
  width: "45%",
  overflow: "hidden",
  borderRadius: "12px",
  boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
  backgroundColor: "rgb(248, 250, 255)",
});

const SliderButton = styled(Button)({
  position: "absolute",
  top: "50%",
  transform: "translateY(-50%)",
  backgroundColor: "rgba(34, 34, 34, 0.6)",
  color: "rgba(255, 255, 255, 0.9)",
  minWidth: "35px",
  height: "35px",
  padding: "10px",
  borderRadius: "50%",
  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
  "&:hover": {
    backgroundColor: "rgba(34, 34, 34, 0.8)",
  },
});

const ProductDetails = styled(Box)({
  width: "50%",
  display: "flex",
  flexDirection: "column",
  padding: "20px",
  gap: "20px",
  backgroundColor: "rgba(255, 255, 255, 0.85)",
  borderRadius: "12px",
  boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.1)",
});

const PriceBox = styled(Box)({
  backgroundColor: "rgba(76, 175, 80, 0.1)",
  padding: "15px",
  marginBottom: "10px",
  textAlign: "center",
  borderRadius: "8px",
  boxShadow: "0px 2px 6px rgba(76, 175, 80, 0.3)",
});

const ActionButton = styled(Button)({
  marginBottom: "15px",
  textTransform: "none",
  padding: "15px",
  borderRadius: "8px",
  backgroundColor: "rgb(33, 150, 243)",
  color: "rgba(255, 255, 255, 0.9)",
  "&:hover": {
    backgroundColor: "rgb(25, 118, 210)",
  },
});

const SellerInfo = styled(Card)({
  marginTop: "20px",
  padding: "20px",
  borderRadius: "12px",
  background: "linear-gradient(to bottom, rgb(248, 249, 250), rgb(240, 240, 255))",
  boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.12)",
});

const QuantityBox = styled(Box)({
  display: "flex",
  gap: "10px",
  justifyContent: "center",
  alignItems: "center",
  marginBottom: "15px",
});

const QuantityButton = styled(Button)({
  borderRadius: "50%",
  minWidth: "30px",
  height: "30px",
  backgroundColor: "rgb(255, 87, 51)",
  color: "rgb(255, 255, 255)",
  "&:hover": {
    backgroundColor: "rgb(211, 47, 47)",
  },
});

const AutopartsDetail = () => {
  const location = useLocation();
  const { images, accessoryInfo, city, category, condition, price, mobileNumber, accessoryDescription } = location.state;

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [totalPrice, setTotalPrice] = useState(price);

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
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
    <ProductContainer>
      <ImageSlider>
        <CardMedia
          component="img"
          image={`http://localhost:3001/${images[currentImageIndex]}`}
          alt={accessoryInfo}
          sx={{ width: "100%", height: "auto", maxHeight: "300px", objectFit: "contain", borderRadius: "12px" }}
        />
        {images.length > 1 && (
          <>
            <SliderButton onClick={prevImage} sx={{ left: 10 }}>
              <ChevronLeft size={24} />
            </SliderButton>
            <SliderButton onClick={nextImage} sx={{ right: 10 }}>
              <ChevronRight size={24} />
            </SliderButton>
          </>
        )}
      </ImageSlider>
      <ProductDetails>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          {accessoryInfo}
        </Typography>
        <PriceBox>
          <Typography variant="h4" fontWeight="bold" color="rgb(76, 175, 80)">
            PKR {totalPrice}
          </Typography>
        </PriceBox>
        <QuantityBox>
          <QuantityButton onClick={handleDecrease}>-</QuantityButton>
          <Typography variant="h6">{quantity}</Typography>
          <QuantityButton onClick={handleIncrease}>+</QuantityButton>
        </QuantityBox>
        <ActionButton variant="contained" fullWidth>
          Buy Now
        </ActionButton>

        <Typography variant="body2" gutterBottom>
          <strong>Category:</strong> {category}
        </Typography>

        <Typography variant="body2" gutterBottom>
          <strong>Condition:</strong> {condition}
        </Typography>

        <Typography variant="body1" gutterBottom>
          <strong>Description:</strong> {accessoryDescription}
        </Typography>
        <SellerInfo>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Seller Details
            </Typography>
            <Typography variant="body2" gutterBottom>
              <strong>Phone Number:</strong> {mobileNumber}
            </Typography>
            <Typography variant="body2" gutterBottom>
              <strong>City:</strong> {city}
            </Typography>
          </CardContent>
        </SellerInfo>
      </ProductDetails>
    </ProductContainer>
  );
};

export default AutopartsDetail;
