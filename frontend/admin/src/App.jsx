import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AdminLogin from './pages/admin/Login';
import AdminDashboard from './pages/admin/Dashboard';
import Affiliates from './pages/admin/Affiliates';
import Coupons from './pages/admin/Coupons';
import Orders from './pages/admin/Orders';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/affiliates" element={<Affiliates />} />
        <Route path="/admin/coupons" element={<Coupons />} />
        <Route path="/admin/orders" element={<Orders />} />
        
        {/* Redirect root / to dashboard or login */}
        <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
        
        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
