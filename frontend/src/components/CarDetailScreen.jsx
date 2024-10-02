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
  TextField,
  List,
  ListItem,
  IconButton,
  InputAdornment,
  Select,
  MenuItem,
} from "@mui/material";
import { MapPin, MessageCircle, Phone } from "lucide-react";
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

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [fontColor, setFontColor] = useState("#000000");
  const [fontSize, setFontSize] = useState(14);
  const [fontStyle, setFontStyle] = useState("Arial");

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

    const fetchMessages = async () => {
      try {
        const messageResponse = await axios.get(
          `http://localhost:3001/messages/${id}`,
          { withCredentials: true }
        );
        setMessages(messageResponse.data);
      } catch (error) {
        console.warn("Failed to fetch messages:", error);
        setMessages([]);
      }
    };

    const checkAuthentication = async () => {
      try {
        const response = await axios.get("http://localhost:3001/currentUser", {
          withCredentials: true,
        });
        setIsAuthenticated(response.data !== null);
      } catch (error) {
        setIsAuthenticated(false);
      }
    };

    fetchCarDetails();

    checkAuthentication().then(() => {
      if (isAuthenticated) {
        fetchMessages();
      }
    });
  }, [id, isAuthenticated]);

  const handleSendMessage = async () => {
    if (newMessage.trim() === "") return;

    try {
      const response = await axios.post(
        "http://localhost:3001/messages",
        {
          carAdId: id,
          receiverId: carDetails.userId._id || carDetails.userId,
          message: newMessage,
          fontColor,
          fontSize,
          fontStyle,
        },
        { withCredentials: true }
      );

      setMessages([...messages, response.data.newMessage]);
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

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
    <Box
      sx={{
        background:  "linear-gradient(142deg, #030950, #12175F, #2F1F2F)",
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
                <Grid item xs={6} md={3}>
                  <Typography
                    variant="subtitle1"
                    fontWeight="bold"
                    fontSize={20}
                    color="#B8001F"
                  >
                    Seller Comments
                  </Typography>
                  <Typography variant="h6">
                    {carDetails.adDescription}
                  </Typography>
                </Grid>
              </Grid>
            </Box>

            {/* Chat Box Section */}
            <Box sx={{ mb: 4, marginTop: 10 }}>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: "bold" }}>
                <MessageCircle style={{ marginRight: 8 }} /> Chat with Seller
              </Typography>
              <List
                sx={{
                  maxHeight: 200,
                  overflow: "auto",
                  border: "1px solid #ddd",
                  borderRadius: 1,
                  mb: 2,
                }}
              >
                {messages.map((msg, index) => (
                  <ListItem
                    key={index}
                    sx={{
                      display: "flex",
                      justifyContent:
                        msg.senderId._id === carDetails.userId
                          ? "flex-start"
                          : "flex-end",
                    }}
                  >
                    <Box
                      sx={{
                        background:
                          msg.senderId._id === carDetails.userId
                            ? "#d1e7dd"
                            : "#f8d7da",
                        color:
                          msg.senderId._id === carDetails.userId
                            ? "#0f5132"
                            : "#842029",
                        borderRadius:
                          msg.senderId._id === carDetails.userId
                            ? "15px 15px 15px 0"
                            : "15px 15px 0 15px",
                        maxWidth: "60%",
                        padding: "5px",
                        margin: "5px 0",
                        boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
                      }}
                    >
                      <Typography
                        variant="subtitle2"
                        sx={{ fontWeight: "bold", marginBottom: "2px" }}
                      >
                        {msg.senderId.name}
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{
                          color: msg.fontColor,
                          fontSize: msg.fontSize,
                          fontFamily: msg.fontStyle,
                        }}
                      >
                        {msg.message}
                      </Typography>{" "}
                      <Typography
                        variant="caption"
                        sx={{
                          display: "block",
                          marginTop: "5px",
                          textAlign: "right",
                        }}
                      >
                        {new Date(msg.createdAt).toLocaleTimeString()}{" "}
                      </Typography>
                    </Box>
                  </ListItem>
                ))}
              </List>
              <Grid container spacing={2}>
                <Grid item xs={9}>
                  <TextField
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type a message..."
                    fullWidth
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <IconButton></IconButton>
                        </InputAdornment>
                      ),
                      sx: { borderRadius: "30px" },
                    }}
                    disabled={!isAuthenticated}
                  />
                </Grid>
                <Grid item xs={3}>
                  <Button
                    variant="contained"
                    onClick={handleSendMessage}
                    fullWidth
                    sx={{
                      height: "100%",
                      background: "linear-gradient(to right, #43cea2, #185a9d)",
                      color: "black",
                      borderRadius: "30px",
                    }}
                    disabled={!isAuthenticated}
                  >
                    Send
                  </Button>
                </Grid>
              </Grid>

              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle1">Customize Message</Typography>
                <Grid container spacing={2} sx={{ mt: 1 }}>
                  <Grid item xs={4}>
                    <Select
                      fullWidth
                      value={fontColor}
                      onChange={(e) => setFontColor(e.target.value)}
                      variant="outlined"
                    >
                      <MenuItem value="#000000">Black</MenuItem>
                      <MenuItem value="#ff0000">Red</MenuItem>
                      <MenuItem value="#00ff00">Green</MenuItem>
                      <MenuItem value="#0000ff">Blue</MenuItem>
                    </Select>
                  </Grid>
                  <Grid item xs={4}>
                    <Select
                      fullWidth
                      value={fontSize}
                      onChange={(e) => setFontSize(e.target.value)}
                      variant="outlined"
                    >
                      <MenuItem value={14}>14px</MenuItem>
                      <MenuItem value={16}>16px</MenuItem>
                      <MenuItem value={18}>18px</MenuItem>
                      <MenuItem value={20}>20px</MenuItem>
                    </Select>
                  </Grid>
                  <Grid item xs={4}>
                    <Select
                      fullWidth
                      value={fontStyle}
                      onChange={(e) => setFontStyle(e.target.value)}
                      variant="outlined"
                    >
                      <MenuItem value="Arial">Arial</MenuItem>
                      <MenuItem value="Courier New">Courier New</MenuItem>
                      <MenuItem value="Georgia">Georgia</MenuItem>
                      <MenuItem value="Times New Roman">
                        Times New Roman
                      </MenuItem>
                    </Select>
                  </Grid>
                </Grid>
              </Box>
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
                marginTop: "100px",
              }}
            >
              <CardContent>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: "bold", color: "#D32F2F" }}
                >
                  Safety Tips for transaction
                </Typography>
                <Typography variant="h6" sx={{ mt: 1 }}>
                  <Typography>1. Use a safe location to meet seller</Typography>
                  <Typography>2. Avoid cash transactions</Typography>
                  <Typography>3. Beware of unrealistic offers</Typography>
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
