import { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import Sidebar from '../../components/admin/Sidebar';
import Header from '../../components/admin/Header';
import { UserPlus, Search, UserCheck } from 'lucide-react';

export default function Influencers() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [influencers, setInfluencers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);

  useEffect(() => {
    fetchInfluencers();
  }, []);

  const fetchInfluencers = async () => {
    try {
      setFetchLoading(true);
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('role', 'influencer')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setInfluencers(data || []);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setFetchLoading(false);
    }
  };

  const createInfluencer = async (e) => {
    e.preventDefault();
    if (!email || !name) return alert('Please provide name and email');

    try {
      setLoading(true);
      const { error } = await supabase.from('users').insert({
        email: email.trim().toLowerCase(),
        name: name.trim(),
        role: 'influencer'
      });

      if (error) throw error;

      alert('Influencer added successfully!');
      setEmail('');
      setName('');
      fetchInfluencers();
    } catch (err) {
      alert(err.message || 'Error adding influencer');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc' }}>
      <Sidebar />
      <div style={{ flex: 1, marginLeft: '260px', padding: '32px' }}>
        <Header title="Influencer Management" />

        <div style={{ maxWidth: '900px', marginTop: '32px' }}>
          {/* Add Influencer Form */}
          <div style={{ 
            background: '#fff', 
            padding: '32px', 
            borderRadius: '24px', 
            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
              <div style={{ padding: '10px', background: '#3b82f610', color: '#3b82f6', borderRadius: '12px' }}>
                <UserPlus size={24} />
              </div>
              <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#1e293b' }}>Register New Influencer</h2>
            </div>

            <form onSubmit={createInfluencer} style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: '240px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#64748b', marginBottom: '8px' }}>Full Name</label>
                <input 
                  placeholder='e.g. John Doe' 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{ 
                    width: '100%', 
                    padding: '12px 16px', 
                    borderRadius: '12px', 
                    border: '1px solid #e2e8f0',
                    outline: 'none',
                    fontSize: '14px'
                  }} 
                />
              </div>
              <div style={{ flex: 1, minWidth: '240px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#64748b', marginBottom: '8px' }}>Email Address</label>
                <input 
                  type="email"
                  placeholder='influencer@example.com' 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ 
                    width: '100%', 
                    padding: '12px 16px', 
                    borderRadius: '12px', 
                    border: '1px solid #e2e8f0',
                    outline: 'none',
                    fontSize: '14px'
                  }} 
                />
              </div>
              <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
                <button 
                  type="submit"
                  disabled={loading}
                  style={{ 
                    background: '#3b82f6', 
                    color: '#fff', 
                    padding: '12px 32px', 
                    borderRadius: '12px', 
                    border: 'none', 
                    fontWeight: '600', 
                    cursor: 'pointer',
                    transition: '0.2s',
                    opacity: loading ? 0.7 : 1
                  }}
                >
                  {loading ? 'Adding...' : 'Add Influencer'}
                </button>
              </div>
            </form>
          </div>

          {/* Influencer List */}
          <div style={{ marginTop: '40px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#1e293b', marginBottom: '20px' }}>Active Influencers</h2>
            
            <div style={{ 
              background: '#fff', 
              borderRadius: '24px', 
              boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
              overflow: 'hidden',
              border: '1px solid #e2e8f0'
            }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                    <th style={{ padding: '16px 24px', fontSize: '13px', color: '#475569', fontWeight: '600' }}>Name</th>
                    <th style={{ padding: '16px 24px', fontSize: '13px', color: '#475569', fontWeight: '600' }}>Email</th>
                    <th style={{ padding: '16px 24px', fontSize: '13px', color: '#475569', fontWeight: '600' }}>Registered On</th>
                    <th style={{ padding: '16px 24px', fontSize: '13px', color: '#475569', fontWeight: '600' }}>ID (for Coupons)</th>
                  </tr>
                </thead>
                <tbody>
                  {influencers.length > 0 ? influencers.map((inf, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #f8fafc' }}>
                      <td style={{ padding: '16px 24px', fontSize: '14px', color: '#1e293b', fontWeight: '500' }}>{inf.name}</td>
                      <td style={{ padding: '16px 24px', fontSize: '14px', color: '#64748b' }}>{inf.email}</td>
                      <td style={{ padding: '16px 24px', fontSize: '13px', color: '#94a3b8' }}>{new Date(inf.created_at).toLocaleDateString()}</td>
                      <td style={{ padding: '16px 24px' }}>
                        <code style={{ background: '#f1f5f9', padding: '4px 8px', borderRadius: '6px', fontSize: '11px', color: '#475569' }}>{inf.id}</code>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="4" style={{ padding: '32px', textAlign: 'center', color: '#64748b' }}>
                        {fetchLoading ? 'Loading influencers...' : 'No influencers registered yet.'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
