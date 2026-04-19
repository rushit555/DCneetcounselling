import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

export default function RecentPurchases() {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPurchases();
  }, []);

  const fetchPurchases = async () => {
    const { data, error } = await supabase
      .from('ebook_users')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5);

    if (!error) {
      setPurchases(data || []);
    }
    setLoading(false);
  };

  if (loading) return <p>Loading purchases...</p>;

  return (
    <div style={styles.container}>
      <table style={styles.table}>
        <thead>
          <tr style={styles.headerRow}>
            <th style={styles.th}>Student</th>
            <th style={styles.th}>Course</th>
            <th style={styles.th}>Amount</th>
            <th style={styles.th}>Status</th>
          </tr>
        </thead>
        <tbody>
          {purchases.map((p) => (
            <tr key={p.id} style={styles.row}>
              <td style={styles.td}>
                <div style={styles.name}>{p.full_name}</div>
                <div style={styles.email}>{p.email}</div>
              </td>
              <td style={styles.td}>{p.course} ({p.quota})</td>
              <td style={styles.td}>₹{p.amount_paid}</td>
              <td style={styles.td}>
                <span style={{
                  ...styles.badge,
                  background: p.payment_status === 'paid' ? '#dcfce7' : '#fee2e2',
                  color: p.payment_status === 'paid' ? '#166534' : '#991b1b'
                }}>
                  {p.payment_status}
                </span>
              </td>
            </tr>
          ))}
          {purchases.length === 0 && (
            <tr>
              <td colSpan="4" style={styles.empty}>No recent purchases found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

const styles = {
  container: {
    overflowX: 'auto'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    textAlign: 'left'
  },
  headerRow: {
    borderBottom: '2px solid #f1f5f9'
  },
  th: {
    padding: '12px 16px',
    fontSize: '13px',
    fontWeight: '600',
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
  },
  row: {
    borderBottom: '1px solid #f1f5f9',
    transition: 'background 0.2s'
  },
  td: {
    padding: '16px',
    fontSize: '14px',
    color: '#334155'
  },
  name: {
    fontWeight: '600',
    color: '#1e293b'
  },
  email: {
    fontSize: '12px',
    color: '#94a3b8'
  },
  badge: {
    padding: '4px 10px',
    borderRadius: '20px',
    fontSize: '11px',
    fontWeight: '700',
    textTransform: 'uppercase'
  },
  empty: {
    padding: '40px',
    textAlign: 'center',
    color: '#94a3b8',
    fontSize: '14px'
  }
};
