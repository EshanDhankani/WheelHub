


// import { useState, useEffect } from "react";
// import { useParams } from "react-router-dom";
// import axios from "axios";
// import {
//   Container,
//   Typography,
//   Box,
//   CircularProgress,
//   Grid,
//   Chip,
//   Button,
//   Card,
//   CardContent,
// } from "@mui/material";
// import { MapPin, Car, Gauge, MessageCircle } from "lucide-react";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Navigation, Pagination } from "swiper/modules";
// import "swiper/css";
// import "swiper/css/navigation";
// import "swiper/css/pagination";

// const CarDetailScreen = () => {
//   const [carDetails, setCarDetails] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const { id } = useParams();

//   useEffect(() => {
//     const fetchCarDetails = async () => {
//       try {
//         setLoading(true);
//         const response = await axios.get(`http://localhost:3001/carAds/${id}`);
//         setCarDetails(response.data);
//         setError(null);
//       } catch (error) {
//         console.error("Error fetching car details:", error);
//         setError("Failed to fetch car details. Please try again later.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCarDetails();
//   }, [id]);

//   if (loading) {
//     return (
//       <Container maxWidth="lg" sx={{ py: 8, textAlign: "center" }}>
//         <CircularProgress />
//       </Container>
//     );
//   }

//   if (error) {
//     return (
//       <Container maxWidth="lg" sx={{ py: 8, textAlign: "center" }}>
//         <Typography color="error">{error}</Typography>
//       </Container>
//     );
//   }

//   if (!carDetails) {
//     return (
//       <Container maxWidth="lg" sx={{ py: 8, textAlign: "center" }}>
//         <Typography>Car details not found.</Typography>
//       </Container>
//     );
//   }

//   return (
//     <Container maxWidth="lg" sx={{ py: 8 }}>
//       <Typography
//         variant="h3"
//         gutterBottom
//         sx={{
//           fontWeight: "bold",
//           color: "#1976d2",
//           textAlign: "center", // Center title
//           mb: 4,
//           letterSpacing: "0.05em", // Slight letter spacing for modern look
//         }}
//       >
//         {carDetails.carInfo}
//       </Typography>
//       <Grid container spacing={4}>
//         <Grid item xs={12} md={8}>
//           <Box
//             sx={{
//               width: "100%",
//               maxHeight: "600px",
//               overflow: "hidden",
//               position: "relative",
//               borderRadius: 3,
//               boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)", // Add subtle shadow
//             }}
//           >
//             <Swiper
//               modules={[Navigation, Pagination]}
//               navigation
//               pagination={{ clickable: true }}
//               loop={true}
//               style={{ width: "100%", height: "100%" }}
//             >
//               {carDetails.images.map((image, index) => (
//                 <SwiperSlide
//                   key={index}
//                   style={{
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "center",
//                   }}
//                 >
//                   <img
//                     src={`http://localhost:3001/${image}`}
//                     alt={`${carDetails.carInfo} - Image ${index + 1}`}
//                     style={{
//                       maxWidth: "100%",
//                       maxHeight: "100%",
//                       objectFit: "cover",
//                       borderRadius: 3,
//                       transition: "transform 0.3s ease", // Smooth transition on hover
//                     }}
//                     onMouseOver={(e) => (e.target.style.transform = "scale(1.02)")} // Slight zoom on hover
//                     onMouseOut={(e) => (e.target.style.transform = "scale(1)")}
//                   />
//                 </SwiperSlide>
//               ))}
//             </Swiper>
//           </Box>
//         </Grid>
//         <Grid item xs={12} md={4}>
//           <Card
//             sx={{
//               boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
//               borderRadius: 3,
//             }}
//           >
//             <CardContent>
//               <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
//                 <Box sx={{ display: "flex", alignItems: "center" }}>
//                   <MapPin size={24} style={{ marginRight: 8, color: "#1976d2" }} />
//                   <Typography variant="h6">{carDetails.city}</Typography>
//                 </Box>
//                 <Box sx={{ display: "flex", alignItems: "center" }}>
//                   <Car size={24} style={{ marginRight: 8, color: "#1976d2" }} />
//                   <Typography variant="h6">
//                     {carDetails.registeredIn} | {carDetails.exteriorColor}
//                   </Typography>
//                 </Box>
//                 <Box sx={{ display: "flex", alignItems: "center" }}>
//                   <Gauge size={24} style={{ marginRight: 8, color: "#1976d2" }} />
//                   <Typography variant="h6">
//                     {carDetails.mileage.toLocaleString()} km
//                   </Typography>
//                 </Box>
//                 <Chip
//                   label={`PKR ${parseInt(carDetails.price).toLocaleString()}`}
//                   color="primary"
//                   sx={{
//                     fontWeight: "bold",
//                     fontSize: "1.2rem",
//                     py: 1,
//                     backgroundColor: "#1976d2",
//                   }}
//                 />
//                 <Button
//                   variant="contained"
//                   startIcon={<MessageCircle size={24} />}
//                   sx={{
//                     py: 1,
//                     fontSize: "1.2rem",
//                     backgroundColor: "#1976d2",
//                     boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)", // Subtle shadow
//                     "&:hover": {
//                       backgroundColor: "#1565c0",
//                     },
//                   }}
//                 >
//                   Message
//                 </Button>
//               </Box>
//             </CardContent>
//           </Card>
//         </Grid>
//       </Grid>
//       <Box sx={{ mt: 6, p: 4, backgroundColor: "#f9f9f9", borderRadius: 2 }}>
//         <Typography
//           variant="h5"
//           gutterBottom
//           sx={{
//             fontWeight: "bold",
//             mb: 2,
//             textDecoration: "underline", // Add underline for emphasis
//           }}
//         >
//           Description
//         </Typography>
//         <Typography sx={{ lineHeight: "1.8", letterSpacing: "0.02em" }}>
//           {carDetails.adDescription}
//         </Typography>
//       </Box>
//     </Container>
//   );
// };

// export default CarDetailScreen;


import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Grid,
  Chip,
  Button,
  Card,
  CardContent,
} from "@mui/material";
import { MapPin, Car, Gauge, MessageCircle } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

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
        console.error("Error fetching car details:", error);
        setError("Failed to fetch car details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCarDetails();
  }, [id]);

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
    <Container maxWidth="lg" sx={{ py: 8 }}>
      {/* Car Title */}
      <Typography
        variant="h3"
        gutterBottom
        sx={{
          fontWeight: "bold",
          color: "#1976d2",
          textAlign: "center", // Center title
          mb: 4,
          letterSpacing: "0.05em", // Slight letter spacing for modern look
          textTransform: "uppercase", // Makes title more prominent
        }}
      >
        {carDetails.carInfo}
      </Typography>

      <Grid container spacing={4}>
        {/* Image Carousel */}
        <Grid item xs={12} md={8}>
          <Box
            sx={{
              width: "100%",
              maxHeight: "600px",
              overflow: "hidden",
              position: "relative",
              borderRadius: 3,
              boxShadow: "0 8px 24px rgba(0, 0, 0, 0.1)", // Enhanced shadow
            }}
          >
            <Swiper
              modules={[Navigation, Pagination]}
              navigation
              pagination={{ clickable: true }}
              loop={true}
              style={{ width: "100%", height: "100%" }}
            >
              {carDetails.images.map((image, index) => (
                <SwiperSlide
                  key={index}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <img
                    src={`http://localhost:3001/${image}`}
                    alt={`${carDetails.carInfo} - Image ${index + 1}`}
                    style={{
                      maxWidth: "100%",
                      maxHeight: "100%",
                      objectFit: "cover",
                      borderRadius: 8,
                      transition: "transform 0.3s ease", // Smooth transition on hover
                    }}
                    onMouseOver={(e) => (e.target.style.transform = "scale(1.05)")} // Slight zoom on hover
                    onMouseOut={(e) => (e.target.style.transform = "scale(1)")}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </Box>
        </Grid>

        {/* Car Details Card */}
        <Grid item xs={12} md={4}>
          <Card
            sx={{
              boxShadow: "0 8px 24px rgba(0, 0, 0, 0.1)", // Enhanced shadow for modern feel
              borderRadius: 3,
              padding: 3,
            }}
          >
            <CardContent>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <MapPin size={24} style={{ color: "#1976d2" }} />
                  <Typography variant="h6">{carDetails.city}</Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Car size={24} style={{ color: "#1976d2" }} />
                  <Typography variant="h6">
                    {carDetails.registeredIn} | {carDetails.exteriorColor}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Gauge size={24} style={{ color: "#1976d2" }} />
                  <Typography variant="h6">
                    {carDetails.mileage.toLocaleString()} km
                  </Typography>
                </Box>
                {/* Price Display */}
                <Chip
                  label={`PKR ${parseInt(carDetails.price).toLocaleString()}`}
                  color="primary"
                  sx={{
                    fontWeight: "bold",
                    fontSize: "1.2rem",
                    py: 1,
                    px: 2,
                    backgroundColor: "#1976d2",
                    color: "#fff", // Ensure text contrast is high for readability
                    borderRadius: 1,
                  }}
                />
                {/* Message Button */}
                <Button
                  variant="contained"
                  startIcon={<MessageCircle size={24} />}
                  sx={{
                    py: 1.5,
                    fontSize: "1.2rem",
                    backgroundColor: "#1976d2",
                    borderRadius: 2,
                    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.1)", // Enhanced shadow
                    "&:hover": {
                      backgroundColor: "#1565c0",
                    },
                  }}
                >
                  Message
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Description Section */}
      <Box
        sx={{
          mt: 6,
          p: 4,
          backgroundColor: "#f9f9f9",
          borderRadius: 2,
          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.05)", // Soft shadow for subtle effect
        }}
      >
        <Typography
          variant="h5"
          gutterBottom
          sx={{
            fontWeight: "bold",
            mb: 2,
            textDecoration: "underline",
            textDecorationColor: "#1976d2", // Underline matches the theme color
          }}
        >
          Description
        </Typography>
        <Typography
          sx={{
            lineHeight: "1.8",
            letterSpacing: "0.02em",
            color: "#555",
          }}
        >
          {carDetails.adDescription}
        </Typography>
      </Box>
    </Container>
  );
};

export default CarDetailScreen;
