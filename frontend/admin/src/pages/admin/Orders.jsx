import { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import Sidebar from '../../components/admin/Sidebar';
import Header from '../../components/admin/Header';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc' }}>
      <Sidebar />
      <div style={{ flex: 1, marginLeft: '260px', padding: '32px' }}>
        <Header title="Orders Management" />

        <div style={{ 
          background: '#fff', 
          borderRadius: '24px', 
          boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
          overflow: 'hidden',
          border: '1px solid #e2e8f0',
          marginTop: '32px'
        }}>
          <div style={{ padding: '24px', borderBottom: '1px solid #f1f5f9' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#1e293b' }}>All Orders</h2>
          </div>
          
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '900px' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                  <th style={{ padding: '16px 24px', fontSize: '13px', color: '#475569', fontWeight: '600' }}>Order ID</th>
                  <th style={{ padding: '16px 24px', fontSize: '13px', color: '#475569', fontWeight: '600' }}>Email</th>
                  <th style={{ padding: '16px 24px', fontSize: '13px', color: '#475569', fontWeight: '600' }}>Amount</th>
                  <th style={{ padding: '16px 24px', fontSize: '13px', color: '#475569', fontWeight: '600' }}>Discount</th>
                  <th style={{ padding: '16px 24px', fontSize: '13px', color: '#475569', fontWeight: '600' }}>Final Amount</th>
                  <th style={{ padding: '16px 24px', fontSize: '13px', color: '#475569', fontWeight: '600' }}>Coupon</th>
                  <th style={{ padding: '16px 24px', fontSize: '13px', color: '#475569', fontWeight: '600' }}>Affiliate</th>
                  <th style={{ padding: '16px 24px', fontSize: '13px', color: '#475569', fontWeight: '600' }}>Commission</th>
                  <th style={{ padding: '16px 24px', fontSize: '13px', color: '#475569', fontWeight: '600' }}>Status</th>
                  <th style={{ padding: '16px 24px', fontSize: '13px', color: '#475569', fontWeight: '600' }}>Date</th>
                </tr>
              </thead>
              <tbody>
                {orders.length > 0 ? orders.map((o) => (
                  <tr key={o.id} style={{ borderBottom: '1px solid #f8fafc' }}>
                    <td style={{ padding: '16px 24px', fontSize: '13px', color: '#64748b' }}>{o.id.split('-')[0]}...</td>
                    <td style={{ padding: '16px 24px', fontSize: '14px', color: '#1e293b', fontWeight: '500' }}>{o.user_email || o.email}</td>
                    <td style={{ padding: '16px 24px', fontSize: '14px', color: '#1e293b' }}>₹{Number(o.amount || o.amount_paid || 0).toLocaleString('en-IN')}</td>
                    <td style={{ padding: '16px 24px', fontSize: '14px', color: '#ef4444' }}>₹{Number(o.discount || 0).toLocaleString('en-IN')}</td>
                    <td style={{ padding: '16px 24px', fontSize: '14px', color: '#1e293b', fontWeight: '600' }}>₹{Number(o.final_amount || o.amount_paid || 0).toLocaleString('en-IN')}</td>
                    <td style={{ padding: '16px 24px' }}>
                      <span style={{ background: '#f1f5f9', padding: '4px 10px', borderRadius: '6px', fontWeight: '600', color: '#3b82f6', fontSize: '13px' }}>
                        {o.coupon_code || '—'}
                      </span>
                    </td>
                    <td style={{ padding: '16px 24px', fontSize: '14px', color: '#64748b' }}>{o.affiliate_ref || '—'}</td>
                    <td style={{ padding: '16px 24px', fontSize: '14px', color: '#10b981', fontWeight: '600' }}>₹{Number(o.commission || 0).toLocaleString('en-IN')}</td>
                    <td style={{ padding: '16px 24px' }}>
                      <span style={{ 
                        background: o.status === 'paid' ? '#ecfdf5' : '#fff7ed', 
                        color: o.status === 'paid' ? '#059669' : '#ea580c', 
                        padding: '4px 10px', 
                        borderRadius: '6px', 
                        fontWeight: '600', 
                        fontSize: '12px',
                        textTransform: 'uppercase'
                      }}>
                        {o.status || o.payment_status}
                      </span>
                    </td>
                    <td style={{ padding: '16px 24px', fontSize: '13px', color: '#64748b' }}>{new Date(o.created_at).toLocaleDateString()}</td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="10" style={{ padding: '32px', textAlign: 'center', color: '#64748b' }}>
                      {loading ? 'Loading orders...' : 'No orders found.'}
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
