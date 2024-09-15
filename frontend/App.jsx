import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./src/components/LandingPage"
import Register from "./src/components/Register";
import Login from "./src/components/Login";
import ForgotPassword from "./src/components/ForgotPassword";
import UsedCars from "./src/components/UsedCars";
import PostAd from "./src/components/PostAd";
import CarDetailScreen from "./src/components/CarDetailScreen";  // Make sure this path is correct

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
      </Routes>
    </BrowserRouter>
  );
}

export default App;