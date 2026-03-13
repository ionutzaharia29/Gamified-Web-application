import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';

const Dashboard = () => {

  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [allCourses, setAllCourses] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeNav, setActiveNav] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [expandedCourse, setExpandedCourse] = useState(null);
  const [courseSort, setCourseSort] = useState({ field: 'title', dir: 'asc' });
  // courseId -> { status: 'IN_PROGRESS'|'COMPLETED', xpAwarded: number }
  const [courseProgress, setCourseProgress] = useState({});
  const [xpToast, setXpToast] = useState(null); // { xpEarned, totalXp }
  const [progressLoading, setProgressLoading] = useState({});

  // Settings modal state
  const [showSettings, setShowSettings] = useState(false);
  const [settingsForm, setSettingsForm] = useState({ fullName: '', email: '' });
  const [settingsSaved, setSettingsSaved] = useState(false);
  const [settingsError, setSettingsError] = useState('');

  // Delete account modal state
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
    fetchCourses();
    fetchProgress();
  }, [navigate]);

  const fetchProgress = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8080/api/progress', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        const map = {};
        data.forEach(p => { map[p.courseId] = { status: p.status, xpAwarded: p.xpAwarded }; });
        setCourseProgress(map);
      }
    } catch (error) {
      console.error('Error fetching progress:', error);
    }
  };

  const handleEnroll = async (courseId) => {
    setProgressLoading(prev => ({ ...prev, [courseId]: true }));
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8080/api/progress/${courseId}/enroll`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setCourseProgress(prev => ({
          ...prev,
          [courseId]: { status: data.status, xpAwarded: data.xpAwarded }
        }));
      }
    } catch (error) {
      console.error('Error enrolling in course:', error);
    } finally {
      setProgressLoading(prev => ({ ...prev, [courseId]: false }));
    }
  };

  const handleCourseStatus = async (courseId, status) => {
    setProgressLoading(prev => ({ ...prev, [courseId]: true }));
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8080/api/progress/${courseId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ status })
      });
      if (response.ok) {
        const data = await response.json();
        setCourseProgress(prev => ({
          ...prev,
          [courseId]: { status: data.status, xpAwarded: data.xpAwarded }
        }));
        if (data.xpAwarded > 0) {
          setUser(prev => ({
            ...prev,
            xp: data.totalXp,
            level: data.level,
            currentLevel: data.level,
            leaderboardScore: data.leaderboardScore,
          }));
          setXpToast({ xpEarned: data.xpAwarded, totalXp: data.totalXp, level: data.level });
          setTimeout(() => setXpToast(null), 3000);
        }
      }
    } catch (error) {
      console.error('Error updating course status:', error);
    } finally {
      setProgressLoading(prev => ({ ...prev, [courseId]: false }));
    }
  };

  const fetchCourses = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8080/api/courses', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setAllCourses(data);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const categories = ['All', ...Array.from(new Set(allCourses.map(c => c.category).filter(Boolean)))];

  const handleSearch = (e) => {
    e.preventDefault();
    const query = searchQuery.trim().toLowerCase();

    let results = allCourses;

    if (selectedCategory !== 'All') {
      results = results.filter(c => c.category === selectedCategory);
    }

    if (query) {
      results = results.filter(c =>
        c.title?.toLowerCase().includes(query) ||
        c.notes?.toLowerCase().includes(query) ||
        c.category?.toLowerCase().includes(query)
      );
    }

    setSearchResults(results);
    setHasSearched(true);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSearchResults([]);
    setHasSearched(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleDeleteAccount = async () => {
    if (!deletePassword) {
      setDeleteError('Please enter your password to confirm.');
      return;
    }
    setDeleteError('');
    setDeleteLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8080/api/auth/me', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ password: deletePassword })
      });
      if (response.ok) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
      } else {
        const err = await response.json();
        setDeleteError(err.message || 'Failed to delete account. Please try again.');
      }
    } catch (error) {
      setDeleteError('Could not connect to server. Is the backend running?');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleSettingsSave = async () => {
    setSettingsError('');
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8080/api/auth/update-profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          fullName: settingsForm.fullName,
          email: settingsForm.email
        })
      });

      if (response.ok) {
        const updatedUser = await response.json();
        localStorage.setItem('token', updatedUser.token);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser({
          ...user,
          fullName: updatedUser.fullName,
          email: updatedUser.email
        });
        setSettingsSaved(true);
        setTimeout(() => {
          setSettingsSaved(false);
          setShowSettings(false);
        }, 1500);
      } else {
        const err = await response.json();
        const msg = err.message || (err.errors && err.errors[0]?.defaultMessage) || 'Update failed. Please try again.';
        setSettingsError(msg);
      }
    } catch (error) {
      setSettingsError('Could not connect to server. Is the backend running?');
    }
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'courses', label: 'Course List' },
    { id: 'leaderboard', label: 'Leaderboard' },
    { id: 'schedule', label: 'Schedule' },
    { id: 'messages', label: 'Messages' },
    { id: 'achievements', label: 'Achievements' },
  ];

  if (!user) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontFamily: 'Arial, sans-serif' }}>
        <p style={{ fontSize: '1.2rem', color: '#7c7c9a' }}>Loading...</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', width: '100vw', backgroundColor: '#f4f6fb', fontFamily: "'Georgia', serif", boxSizing: 'border-box', position: 'relative' }}>

      {/* XP Toast */}
      {xpToast && (
        <div style={{ position: 'fixed', bottom: '32px', right: '32px', zIndex: 2000, backgroundColor: '#1a1a2e', color: 'white', borderRadius: '16px', padding: '18px 24px', boxShadow: '0 8px 32px rgba(0,0,0,0.25)', display: 'flex', alignItems: 'center', gap: '14px', fontFamily: 'Arial, sans-serif', animation: 'fadeIn 0.3s ease' }}>
          <span style={{ fontSize: '2rem' }}>🎉</span>
          <div>
            <p style={{ margin: 0, fontWeight: '700', fontSize: '1rem' }}>Course Completed!</p>
            <p style={{ margin: '2px 0 0 0', fontSize: '0.85rem', color: 'rgba(255,255,255,0.75)' }}>
              +{xpToast.xpEarned} XP · {xpToast.totalXp} XP total · Level {xpToast.level}
            </p>
          </div>
        </div>
      )}

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ backgroundColor: 'white', borderRadius: '20px', padding: '36px', width: '420px', boxShadow: '0 20px 60px rgba(0,0,0,0.25)', position: 'relative' }}>
            <button
              onClick={() => { setShowDeleteModal(false); setDeletePassword(''); setDeleteError(''); }}
              style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#7c7c9a' }}
            >✕</button>

            <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px', fontSize: '1.5rem' }}>
              ⚠️
            </div>

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
              <p style={{ color: '#dc2626', fontSize: '0.85rem', fontFamily: 'Arial, sans-serif', marginBottom: '12px', padding: '10px 14px', backgroundColor: '#fef2f2', borderRadius: '8px', border: '1px solid #fecaca' }}>
                {deleteError}
              </p>
            )}

            <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
              <button
                onClick={() => { setShowDeleteModal(false); setDeletePassword(''); setDeleteError(''); }}
                style={{ flex: 1, padding: '12px', borderRadius: '12px', border: '2px solid #e8e8f0', backgroundColor: 'white', color: '#1a1a2e', fontSize: '14px', fontWeight: '600', cursor: 'pointer', fontFamily: 'Arial, sans-serif' }}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={deleteLoading}
                style={{ flex: 1, padding: '12px', borderRadius: '12px', border: 'none', backgroundColor: deleteLoading ? '#f87171' : '#dc2626', color: 'white', fontSize: '14px', fontWeight: '600', cursor: deleteLoading ? 'default' : 'pointer', fontFamily: 'Arial, sans-serif', transition: 'background 0.2s' }}
              >
                {deleteLoading ? 'Deleting...' : 'Delete Account'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettings && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.4)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ backgroundColor: 'white', borderRadius: '20px', padding: '36px', width: '420px', boxShadow: '0 20px 60px rgba(0,0,0,0.2)', position: 'relative' }}>
            <button
              onClick={() => setShowSettings(false)}
              style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#7c7c9a' }}
            >✕</button>

            <h2 style={{ margin: '0 0 24px 0', color: '#1a1a2e', fontFamily: 'Georgia, serif', fontSize: '1.4rem' }}>Update Profile</h2>

            <label style={{ display: 'block', fontSize: '0.85rem', color: '#7c7c9a', fontFamily: 'Arial, sans-serif', marginBottom: '6px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Full Name
            </label>
            <input
              type="text"
              value={settingsForm.fullName}
              onChange={(e) => setSettingsForm(f => ({ ...f, fullName: e.target.value }))}
              style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '2px solid #e8e8f0', fontSize: '15px', fontFamily: 'Arial, sans-serif', color: '#1a1a2e', outline: 'none', boxSizing: 'border-box', marginBottom: '18px' }}
            />

            <label style={{ display: 'block', fontSize: '0.85rem', color: '#7c7c9a', fontFamily: 'Arial, sans-serif', marginBottom: '6px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Email
            </label>
            <input
              type="email"
              value={settingsForm.email}
              onChange={(e) => setSettingsForm(f => ({ ...f, email: e.target.value }))}
              style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '2px solid #e8e8f0', fontSize: '15px', fontFamily: 'Arial, sans-serif', color: '#1a1a2e', outline: 'none', boxSizing: 'border-box', marginBottom: '24px' }}
            />

            {settingsError && (
              <p style={{ color: '#dc2626', fontSize: '0.85rem', fontFamily: 'Arial, sans-serif', marginBottom: '12px', padding: '10px 14px', backgroundColor: '#fef2f2', borderRadius: '8px', border: '1px solid #fecaca' }}>
                {settingsError}
              </p>
            )}

            <button
              onClick={handleSettingsSave}
              style={{ width: '100%', padding: '14px', borderRadius: '12px', border: 'none', backgroundColor: settingsSaved ? '#10b981' : '#4f46e5', color: 'white', fontSize: '15px', fontWeight: '600', cursor: 'pointer', fontFamily: 'Arial, sans-serif', transition: 'background 0.3s' }}
            >
              {settingsSaved ? '✓ Saved!' : 'Save Changes'}
            </button>

            <p style={{ fontSize: '0.78rem', color: '#7c7c9a', fontFamily: 'Arial, sans-serif', marginTop: '12px', textAlign: 'center' }}>
              Note: Password changes require contacting your admin.
            </p>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <aside style={{ width: sidebarOpen ? '220px' : '0px', minWidth: sidebarOpen ? '220px' : '0px', backgroundColor: '#4f46e5', display: 'flex', flexDirection: 'column', paddingTop: '24px', paddingBottom: '24px', minHeight: '100vh', overflow: 'hidden', transition: 'width 0.3s ease, min-width 0.3s ease', flexShrink: 0 }}>

        <div style={{ padding: '0 20px', marginBottom: '36px', whiteSpace: 'nowrap' }}>
          <span style={{ color: 'white', fontWeight: '800', fontSize: '1.2rem', letterSpacing: '-0.5px' }}>SkillsBuild</span>
        </div>

        <nav style={{ flex: 1 }}>
          {navItems.map(item => (
            <div
              key={item.id}
              onClick={() => setActiveNav(item.id)}
              style={{ display: 'flex', alignItems: 'center', padding: '12px 20px', cursor: 'pointer', backgroundColor: activeNav === item.id ? 'rgba(255,255,255,0.15)' : 'transparent', borderLeft: activeNav === item.id ? '3px solid white' : '3px solid transparent', color: activeNav === item.id ? 'white' : 'rgba(255,255,255,0.7)', fontSize: '0.9rem', fontFamily: 'Arial, sans-serif', fontWeight: activeNav === item.id ? '600' : '400', whiteSpace: 'nowrap', transition: 'background 0.2s, color 0.2s', marginBottom: '2px' }}
              onMouseEnter={(e) => { if (activeNav !== item.id) { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = 'white'; } }}
              onMouseLeave={(e) => { if (activeNav !== item.id) { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.7)'; } }}
            >
              {item.label}
            </div>
          ))}
        </nav>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.15)', paddingTop: '16px', marginTop: '16px' }}>
          <div
            onClick={() => { setSettingsError(''); setShowSettings(true); }}
            style={{ display: 'flex', alignItems: 'center', padding: '12px 20px', cursor: 'pointer', color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', fontFamily: 'Arial, sans-serif', whiteSpace: 'nowrap', transition: 'background 0.2s, color 0.2s', borderLeft: '3px solid transparent', marginBottom: '2px' }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = 'white'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.7)'; }}
          >
            ⚙ Update Profile
          </div>

          <div
            onClick={handleLogout}
            style={{ display: 'flex', alignItems: 'center', padding: '12px 20px', cursor: 'pointer', color: 'rgba(255, 180, 180, 0.9)', fontSize: '0.9rem', fontFamily: 'Arial, sans-serif', whiteSpace: 'nowrap', transition: 'background 0.2s, color 0.2s', borderLeft: '3px solid transparent', marginBottom: '2px' }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255,100,100,0.15)'; e.currentTarget.style.color = '#fca5a5'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'rgba(255, 180, 180, 0.9)'; }}
          >
            ⏻ Logout
          </div>

          <div
            onClick={() => { setDeletePassword(''); setDeleteError(''); setShowDeleteModal(true); }}
            style={{ display: 'flex', alignItems: 'center', padding: '12px 20px', cursor: 'pointer', color: 'rgba(255, 120, 120, 0.8)', fontSize: '0.9rem', fontFamily: 'Arial, sans-serif', whiteSpace: 'nowrap', transition: 'background 0.2s, color 0.2s', borderLeft: '3px solid transparent' }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255,100,100,0.15)'; e.currentTarget.style.color = '#fca5a5'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'rgba(255, 120, 120, 0.8)'; }}
          >
            🗑 Delete Account
          </div>
        </div>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, padding: '36px 40px', overflow: 'auto', minWidth: 0 }}>

        {/* Top Bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
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

        {/* Course List View */}
        {activeNav === 'courses' && (() => {
          const sorted = [...allCourses].sort((a, b) => {
            const av = (a[courseSort.field] || '').toLowerCase();
            const bv = (b[courseSort.field] || '').toLowerCase();
            return courseSort.dir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av);
          });

          const toggleSort = (field) => {
            setCourseSort(prev => ({
              field,
              dir: prev.field === field && prev.dir === 'asc' ? 'desc' : 'asc',
            }));
          };

          const sortArrow = (field) => {
            if (courseSort.field !== field) return ' ↕';
            return courseSort.dir === 'asc' ? ' ↑' : ' ↓';
          };

          return (
            <section>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <h2 style={{ margin: 0, fontSize: '1.4rem', fontWeight: '700', color: '#1a1a2e' }}>All Courses</h2>
                <span style={{ fontSize: '0.85rem', color: '#7c7c9a', fontFamily: 'Arial, sans-serif' }}>
                  {isLoading ? 'Loading…' : `${allCourses.length} course${allCourses.length !== 1 ? 's' : ''}`}
                </span>
              </div>

              {isLoading ? (
                <p style={{ color: '#7c7c9a', fontFamily: 'Arial, sans-serif' }}>Loading courses…</p>
              ) : allCourses.length === 0 ? (
                <p style={{ color: '#7c7c9a', fontFamily: 'Arial, sans-serif' }}>No courses found.</p>
              ) : (
                <div style={{ backgroundColor: 'white', borderRadius: '16px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
                  {/* Table header */}
                  <div style={{ display: 'grid', gridTemplateColumns: '40px 1fr 150px 210px 80px', backgroundColor: '#f8f8fc', borderBottom: '2px solid #e8e8f0' }}>
                    <div style={{ padding: '14px 12px' }} />
                    <div onClick={() => toggleSort('title')} style={{ padding: '14px 16px', fontSize: '0.8rem', fontWeight: '700', color: '#7c7c9a', textTransform: 'uppercase', letterSpacing: '0.5px', fontFamily: 'Arial, sans-serif', cursor: 'pointer', userSelect: 'none' }}>
                      Title{sortArrow('title')}
                    </div>
                    <div onClick={() => toggleSort('category')} style={{ padding: '14px 16px', fontSize: '0.8rem', fontWeight: '700', color: '#7c7c9a', textTransform: 'uppercase', letterSpacing: '0.5px', fontFamily: 'Arial, sans-serif', cursor: 'pointer', userSelect: 'none' }}>
                      Category{sortArrow('category')}
                    </div>
                    <div style={{ padding: '14px 16px', fontSize: '0.8rem', fontWeight: '700', color: '#7c7c9a', textTransform: 'uppercase', letterSpacing: '0.5px', fontFamily: 'Arial, sans-serif' }}>
                      Progress
                    </div>
                    <div style={{ padding: '14px 16px', fontSize: '0.8rem', fontWeight: '700', color: '#7c7c9a', textTransform: 'uppercase', letterSpacing: '0.5px', fontFamily: 'Arial, sans-serif' }}>
                      Link
                    </div>
                  </div>

                  {/* Rows */}
                  {sorted.map((course, idx) => {
                    const isExpanded = expandedCourse === course.id;
                    const isLast = idx === sorted.length - 1;
                    const prog = courseProgress[course.id];
                    const status = prog?.status || null;
                    const isBusy = progressLoading[course.id];
                    const isCompleted = status === 'COMPLETED';
                    const isInProgress = status === 'IN_PROGRESS';

                    return (
                      <div key={course.id || idx} style={{ borderBottom: isLast && !isExpanded ? 'none' : '1px solid #e8e8f0' }}>
                        {/* Main row */}
                        <div
                          style={{ display: 'grid', gridTemplateColumns: '40px 1fr 150px 210px 80px', alignItems: 'center', cursor: 'pointer', transition: 'background 0.15s' }}
                          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#f8f8fc'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                          onClick={() => setExpandedCourse(isExpanded ? null : course.id)}
                        >
                          <div style={{ padding: '16px 12px', textAlign: 'center', fontSize: '0.85rem', color: '#7c7c9a' }}>
                            {isExpanded ? '▲' : '▶'}
                          </div>
                          <div style={{ padding: '16px' }}>
                            <span style={{ fontSize: '0.95rem', fontWeight: '600', color: '#1a1a2e' }}>{course.title}</span>
                            {isCompleted && (
                              <span style={{ marginLeft: '8px', fontSize: '0.72rem', fontWeight: '700', color: '#059669', backgroundColor: '#d1fae5', padding: '2px 8px', borderRadius: '99px', fontFamily: 'Arial, sans-serif' }}>
                                +{prog.xpAwarded} XP
                              </span>
                            )}
                            {course.duration && (
                              <p style={{ margin: '4px 0 0 0', fontSize: '0.75rem', color: '#7c7c9a', fontFamily: 'Arial, sans-serif' }}>
                                ⏱ ~{course.duration}
                              </p>
                            )}
                          </div>
                          <div style={{ padding: '16px' }}>
                            {course.category && (
                              <span style={{ backgroundColor: '#ede9fe', color: '#6d28d9', padding: '4px 10px', borderRadius: '99px', fontSize: '0.78rem', fontFamily: 'Arial, sans-serif', fontWeight: '600' }}>
                                {course.category}
                              </span>
                            )}
                          </div>
                          {/* Progress buttons */}
                          <div style={{ padding: '12px 16px', display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap' }} onClick={(e) => e.stopPropagation()}>
                            {/* State: not enrolled */}
                            {!status && (
                              <button
                                disabled={isBusy}
                                onClick={() => handleEnroll(course.id)}
                                style={{
                                  padding: '5px 12px', borderRadius: '7px', border: '1.5px solid #818cf8', fontSize: '0.75rem', fontWeight: '600', fontFamily: 'Arial, sans-serif',
                                  cursor: isBusy ? 'default' : 'pointer', transition: 'all 0.15s',
                                  backgroundColor: isBusy ? '#e8e8f0' : '#4f46e5', borderColor: '#4f46e5', color: 'white',
                                }}
                              >
                                {isBusy ? '...' : 'Enroll'}
                              </button>
                            )}

                            {/* State: in progress — show badge + mark done button */}
                            {isInProgress && (
                              <>
                                <span style={{
                                  padding: '5px 10px', borderRadius: '7px', border: '1.5px solid #86efac', fontSize: '0.75rem', fontWeight: '600', fontFamily: 'Arial, sans-serif',
                                  backgroundColor: '#f0fdf4', color: '#16a34a',
                                }}>
                                  ● In Progress
                                </span>
                                <button
                                  disabled={isBusy}
                                  onClick={() => handleCourseStatus(course.id, 'COMPLETED')}
                                  style={{
                                    padding: '5px 10px', borderRadius: '7px', border: '1.5px solid #d1d5db', fontSize: '0.75rem', fontWeight: '600', fontFamily: 'Arial, sans-serif',
                                    cursor: isBusy ? 'default' : 'pointer', transition: 'all 0.15s',
                                    backgroundColor: 'white', color: '#6b7280',
                                  }}
                                >
                                  {isBusy ? '...' : 'Mark Done'}
                                </button>
                              </>
                            )}

                            {/* State: completed */}
                            {isCompleted && (
                              <span style={{
                                padding: '5px 10px', borderRadius: '7px', border: '1.5px solid #93c5fd', fontSize: '0.75rem', fontWeight: '600', fontFamily: 'Arial, sans-serif',
                                backgroundColor: '#eff6ff', color: '#2563eb',
                              }}>
                                ✓ Completed
                              </span>
                            )}
                          </div>
                          <div style={{ padding: '16px' }} onClick={(e) => e.stopPropagation()}>
                            <a
                              href={course.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{ padding: '6px 12px', borderRadius: '8px', backgroundColor: '#4f46e5', color: 'white', fontSize: '0.8rem', fontWeight: '600', textDecoration: 'none', fontFamily: 'Arial, sans-serif' }}
                            >
                              Open →
                            </a>
                          </div>
                        </div>

                        {/* Expanded detail row */}
                        {isExpanded && (
                          <div style={{ padding: '20px 24px 24px 56px', backgroundColor: '#fafafa', borderTop: '1px solid #e8e8f0' }}>
                            {course.notes ? (
                              <div style={{ marginBottom: '14px' }}>
                                <p style={{ margin: '0 0 6px 0', fontSize: '0.8rem', fontWeight: '700', color: '#7c7c9a', textTransform: 'uppercase', letterSpacing: '0.5px', fontFamily: 'Arial, sans-serif' }}>Description</p>
                                <p style={{ margin: 0, fontSize: '0.92rem', color: '#1a1a2e', lineHeight: 1.6, fontFamily: 'Arial, sans-serif', whiteSpace: 'pre-line' }}>{course.notes}</p>
                              </div>
                            ) : (
                              <p style={{ margin: '0 0 14px 0', fontSize: '0.9rem', color: '#7c7c9a', fontFamily: 'Arial, sans-serif', fontStyle: 'italic' }}>No description available.</p>
                            )}
                            <div>
                              <p style={{ margin: '0 0 4px 0', fontSize: '0.8rem', fontWeight: '700', color: '#7c7c9a', textTransform: 'uppercase', letterSpacing: '0.5px', fontFamily: 'Arial, sans-serif' }}>URL</p>
                              <a href={course.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.88rem', color: '#4f46e5', fontFamily: 'Arial, sans-serif', wordBreak: 'break-all' }}>
                                {course.url}
                              </a>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          );
        })()}

        {/* Dashboard default content */}
        {activeNav !== 'courses' && <>

        {/* Search */}
        <section style={{ marginBottom: '36px' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: '600', color: '#7c7c9a', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px', display: 'block', fontFamily: 'Arial, sans-serif' }}>
            Find SkillsBuild Courses
          </span>

          <form onSubmit={handleSearch} style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{ padding: '14px 16px', borderRadius: '12px', border: '2px solid #e8e8f0', backgroundColor: 'white', fontSize: '14px', color: '#1a1a2e', outline: 'none', fontFamily: 'Arial, sans-serif', cursor: 'pointer', minWidth: '160px' }}
            >
              {isLoading
                ? <option>Loading...</option>
                : categories.map(cat => <option key={cat} value={cat}>{cat}</option>)
              }
            </select>

            <input
              type="text"
              placeholder="Search by title, keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ flex: 1, padding: '14px 20px', borderRadius: '12px', border: '2px solid #e8e8f0', backgroundColor: 'white', fontSize: '15px', color: '#1a1a2e', outline: 'none', fontFamily: 'Arial, sans-serif', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', minWidth: '200px' }}
            />

            <button
              type="submit"
              style={{ padding: '14px 28px', borderRadius: '12px', border: 'none', backgroundColor: '#4f46e5', color: 'white', fontSize: '15px', fontWeight: '600', cursor: 'pointer', fontFamily: 'Arial, sans-serif', boxShadow: '0 4px 12px rgba(79,70,229,0.3)' }}
            >
              Search
            </button>

            {hasSearched && (
              <button
                type="button"
                onClick={handleClearSearch}
                style={{ padding: '14px 20px', borderRadius: '12px', border: '2px solid #e8e8f0', backgroundColor: 'white', color: '#7c7c9a', fontSize: '15px', cursor: 'pointer', fontFamily: 'Arial, sans-serif' }}
              >
                Clear
              </button>
            )}
          </form>

          {hasSearched && (
            <div style={{ marginTop: '16px' }}>
              <p style={{ fontSize: '0.85rem', color: '#7c7c9a', fontFamily: 'Arial, sans-serif', marginBottom: '12px' }}>
                {searchResults.length === 0
                  ? 'No courses found. Try a different keyword or category.'
                  : `${searchResults.length} course${searchResults.length !== 1 ? 's' : ''} found`
                }
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {searchResults.map((course, index) => (
                  <li
                    key={course.id || index}
                    style={{ padding: '16px 20px', borderRadius: '12px', border: '1px solid #e8e8f0', marginBottom: '10px', backgroundColor: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}
                  >
                    <div style={{ flex: 1 }}>
                      <span style={{ color: '#1a1a2e', fontSize: '1rem', fontWeight: '600', display: 'block', marginBottom: '6px' }}>
                        {course.title}
                      </span>
                      <span style={{ backgroundColor: '#ede9fe', color: '#6d28d9', padding: '3px 10px', borderRadius: '99px', fontSize: '0.78rem', fontFamily: 'Arial, sans-serif' }}>
                        {course.category || 'Uncategorized'}
                      </span>
                    </div>
                    <a
                      href={course.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ padding: '8px 18px', borderRadius: '8px', backgroundColor: '#4f46e5', color: 'white', fontSize: '0.85rem', fontWeight: '600', textDecoration: 'none', fontFamily: 'Arial, sans-serif', whiteSpace: 'nowrap' }}
                    >
                      Open →
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '36px' }}>
          {[
            { label: 'Current Level', value: user.level || user.currentLevel || 1, accent: '#4f46e5' },
            { label: 'Total XP', value: user.xp || user.experiencePoints || 0, accent: '#f59e0b' },
            { label: 'Courses Done', value: Object.values(courseProgress).filter(p => p.status === 'COMPLETED').length, accent: '#10b981' },
            { label: 'Badges', value: 0, accent: '#ef4444' },
          ].map((stat) => (
            <div key={stat.label} style={{ backgroundColor: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', borderTop: `4px solid ${stat.accent}` }}>
              <div style={{ fontSize: '2.2rem', fontWeight: '700', color: '#1a1a2e', lineHeight: 1, marginBottom: '6px' }}>{stat.value}</div>
              <div style={{ fontSize: '0.85rem', color: '#7c7c9a', fontFamily: 'Arial, sans-serif' }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Bottom Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>

          <div style={{ backgroundColor: '#4f46e5', borderRadius: '16px', padding: '28px', boxShadow: '0 4px 20px rgba(79,70,229,0.3)', color: 'white' }}>
            <p style={{ fontSize: '0.85rem', opacity: 0.75, textTransform: 'uppercase', letterSpacing: '1px', fontFamily: 'Arial, sans-serif', margin: '0 0 8px 0' }}>Total Points</p>
            <p style={{ fontSize: '3rem', fontWeight: '700', lineHeight: 1, margin: '0 0 16px 0' }}>{user.xp || user.experiencePoints || 0} XP</p>
            <div style={{ backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '99px', height: '8px', marginBottom: '8px' }}>
              <div style={{ backgroundColor: 'white', borderRadius: '99px', height: '8px', width: `${Math.min((((user.xp || 0) % 150) / 150) * 100, 100)}%` }}></div>
            </div>
            <p style={{ fontSize: '0.8rem', opacity: 0.65, fontFamily: 'Arial, sans-serif', margin: 0 }}>
              {150 - ((user.xp || 0) % 150)} XP to reach Level {(user.level || user.currentLevel || 1) + 1}
            </p>
          </div>

          <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '28px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
            <p style={{ fontSize: '1.1rem', fontWeight: '700', color: '#1a1a2e', margin: '0 0 20px 0' }}>Activity Summary</p>
            {[
              { icon: '📚', value: Object.values(courseProgress).filter(p => p.status === 'COMPLETED').length, label: 'Courses Completed' },
              { icon: '🏆', value: 0, label: 'Badges Earned' },
              { icon: '🔥', value: user.loginStreak || user.dailyStreak || 0, label: 'Day Streak' },
            ].map((item) => (
              <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '14px', backgroundColor: '#f8f8fc', borderRadius: '10px', marginBottom: '10px' }}>
                <span style={{ fontSize: '1.6rem' }}>{item.icon}</span>
                <div>
                  <p style={{ margin: 0, fontSize: '1.3rem', fontWeight: '700', color: '#1a1a2e' }}>{item.value}</p>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: '#7c7c9a', fontFamily: 'Arial, sans-serif' }}>{item.label}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
        </>}

      </main>
    </div>
  );
};

export default Dashboard;