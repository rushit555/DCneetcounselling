import { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';
import Sidebar from '../../components/admin/Sidebar';
import Header from '../../components/admin/Header';
import {
  TrendingUp,
  ShoppingBag,
  IndianRupee,
  Tag,
  Star,
  Zap,
  RefreshCw,
  ArrowUpRight
} from 'lucide-react';

// ── Helpers ──────────────────────────────────────────────
function fmt(n) {
  return Number(n || 0).toLocaleString('en-IN');
}

function StatusBadge({ status }) {
  const map = {
    paid:      { bg: '#e6f9f0', color: '#16a34a', label: 'Paid' },
    pending:   { bg: '#fff4e5', color: '#d97706', label: 'Pending' },
    cancelled: { bg: '#fef2f2', color: '#ef4444', label: 'Cancelled' },
  };
  const s = map[status] || map.pending;
  return (
    <span style={{
      background: s.bg, color: s.color,
      padding: '3px 10px', borderRadius: '6px',
      fontSize: '11px', fontWeight: '700',
      textTransform: 'uppercase', letterSpacing: '0.5px',
      display: 'inline-block'
    }}>
      {s.label}
    </span>
  );
}

// ── Skeleton loader ───────────────────────────────────────
function Skeleton({ w = '100%', h = '16px', r = '8px' }) {
  return (
    <div style={{
      width: w, height: h, borderRadius: r,
      background: 'linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%)',
      backgroundSize: '200% 100%',
      animation: 'shimmer 1.5s infinite',
    }} />
  );
}

// ── Stat Card ─────────────────────────────────────────────
function StatCard({ label, value, icon: Icon, gradient, loading, delay = 0 }) {
  return (
    <div className="stat-card" style={{
      background: 'white',
      padding: '22px 20px',
      borderRadius: '16px',
      boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
      border: '1px solid rgba(0,0,0,0.04)',
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      animationDelay: `${delay}ms`
    }}>
      <div style={{
        width: '52px', height: '52px', borderRadius: '14px',
        background: gradient,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
        boxShadow: '0 4px 14px rgba(0,0,0,0.1)'
      }}>
        <Icon size={22} color="white" strokeWidth={2} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: '11px', fontWeight: '600', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '6px' }}>
          {label}
        </div>
        {loading
          ? <Skeleton w="80px" h="28px" r="6px" />
          : <div style={{ fontSize: '24px', fontWeight: '800', color: '#0f172a', lineHeight: 1, letterSpacing: '-0.5px' }}>
              {value}
            </div>
        }
      </div>
    </div>
  );
}

// ── Main ─────────────────────────────────────────────────
export default function Dashboard() {
  const [stats, setStats] = useState({
    orders: 0, coupons: 0, revenue: 0, commission: 0,
    topCoupon: null, topAffiliate: null
  });
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true); else setLoading(true);
    try {
      // Counts
      const [{ count: ordersCount }, { count: couponsCount }] = await Promise.all([
        supabase.from('orders').select('*', { count: 'exact', head: true }),
        supabase.from('coupons').select('*', { count: 'exact', head: true }).eq('is_active', true),
      ]);

      // Aggregates from paid orders
      const { data: ordersData } = await supabase
        .from('orders')
        .select('final_amount, commission, coupon_code, affiliate_ref')
        .eq('status', 'paid');

      let revenue = 0, commission = 0;
      const couponFreq = {}, affiliateFreq = {};

      ordersData?.forEach(item => {
        revenue    += Number(item.final_amount) || 0;
        commission += Number(item.commission)   || 0;
        if (item.coupon_code)   couponFreq[item.coupon_code]     = (couponFreq[item.coupon_code]     || 0) + 1;
        if (item.affiliate_ref) affiliateFreq[item.affiliate_ref] = (affiliateFreq[item.affiliate_ref] || 0) + 1;
      });

      const topCoupon    = Object.keys(couponFreq).sort((a, b) => couponFreq[b] - couponFreq[a])[0] || null;
      const topAffiliate = Object.keys(affiliateFreq).sort((a, b) => affiliateFreq[b] - affiliateFreq[a])[0] || null;

      setStats({ orders: ordersCount || 0, coupons: couponsCount || 0, revenue, commission, topCoupon, topAffiliate });

      // Recent transactions
      const { data: recent } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      setTransactions(recent || []);
    } catch (err) {
      console.error('Dashboard fetch error:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const statCards = [
    { label: 'Total Revenue',      value: '₹' + fmt(stats.revenue),    icon: TrendingUp,  gradient: 'linear-gradient(135deg,#6366f1,#8b5cf6)', delay: 0   },
    { label: 'Total Orders',       value: stats.orders,                  icon: ShoppingBag, gradient: 'linear-gradient(135deg,#3b82f6,#0ea5e9)',  delay: 60  },
    { label: 'Commission Paid',    value: '₹' + fmt(stats.commission),  icon: IndianRupee, gradient: 'linear-gradient(135deg,#f59e0b,#f97316)',  delay: 120 },
    { label: 'Active Coupons',     value: stats.coupons,                 icon: Tag,         gradient: 'linear-gradient(135deg,#10b981,#059669)',  delay: 180 },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f1f5f9' }}>
      <Sidebar />

      <div style={{ flex: 1, marginLeft: '240px', display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Header title="Admin Dashboard" subtitle="Your marketing suite overview" />

        <main style={{ flex: 1, padding: '28px 32px' }}>

          {/* ── Stat Cards ── */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '20px',
            marginBottom: '28px'
          }}>
            {statCards.map((c, i) => (
              <StatCard key={i} {...c} loading={loading} />
            ))}
          </div>

          {/* ── Top Performers Row ── */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '28px' }}>
            {/* Top Affiliate */}
            <div style={{
              background: 'white', borderRadius: '16px', padding: '20px 22px',
              boxShadow: '0 2px 12px rgba(0,0,0,0.05)', border: '1px solid rgba(0,0,0,0.04)',
              display: 'flex', alignItems: 'center', gap: '14px'
            }}>
              <div style={{
                width: '46px', height: '46px', borderRadius: '12px',
                background: 'linear-gradient(135deg,#fbbf24,#f59e0b)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(245,158,11,0.25)', flexShrink: 0
              }}>
                <Star size={20} color="white" strokeWidth={2} />
              </div>
              <div>
                <div style={{ fontSize: '11px', fontWeight: '600', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '4px' }}>
                  Top Affiliate
                </div>
                {loading
                  ? <Skeleton w="100px" h="22px" r="5px" />
                  : stats.topAffiliate
                    ? <div style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.3px' }}>{stats.topAffiliate}</div>
                    : <div style={{ fontSize: '14px', color: '#94a3b8', fontStyle: 'italic' }}>No data yet</div>
                }
                {!loading && stats.topAffiliate && (
                  <div style={{ fontSize: '12px', color: '#f59e0b', fontWeight: '600', marginTop: '2px' }}>
                    Most conversions
                  </div>
                )}
              </div>
            </div>

            {/* Top Coupon */}
            <div style={{
              background: 'white', borderRadius: '16px', padding: '20px 22px',
              boxShadow: '0 2px 12px rgba(0,0,0,0.05)', border: '1px solid rgba(0,0,0,0.04)',
              display: 'flex', alignItems: 'center', gap: '14px'
            }}>
              <div style={{
                width: '46px', height: '46px', borderRadius: '12px',
                background: 'linear-gradient(135deg,#ef4444,#dc2626)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(239,68,68,0.25)', flexShrink: 0
              }}>
                <Zap size={20} color="white" strokeWidth={2} />
              </div>
              <div>
                <div style={{ fontSize: '11px', fontWeight: '600', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '4px' }}>
                  Top Coupon
                </div>
                {loading
                  ? <Skeleton w="100px" h="22px" r="5px" />
                  : stats.topCoupon
                    ? <div style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a', fontFamily: 'monospace', letterSpacing: '1px' }}>{stats.topCoupon}</div>
                    : <div style={{ fontSize: '14px', color: '#94a3b8', fontStyle: 'italic' }}>No data yet</div>
                }
                {!loading && stats.topCoupon && (
                  <div style={{ fontSize: '12px', color: '#ef4444', fontWeight: '600', marginTop: '2px' }}>
                    Most used coupon
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ── Recent Transactions ── */}
          <div style={{
            background: 'white', borderRadius: '16px',
            boxShadow: '0 2px 12px rgba(0,0,0,0.05)', border: '1px solid rgba(0,0,0,0.04)',
            overflow: 'hidden'
          }}>
            {/* Table Header */}
            <div style={{
              padding: '18px 24px', borderBottom: '1px solid #f1f5f9',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center'
            }}>
              <div>
                <h2 style={{ fontSize: '15px', fontWeight: '700', color: '#0f172a' }}>
                  Recent Transactions
                </h2>
                <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>
                  Latest 10 affiliate orders
                </p>
              </div>
              <button
                onClick={() => fetchData(true)}
                disabled={refreshing}
                style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  padding: '8px 16px', borderRadius: '10px',
                  background: '#f8fafc', border: '1px solid #e2e8f0',
                  color: '#475569', fontSize: '13px', fontWeight: '600',
                  cursor: 'pointer', transition: '0.18s'
                }}
                onMouseEnter={e => { e.currentTarget.style.background = '#f1f5f9'; }}
                onMouseLeave={e => { e.currentTarget.style.background = '#f8fafc'; }}
              >
                <RefreshCw size={14} style={{ animation: refreshing ? 'spin 0.8s linear infinite' : 'none' }} />
                {refreshing ? 'Refreshing…' : 'Refresh'}
              </button>
            </div>

            {/* Table */}
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr>
                    {['User Email', 'Coupon Code', 'Affiliate', 'Amount', 'Commission', 'Status', 'Date'].map(h => (
                      <th key={h} style={{
                        padding: '12px 20px',
                        fontSize: '11px', fontWeight: '700', color: '#64748b',
                        background: '#f9fafc', borderBottom: '1px solid #e2e8f0',
                        textTransform: 'uppercase', letterSpacing: '0.6px',
                        whiteSpace: 'nowrap'
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <tr key={i}>
                        {Array.from({ length: 7 }).map((_, j) => (
                          <td key={j} style={{ padding: '16px 20px' }}>
                            <Skeleton w={j === 0 ? '140px' : j === 3 || j === 4 ? '70px' : '80px'} h="14px" />
                          </td>
                        ))}
                      </tr>
                    ))
                  ) : transactions.length > 0 ? (
                    transactions.map((t, i) => (
                      <tr key={i} className="data-row" style={{ borderBottom: '1px solid #f8fafc' }}>
                        <td style={{ padding: '14px 20px', fontSize: '13px', color: '#475569', maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {t.user_email || <span style={{ color: '#cbd5e1' }}>—</span>}
                        </td>
                        <td style={{ padding: '14px 20px' }}>
                          {t.coupon_code
                            ? <span style={{ background: '#eff6ff', color: '#3b82f6', padding: '3px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: '700', letterSpacing: '0.5px' }}>{t.coupon_code}</span>
                            : <span style={{ color: '#cbd5e1', fontSize: '13px' }}>—</span>
                          }
                        </td>
                        <td style={{ padding: '14px 20px', fontSize: '13px', color: '#64748b' }}>
                          {t.affiliate_ref
                            ? <span style={{ background: '#f5f3ff', color: '#7c3aed', padding: '3px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: '600' }}>{t.affiliate_ref}</span>
                            : <span style={{ color: '#cbd5e1' }}>—</span>
                          }
                        </td>
                        <td style={{ padding: '14px 20px', fontSize: '14px', fontWeight: '700', color: '#0f172a' }}>
                          ₹{fmt(t.final_amount)}
                        </td>
                        <td style={{ padding: '14px 20px', fontSize: '14px', fontWeight: '700', color: '#16a34a' }}>
                          ₹{fmt(t.commission)}
                        </td>
                        <td style={{ padding: '14px 20px' }}>
                          <StatusBadge status={t.status} />
                        </td>
                        <td style={{ padding: '14px 20px', fontSize: '12px', color: '#94a3b8', whiteSpace: 'nowrap' }}>
                          {new Date(t.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" style={{ padding: '52px', textAlign: 'center' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', color: '#94a3b8' }}>
                          <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <ShoppingBag size={24} />
                          </div>
                          <div>
                            <div style={{ fontWeight: '600', color: '#475569', fontSize: '14px' }}>No transactions yet</div>
                            <div style={{ fontSize: '13px', marginTop: '4px' }}>Orders will appear here once affiliates make sales</div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </main>
      </div>

      {/* Shimmer animation */}
      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
    </div>
  );
}
