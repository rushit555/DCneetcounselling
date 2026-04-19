import React, { useState } from 'react';
import { supabase } from '../../supabaseClient';
import { useNavigate } from 'react-router-dom';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      const user = data.user;

      // Fetch user role from our custom column
      const { data: roleData, error: roleError } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single();

      if (roleError) throw new Error('Could not verify admin permissions.');

      if (roleData?.role === 'admin') {
        navigate('/dashboard');
      } else {
        await supabase.auth.signOut();
        throw new Error('Access Denied: You do not have admin privileges.');
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.glassCard}>
        <div style={styles.logoSection}>
          <div style={styles.logoPlaceholder}>DC</div>
          <h1 style={styles.title}>Admin Portal</h1>
          <p style={styles.subtitle}>Enter your credentials to access the command center</p>
        </div>

        <form onSubmit={handleLogin} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email Address</label>
            <input
              type='email'
              placeholder='admin@example.com'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input
              type='password'
              placeholder='••••••••'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={loading} 
            style={{
              ...styles.button,
              opacity: loading ? 0.7 : 1,
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Authenticating...' : 'Sign In to Dashboard'}
          </button>
        </form>

        <div style={styles.footer}>
          <p>© 2026 DC Neet Counselling • Secure Access Only</p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    height: '100vh',
    width: '100vw',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
    fontFamily: '"Inter", sans-serif',
    margin: 0,
    overflow: 'hidden'
  },
  glassCard: {
    width: '100%',
    maxWidth: '420px',
    padding: '40px',
    background: 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(12px)',
    borderRadius: '24px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
    display: 'flex',
    flexDirection: 'column',
    gap: '30px'
  },
  logoSection: {
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px'
  },
  logoPlaceholder: {
    width: '60px',
    height: '60px',
    background: 'linear-gradient(45deg, #6366f1, #a855f7)',
    borderRadius: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '24px',
    fontWeight: '800',
    color: 'white',
    boxShadow: '0 0 20px rgba(99, 102, 241, 0.4)'
  },
  title: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#f8fafc',
    margin: 0,
    letterSpacing: '-0.025em'
  },
  subtitle: {
    fontSize: '14px',
    color: '#94a3b8',
    margin: 0,
    lineHeight: '1.5'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  label: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#cbd5e1',
    marginLeft: '4px'
  },
  input: {
    padding: '14px 16px',
    background: 'rgba(0, 0, 0, 0.2)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '12px',
    color: 'white',
    fontSize: '15px',
    outline: 'none',
    transition: 'all 0.2s ease',
    '::placeholder': { color: '#64748b' }
  },
  button: {
    marginTop: '10px',
    padding: '14px',
    background: 'linear-gradient(45deg, #6366f1, #a855f7)',
    border: 'none',
    borderRadius: '12px',
    color: 'white',
    fontSize: '16px',
    fontWeight: '600',
    letterSpacing: '0.025em',
    transition: 'transform 0.1s active, filter 0.2s',
    boxShadow: '0 10px 15px -3px rgba(99, 102, 241, 0.3)'
  },
  footer: {
    textAlign: 'center',
    marginTop: '10px'
  },
  footerText: {
    fontSize: '12px',
    color: '#64748b'
  }
};
