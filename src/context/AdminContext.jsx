import React, { createContext, useContext, useState, useCallback } from 'react';
import {
  mockUsers, mockClasses, mockPayments,
  mockActivity, mockAuditLog, defaultConfig, translations
} from '../data/mockData';

const AdminContext = createContext(null);

export function AdminProvider({ children }) {
  const [users, setUsers] = useState(mockUsers);
  const [classes, setClasses] = useState(mockClasses);
  const [payments] = useState(mockPayments);
  const [activity, setActivity] = useState(mockActivity);
  const [auditLog, setAuditLog] = useState(mockAuditLog);
  const [config, setConfig] = useState(defaultConfig);
  const [currentAdmin] = useState(mockUsers.find(u => u.role === 'admin'));

  const t = useCallback((key) => {
    return translations[config.language]?.[key] || translations.en[key] || key;
  }, [config.language]);

  // ── User actions ──────────────────────────────────────
  const addUser = (user) => {
    const newUser = { ...user, id: `u${Date.now()}`, joined: new Date().toISOString().split('T')[0], status: 'active' };
    setUsers(prev => [newUser, ...prev]);
    pushActivity('Admin Super', 'added user', `${newUser.name} (${newUser.role})`);
    pushAudit(`Added new user ${newUser.name} (${newUser.role})`);
  };

  const updateUser = (id, patch) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, ...patch } : u));
    pushAudit(`Updated user ${patch.name || id}`);
  };

  const deactivateUser = (id) => {
    const u = users.find(x => x.id === id);
    setUsers(prev => prev.map(x => x.id === id ? { ...x, status: x.status === 'active' ? 'inactive' : 'active' } : x));
    pushAudit(`${u?.status === 'active' ? 'Deactivated' : 'Activated'} user ${u?.name}`);
  };

  const deleteUser = (id) => {
    const u = users.find(x => x.id === id);
    setUsers(prev => prev.filter(x => x.id !== id));
    pushAudit(`Deleted user ${u?.name}`);
  };

  // ── Class actions ─────────────────────────────────────
  const addClass = (cls) => {
    const newCls = { ...cls, id: `c${Date.now()}`, students: [], status: 'active' };
    setClasses(prev => [newCls, ...prev]);
    pushAudit(`Created class "${newCls.name}"`);
  };

  const updateClass = (id, patch) => {
    setClasses(prev => prev.map(c => c.id === id ? { ...c, ...patch } : c));
    pushAudit(`Updated class "${patch.name || id}"`);
  };

  const enrollStudent = (classId, studentId) => {
    setClasses(prev => prev.map(c => {
      if (c.id !== classId) return c;
      if (c.students.includes(studentId)) return c; // prevent duplicate
      return { ...c, students: [...c.students, studentId] };
    }));
    const student = users.find(u => u.id === studentId);
    const cls = classes.find(c => c.id === classId);
    pushAudit(`Enrolled ${student?.name} in ${cls?.name}`);
  };

  const removeStudent = (classId, studentId) => {
    setClasses(prev => prev.map(c =>
      c.id === classId ? { ...c, students: c.students.filter(id => id !== studentId) } : c
    ));
  };

  // ── Config actions ────────────────────────────────────
  const updateConfig = (patch) => {
    setConfig(prev => ({ ...prev, ...patch }));
    const key = Object.keys(patch)[0];
    pushAudit(`Updated setting "${key}" to "${patch[key]}"`);
  };

  // ── Helpers ───────────────────────────────────────────
  const pushActivity = (user, action, detail) => {
    setActivity(prev => [
      { id: `a${Date.now()}`, user, action, detail, time: 'just now', color: '#6366f1' },
      ...prev.slice(0, 9)
    ]);
  };

  const pushAudit = (action) => {
    const now = new Date();
    const time = `${now.toISOString().split('T')[0]} ${now.toTimeString().slice(0, 5)}`;
    setAuditLog(prev => [
      { id: `al${Date.now()}`, time, user: 'Admin Super', action, category: 'General' },
      ...prev.slice(0, 19)
    ]);
  };

  // ── Derived metrics ───────────────────────────────────
  const metrics = {
    totalStudents: users.filter(u => u.role === 'student').length,
    totalTeachers: users.filter(u => u.role === 'teacher').length,
    activeClasses: classes.filter(c => c.status === 'active').length,
    pendingFees: payments.filter(p => p.status === 'overdue' || p.status === 'failed')
      .reduce((sum, p) => sum + p.amount, 0),
    totalCollected: payments.filter(p => p.status === 'successful')
      .reduce((sum, p) => sum + p.amount, 0),
    failedPayments: payments.filter(p => p.status === 'failed' || p.status === 'overdue').length,
  };

  return (
    <AdminContext.Provider value={{
      users, classes, payments, activity, auditLog, config, currentAdmin, metrics,
      t, addUser, updateUser, deactivateUser, deleteUser,
      addClass, updateClass, enrollStudent, removeStudent,
      updateConfig, pushActivity
    }}>
      {children}
    </AdminContext.Provider>
  );
}

export const useAdmin = () => {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error('useAdmin must be used inside AdminProvider');
  return ctx;
};
