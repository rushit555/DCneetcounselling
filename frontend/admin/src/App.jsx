import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AdminLogin from './pages/admin/Login';
import AdminDashboard from './pages/admin/Dashboard';
import Influencers from './pages/admin/Influencers';
import Coupons from './pages/admin/Coupons';
import Analytics from './pages/admin/Analytics';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/influencers" element={<Influencers />} />
        <Route path="/admin/coupons" element={<Coupons />} />
        <Route path="/admin/analytics" element={<Analytics />} />
        
        {/* Redirect root / to dashboard or login */}
        <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
        
        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
