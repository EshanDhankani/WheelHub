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
import AccessoryAd from "./src/components/AccessoryAd";
import Autoparts from "./src/components/Autoparts";
import AutopartsDetail from "./src/components/AutopartsDetail";
import EmailVerification from "./src/components/EmailVerification";
import PasswordReset from "./src/components/PasswordReset"; // Import the PasswordReset component

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
        <Route path="/edit-car/:id" element={<PostAd />} />
        <Route path="/AccessoryAd" element={<AccessoryAd />} />
        <Route path="/autoparts" element={<Autoparts />} />
        <Route path="/details/:id" element={<AutopartsDetail />} />
        <Route path="/verify-email" element={<EmailVerification />} />
        <Route path="/reset-password/:token" element={<PasswordReset />} /> {/* Add this route */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
