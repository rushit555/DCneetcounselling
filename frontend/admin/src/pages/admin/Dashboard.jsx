import { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';
import Sidebar from '../../components/admin/Sidebar';
import Header from '../../components/admin/Header';
import { 
  Users, 
  Ticket, 
  TrendingUp, 
  IndianRupee,
  ArrowRight
} from 'lucide-react';

export default function Dashboard() {
  const [stats, setStats] = useState({
    influencers: 0,
    coupons: 0,
    revenue: 0,
    commission: 0
  });
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      // 1. Total Orders
      const { count: ordersCount } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true });

      // 2. Total Active Coupons
      const { count: couponsCount } = await supabase
        .from('coupons')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true);

      // 3. Totals from orders table
      const { data: ordersData } = await supabase
        .from('orders')
        .select('final_amount, commission, coupon_code, affiliate_ref')
        .eq('status', 'paid');

      let revenue = 0;
      let commission = 0;
      let couponFreq = {};
      let affiliateFreq = {};

      ordersData?.forEach(item => {
        revenue += Number(item.final_amount) || 0;
        commission += Number(item.commission) || 0;
        
        if (item.coupon_code) {
          couponFreq[item.coupon_code] = (couponFreq[item.coupon_code] || 0) + 1;
        }
        if (item.affiliate_ref) {
          affiliateFreq[item.affiliate_ref] = (affiliateFreq[item.affiliate_ref] || 0) + 1;
        }
      });

      let topCoupon = Object.keys(couponFreq).sort((a,b) => couponFreq[b] - couponFreq[a])[0] || 'N/A';
      let topAffiliate = Object.keys(affiliateFreq).sort((a,b) => affiliateFreq[b] - affiliateFreq[a])[0] || 'N/A';

      setStats({ 
        orders: ordersCount || 0, 
        coupons: couponsCount || 0, 
        revenue, 
        commission,
        topCoupon,
        topAffiliate
      });

      // 4. Recent Transactions
      const { data: recent } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      setTransactions(recent || []);
    } catch (err) {
      console.error("Dashboard Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { label: 'Total Revenue', value: '₹' + stats.revenue.toLocaleString('en-IN'), icon: TrendingUp, color: '#8b5cf6' },
    { label: 'Total Orders', value: stats.orders, icon: Users, color: '#3b82f6' },
    { label: 'Total Commission Paid', value: '₹' + stats.commission.toLocaleString('en-IN'), icon: IndianRupee, color: '#f59e0b' },
    { label: 'Active Coupons', value: stats.coupons, icon: Ticket, color: '#10b981' },
    { label: 'Top Affiliate', value: stats.topAffiliate, icon: Users, color: '#eab308' },
    { label: 'Top Coupon', value: stats.topCoupon, icon: Ticket, color: '#ef4444' },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc' }}>
      <Sidebar />
      <div style={{ flex: 1, marginLeft: '260px', padding: '32px' }}>
        <Header title="Admin Dashboard Overview" />

        {/* Stats Grid */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', 
          gap: '24px', 
          marginTop: '32px' 
        }}>
          {statCards.map((card, i) => {
            const Icon = card.icon;
            return (
              <div key={i} className="stat-card" style={{
                background: '#fff',
                padding: '24px',
                borderRadius: '20px',
                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
                display: 'flex',
                alignItems: 'center',
                gap: '20px'
              }}>
                <div style={{ 
                  width: '56px', 
                  height: '56px', 
                  borderRadius: '16px', 
                  background: card.color + '10', 
                  color: card.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Icon size={28} />
                </div>
                <div>
                  <p style={{ fontSize: '14px', color: '#64748b', fontWeight: '500' }}>{card.label}</p>
                  <h3 style={{ fontSize: '24px', fontWeight: '700', color: '#1e293b', marginTop: '2px' }}>{card.value}</h3>
                </div>
              </div>
            );
          })}
        </div>

        {/* Recent Transactions */}
        <div style={{ marginTop: '40px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#1e293b' }}>Recent Coupon Transactions</h2>
            <button 
              onClick={fetchData} 
              style={{ background: 'transparent', border: 'none', color: '#3b82f6', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              Refresh Data <ArrowRight size={16} />
            </button>
          </div>

          <div style={{ 
            background: '#fff', 
            borderRadius: '20px', 
            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
            overflow: 'hidden'
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: '#f1f5f9', borderBottom: '1px solid #e2e8f0' }}>
                  <th style={{ padding: '16px 24px', fontSize: '14px', color: '#475569', fontWeight: '600' }}>User Email</th>
                  <th style={{ padding: '16px 24px', fontSize: '14px', color: '#475569', fontWeight: '600' }}>Coupon Code</th>
                  <th style={{ padding: '16px 24px', fontSize: '14px', color: '#475569', fontWeight: '600' }}>Final Amount</th>
                  <th style={{ padding: '16px 24px', fontSize: '14px', color: '#475569', fontWeight: '600' }}>Commission</th>
                  <th style={{ padding: '16px 24px', fontSize: '14px', color: '#475569', fontWeight: '600' }}>Date</th>
                </tr>
              </thead>
              <tbody>
                {transactions.length > 0 ? transactions.map((t, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '16px 24px', fontSize: '14px', color: '#1e293b' }}>{t.user_email}</td>
                    <td style={{ padding: '16px 24px', fontSize: '14px', color: '#1e293b' }}>
                      <span style={{ background: '#f1f5f9', padding: '4px 10px', borderRadius: '6px', fontWeight: '600', color: '#3b82f6' }}>{t.coupon_code || '—'}</span>
                    </td>
                    <td style={{ padding: '16px 24px', fontSize: '14px', fontWeight: '600', color: '#1e293b' }}>₹{Number(t.final_amount).toLocaleString('en-IN')}</td>
                    <td style={{ padding: '16px 24px', fontSize: '14px', fontWeight: '600', color: '#16a34a' }}>₹{Number(t.commission).toLocaleString('en-IN')}</td>
                    <td style={{ padding: '16px 24px', fontSize: '13px', color: '#64748b' }}>{new Date(t.created_at).toLocaleDateString()}</td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="5" style={{ padding: '32px', textAlign: 'center', color: '#64748b' }}>No transactions found yet.</td>
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
