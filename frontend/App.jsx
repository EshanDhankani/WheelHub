import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./src/components/LandingPage";
import Register from "./src/components/Register";
import Login from "./src/components/Login";
import ForgotPassword from "./src/components/ForgotPassword";
import UsedCars from "./src/components/UsedCars";
import PostAd from "./src/components/PostAd";
import CarDetailScreen from "./src/components/CarDetailScreen";
import MyProfile from "./src/components/MyProfile";
import MyAds from './src/components/MyAds';
import EditCarDetails from './src/components/EditCarDetails'; // Import EditCarDetails component

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/UsedCars" element={<UsedCars />} />
        <Route path="/PostAd" element={<PostAd />} />
        <Route path="/car/:id" element={<CarDetailScreen />} />
        <Route path="/profile" element={<MyProfile />} />
        <Route path="/my-ads" element={<MyAds />} />
        <Route path="/edit-car/:id" element={<EditCarDetails />} /> {/* Add EditCarDetails route */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
