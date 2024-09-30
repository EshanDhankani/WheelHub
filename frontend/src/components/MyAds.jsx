import { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

const MyAds = () => {
  const [carAds, setCarAds] = useState([]);
  const [accessoryAds, setAccessoryAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteAdId, setDeleteAdId] = useState(null);
  const [adType, setAdType] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyAds = async () => {
      try {
        const response = await axios.get("http://localhost:3001/myAds", {
          withCredentials: true,
        });
        setCarAds(response.data.carAds);
        setAccessoryAds(response.data.accessoryAds);
      } catch (error) {
        console.error("Error fetching ads:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMyAds();
  }, []);

  const handleEditClick = (ad, type) => {
    if (type === "car") {
      navigate(`/edit-car/${ad._id}`, { state: { adData: ad } });
    } else {
      navigate(`/edit-accessory/${ad._id}`, { state: { adData: ad } });
    }
  };
  const handleDeleteClick = (adId, type) => {
    setDeleteAdId(adId);
    setAdType(type);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      if (adType === "car") {
        await axios.delete(`http://localhost:3001/carAds/${deleteAdId}`, {
          withCredentials: true,
        });
        setCarAds((prevAds) => prevAds.filter((ad) => ad._id !== deleteAdId));
      } else {
        await axios.delete(`http://localhost:3001/accessoryAds/${deleteAdId}`, {
          withCredentials: true,
        });
        setAccessoryAds((prevAds) =>
          prevAds.filter((ad) => ad._id !== deleteAdId)
        );
      }
      setIsDeleteDialogOpen(false);
      setDeleteAdId(null);
    } catch (error) {
      console.error("Error deleting ad:", error);
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
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          backgroundColor: "#f5f7fa",
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
    arrows: false,
    appendDots: (dots) => (
      <div
        style={{
          position: "absolute",
          bottom: "10px",
          width: "100%",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <ul style={{ margin: 0, padding: 0 }}> {dots} </ul>
      </div>
    ),
    customPaging: () => (
      <div
        style={{
          width: "10px",
          height: "10px",
          backgroundColor: "rgba(255, 255, 255, 0.7)",
          borderRadius: "50%",
          margin: "0 3px",
        }}
      />
    ),
  };

  return (
    <div
      style={{
        fontFamily: "Roboto, sans-serif",
        backgroundColor: "#f5f7fa",
        minHeight: "100vh",
        padding: "20px",
      }}
    >
      <Navbar />
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "20px",
        }}
      >
        <Typography
          variant="h5"
          style={{
            fontWeight: "bold",
            fontSize: "26px",
            color: "rgb(0, 123, 255)",
            textShadow: "2px 2px 4px rgba(0, 0, 0, 0.1)",
          }}
        >
          My Ads
        </Typography>
      </Box>

      <Box
        style={{
          display: "flex",
          flexDirection: "row",
          padding: "30px",
          justifyContent: "space-between",
        }}
      >
        {carAds.length === 0 && accessoryAds.length === 0 ? (
          <Grid container justifyContent="center">
            <Grid item xs={12} sm={8} md={6}>
              <Card
                style={{
                  backgroundColor: "rgb(240, 248, 255)",
                  borderRadius: "20px",
                  boxShadow: "0 8px 24px rgba(0, 0, 0, 0.15)",
                  textAlign: "center",
                }}
              >
                <CardContent>
                  <Typography
                    variant="h6"
                    style={{
                      color: "rgb(0, 128, 128)",
                      marginBottom: "20px",
                      fontWeight: "bold",
                      fontSize: "24px",
                    }}
                  >
                    No Active Ads
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        ) : (
          <Grid container spacing={4} style={{ flex: 2 }}>
            {carAds.map((ad) => (
              <Grid item xs={12} sm={6} md={4} key={ad._id}>
                <Card
                  sx={{
                    position: "relative",
                    overflow: "hidden",
                    borderRadius: "10px",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                    transition: "transform 0.2s ease, box-shadow 0.2s ease",
                    height: "100%",
                    "&:hover": {
                      transform: "scale(1.05)",
                      boxShadow: "0 6px 16px rgba(0, 0, 0, 0.2)",
                    },
                  }}
                >
                  {/* Image Slider */}
                  <Box
                    sx={{
                      width: "100%",
                      padding: "10px",
                      position: "relative",
                    }}
                  >
                    <Slider {...sliderSettings}>
                      {ad.images.map((image, index) => (
                        <div key={index}>
                          <img
                            src={`http://localhost:3001/${image}`}
                            alt={`Ad Image ${index + 1}`}
                            style={{
                              width: "100%",
                              height: "300px",
                              objectFit: "contain",
                              borderRadius: "8px",
                            }}
                          />
                        </div>
                      ))}
                    </Slider>
                  </Box>

                  <CardContent>
                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                      {ad.carInfo}
                    </Typography>
                    <Typography variant="body2">
                      Price: {ad.price} PKR
                    </Typography>
                    <Typography variant="body2">
                      Mileage: {ad.mileage} km
                    </Typography>
                    <Typography variant="body2">City: {ad.city}</Typography>
                    <Grid container spacing={2} sx={{ marginTop: "10px" }}>
                      <Grid item>
                        <IconButton
                          size="small"
                          onClick={() => handleEditClick(ad, "car")}
                        >
                          <EditIcon />
                        </IconButton>
                      </Grid>
                      <Grid item>
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteClick(ad._id, "car")}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            ))}

            {accessoryAds.map((ad) => (
              <Grid item xs={12} sm={6} md={4} key={ad._id}>
                <Card
                  sx={{
                    position: "relative",
                    overflow: "hidden",
                    borderRadius: "10px",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                    transition: "transform 0.2s ease, box-shadow 0.2s ease",
                    height: "100%",
                    "&:hover": {
                      transform: "scale(1.05)",
                      boxShadow: "0 6px 16px rgba(0, 0, 0, 0.2)",
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: "100%",
                      padding: "10px",
                      position: "relative",
                    }}
                  >
                    <Slider {...sliderSettings}>
                      {ad.images.map((image, index) => (
                        <div key={index}>
                          <img
                            src={`http://localhost:3001/${image}`}
                            alt={`Ad Image ${index + 1}`}
                            style={{
                              width: "100%",
                              height: "300px",
                              objectFit: "contain",
                              borderRadius: "8px",
                            }}
                          />
                        </div>
                      ))}
                    </Slider>
                  </Box>

                  <CardContent>
                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                      {ad.accessoryInfo}
                    </Typography>
                    <Typography variant="body2">
                      Price: {ad.price} PKR
                    </Typography>
                    <Typography variant="body2">
                      Condition: {ad.condition}
                    </Typography>
                    <Typography variant="body2">City: {ad.city}</Typography>
                    <Grid container spacing={2} sx={{ marginTop: "10px" }}>
                      <Grid item>
                        <IconButton
                          size="small"
                          onClick={() => handleEditClick(ad, "accessory")}
                        >
                          <EditIcon />
                        </IconButton>
                      </Grid>
                      <Grid item>
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteClick(ad._id, "accessory")}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>

      <Dialog open={isDeleteDialogOpen} onClose={handleDeleteCancel}>
        <DialogTitle>Delete Ad</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this ad?
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
