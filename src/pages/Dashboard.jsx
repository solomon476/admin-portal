import React from 'react';
import { useAdmin } from '../context/AdminContext';
import { GraduationCap, Presentation, AlertTriangle, BookOpen, Zap, Users, CircleDollarSign, Settings as SettingsIcon, ClipboardList } from 'lucide-react';

function MetricCard({ label, value, icon, colorClass, change }) {
  return (
    <div className={`metric-card ${colorClass}`}>
      <div className="metric-icon" style={{ background: 'var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span>{icon}</span>
      </div>
      <div className="metric-value">{value ?? <span className="skeleton" style={{ width: 60, height: 28, display: 'inline-block' }} />}</div>
      <div className="metric-label">{label}</div>
      {change && <div className="metric-change">{change}</div>}
    </div>
  );
}

export default function Dashboard() {
  const { t, metrics, activity, pushActivity } = useAdmin();

  const handleQuickNav = (path) => {
    window.history.pushState({}, '', path);
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  return (
    <div>
      <div className="page-header">
        <h1>{t('dashboard')}</h1>
        <p>School-wide overview and quick actions</p>
      </div>

      {/* Metrics */}
      <div className="metrics-grid">
        <MetricCard label={t('totalStudents')} value={metrics.totalStudents} icon={<GraduationCap size={20} />} colorClass="indigo" change="+2 this term" />
        <MetricCard label={t('totalTeachers')} value={metrics.totalTeachers} icon={<Presentation size={20} />} colorClass="green" />
        <MetricCard label={t('pendingFees')} value={`KES ${metrics.pendingFees.toLocaleString()}`} icon={<AlertTriangle size={20} />} colorClass="yellow" />
        <MetricCard label={t('activeClasses')} value={metrics.activeClasses} icon={<BookOpen size={20} />} colorClass="blue" />
      </div>

      {/* Quick Actions */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-header">
          <div>
            <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Zap size={18} /> {t('quickActions')}</div>
          </div>
        </div>
        <div className="quick-actions">
          {[
            { label: t('manageUsers'), path: '/users', icon: <Users size={16} /> },
            { label: t('setupClasses'), path: '/classes', icon: <BookOpen size={16} /> },
            { label: t('viewFinance'), path: '/finance', icon: <CircleDollarSign size={16} /> },
            { label: t('systemSettings'), path: '/settings', icon: <SettingsIcon size={16} /> },
          ].map(a => (
            <button key={a.path} className="quick-btn" onClick={() => handleQuickNav(a.path)}>
              <span style={{ display: 'flex', alignItems: 'center' }}>{a.icon}</span> {a.label}
            </button>
          ))}
        </div>
      </div>

      {/* Activity log */}
      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 6 }}><ClipboardList size={18} /> {t('recentActivity')}</div>
            <div className="card-subtitle">Live system events</div>
          </div>
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => pushActivity('Admin Super', 'viewed dashboard', '')}
          >
            Refresh
          </button>
        </div>
        <div className="activity-list">
          {activity.length === 0 && (
            <div className="empty"><p>No recent activity.</p></div>
          )}
          {activity.map(a => (
            <div key={a.id} className="activity-item">
              <div className="activity-dot" style={{ background: a.color }} />
              <div className="activity-text">
                <strong>{a.user}</strong> {a.action}
                {a.detail && <> — <em>{a.detail}</em></>}
              </div>
              <div className="activity-time">{a.time}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
