import React, { useState, useEffect } from 'react';
import { useAdmin } from '../../context/AdminContext';
import AIAssistant from '../AIAssistant';
import SomoBloomLogo from './SomoBloomLogo';

import { LayoutDashboard, Users, BookOpen, CircleDollarSign, Settings as SettingsIcon, School, Menu } from 'lucide-react';

const navItems = [
  { path: '/', label: 'dashboard', icon: <LayoutDashboard size={20} />, section: 'main' },
  { path: '/users', label: 'users', icon: <Users size={20} />, section: 'main' },
  { path: '/classes', label: 'classes', icon: <BookOpen size={20} />, section: 'main' },
  { path: '/finance', label: 'finance', icon: <CircleDollarSign size={20} />, section: 'main' },
  { path: '/settings', label: 'settings', icon: <SettingsIcon size={20} />, section: 'system' },
];

export default function Layout({ children }) {
  const { t, currentAdmin, config, updateConfig } = useAdmin();
  const [activePath, setActivePath] = useState('/');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
    setIsMobileMenuOpen(false);
    // Push state without full reload
    window.history.pushState({}, '', path);
    // Trigger a popstate-like update for Routes
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  return (
    <div className="layout">
      {/* Mobile Overlay */}
      <div 
        className={`mobile-overlay ${isMobileMenuOpen ? 'open' : ''}`} 
        onClick={() => setIsMobileMenuOpen(false)}
      ></div>

      {/* Sidebar */}
      <aside className={`sidebar ${isMobileMenuOpen ? 'open' : ''}`}>
        <div className="sidebar-logo" style={{ padding: '24px 20px', borderBottom: '1px solid var(--border)' }}>
          <SomoBloomLogo size={36} fontSize="17px" />
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
              <span style={{ display: 'flex', alignItems: 'center' }}>{item.icon}</span>
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
              <span style={{ display: 'flex', alignItems: 'center' }}>{item.icon}</span>
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
          <div className="topbar-left">
            <button className="menu-btn" onClick={() => setIsMobileMenuOpen(true)}>
              <Menu size={24} />
            </button>
            <div className="topbar-title">{titleMap[activePath] || 'Admin Portal'}</div>
          </div>
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
