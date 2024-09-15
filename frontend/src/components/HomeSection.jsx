import { Box, Button, Typography } from "@mui/material";
import PropTypes from "prop-types";
import Link from "@mui/material/Link";


function HomeSection({ imageSrc }) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        alignItems: "center",
        justifyContent: "space-between",
        padding: 2,
        backgroundColor: "#000000",
        paddingTop: "10%",
        height: "110vh",
        fontFamily: "Poppins, sans-serif",
      }}
    >
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: { xs: "center", md: "flex-start" },
          textAlign: { xs: "center", md: "left" },
          gap: 1,

        }}
      >
        <Typography
          variant="h4"
          gutterBottom
          sx={{
            fontSize: {
              xs: "1.5rem",
              sm: "60px",
            },
            paddingLeft: {
              xs: 0,
              md: 10,
            },
            fontWeight: 100,
            color: "white",
            margin: 0,
          }}
        >
           Find You Dream Car From {" "}
          <Box component="span" sx={{ fontWeight: "bold" }}>
            WheelHub{" "}
          </Box>
          
        </Typography>
        <Box
          sx={{
            display: "flex",
            justifyContent: { xs: "center", md: "flex-start" },
            gap: 1,
            paddingTop: '10px',
            paddingLeft: {
              xs: 0,
              md: 10,
            },
          }}
        >
          <Link href="/login">
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#030947",
              color: "#fff",
              textTransform: 'none', 
              borderRadius: '25px',
            }}
          >
            Get Started
          </Button>
          </Link>
          <Button
            variant="outlined"
            sx={{
              backgroundColor: "#000",
              color: "#fff",
              borderColor: "#030947",
              textTransform: 'none',
              borderRadius: '25px'

            }}
          >
            Contact Us
          </Button>
        </Box>
      </Box>
      <Box
        sx={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: { xs: 2, md: 0 },

        }}
      >
        <img
          src={imageSrc}
          alt="Home"
          style={{ maxWidth: "100%", height: "auto" }}
        />
      </Box>
    </Box>
  );
}

HomeSection.propTypes = {
  imageSrc: PropTypes.string.isRequired,
};

export default HomeSection;
