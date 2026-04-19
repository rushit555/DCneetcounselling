import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';

export default function Header({ title }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        supabase.from('users').select('*').eq('id', session.user.id).single()
          .then(({ data }) => setUser(data));
      }
    });
  }, []);

  return (
    <header style={styles.header}>
      <div>
        <h1 style={styles.title}>{title}</h1>
      </div>

      <div style={styles.profile}>
        <div style={styles.userInfo}>
          <span style={styles.userName}>{user?.name || 'Admin'}</span>
          <span style={styles.userRole}>Administrator</span>
        </div>
        <div style={styles.avatar}>
          {user?.name?.[0] || 'A'}
        </div>
      </div>
    </header>
  );
}

const styles = {
  header: {
    padding: '24px 40px',
    background: 'white',
    borderBottom: '1px solid #e2e8f0',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'sticky',
    top: 0,
    zIndex: 10
  },
  title: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#1e293b',
    margin: 0
  },
  profile: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px'
  },
  userInfo: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end'
  },
  userName: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#1e293b'
  },
  userRole: {
    fontSize: '12px',
    color: '#64748b'
  },
  avatar: {
    width: '40px',
    height: '40px',
    background: 'linear-gradient(45deg, #6366f1, #a855f7)',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontWeight: 'bold',
    fontSize: '16px',
    boxShadow: '0 4px 6px -1px rgba(99, 102, 241, 0.2)'
  }
};
