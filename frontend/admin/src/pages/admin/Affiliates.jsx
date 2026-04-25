import { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import Sidebar from '../../components/admin/Sidebar';
import Header from '../../components/admin/Header';
import { Users } from 'lucide-react';

export default function Affiliates() {
  const [affiliates, setAffiliates] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [refCode, setRefCode] = useState('');
  const [commissionValue, setCommissionValue] = useState(10);
  const [commissionType, setCommissionType] = useState('percentage');
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchAffiliates();
  }, []);

  const fetchAffiliates = async () => {
    try {
      setLoading(true);

      // Fetch affiliates
      const { data: affs, error } = await supabase
        .from('affiliates')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Fetch earnings per affiliate
      const { data: orders } = await supabase
        .from('orders')
        .select('affiliate_ref, commission')
        .eq('status', 'paid');

      const earningsMap = {};
      orders?.forEach(o => {
        if (o.affiliate_ref) {
          earningsMap[o.affiliate_ref] = (earningsMap[o.affiliate_ref] || 0) + Number(o.commission || 0);
        }
      });

      const processed = affs.map(a => ({
        ...a,
        total_earnings: earningsMap[a.ref_code] || 0
      }));

      setAffiliates(processed);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name || !email || !refCode) return alert('Please fill all required fields');

    try {
      setCreating(true);
      const { error } = await supabase.from('affiliates').insert({
        name,
        email,
        ref_code: refCode.trim().toUpperCase(),
        commission_value: Number(commissionValue),
        commission_type: commissionType,
        status: 'approved'
      });

      if (error) {
        if (error.code === '23505') throw new Error('Email or Ref Code already exists.');
        throw error;
      }

      alert('Affiliate created successfully!');
      setName('');
      setEmail('');
      setRefCode('');
      setCommissionValue(10);
      fetchAffiliates();
    } catch (err) {
      alert(err.message || 'Error creating affiliate');
    } finally {
      setCreating(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      const { error } = await supabase
        .from('affiliates')
        .update({ status })
        .eq('id', id);

      if (error) throw error;
      fetchAffiliates();
    } catch (err) {
      alert('Error updating status');
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc' }}>
      <Sidebar />
      <div style={{ flex: 1, marginLeft: '260px', padding: '32px' }}>
        <Header title="Affiliates Management" />

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 2fr', 
          gap: '24px', 
          marginTop: '32px',
          alignItems: 'start'
        }}>
          
          {/* Create Affiliate Card */}
          <div style={{ 
            background: '#fff', 
            padding: '32px', 
            borderRadius: '24px', 
            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
            border: '1px solid #e2e8f0',
            height: 'fit-content'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
              <div style={{ padding: '10px', background: '#3b82f610', color: '#3b82f6', borderRadius: '12px' }}>
                <Users size={24} />
              </div>
              <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#1e293b' }}>Add Affiliate</h2>
            </div>

            <form onSubmit={handleCreate}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#64748b', marginBottom: '8px' }}>Name</label>
                <input 
                  placeholder='John Doe' 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #e2e8f0', outline: 'none', fontSize: '14px' }} 
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#64748b', marginBottom: '8px' }}>Email</label>
                <input 
                  type="email"
                  placeholder='john@example.com' 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #e2e8f0', outline: 'none', fontSize: '14px' }} 
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#64748b', marginBottom: '8px' }}>Reference Code</label>
                <input 
                  placeholder='JOHNDOE' 
                  value={refCode}
                  onChange={(e) => setRefCode(e.target.value)}
                  style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #e2e8f0', outline: 'none', fontSize: '14px' }} 
                />
              </div>

              <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#64748b', marginBottom: '8px' }}>Commission Value</label>
                  <input 
                    type="number"
                    placeholder='10' 
                    value={commissionValue}
                    onChange={(e) => setCommissionValue(e.target.value)}
                    style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #e2e8f0', outline: 'none', fontSize: '14px' }} 
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#64748b', marginBottom: '8px' }}>Type</label>
                  <select 
                    value={commissionType}
                    onChange={(e) => setCommissionType(e.target.value)}
                    style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #e2e8f0', outline: 'none', fontSize: '14px', background: '#fff' }}
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="flat">Flat (₹)</option>
                  </select>
                </div>
              </div>

              <button 
                type="submit"
                disabled={creating}
                style={{ 
                  width: '100%',
                  background: '#3b82f6', 
                  color: '#fff', 
                  padding: '14px', 
                  borderRadius: '12px', 
                  border: 'none', 
                  fontWeight: '600', 
                  cursor: 'pointer',
                  transition: '0.2s',
                  fontSize: '15px'
                }}
              >
                {creating ? 'Adding...' : 'Add Affiliate'}
              </button>
            </form>
          </div>

          {/* Affiliates List */}
          <div style={{ 
            background: '#fff', 
            borderRadius: '24px', 
            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
            overflowX: 'auto',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{ padding: '24px', borderBottom: '1px solid #f1f5f9' }}>
              <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#1e293b' }}>Active Affiliates</h2>
            </div>
            
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                  <th style={{ padding: '16px 24px', fontSize: '13px', color: '#475569', fontWeight: '600' }}>Name & Email</th>
                  <th style={{ padding: '16px 24px', fontSize: '13px', color: '#475569', fontWeight: '600' }}>Ref Code</th>
                  <th style={{ padding: '16px 24px', fontSize: '13px', color: '#475569', fontWeight: '600' }}>Commission</th>
                  <th style={{ padding: '16px 24px', fontSize: '13px', color: '#475569', fontWeight: '600' }}>Total Earnings</th>
                  <th style={{ padding: '16px 24px', fontSize: '13px', color: '#475569', fontWeight: '600' }}>Status</th>
                  <th style={{ padding: '16px 24px', fontSize: '13px', color: '#475569', fontWeight: '600' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {affiliates.length > 0 ? affiliates.map((a, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #f8fafc' }}>
                    <td style={{ padding: '16px 24px' }}>
                      <div style={{ fontSize: '14px', fontWeight: '600', color: '#1e293b' }}>{a.name}</div>
                      <div style={{ fontSize: '12px', color: '#64748b' }}>{a.email}</div>
                    </td>
                    <td style={{ padding: '16px 24px' }}>
                      <span style={{ background: '#3b82f610', color: '#2563eb', padding: '4px 10px', borderRadius: '6px', fontWeight: '600', fontSize: '13px' }}>
                        {a.ref_code}
                      </span>
                    </td>
                    <td style={{ padding: '16px 24px', fontSize: '14px', color: '#1e293b', fontWeight: '500' }}>
                      {a.commission_value}{a.commission_type === 'percentage' ? '%' : '₹'}
                    </td>
                    <td style={{ padding: '16px 24px', fontSize: '14px', color: '#10b981', fontWeight: '600' }}>
                      ₹{Number(a.total_earnings).toLocaleString('en-IN')}
                    </td>
                    <td style={{ padding: '16px 24px' }}>
                      <span style={{ 
                        background: a.status === 'approved' ? '#dcfce7' : a.status === 'rejected' ? '#fef2f2' : '#fef9c3', 
                        color: a.status === 'approved' ? '#16a34a' : a.status === 'rejected' ? '#dc2626' : '#ca8a04', 
                        padding: '4px 10px', 
                        borderRadius: '6px', 
                        fontWeight: '600', 
                        fontSize: '12px',
                        textTransform: 'uppercase'
                      }}>
                        {a.status || 'approved'}
                      </span>
                    </td>
                    <td style={{ padding: '16px 24px' }}>
                      {(!a.status || a.status === 'pending') && (
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button 
                            onClick={() => updateStatus(a.id, 'approved')}
                            style={{ padding: '6px 12px', background: '#10b981', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}
                          >
                            Approve
                          </button>
                          <button 
                            onClick={() => updateStatus(a.id, 'rejected')}
                            style={{ padding: '6px 12px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="6" style={{ padding: '32px', textAlign: 'center', color: '#64748b' }}>
                      {loading ? 'Loading affiliates...' : 'No affiliates added yet.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
