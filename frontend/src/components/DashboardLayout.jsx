import { useEffect, useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';

const navItems = [
  { id: 'overview',      label: 'Dashboard',     path: '/dashboard/overview' },
  { id: 'courses',       label: 'Course List',   path: '/dashboard/courses' },
  { id: 'leaderboard',  label: 'Leaderboard',   path: '/dashboard/leaderboard' },
  { id: 'schedule',     label: 'Schedule',       path: '/dashboard/schedule' },
  { id: 'achievements',  label: 'Achievements',   path: '/dashboard/achievements' },
  { id: 'brain-breaks', label: 'Brain Breaks',   path: '/dashboard/brain-breaks' },
  { id: 'support',      label: 'Support & FAQ',  path: '/dashboard/support' },
];

const DashboardLayout = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [showSettings, setShowSettings] = useState(false);
  const [settingsForm, setSettingsForm] = useState({ fullName: '', email: '' });
  const [settingsSaved, setSettingsSaved] = useState(false);
  const [settingsError, setSettingsError] = useState('');

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [deleteError, setDeleteError] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      navigate('/login');
      return;
    }
    setUser(currentUser);
    setSettingsForm({ fullName: currentUser.fullName || '', email: currentUser.email || '' });
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleSettingsSave = async () => {
    setSettingsError('');
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8080/api/auth/update-profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ fullName: settingsForm.fullName, email: settingsForm.email }),
      });

      if (response.ok) {
        const updatedUser = await response.json();
        localStorage.setItem('token', updatedUser.token);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(prev => ({ ...prev, fullName: updatedUser.fullName, email: updatedUser.email }));
        setSettingsSaved(true);
        setTimeout(() => { setSettingsSaved(false); setShowSettings(false); }, 1500);
      } else {
        const err = await response.json();
        const msg = err.message || (err.errors && err.errors[0]?.defaultMessage) || 'Update failed. Please try again.';
        setSettingsError(msg);
      }
    } catch {
      setSettingsError('Could not connect to server. Is the backend running?');
    }
  };

  const handleDeleteAccount = async () => {
    if (!deletePassword) { setDeleteError('Please enter your password to confirm.'); return; }
    setDeleteError('');
    setDeleteLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8080/api/auth/me', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ password: deletePassword }),
      });
      if (response.ok) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
      } else {
        const err = await response.json();
        setDeleteError(err.message || 'Failed to delete account. Please try again.');
      }
    } catch {
      setDeleteError('Could not connect to server. Is the backend running?');
    } finally {
      setDeleteLoading(false);
    }
  };

  if (!user) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontFamily: 'Arial, sans-serif' }}>
        <p style={{ fontSize: '1.2rem', color: '#7c7c9a' }}>Loading...</p>
      </div>
    );
  }

  const navLinkStyle = ({ isActive }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: '12px 20px',
    cursor: 'pointer',
    textDecoration: 'none',
    fontSize: '0.9rem',
    fontFamily: 'Arial, sans-serif',
    whiteSpace: 'nowrap',
    transition: 'background 0.2s, color 0.2s',
    marginBottom: '2px',
    backgroundColor: isActive ? 'rgba(255,255,255,0.15)' : 'transparent',
    borderLeft: isActive ? '3px solid white' : '3px solid transparent',
    color: isActive ? 'white' : 'rgba(255,255,255,0.7)',
    fontWeight: isActive ? '600' : '400',
  });

  return (
    <div style={{ display: 'flex', minHeight: '100vh', width: '100vw', backgroundColor: '#f4f6fb', fontFamily: "'Georgia', serif", boxSizing: 'border-box', position: 'relative' }}>

      {/* delete modal */}
      {showDeleteModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ backgroundColor: 'white', borderRadius: '20px', padding: '36px', width: '420px', boxShadow: '0 20px 60px rgba(0,0,0,0.25)', position: 'relative' }}>
            <button onClick={() => { setShowDeleteModal(false); setDeletePassword(''); setDeleteError(''); }} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#7c7c9a' }}>✕</button>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px', fontSize: '1.5rem' }}>⚠️</div>
            <h2 style={{ margin: '0 0 8px 0', color: '#1a1a2e', fontFamily: 'Georgia, serif', fontSize: '1.4rem' }}>Delete Account</h2>
            <p style={{ margin: '0 0 20px 0', fontSize: '0.9rem', color: '#7c7c9a', fontFamily: 'Arial, sans-serif', lineHeight: 1.5 }}>
              Are you sure? This action <strong style={{ color: '#dc2626' }}>cannot be undone</strong>. All your progress, badges, and data will be permanently deleted.
            </p>
            <label style={{ display: 'block', fontSize: '0.85rem', color: '#7c7c9a', fontFamily: 'Arial, sans-serif', marginBottom: '6px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Enter your password to confirm
            </label>
            <input
              type="password"
              value={deletePassword}
              onChange={(e) => { setDeletePassword(e.target.value); setDeleteError(''); }}
              placeholder="Your current password"
              style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: `2px solid ${deleteError ? '#fca5a5' : '#e8e8f0'}`, fontSize: '15px', fontFamily: 'Arial, sans-serif', color: '#1a1a2e', outline: 'none', boxSizing: 'border-box', marginBottom: '8px' }}
            />
            {deleteError && (
              <p style={{ color: '#dc2626', fontSize: '0.85rem', fontFamily: 'Arial, sans-serif', marginBottom: '12px', padding: '10px 14px', backgroundColor: '#fef2f2', borderRadius: '8px', border: '1px solid #fecaca' }}>{deleteError}</p>
            )}
            <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
              <button onClick={() => { setShowDeleteModal(false); setDeletePassword(''); setDeleteError(''); }} style={{ flex: 1, padding: '12px', borderRadius: '12px', border: '2px solid #e8e8f0', backgroundColor: 'white', color: '#1a1a2e', fontSize: '14px', fontWeight: '600', cursor: 'pointer', fontFamily: 'Arial, sans-serif' }}>Cancel</button>
              <button onClick={handleDeleteAccount} disabled={deleteLoading} style={{ flex: 1, padding: '12px', borderRadius: '12px', border: 'none', backgroundColor: deleteLoading ? '#f87171' : '#dc2626', color: 'white', fontSize: '14px', fontWeight: '600', cursor: deleteLoading ? 'default' : 'pointer', fontFamily: 'Arial, sans-serif', transition: 'background 0.2s' }}>
                {deleteLoading ? 'Deleting...' : 'Delete Account'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* settings modal */}
      {showSettings && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.4)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ backgroundColor: 'white', borderRadius: '20px', padding: '36px', width: '420px', boxShadow: '0 20px 60px rgba(0,0,0,0.2)', position: 'relative' }}>
            <button onClick={() => setShowSettings(false)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#7c7c9a' }}>✕</button>
            <h2 style={{ margin: '0 0 24px 0', color: '#1a1a2e', fontFamily: 'Georgia, serif', fontSize: '1.4rem' }}>Update Profile</h2>
            <label style={{ display: 'block', fontSize: '0.85rem', color: '#7c7c9a', fontFamily: 'Arial, sans-serif', marginBottom: '6px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Full Name</label>
            <input
              type="text"
              value={settingsForm.fullName}
              onChange={(e) => setSettingsForm(f => ({ ...f, fullName: e.target.value }))}
              style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '2px solid #e8e8f0', fontSize: '15px', fontFamily: 'Arial, sans-serif', color: '#1a1a2e', outline: 'none', boxSizing: 'border-box', marginBottom: '18px' }}
            />
            <label style={{ display: 'block', fontSize: '0.85rem', color: '#7c7c9a', fontFamily: 'Arial, sans-serif', marginBottom: '6px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Email</label>
            <input
              type="email"
              value={settingsForm.email}
              onChange={(e) => setSettingsForm(f => ({ ...f, email: e.target.value }))}
              style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '2px solid #e8e8f0', fontSize: '15px', fontFamily: 'Arial, sans-serif', color: '#1a1a2e', outline: 'none', boxSizing: 'border-box', marginBottom: '24px' }}
            />
            {settingsError && (
              <p style={{ color: '#dc2626', fontSize: '0.85rem', fontFamily: 'Arial, sans-serif', marginBottom: '12px', padding: '10px 14px', backgroundColor: '#fef2f2', borderRadius: '8px', border: '1px solid #fecaca' }}>{settingsError}</p>
            )}
            <button onClick={handleSettingsSave} style={{ width: '100%', padding: '14px', borderRadius: '12px', border: 'none', backgroundColor: settingsSaved ? '#10b981' : '#4f46e5', color: 'white', fontSize: '15px', fontWeight: '600', cursor: 'pointer', fontFamily: 'Arial, sans-serif', transition: 'background 0.3s' }}>
              {settingsSaved ? '✓ Saved!' : 'Save Changes'}
            </button>
            <p style={{ fontSize: '0.78rem', color: '#7c7c9a', fontFamily: 'Arial, sans-serif', marginTop: '12px', textAlign: 'center' }}>Note: Password changes require contacting your admin.</p>
          </div>
        </div>
      )}

      {/* sidebar */}
      <aside style={{ width: sidebarOpen ? '220px' : '0px', minWidth: sidebarOpen ? '220px' : '0px', backgroundColor: '#4f46e5', display: 'flex', flexDirection: 'column', paddingTop: '24px', paddingBottom: '24px', minHeight: '100vh', overflow: 'hidden', transition: 'width 0.3s ease, min-width 0.3s ease', flexShrink: 0 }}>
        <div style={{ padding: '0 20px', marginBottom: '36px', whiteSpace: 'nowrap' }}>
          <span style={{ color: 'white', fontWeight: '800', fontSize: '1.2rem', letterSpacing: '-0.5px' }}>SkillsBuild</span>
        </div>

        <nav style={{ flex: 1 }}>
          {navItems.map(item => (
            <NavLink
              key={item.id}
              to={item.path}
              style={navLinkStyle}
              onMouseEnter={(e) => { if (!e.currentTarget.style.backgroundColor.includes('0.15')) { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = 'white'; } }}
              onMouseLeave={(e) => { if (!e.currentTarget.style.backgroundColor.includes('0.15')) { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.7)'; } }}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* sidebar actions */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.15)', paddingTop: '16px', marginTop: '16px' }}>
          <div onClick={() => { setSettingsError(''); setShowSettings(true); }} style={{ display: 'flex', alignItems: 'center', padding: '12px 20px', cursor: 'pointer', color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', fontFamily: 'Arial, sans-serif', whiteSpace: 'nowrap', transition: 'background 0.2s, color 0.2s', borderLeft: '3px solid transparent', marginBottom: '2px' }} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = 'white'; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.7)'; }}>
            ⚙ Update Profile
          </div>
          <div onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', padding: '12px 20px', cursor: 'pointer', color: 'rgba(255, 180, 180, 0.9)', fontSize: '0.9rem', fontFamily: 'Arial, sans-serif', whiteSpace: 'nowrap', transition: 'background 0.2s, color 0.2s', borderLeft: '3px solid transparent', marginBottom: '2px' }} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255,100,100,0.15)'; e.currentTarget.style.color = '#fca5a5'; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'rgba(255, 180, 180, 0.9)'; }}>
            ⏻ Logout
          </div>
          <div onClick={() => { setDeletePassword(''); setDeleteError(''); setShowDeleteModal(true); }} style={{ display: 'flex', alignItems: 'center', padding: '12px 20px', cursor: 'pointer', color: 'rgba(255, 120, 120, 0.8)', fontSize: '0.9rem', fontFamily: 'Arial, sans-serif', whiteSpace: 'nowrap', transition: 'background 0.2s, color 0.2s', borderLeft: '3px solid transparent' }} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255,100,100,0.15)'; e.currentTarget.style.color = '#fca5a5'; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'rgba(255, 120, 120, 0.8)'; }}>
            🗑 Delete Account
          </div>
        </div>
      </aside>

      <main style={{ flex: 1, overflow: 'auto', minWidth: 0 }}>
        {/* top bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '36px 40px 0 40px' }}>
          <button
            onClick={() => setSidebarOpen(prev => !prev)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '6px', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '5px', transition: 'background 0.2s', flexShrink: 0 }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e8e8f0'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <span style={{ display: 'block', width: '22px', height: '2px', backgroundColor: '#4f46e5', borderRadius: '2px' }} />
            <span style={{ display: 'block', width: '22px', height: '2px', backgroundColor: '#4f46e5', borderRadius: '2px' }} />
            <span style={{ display: 'block', width: '22px', height: '2px', backgroundColor: '#4f46e5', borderRadius: '2px' }} />
          </button>
          <div>
            <p style={{ fontSize: '1.8rem', fontWeight: '700', color: '#1a1a2e', margin: 0 }}>Hello, {user.fullName} 👋</p>
            <p style={{ fontSize: '0.95rem', color: '#7c7c9a', margin: '4px 0 0 0', fontFamily: 'Arial, sans-serif' }}>Nice to have you back. Ready to keep learning today?</p>
          </div>
        </div>

        {/* page content */}
        <div style={{ padding: '32px 40px' }}>
          <Outlet context={{ user, setUser }} />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
