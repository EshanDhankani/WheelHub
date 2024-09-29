import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Drawer from "@mui/material/Drawer";
import MenuIcon from "@mui/icons-material/Menu";
import Divider from "@mui/material/Divider";
import { useNavigate } from "react-router-dom";
import Dialog from "@mui/material/Dialog";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import DialogContent from "@mui/material/DialogContent";
import Menu from "@mui/material/Menu";
import Slider from "react-slick";
import GoogleIcon from "@mui/icons-material/Google";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ProfileMenu from "../components/ProfileMenu.jsx";

const logoStyle = {
  width: "auto",
  height: "70px",
  cursor: "pointer",
  mx: 10,
};

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isCheckingLogin, setIsCheckingLogin] = useState(true);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const menuItems = [
    { text: "Used Cars", path: "/UsedCars" },
    { text: "Auto Store", path: "/autoparts" },
    { text: "Mechanics", path: "/mechanics" },
    { text: "Videos", path: "/videos" },
  ];

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("http://localhost:3001/currentUser", {
          credentials: "include",
        });
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        }
        setIsCheckingLogin(false);
      } catch (error) {
        console.error("Error fetching user:", error);
        setIsCheckingLogin(false);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:3001/logout", {
        method: "POST",
        credentials: "include",
      });
      setUser(null);
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const handlePostAdClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseDropdown = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (path) => {
    if (!user) {
      setShowLoginPopup(true);
    } else {
      navigate(path);
    }
    setAnchorEl(null);
  };

  const handleGoogleLogin = () => {
    window.localStorage.setItem("redirectAfterLogin", "/PostAd");
    window.open("http://localhost:3001/auth/google", "_self");
  };

  const handleClosePopup = () => {
    setShowLoginPopup(false);
  };

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 1200,
    arrows: false,
  };

  if (isCheckingLogin) {
    return (
      <div style={{ textAlign: "center", padding: "20px" }}>
        <Typography variant="h6">Loading...</Typography>
      </div>
    );
  }

  return (
    <div>
      <AppBar position="fixed" sx={{ boxShadow: 0, bgcolor: "transparent", mt: 2 }}>
        <Container maxWidth="lg">
          <Toolbar
            variant="regular"
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexShrink: 0,
              borderRadius: "999px",
              bgcolor: "black",
              maxHeight: 40,
              borderColor: "divider",
              boxShadow: "0 0 1px rgba(85, 166, 246, 0.1)",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <img src={"/logo2.png"} style={logoStyle} alt="Logo" />
            </Box>

            <Box sx={{ display: { xs: "none", md: "flex" }, justifyContent: "center", flexGrow: 1 }}>
              {menuItems.map((item) => (
                <MenuItem
                  key={item.text}
                  component={Link}
                  to={item.path}
                  sx={{
                    py: "6px",
                    px: "12px",
                    borderBottom: location.pathname === item.path ? "2px solid #fff" : "none",
                    "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.1)" },
                  }}
                >
                  <Typography variant="body2" sx={{ fontWeight: "600", color: "white" }}>
                    {item.text}
                  </Typography>
                </MenuItem>
              ))}
              <MenuItem onClick={handlePostAdClick} sx={{ py: "6px", px: "12px", "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.1)" } }}>
                <Typography variant="body2" sx={{ fontWeight: "600", color: "white" }}>
                  Post an Ad
                </Typography>
              </MenuItem>
            </Box>

            <Box sx={{ display: { xs: "none", md: "flex" }, gap: 0.5, alignItems: "center" }}>
              {user ? (
                <ProfileMenu user={user} onLogout={handleLogout} />
              ) : (
                <Button
                  color="primary"
                  variant="contained"
                  size="small"
                  component={Link}
                  to="/login"
                  sx={{ fontWeight: "600", backgroundColor: "#C7253E", textTransform: "none", borderRadius: 15 }}
                >
                  Login
                </Button>
              )}
            </Box>

            <Box sx={{ display: { sm: "", md: "none" } }}>
              <Button variant="text" color="primary" aria-label="menu" onClick={toggleDrawer(true)} sx={{ minWidth: "30px", p: "4px" }}>
                <MenuIcon />
              </Button>
              <Drawer anchor="right" open={open} onClose={toggleDrawer(false)}>
                <Box sx={{ minWidth: "60dvw", p: 2, backgroundColor: "background.paper", flexGrow: 1 }}>
                  {menuItems.map((item) => (
                    <MenuItem key={item.text} component={Link} to={item.path} onClick={toggleDrawer(false)} sx={{ py: 1, "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.1)" } }}>
                      {item.text}
                    </MenuItem>
                  ))}
                  <Divider />
                  <MenuItem>
                    {user ? (
                      <Button color="primary" variant="contained" sx={{ width: "100%" }} onClick={handleLogout}>
                        Logout
                      </Button>
                    ) : (
                      <Button color="primary" variant="contained" component={Link} to="/login" sx={{ width: "100%" }}>
                        Login
                      </Button>
                    )}
                  </MenuItem>
                </Box>
              </Drawer>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Dropdown for Post an Ad */}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleCloseDropdown}>
        <MenuItem onClick={() => handleMenuItemClick("/PostAd")}>Sell Your Car</MenuItem>
        <MenuItem onClick={() => handleMenuItemClick("/AccessoryAd")}>Sell Your Accessory</MenuItem>
      </Menu>

      {/* Login Popup with Carousel */}
      <Dialog open={showLoginPopup} onClose={handleClosePopup}>
        <IconButton
          aria-label="close"
          onClick={handleClosePopup}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent>
        <Box textAlign="center" sx={{ maxWidth: 400 }}>
            <Slider {...sliderSettings}>
              <div>
                <img
                  src="/assets/1.jpg"
                  alt="Slide 1"
                  style={{ width: "80%", maxWidth: "150px", margin: "auto" }}
                />
                <Typography variant="body1">Save Your Favourite Ads</Typography>
              </div>
              <div>
                <img
                  src="/assets/2.jpg"
                  alt="Slide 2"
                  style={{ width: "80%", maxWidth: "150px", margin: "auto" }}
                />
                <Typography variant="body1">Safely Connect With Buyers</Typography>
              </div>
              <div>
                <img
                  src="/assets/3.jpg"
                  alt="Slide 3"
                  style={{ width: "80%", maxWidth: "150px", margin: "auto" }}
                />
                <Typography variant="body1">Create Quick Alerts</Typography>
              </div>
            </Slider>

            <Typography variant="h6" component="div" gutterBottom></Typography>

            <Typography variant="body2" color="textSecondary" gutterBottom></Typography>

            <Button
              startIcon={<GoogleIcon />}
              variant="outlined"
              fullWidth
              sx={{
                textTransform: "none",
                mb: 1,
                mt: 3,
              }}
              onClick={handleGoogleLogin}
            >
              Continue with Google
            </Button>

            <Typography variant="caption" display="block" sx={{ mt: 2 }}>
              By continuing, you agree to our{" "}
              <Link href="#">Terms of Service</Link> and{" "}
              <Link href="#">Privacy Policy</Link>.
            </Typography>
          </Box>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Navbar;