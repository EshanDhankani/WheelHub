import { useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import Box from "@mui/material/Box";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";

const ProfileMenu = ({ user, onLogout }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Avatar
        alt={user.name}
        src={user.avatar || "/static/images/avatar/1.jpg"}
        sx={{ width: 40, height: 40, borderRadius: "50%", cursor: "pointer" }}
        onClick={handleClick}
      />
      <Typography
        variant="body2"
        sx={{ fontWeight: "600", color: "white", ml: 1, cursor: "pointer" }}
        onClick={handleClick}
      >
        {user.name}
      </Typography>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        sx={{ mt: 2 }}
        PaperProps={{
          style: {
            minWidth: "200px",
          },
        }}
      >
        <MenuItem component={Link} to="/profile" onClick={handleClose}>
          My Profile
        </MenuItem>

        <MenuItem component={Link} to="/my-ads" onClick={handleClose}>
          My Ads
        </MenuItem>

        <MenuItem onClick={onLogout}>Sign Out</MenuItem>
      </Menu>
    </Box>
  );
};

ProfileMenu.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string.isRequired,
    avatar: PropTypes.string,
  }).isRequired,
  onLogout: PropTypes.func.isRequired,
};

export default ProfileMenu;
