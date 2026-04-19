import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/admin/Sidebar';
import Header from '../../components/admin/Header';
import { supabase } from '../../supabaseClient';

export default function Analytics() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState({ totalUsage: 0, totalRevenue: 0 });

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    setLoading(true);
    const { data: usageData, error } = await supabase
      .from('coupon_usages')
      .select('*, coupons(code, influencer_id, users(name))')
      .order('created_at', { ascending: false });

    if (!error) {
      setData(usageData || []);
      const totalRev = usageData?.reduce((s, i) => s + parseFloat(i.final_amount), 0) || 0;
      setSummary({
        totalUsage: usageData?.length || 0,
        totalRevenue: totalRev
      });
    }
    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <Sidebar />
      <div style={styles.content}>
        <Header title="Analytics & Reports" />
        
        <main style={styles.main}>
          {/* Summary Stats */}
          <div style={styles.statsGrid}>
            <div style={styles.statCard}>
              <p style={styles.statLabel}>Total Coupon Redemptions</p>
              <h3 style={styles.statValue}>{summary.totalUsage}</h3>
            </div>
            <div style={styles.statCard}>
              <p style={styles.statLabel}>Total Revenue via Coupons</p>
              <h3 style={styles.statValue}>₹{summary.totalRevenue.toLocaleString()}</h3>
            </div>
          </div>

          {/* Usage Table */}
          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>Detailed Usage Logs</h2>
            {loading ? (
              <p>Loading analytics...</p>
            ) : (
              <div style={styles.tableWrapper}>
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={styles.th}>Date</th>
                      <th style={styles.th}>Coupon</th>
                      <th style={styles.th}>Influencer</th>
                      <th style={styles.th}>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((item) => (
                      <tr key={item.id} style={styles.tr}>
                        <td style={styles.td}>{new Date(item.created_at).toLocaleDateString()}</td>
                        <td style={{...styles.td, fontWeight: '700'}}>{item.coupons?.code}</td>
                        <td style={styles.td}>{item.coupons?.users?.name || 'General'}</td>
                        <td style={styles.td}>₹{item.final_amount}</td>
                      </tr>
                    ))}
                    {data.length === 0 && (
                      <tr>
                        <td colSpan="4" style={styles.empty}>No usage data recorded yet.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}

const styles = {
  container: { display: 'flex', minHeight: '100vh', background: '#f8fafc' },
  content: { flex: 1, display: 'flex', flexDirection: 'column' },
  main: { padding: '40px', display: 'flex', flexDirection: 'column', gap: '30px' },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px' },
  statCard: { background: 'white', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' },
  statLabel: { fontSize: '14px', fontWeight: '500', color: '#64748b', margin: 0 },
  statValue: { fontSize: '28px', fontWeight: '700', color: '#1e293b', margin: '8px 0 0 0' },
  section: { background: 'white', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' },
  sectionTitle: { fontSize: '18px', fontWeight: '600', color: '#1e293b', marginBottom: '20px' },
  tableWrapper: { overflowX: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse', textAlign: 'left' },
  th: { padding: '12px 16px', borderBottom: '2px solid #f1f5f9', fontSize: '13px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase' },
  tr: { borderBottom: '1px solid #f1f5f9' },
  td: { padding: '16px', fontSize: '14px', color: '#334155' },
  empty: { padding: '40px', textAlign: 'center', color: '#94a3b8' }
};
