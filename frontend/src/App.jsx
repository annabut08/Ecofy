import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/user/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import MunicipalDashboard from "./pages/municipal/MunicipalDashboard";

// const PrivateRoute = ({ children }) => {
//   const token = localStorage.getItem("token");
//   return token ? children : <Navigate to="/login" />;
// };

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/municipal" element={<MunicipalDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;