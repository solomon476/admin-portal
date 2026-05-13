import React, { useState } from 'react';
import { useAdmin } from '../context/AdminContext';

const ROLES = ['all', 'student', 'teacher', 'parent', 'admin'];

function ConfirmDialog({ message, onConfirm, onCancel }) {
  return (
    <div className="dialog-overlay">
      <div className="dialog">
        <h3>⚠️ Confirm Action</h3>
        <p>{message}</p>
        <div className="dialog-actions">
          <button className="btn btn-ghost" onClick={onCancel}>Cancel</button>
          <button className="btn btn-danger" onClick={onConfirm}>Confirm</button>
        </div>
      </div>
    </div>
  );
}

function UserPanel({ user, onClose, onSave }) {
  const [form, setForm] = useState({ ...user });
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));
  return (
    <div>
      <div className="panel-overlay" onClick={onClose} />
      <div className="slide-panel">
        <div className="panel-header">
          <strong>{user.id ? 'Edit User' : 'New User'}</strong>
          <button className="btn btn-ghost btn-sm" onClick={onClose}>✕</button>
        </div>
        <div className="panel-body">
          <div className="form-grid">
            <div className="form-group">
              <label>Full Name</label>
              <input className="input" value={form.name || ''} onChange={e => set('name', e.target.value)} placeholder="Jane Doe" />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input className="input" type="email" value={form.email || ''} onChange={e => set('email', e.target.value)} placeholder="jane@school.ke" />
            </div>
            <div className="form-group">
              <label>Role</label>
              <select className="select" value={form.role || 'student'} onChange={e => set('role', e.target.value)}>
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
                <option value="parent">Parent</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div className="form-group">
              <label>Grade (students only)</label>
              <input className="input" value={form.grade || ''} onChange={e => set('grade', e.target.value)} placeholder="Grade 4" />
            </div>
          </div>
        </div>
        <div className="panel-footer">
          <button className="btn btn-ghost" style={{ flex: 1 }} onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => onSave(form)}>Save</button>
        </div>
      </div>
    </div>
  );
}

export default function UserManagement() {
  const { users, addUser, updateUser, deactivateUser, deleteUser } = useAdmin();
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [panelUser, setPanelUser] = useState(null);
  const [confirm, setConfirm] = useState(null);

  const filtered = users.filter(u => {
    const matchRole = roleFilter === 'all' || u.role === roleFilter;
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    return matchRole && matchSearch;
  });

  const handleSave = (form) => {
    if (form.id) {
      updateUser(form.id, form);
    } else {
      const initials = form.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
      addUser({ ...form, avatar: initials });
    }
    setPanelUser(null);
  };

  const handleDelete = (id) => {
    setConfirm({
      message: 'This will permanently delete the user. This cannot be undone.',
      onConfirm: () => { deleteUser(id); setConfirm(null); },
    });
  };

  const roleBadge = (role) => {
    const map = { student: 'blue', teacher: 'green', parent: 'purple', admin: 'red' };
    return <span className={`badge badge-${map[role] || 'gray'}`}>{role}</span>;
  };

  return (
    <div>
      {confirm && <ConfirmDialog {...confirm} onCancel={() => setConfirm(null)} />}
      {panelUser !== null && (
        <UserPanel
          user={panelUser}
          onClose={() => setPanelUser(null)}
          onSave={handleSave}
        />
      )}

      <div className="page-header">
        <h1>👥 User &amp; Role Management</h1>
        <p>View, add, edit, or deactivate students, teachers, and parents.</p>
      </div>

      <div className="card">
        <div className="toolbar">
          <div className="search-wrap" style={{ flex: 1, maxWidth: 320 }}>
            <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>🔍</span>
            <input
              className="input"
              style={{ paddingLeft: 34 }}
              placeholder="Search by name or email…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <select className="select" style={{ width: 'auto' }} value={roleFilter} onChange={e => setRoleFilter(e.target.value)}>
            {ROLES.map(r => <option key={r} value={r}>{r === 'all' ? 'All Roles' : r.charAt(0).toUpperCase() + r.slice(1)}</option>)}
          </select>
          <button className="btn btn-ghost btn-sm" title="Import CSV (mock)" onClick={() => alert('CSV mapping screen would open here.')}>⬆ Import CSV</button>
          <button className="btn btn-primary btn-sm" onClick={() => setPanelUser({})}>+ Add User</button>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Role</th>
                <th>Grade</th>
                <th>Status</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan={7}><div className="empty"><p>No users found.</p></div></td></tr>
              )}
              {filtered.map(u => (
                <tr key={u.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div className="admin-avatar" style={{ width: 28, height: 28, fontSize: 11 }}>{u.avatar}</div>
                      <strong>{u.name}</strong>
                    </div>
                  </td>
                  <td>{u.email}</td>
                  <td>{roleBadge(u.role)}</td>
                  <td>{u.grade || '—'}</td>
                  <td>
                    <span className={`badge ${u.status === 'active' ? 'badge-green' : 'badge-gray'}`}>
                      {u.status}
                    </span>
                  </td>
                  <td>{u.joined}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button className="btn btn-ghost btn-sm" onClick={() => setPanelUser(u)}>Edit</button>
                      <button className="btn btn-ghost btn-sm" onClick={() => deactivateUser(u.id)}>
                        {u.status === 'active' ? 'Deactivate' : 'Activate'}
                      </button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(u.id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
