import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

export default function SummaryCards() {
  const [stats, setStats] = useState({
    users: 0,
    revenue: 0,
    bookings: 0
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    // 1. Total Users
    const { count: userCount } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true });

    // 2. Total Revenue from ebook_users (paid)
    const { data: revenueData } = await supabase
      .from('ebook_users')
      .select('amount_paid')
      .eq('payment_status', 'paid');
    
    const totalRevenue = (revenueData || []).reduce((sum, item) => sum + (item.amount_paid || 0), 0);

    // 3. Total Counselling Bookings
    const { count: bookingCount } = await supabase
      .from('counselling_bookings')
      .select('*', { count: 'exact', head: true });

    setStats({
      users: userCount || 0,
      revenue: totalRevenue || 0,
      bookings: bookingCount || 0
    });
  };

  return (
    <div style={styles.container}>
      <Card title="Total Students" value={stats.users.toLocaleString()} icon="👥" color="#6366f1" />
      <Card title="Total Revenue" value={`₹${stats.revenue.toLocaleString()}`} icon="💰" color="#10b981" />
      <Card title="Counselling Leads" value={stats.bookings.toLocaleString()} icon="🔥" color="#f59e0b" />
    </div>
  );
}

function Card({ title, value, icon, color }) {
  return (
    <div style={styles.card}>
      <div style={{...styles.iconWrapper, background: `${color}15`, color: color}}>
        {icon}
      </div>
      <div>
        <p style={styles.cardTitle}>{title}</p>
        <h3 style={styles.cardValue}>{value}</h3>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '24px'
  },
  card: {
    background: 'white',
    padding: '24px',
    borderRadius: '16px',
    border: '1px solid #e2e8f0',
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
  },
  iconWrapper: {
    width: '56px',
    height: '56px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '24px'
  },
  cardTitle: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#64748b',
    margin: 0
  },
  cardValue: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#1e293b',
    margin: '4px 0 0 0'
  }
};
