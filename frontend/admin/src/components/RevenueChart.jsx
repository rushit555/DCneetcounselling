import React from 'react';

export default function RevenueChart() {
  // Mock data for visual representation
  const data = [
    { month: 'Jan', value: 45 },
    { month: 'Feb', value: 65 },
    { month: 'Mar', value: 85 },
    { month: 'Apr', value: 55 },
    { month: 'May', value: 70 },
    { month: 'Jun', value: 95 }
  ];

  return (
    <div style={styles.container}>
      <div style={styles.chartArea}>
        {data.map((item, i) => (
          <div key={i} style={styles.barWrapper}>
            <div style={{...styles.bar, height: `${item.value}%`}}>
              <div style={styles.tooltip}>₹{item.value}k</div>
            </div>
            <span style={styles.label}>{item.month}</span>
          </div>
        ))}
      </div>
      
      <div style={styles.legend}>
        <div style={styles.legendItem}>
          <div style={{...styles.dot, background: '#6366f1'}}></div>
          <span>Monthly Revenue (Estimated)</span>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    height: '240px',
    display: 'flex',
    flexDirection: 'column'
  },
  chartArea: {
    flex: 1,
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    padding: '20px 10px',
    gap: '12px'
  },
  barWrapper: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px',
    height: '100%'
  },
  bar: {
    width: '100%',
    maxWidth: '32px',
    background: 'linear-gradient(to top, #6366f1, #a855f7)',
    borderRadius: '6px 6px 4px 4px',
    position: 'relative',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    '--tooltip-opacity': 0
  },
  label: {
    fontSize: '12px',
    color: '#94a3b8',
    fontWeight: '500'
  },
  tooltip: {
    position: 'absolute',
    top: '-35px',
    left: '50%',
    transform: 'translateX(-50%)',
    background: '#1e293b',
    color: 'white',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '10px',
    opacity: 0,
    transition: 'opacity 0.2s',
    pointerEvents: 'none',
    whiteSpace: 'nowrap'
  },
  legend: {
    marginTop: 'auto',
    paddingTop: '12px',
    borderTop: '1px solid #f1f5f9'
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '12px',
    color: '#64748b'
  },
  dot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%'
  }
};
