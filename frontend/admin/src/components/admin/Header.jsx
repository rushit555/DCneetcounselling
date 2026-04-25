import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';
import { Bell } from 'lucide-react';

export default function Header({ title, subtitle }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        supabase.from('users').select('*').eq('id', session.user.id).single()
          .then(({ data }) => setUser(data));
      }
    });
  }, []);

  const initials = (user?.name || 'Admin').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

  return (
    <header style={{
      padding: '0 32px',
      height: '70px',
      background: 'white',
      borderBottom: '1px solid #e2e8f0',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
    }}>
      {/* Left: title */}
      <div>
        <h1 style={{ fontSize: '18px', fontWeight: '700', color: '#0f172a', letterSpacing: '-0.3px' }}>
          {title}
        </h1>
        {subtitle && (
          <p style={{ fontSize: '13px', color: '#64748b', marginTop: '1px' }}>{subtitle}</p>
        )}
      </div>

      {/* Right: actions + user */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* Bell */}
        <button style={{
          width: '38px', height: '38px', borderRadius: '10px',
          background: '#f8fafc', border: '1px solid #e2e8f0',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#64748b', cursor: 'pointer', transition: '0.18s'
        }}
          onMouseEnter={e => e.currentTarget.style.background = '#f1f5f9'}
          onMouseLeave={e => e.currentTarget.style.background = '#f8fafc'}
        >
          <Bell size={16} />
        </button>

        {/* Divider */}
        <div style={{ width: '1px', height: '32px', background: '#e2e8f0' }} />

        {/* User info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '13px', fontWeight: '600', color: '#0f172a' }}>
              {user?.name || 'Admin'}
            </div>
            <div style={{ fontSize: '11px', color: '#94a3b8' }}>Administrator</div>
          </div>
          <div style={{
            width: '38px', height: '38px',
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            borderRadius: '10px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white', fontWeight: '700', fontSize: '14px',
            boxShadow: '0 4px 10px rgba(99,102,241,0.3)',
            letterSpacing: '0.5px'
          }}>
            {initials}
          </div>
        </div>
      </div>
    </header>
  );
}
