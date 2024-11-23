// import { useState, useEffect } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import {
//   Box,
//   Typography,
//   List,
//   ListItem,
//   TextField,
//   Button,
//   IconButton,
//   Avatar,
//   InputAdornment,
//   Dialog,
//   DialogContent,
// } from "@mui/material";
// import { Image as ImageIcon, Eye, Check } from "lucide-react";
// import axios from "axios";

// const Chat = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { carDetails, carId } = location.state || {};

//   const [messages, setMessages] = useState(() => {
//     // Load messages from localStorage on initial render
//     const savedMessages = localStorage.getItem(`chat_${carId}`);
//     return savedMessages ? JSON.parse(savedMessages) : [];
//   });

//   const [newMessage, setNewMessage] = useState("");
//   const [imageList, setImageList] = useState([]);
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [currentUserId, setCurrentUserId] = useState(null);
//   const [openImage, setOpenImage] = useState(null);

//   useEffect(() => {
//     const fetchMessages = async () => {
//       try {
//         const response = await axios.get(
//           `http://localhost:3001/messages/${carId}`,
//           { withCredentials: true }
//         );
//         setMessages(response.data);
//         localStorage.setItem(`chat_${carId}`, JSON.stringify(response.data)); // Save messages to localStorage
//       } catch (error) {
//         console.warn("Failed to fetch messages:", error);
//       }
//     };

//     const checkAuthentication = async () => {
//       try {
//         const response = await axios.get("http://localhost:3001/currentUser", {
//           withCredentials: true,
//         });
//         setIsAuthenticated(!!response.data);
//         setCurrentUserId(response.data?._id);
//       } catch (error) {
//         setIsAuthenticated(false);
//       }
//     };

//     checkAuthentication();
//     fetchMessages();
//   }, [carId]);

//   const handleSendMessage = async () => {
//     if (newMessage.trim() === "" && imageList.length === 0) {
//       alert("Message or image is required.");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("carAdId", carId);
//     formData.append("receiverId", carDetails.userId._id || carDetails.userId);
//     formData.append("message", newMessage);

//     imageList.forEach((image) => formData.append("images", image));

//     try {
//       const response = await axios.post(
//         "http://localhost:3001/messages",
//         formData,
//         {
//           withCredentials: true,
//           headers: {
//             "Content-Type": "multipart/form-data",
//           },
//         }
//       );

//       if (response.status === 201) {
//         const updatedMessages = [...messages, response.data.newMessage];
//         setMessages(updatedMessages);
//         localStorage.setItem(`chat_${carId}`, JSON.stringify(updatedMessages)); // Update localStorage
//         setNewMessage("");
//         setImageList([]);
//       } else {
//         console.error("Failed to send message: ", response.data.message);
//       }
//     } catch (error) {
//       console.error("Error sending message:", error.response?.data || error.message);
//     }
//   };

//   const handleImageUpload = (e) => {
//     const files = Array.from(e.target.files);
//     if (files.length + imageList.length > 8) {
//       alert("You can upload up to 8 images in total.");
//       return;
//     }
//     setImageList((prev) => [...prev, ...files]);
//   };

//   const handleViewAd = () => {
//     navigate(`/cardetails/${carId}`, { state: { carDetails } });
//   };

//   const handleImageClick = (imageUrl) => {
//     setOpenImage(imageUrl);
//   };

//   const handleCloseImage = () => {
//     setOpenImage(null);
//   };

//   const getMessageStatusIcon = (msg) => {
//     if (msg.senderId === currentUserId) {
//       return msg.isSeen ? <Eye size={18} color="green" /> : <Check size={18} color="gray" />;
//     }
//     return null;
//   };
  

//   const markMessageAsSeen = async (messageId) => {
//     try {
//       await axios.put(
//         `http://localhost:3001/messages/seen/${messageId}`,
//         {},
//         { withCredentials: true }
//       );
//       setMessages((prevMessages) =>
//         prevMessages.map((msg) =>
//           msg._id === messageId ? { ...msg, isSeen: true } : msg
//         )
//       );
//     } catch (error) {
//       console.error("Error marking message as seen:", error.message);
//     }
//   };
  

//   useEffect(() => {
//     messages.forEach((msg) => {
//       if (msg.receiverId === currentUserId && !msg.isSeen) {
//         markMessageAsSeen(msg._id);
//       }
//     });
//   }, [messages, currentUserId]);
  
  

//   return (
//     <Box sx={{ height: "100vh", display: "flex", flexDirection: "column" }}>
//       {/* Header Section */}
//       <Box
//         sx={{
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "space-between",
//           padding: "16px",
//           backgroundColor: "#030950",
//           color: "#fff",
//           boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
//         }}
//       >
//         <Box sx={{ display: "flex", alignItems: "center" }}>
//           <Avatar
//             alt={carDetails.userId.name}
//             sx={{
//               width: 40,
//               height: 40,
//               marginRight: 2,
//               backgroundColor: "#ffffff",
//               color: "#030950",
//               fontWeight: "bold",
//             }}
//           >
//             {carDetails.userId.name[0]}
//           </Avatar>
//           <Typography variant="h6">{carDetails.userId.name}</Typography>
//         </Box>
//       </Box>

//       {/* Ad Details Section */}
//       <Box
//         sx={{
//           padding: "16px",
//           backgroundColor: "#fff",
//           borderBottom: "1px solid #e0e0e0",
//           display: "flex",
//           alignItems: "center",
//         }}
//       >
//         <Avatar
//           src={`http://localhost:3001/${carDetails.images[0]}`}
//           alt="Car Image"
//           sx={{ width: 80, height: 80, marginRight: 2, borderRadius: 0  }}
//         />
//         <Box>
//           <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
//             {carDetails.carInfo}
//           </Typography>
//           <Typography variant="body2" sx={{ color: "#555" }}>
//             PKR {parseInt(carDetails.price).toLocaleString()}
//           </Typography>
//         </Box>
//         <Button
//           variant="contained"
//           color="primary"
//           onClick={handleViewAd}
//           sx={{
//             backgroundColor: "#f0f0f0",
//             color: "#030950",
//             fontWeight: "bold",
//             marginLeft: "auto",
//           }}
//         >
//           View Ad
//         </Button>
//       </Box>

//       {/* Messages Section */}
//       <Box
//         sx={{
//           flex: 1,
//           overflowY: "auto",
//           padding: "16px",
//           backgroundColor: "#f9f9f9",
//         }}
//       >
//         <List>
//           {messages.map((msg, index) => (
//             <ListItem
//               key={index}
//               sx={{
//                 display: "flex",
//                 justifyContent: msg.senderId === currentUserId ? "flex-end" : "flex-start",
//                 marginBottom: "10px",
//               }}
//             >
//               <Box
//                 sx={{
//                   maxWidth: "60%",
//                   padding: "10px",
//                   borderRadius: "10px",
//                   backgroundColor: msg.senderId === currentUserId ? "#030950" : "#e0e0e0",
//                   color: msg.senderId === currentUserId ? "#fff" : "#000",
//                   boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
//                 }}
//               >
//                 <Typography variant="body1">{msg.message}</Typography>
//                 <Box
//                   sx={{
//                     display: "flex",
//                     flexWrap: "wrap",
//                     gap: "8px",
//                     marginTop: "8px",
//                   }}
//                 >
//                   {msg.imageUrl?.map((url, idx) => (
//                     <img
//                       key={idx}
//                       src={url}
//                       alt={`attachment-${idx}`}
//                       style={{
//                         width: "60px",
//                         height: "60px",
//                         borderRadius: "8px",
//                         cursor: "pointer",
//                       }}
//                       onClick={() => handleImageClick(url)}
//                     />
//                   ))}
//                 </Box>
//                 <Typography
//                   variant="caption"
//                   sx={{
//                     display: "flex",
//                     justifyContent: "flex-end",
//                     alignItems: "center",
//                     marginTop: "8px",
//                     gap: "5px",
//                   }}
//                 >
//                   {new Date(msg.createdAt).toLocaleTimeString()}
//                   {getMessageStatusIcon(msg)}
//                 </Typography>
//               </Box>
//             </ListItem>
//           ))}
//         </List>
//       </Box>

//       {/* Input Section */}
//       <Box
//         sx={{
//           display: "flex",
//           padding: "16px",
//           backgroundColor: "#fff",
//           boxShadow: "0 -2px 4px rgba(0, 0, 0, 0.1)",
//         }}
//       >
//         <TextField
//           value={newMessage}
//           onChange={(e) => setNewMessage(e.target.value)}
//           placeholder="Type a message..."
//           variant="outlined"
//           fullWidth
//           InputProps={{
//             endAdornment: (
//               <InputAdornment position="end">
//                 <IconButton component="label">
//                   <ImageIcon />
//                   <input
//                     type="file"
//                     hidden
//                     multiple
//                     onChange={handleImageUpload}
//                   />
//                 </IconButton>
//               </InputAdornment>
//             ),
//           }}
//           sx={{ marginRight: 2 }}
//           disabled={!isAuthenticated}
//         />
//         <Button
//           variant="contained"
//           onClick={handleSendMessage}
//           sx={{
//             backgroundColor: "#030950",
//             color: "#fff",
//             "&:hover": { backgroundColor: "#020738" },
//           }}
//           disabled={!isAuthenticated}
//         >
//           Send
//         </Button>
//       </Box>

//       {/* Image Modal */}
//       {openImage && (
//         <Dialog open={true} onClose={handleCloseImage} maxWidth="lg">
//           <DialogContent>
//             <img
//               src={openImage}
//               alt="Full Size"
//               style={{ width: "100%", borderRadius: "8px" }}
//             />
//           </DialogContent>
//         </Dialog>
//       )}
//     </Box>
//   );
// };

// export default Chat;


import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  List,
  ListItem,
  TextField,
  Button,
  IconButton,
  Avatar,
  InputAdornment,
  Dialog,
  DialogContent,
} from "@mui/material";
import { Image as ImageIcon, Eye, Check } from "lucide-react";
import axios from "axios";

const Chat = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { carDetails, carId } = location.state || {};

  const [messages, setMessages] = useState(() => {
    // Load messages from localStorage on initial render
    const savedMessages = localStorage.getItem(`chat_${carId}`);
    return savedMessages ? JSON.parse(savedMessages) : [];
  });

  const [newMessage, setNewMessage] = useState("");
  const [imageList, setImageList] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [openImage, setOpenImage] = useState(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/messages/${carId}`,
          { withCredentials: true }
        );
        setMessages(response.data);
        localStorage.setItem(`chat_${carId}`, JSON.stringify(response.data)); // Save messages to localStorage
      } catch (error) {
        console.warn("Failed to fetch messages:", error);
      }
    };

    const checkAuthentication = async () => {
      try {
        const response = await axios.get("http://localhost:3001/currentUser", {
          withCredentials: true,
        });
        setIsAuthenticated(!!response.data);
        setCurrentUserId(response.data?._id);
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
        localStorage.setItem(`chat_${carId}`, JSON.stringify(updatedMessages)); // Update localStorage
        setNewMessage("");
        setImageList([]);
      } else {
        console.error("Failed to send message: ", response.data.message);
      }
    } catch (error) {
      console.error("Error sending message:", error.response?.data || error.message);
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

  const handleViewAd = () => {
    navigate(`/cardetails/${carId}`, { state: { carDetails } });
  };

  const handleImageClick = (imageUrl) => {
    setOpenImage(imageUrl);
  };

  const handleCloseImage = () => {
    setOpenImage(null);
  };

  const getMessageStatusIcon = (msg) => {
    if (msg.senderId === currentUserId) {
      return msg.isSeen ? <Eye size={18} color="green" /> : <Check size={18} color="gray" />;
    }
    return null;
  };

  const markMessageAsSeen = async (messageId) => {
    try {
      await axios.put(
        `http://localhost:3001/messages/seen/${messageId}`,
        {},
        { withCredentials: true }
      );
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg._id === messageId ? { ...msg, isSeen: true } : msg
        )
      );
    } catch (error) {
      console.error("Error marking message as seen:", error.message);
    }
  };

  useEffect(() => {
    messages.forEach((msg) => {
      if (msg.receiverId === currentUserId && !msg.isSeen) {
        markMessageAsSeen(msg._id);
      }
    });
  }, [messages, currentUserId]);

  return (
    <Box sx={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Header Section */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "16px",
          backgroundColor: "#030950",
          color: "#fff",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Avatar
            alt={carDetails.userId.name}
            sx={{
              width: 40,
              height: 40,
              marginRight: 2,
              backgroundColor: "#ffffff",
              color: "#030950",
              fontWeight: "bold",
            }}
          >
            {carDetails.userId.name[0]}
          </Avatar>
          <Typography variant="h6">{carDetails.userId.name}</Typography>
        </Box>
      </Box>

      {/* Ad Details Section */}
      <Box
        sx={{
          padding: "16px",
          backgroundColor: "#fff",
          borderBottom: "1px solid #e0e0e0",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Avatar
          src={`http://localhost:3001/${carDetails.images[0]}`}
          alt="Car Image"
          sx={{ width: 80, height: 80, marginRight: 2, borderRadius: 0 }}
        />
        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
            {carDetails.carInfo}
          </Typography>
          <Typography variant="body2" sx={{ color: "#555" }}>
            PKR {parseInt(carDetails.price).toLocaleString()}
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="primary"
          onClick={handleViewAd}
          sx={{
            backgroundColor: "#f0f0f0",
            color: "#030950",
            fontWeight: "bold",
            marginLeft: "auto",
          }}
        >
          View Ad
        </Button>
      </Box>

      {/* Messages Section */}
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          padding: "16px",
          backgroundColor: "#f9f9f9",
        }}
      >
        <List>
          {messages.map((msg, index) => (
            <ListItem
              key={index}
              sx={{
                display: "flex",
                justifyContent: msg.senderId === currentUserId ? "flex-end" : "flex-start",
                marginBottom: "10px",
              }}
            >
              <Box
                sx={{
                  maxWidth: "60%",
                  padding: "10px",
                  borderRadius: "10px",
                  backgroundColor: msg.senderId === currentUserId ? "#030950" : "#e0e0e0",
                  color: msg.senderId === currentUserId ? "#fff" : "#000",
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                }}
              >
                <Typography variant="body1">{msg.message}</Typography>
                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "8px",
                    marginTop: "8px",
                  }}
                >
                  {msg.imageUrl?.map((url, idx) => (
                    <img
                      key={idx}
                      src={url}
                      alt={`attachment-${idx}`}
                      style={{
                        width: "60px",
                        height: "60px",
                        borderRadius: "8px",
                        cursor: "pointer",
                      }}
                      onClick={() => handleImageClick(url)}
                    />
                  ))}
                </Box>
                <Typography
                  variant="caption"
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "center",
                    marginTop: "8px",
                    gap: "5px",
                  }}
                >
                  {new Date(msg.createdAt).toLocaleTimeString()}
                  {getMessageStatusIcon(msg)}
                </Typography>
              </Box>
            </ListItem>
          ))}
        </List>
      </Box>

      {/* Input Section */}
      <Box
        sx={{
          display: "flex",
          padding: "16px",
          backgroundColor: "#fff",
          boxShadow: "0 -2px 4px rgba(0, 0, 0, 0.1)",
        }}
      >
        <TextField
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault(); // Prevent default action of Enter key
              handleSendMessage(); // Call send message function
            }
          }}
          placeholder="Type a message..."
          variant="outlined"
          fullWidth
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton component="label">
                  <ImageIcon />
                  <input
                    type="file"
                    hidden
                    multiple
                    onChange={handleImageUpload}
                  />
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{ marginRight: 2 }}
          disabled={!isAuthenticated}
        />
        <Button
          variant="contained"
          onClick={handleSendMessage}
          sx={{
            backgroundColor: "#030950",
            color: "#fff",
            "&:hover": { backgroundColor: "#020738" },
          }}
          disabled={!isAuthenticated}
        >
          Send
        </Button>
      </Box>

      {/* Image Modal */}
      {openImage && (
        <Dialog open={true} onClose={handleCloseImage} maxWidth="lg">
          <DialogContent>
            <img
              src={openImage}
              alt="Full Size"
              style={{ width: "100%", borderRadius: "8px" }}
            />
          </DialogContent>
        </Dialog>
      )}
    </Box>
  );
};

export default Chat;
