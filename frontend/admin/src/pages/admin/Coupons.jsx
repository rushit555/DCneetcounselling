import { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import Sidebar from '../../components/admin/Sidebar';
import Header from '../../components/admin/Header';
import { TicketPlus, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function Coupons() {
  const [code, setCode] = useState('');
  const [discountValue, setDiscountValue] = useState('');
  const [discountType, setDiscountType] = useState('percentage');
  const [affiliateRef, setAffiliateRef] = useState('');
  const [usageLimit, setUsageLimit] = useState(100);
  const [affiliates, setAffiliates] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setFetchLoading(true);
      
      // Fetch Affiliates
      const { data: affs } = await supabase
        .from('affiliates')
        .select('ref_code, name, email');
      
      setAffiliates(affs || []);

      // Fetch existing coupons
      const { data: cups } = await supabase
        .from('coupons')
        .select('*')
        .order('created_at', { ascending: false });
      
      setCoupons(cups || []);
    } catch (err) {
      console.error(err);
    } finally {
      setFetchLoading(false);
    }
  };

  const createCoupon = async (e) => {
    e.preventDefault();
    if (!code || !discountValue) return alert('Please fill required fields');

    try {
      setLoading(true);
      const { error } = await supabase.from('coupons').insert({
        code: code.trim().toUpperCase(),
        type: discountType,
        value: Number(discountValue),
        affiliate_ref: affiliateRef || null,
        usage_limit: Number(usageLimit),
        is_active: true
      });

      if (error) {
        throw error;
      }

      alert('Coupon created successfully!');
      setCode('');
      setDiscountValue('');
      setAffiliateRef('');
      setUsageLimit(100);
      fetchData();
    } catch (err) {
      alert(err.message || 'Error creating coupon');
    } finally {
      setLoading(false);
    }
  };

  const toggleCouponStatus = async (id, currentStatus) => {
    try {
      const { error } = await supabase
        .from('coupons')
        .update({ is_active: !currentStatus })
        .eq('id', id);
      
      if (error) throw error;
      fetchData();
    } catch (err) {
      alert('Error updating status');
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc' }}>
      <Sidebar />
      <div style={{ flex: 1, marginLeft: '260px', padding: '32px' }}>
        <Header title="Coupon Management" />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '32px', marginTop: '32px' }}>
          
          {/* Create Coupon Card */}
          <div style={{ 
            background: '#fff', 
            padding: '32px', 
            borderRadius: '24px', 
            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
            border: '1px solid #e2e8f0',
            height: 'fit-content'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
              <div style={{ padding: '10px', background: '#10b98110', color: '#10b981', borderRadius: '12px' }}>
                <TicketPlus size={24} />
              </div>
              <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#1e293b' }}>Create New Coupon</h2>
            </div>

            <form onSubmit={createCoupon}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#64748b', marginBottom: '8px' }}>Assign Affiliate (Optional)</label>
                <select 
                  value={affiliateRef}
                  onChange={(e) => setAffiliateRef(e.target.value)}
                  style={{ 
                    width: '100%', 
                    padding: '12px 16px', 
                    borderRadius: '12px', 
                    border: '1px solid #e2e8f0',
                    outline: 'none',
                    fontSize: '14px',
                    background: '#fff'
                  }}
                >
                  <option value="">None</option>
                  {affiliates.map(aff => (
                    <option key={aff.ref_code} value={aff.ref_code}>{aff.name} ({aff.ref_code})</option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#64748b', marginBottom: '8px' }}>Coupon Code</label>
                <input 
                  placeholder='e.g. SAVE20' 
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
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

              <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#64748b', marginBottom: '8px' }}>Discount Value</label>
                  <input 
                    type="number"
                    placeholder='10' 
                    value={discountValue}
                    onChange={(e) => setDiscountValue(e.target.value)}
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
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#64748b', marginBottom: '8px' }}>Type</label>
                  <select 
                    value={discountType}
                    onChange={(e) => setDiscountType(e.target.value)}
                    style={{ 
                      width: '100%', 
                      padding: '12px 16px', 
                      borderRadius: '12px', 
                      border: '1px solid #e2e8f0',
                      outline: 'none',
                      fontSize: '14px',
                      background: '#fff'
                    }}
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="flat">Flat (₹)</option>
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#64748b', marginBottom: '8px' }}>Usage Limit</label>
                <input 
                  type="number"
                  placeholder='100' 
                  value={usageLimit}
                  onChange={(e) => setUsageLimit(e.target.value)}
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

              <button 
                type="submit"
                disabled={loading}
                style={{ 
                  width: '100%',
                  background: '#10b981', 
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
                {loading ? 'Creating...' : 'Generate Coupon'}
              </button>
            </form>
          </div>

          {/* Existing Coupons List */}
          <div style={{ 
            background: '#fff', 
            borderRadius: '24px', 
            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
            overflow: 'hidden',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{ padding: '24px', borderBottom: '1px solid #f1f5f9' }}>
              <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#1e293b' }}>Active Coupons</h2>
            </div>
            
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                  <th style={{ padding: '16px 24px', fontSize: '13px', color: '#475569', fontWeight: '600' }}>Code</th>
                  <th style={{ padding: '16px 24px', fontSize: '13px', color: '#475569', fontWeight: '600' }}>Discount</th>
                  <th style={{ padding: '16px 24px', fontSize: '13px', color: '#475569', fontWeight: '600' }}>Affiliate Ref</th>
                  <th style={{ padding: '16px 24px', fontSize: '13px', color: '#475569', fontWeight: '600' }}>Usage</th>
                  <th style={{ padding: '16px 24px', fontSize: '13px', color: '#475569', fontWeight: '600' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {coupons.length > 0 ? coupons.map((c, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #f8fafc' }}>
                    <td style={{ padding: '16px 24px' }}>
                      <span style={{ background: '#10b98110', color: '#059669', padding: '6px 12px', borderRadius: '8px', fontWeight: '700', fontSize: '14px' }}>
                        {c.code}
                      </span>
                    </td>
                    <td style={{ padding: '16px 24px', fontSize: '14px', color: '#1e293b' }}>
                      {c.value}{c.type === 'percentage' ? '%' : '₹'} off
                    </td>
                    <td style={{ padding: '16px 24px', fontSize: '14px', color: '#1e293b' }}>
                      {c.affiliate_ref || '—'}
                    </td>
                    <td style={{ padding: '16px 24px', fontSize: '14px', color: '#1e293b' }}>
                      {c.used_count} / {c.usage_limit || '∞'}
                    </td>
                    <td style={{ padding: '16px 24px' }}>
                      <button 
                        onClick={() => toggleCouponStatus(c.id, c.is_active)}
                        style={{ 
                          border: 'none',
                          padding: '6px 12px',
                          borderRadius: '20px',
                          fontSize: '12px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          background: c.is_active ? '#ecfdf5' : '#fef2f2',
                          color: c.is_active ? '#059669' : '#dc2626'
                        }}
                      >
                        {c.is_active ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
                        {c.is_active ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="5" style={{ padding: '32px', textAlign: 'center', color: '#64748b' }}>
                      {fetchLoading ? 'Loading coupons...' : 'No coupons generated yet.'}
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
