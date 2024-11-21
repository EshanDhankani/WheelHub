import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Box,
  Typography,
  List,
  ListItem,
  TextField,
  Grid,
  Button,
  IconButton,
  InputAdornment,
  Select,
  MenuItem,
} from "@mui/material";
import { MessageCircle, Image as ImageIcon } from "lucide-react";
import axios from "axios";

const Chat = ({ carDetails, carId }) => {
  const [messages, setMessages] = useState(() => {
    // Load messages from localStorage on initial render
    const savedMessages = localStorage.getItem(`chat_${carId}`);
    return savedMessages ? JSON.parse(savedMessages) : [];
  });
  const [newMessage, setNewMessage] = useState("");
  const [imageList, setImageList] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [fontColor, setFontColor] = useState("#000000");
  const [fontSize, setFontSize] = useState(14);
  const [fontStyle, setFontStyle] = useState("Arial");

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/messages/${carId}`,
          { withCredentials: true }
        );
        setMessages(response.data);

        // Save fetched messages to localStorage
        localStorage.setItem(`chat_${carId}`, JSON.stringify(response.data));
      } catch (error) {
        console.warn("Failed to fetch messages:", error);
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

    checkAuthentication();
    fetchMessages(); 
  }, [carId]);

  const handleSendMessage = async () => {
    if (newMessage.trim() === "" && imageList.length === 0) {
      alert("Message or image is required.");
      return;
    }

    const formData = new FormData();
    formData.append("carAdId", carId);
    formData.append("receiverId", carDetails.userId._id || carDetails.userId);
    formData.append("message", newMessage);
    formData.append("fontColor", fontColor);
    formData.append("fontSize", fontSize);
    formData.append("fontStyle", fontStyle);

    imageList.forEach((image) => formData.append("images", image));

    try {
      const response = await axios.post(
        "http://localhost:3001/messages",
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 201) {
        const updatedMessages = [...messages, response.data.newMessage];
        setMessages(updatedMessages);

        // Update localStorage
        localStorage.setItem(`chat_${carId}`, JSON.stringify(updatedMessages));

        setNewMessage("");
        setImageList([]);
      } else {
        console.error("Failed to send message: ", response.data.message);
      }
    } catch (error) {
      console.error(
        "Error sending message:",
        error.response?.data || error.message
      );
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + imageList.length > 8) {
      alert("You can upload up to 8 images in total.");
      return;
    }
    setImageList((prev) => [...prev, ...files]);
  };

  return (
    <Box sx={{ mb: 4 }}>
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
              </Typography>
              {msg.imageUrl?.map((url, idx) => (
                <Box key={idx} sx={{ mt: 1 }}>
                  <img
                    src={url}
                    alt={`attachment-${idx}`}
                    style={{ maxWidth: "100%", borderRadius: 8 }}
                  />
                </Box>
              ))}
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
        <Grid item xs={8}>
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
        <Grid item xs={2}>
          <Button
            variant="contained"
            component="label"
            fullWidth
            sx={{
              height: "100%",
              borderRadius: "30px",
            }}
            disabled={!isAuthenticated}
          >
            <ImageIcon />
            <input
              type="file"
              hidden
              multiple
              onChange={handleImageUpload}
              accept="image/*"
            />
          </Button>
        </Grid>

        <Grid item xs={2}>
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
              <MenuItem value="Times New Roman">Times New Roman</MenuItem>
            </Select>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

Chat.propTypes = {
  carDetails: PropTypes.object.isRequired,
  carId: PropTypes.string.isRequired,
};

export default Chat;
