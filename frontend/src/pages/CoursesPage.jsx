import { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';

const CoursesPage = () => {
  const { user, setUser } = useOutletContext();

  const [allCourses, setAllCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [courseProgress, setCourseProgress] = useState({});
  const [progressLoading, setProgressLoading] = useState({});
  const [expandedCourse, setExpandedCourse] = useState(null);
  const [courseSort, setCourseSort] = useState({ field: 'title', dir: 'asc' });
  const [xpToast, setXpToast] = useState(null);

  useEffect(() => {
    fetchCourses();
    fetchProgress();
  }, []);

  const fetchCourses = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8080/api/courses', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (response.ok) setAllCourses(await response.json());
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProgress = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8080/api/progress', {
        headers: { 'Authorization': `Bearer ${token}` },
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
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setCourseProgress(prev => ({ ...prev, [courseId]: { status: data.status, xpAwarded: data.xpAwarded } }));
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
        body: JSON.stringify({ status }),
      });
      if (response.ok) {
        const data = await response.json();
        setCourseProgress(prev => ({ ...prev, [courseId]: { status: data.status, xpAwarded: data.xpAwarded } }));
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

  const toggleSort = (field) => {
    setCourseSort(prev => ({ field, dir: prev.field === field && prev.dir === 'asc' ? 'desc' : 'asc' }));
  };

  const sortArrow = (field) => {
    if (courseSort.field !== field) return ' ↕';
    return courseSort.dir === 'asc' ? ' ↑' : ' ↓';
  };

  const sorted = [...allCourses].sort((a, b) => {
    const av = (a[courseSort.field] || '').toLowerCase();
    const bv = (b[courseSort.field] || '').toLowerCase();
    return courseSort.dir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av);
  });

  return (
    <section>
      {/* xp toast */}
      {xpToast && (
        <div style={{ position: 'fixed', bottom: '32px', right: '32px', zIndex: 2000, backgroundColor: '#1a1a2e', color: 'white', borderRadius: '16px', padding: '18px 24px', boxShadow: '0 8px 32px rgba(0,0,0,0.25)', display: 'flex', alignItems: 'center', gap: '14px', fontFamily: 'Arial, sans-serif' }}>
          <span style={{ fontSize: '2rem' }}>🎉</span>
          <div>
            <p style={{ margin: 0, fontWeight: '700', fontSize: '1rem' }}>Course Completed!</p>
            <p style={{ margin: '2px 0 0 0', fontSize: '0.85rem', color: 'rgba(255,255,255,0.75)' }}>
              +{xpToast.xpEarned} XP · {xpToast.totalXp} XP total · Level {xpToast.level}
            </p>
          </div>
        </div>
      )}

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
        <div style={{ backgroundColor: 'white', borderRadius: '16px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', overflow: 'hidden' }}> {/* course table */}

          {/* table header */}
          <div style={{ display: 'grid', gridTemplateColumns: '40px 1fr 150px 210px 80px', backgroundColor: '#f8f8fc', borderBottom: '2px solid #e8e8f0' }}>
            <div style={{ padding: '14px 12px' }} />
            <div onClick={() => toggleSort('title')} style={{ padding: '14px 16px', fontSize: '0.8rem', fontWeight: '700', color: '#7c7c9a', textTransform: 'uppercase', letterSpacing: '0.5px', fontFamily: 'Arial, sans-serif', cursor: 'pointer', userSelect: 'none' }}>
              Title{sortArrow('title')}
            </div>
            <div onClick={() => toggleSort('category')} style={{ padding: '14px 16px', fontSize: '0.8rem', fontWeight: '700', color: '#7c7c9a', textTransform: 'uppercase', letterSpacing: '0.5px', fontFamily: 'Arial, sans-serif', cursor: 'pointer', userSelect: 'none' }}>
              Category{sortArrow('category')}
            </div>
            <div style={{ padding: '14px 16px', fontSize: '0.8rem', fontWeight: '700', color: '#7c7c9a', textTransform: 'uppercase', letterSpacing: '0.5px', fontFamily: 'Arial, sans-serif' }}>Progress</div>
            <div style={{ padding: '14px 16px', fontSize: '0.8rem', fontWeight: '700', color: '#7c7c9a', textTransform: 'uppercase', letterSpacing: '0.5px', fontFamily: 'Arial, sans-serif' }}>Link</div>
          </div>

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
                      <p style={{ margin: '4px 0 0 0', fontSize: '0.75rem', color: '#7c7c9a', fontFamily: 'Arial, sans-serif' }}>⏱ ~{course.duration}</p>
                    )}
                  </div>
                  <div style={{ padding: '16px' }}>
                    {course.category && (
                      <span style={{ backgroundColor: '#ede9fe', color: '#6d28d9', padding: '4px 10px', borderRadius: '99px', fontSize: '0.78rem', fontFamily: 'Arial, sans-serif', fontWeight: '600' }}>
                        {course.category}
                      </span>
                    )}
                  </div>
                  <div style={{ padding: '12px 16px', display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap' }} onClick={(e) => e.stopPropagation()}>
                    {!status && (
                      <button
                        disabled={isBusy}
                        onClick={() => handleEnroll(course.id)}
                        style={{ padding: '5px 12px', borderRadius: '7px', border: '1.5px solid #4f46e5', fontSize: '0.75rem', fontWeight: '600', fontFamily: 'Arial, sans-serif', cursor: isBusy ? 'default' : 'pointer', transition: 'all 0.15s', backgroundColor: isBusy ? '#e8e8f0' : '#4f46e5', color: 'white' }}
                      >
                        {isBusy ? '...' : 'Enroll'}
                      </button>
                    )}
                    {isInProgress && (
                      <>
                        <span style={{ padding: '5px 10px', borderRadius: '7px', border: '1.5px solid #86efac', fontSize: '0.75rem', fontWeight: '600', fontFamily: 'Arial, sans-serif', backgroundColor: '#f0fdf4', color: '#16a34a' }}>
                          ● In Progress
                        </span>
                        <button
                          disabled={isBusy}
                          onClick={() => handleCourseStatus(course.id, 'COMPLETED')}
                          style={{ padding: '5px 10px', borderRadius: '7px', border: '1.5px solid #d1d5db', fontSize: '0.75rem', fontWeight: '600', fontFamily: 'Arial, sans-serif', cursor: isBusy ? 'default' : 'pointer', transition: 'all 0.15s', backgroundColor: 'white', color: '#6b7280' }}
                        >
                          {isBusy ? '...' : 'Mark Done'}
                        </button>
                      </>
                    )}
                    {isCompleted && (
                      <span style={{ padding: '5px 10px', borderRadius: '7px', border: '1.5px solid #93c5fd', fontSize: '0.75rem', fontWeight: '600', fontFamily: 'Arial, sans-serif', backgroundColor: '#eff6ff', color: '#2563eb' }}>
                        ✓ Completed
                      </span>
                    )}
                  </div>
                  <div style={{ padding: '16px' }} onClick={(e) => e.stopPropagation()}>
                    <a href={course.url} target="_blank" rel="noopener noreferrer" style={{ padding: '6px 12px', borderRadius: '8px', backgroundColor: '#4f46e5', color: 'white', fontSize: '0.8rem', fontWeight: '600', textDecoration: 'none', fontFamily: 'Arial, sans-serif' }}>
                      Open →
                    </a>
                  </div>
                </div>

                {/* expanded row */}
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
};

export default CoursesPage;
