import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Ticket, 
  LogOut,
  TrendingUp
} from 'lucide-react';
import { supabase } from '../../supabaseClient';

export default function Sidebar() {
  const location = useLocation();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/admin-login';
  };

  const menuItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/influencers', label: 'Influencers', icon: Users },
    { path: '/admin/coupons', label: 'Coupons', icon: Ticket },
    { path: '/admin/analytics', label: 'Analytics', icon: TrendingUp },
  ];

  return (
    <div style={{ 
      width: '260px', 
      height: '100vh', 
      background: '#0f172a', 
      color: '#fff', 
      padding: '24px',
      display: 'flex',
      flexDirection: 'column',
      position: 'fixed',
      left: 0,
      top: 0,
      borderRight: '1px solid rgba(255,255,255,0.1)'
    }}>
      <div style={{ marginBottom: '40px', padding: '0 12px' }}>
        <h2 style={{ 
          fontSize: '24px', 
          fontWeight: '800', 
          background: 'linear-gradient(to right, #60a5fa, #3b82f6)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          DC ADMIN
        </h2>
        <p style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>Marketing Suite v2.0</p>
      </div>

      <nav style={{ flex: 1 }}>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <li key={item.path} style={{ marginBottom: '8px' }}>
                <Link 
                  to={item.path}
                  style={{ 
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 16px',
                    color: isActive ? '#fff' : '#94a3b8',
                    textDecoration: 'none',
                    borderRadius: '12px',
                    background: isActive ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                    transition: '0.2s',
                    fontWeight: isActive ? '600' : '400'
                  }}
                  onMouseEnter={(e) => {
                    if(!isActive) e.currentTarget.style.color = '#fff';
                    if(!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                  }}
                  onMouseLeave={(e) => {
                    if(!isActive) e.currentTarget.style.color = '#94a3b8';
                    if(!isActive) e.currentTarget.style.background = 'transparent';
                  }}
                >
                  <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div style={{ paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <button 
          onClick={handleLogout}
          style={{ 
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px 16px',
            color: '#ef4444',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            width: '100%',
            borderRadius: '12px',
            transition: '0.2s',
            fontSize: '15px'
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
        >
          <LogOut size={20} />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
}
