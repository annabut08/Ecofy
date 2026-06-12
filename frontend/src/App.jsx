import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/user/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import MunicipalDashboard from "./pages/municipal/MunicipalDashboard";
import CompanyDashboard from "./pages/company/CompanyDashboard";

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" />;
};


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/admin" element={
          <PrivateRoute>
            <AdminDashboard />
          </PrivateRoute>
        } />      
        <Route path="/municipal" element={
          <PrivateRoute>
            <MunicipalDashboard />
          </PrivateRoute>
        } />  
        <Route path="/company" element={
          <PrivateRoute><CompanyDashboard /></PrivateRoute>
        } />    
      </Routes>
    </BrowserRouter>
  );
}

export default App;