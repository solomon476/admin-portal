import React, { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import AIAssistant from '../AIAssistant';

const navItems = [
  { path: '/', label: 'dashboard', icon: '⊞', section: 'main' },
  { path: '/users', label: 'users', icon: '👥', section: 'main' },
  { path: '/classes', label: 'classes', icon: '📚', section: 'main' },
  { path: '/finance', label: 'finance', icon: '💰', section: 'main' },
  { path: '/settings', label: 'settings', icon: '⚙️', section: 'system' },
];

export default function Layout({ children }) {
  const { t, currentAdmin, config, updateConfig } = useAdmin();
  const [activePath, setActivePath] = useState('/');

  // derive page title from active path
  const titleMap = {
    '/': t('dashboard'),
    '/users': t('users'),
    '/classes': t('classes'),
    '/finance': t('finance'),
    '/settings': t('settings'),
  };

  const handleNav = (path) => {
    setActivePath(path);
    // Push state without full reload
    window.history.pushState({}, '', path);
    // Trigger a popstate-like update for Routes
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  return (
    <div className="layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="logo-icon">🏫</div>
          <span>EduPortal Admin</span>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section-label">Main</div>
          {navItems.filter(i => i.section === 'main').map(item => (
            <a
              key={item.path}
              className={`nav-item ${activePath === item.path ? 'active' : ''}`}
              onClick={() => handleNav(item.path)}
              href="#"
            >
              <span style={{ fontSize: 16 }}>{item.icon}</span>
              {t(item.label)}
            </a>
          ))}

          <div className="nav-section-label" style={{ marginTop: 16 }}>System</div>
          {navItems.filter(i => i.section === 'system').map(item => (
            <a
              key={item.path}
              className={`nav-item ${activePath === item.path ? 'active' : ''}`}
              onClick={() => handleNav(item.path)}
              href="#"
            >
              <span style={{ fontSize: 16 }}>{item.icon}</span>
              {t(item.label)}
            </a>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="admin-badge">
            <div className="admin-avatar">
              {currentAdmin?.avatar || 'A'}
            </div>
            <div className="admin-info">
              <div className="name">{currentAdmin?.name}</div>
              <div className="role">Administrator</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="main-wrap">
        <header className="topbar">
          <div className="topbar-title">{titleMap[activePath] || 'Admin Portal'}</div>
          <div className="topbar-actions">
            <div className="lang-switcher">
              <button
                className={`lang-btn ${config.language === 'en' ? 'active' : ''}`}
                onClick={() => updateConfig({ language: 'en' })}
              >EN</button>
              <button
                className={`lang-btn ${config.language === 'sw' ? 'active' : ''}`}
                onClick={() => updateConfig({ language: 'sw' })}
              >SW</button>
            </div>
          </div>
        </header>

        <main className="page-content">
          {children}
        </main>
      </div>
      
      {/* AI Assistant Floating Button */}
      <AIAssistant />
    </div>
  );
}
