import { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';

const OverviewPage = () => {
  const { user } = useOutletContext();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [allCourses, setAllCourses] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [courseProgress, setCourseProgress] = useState({});

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

  const categories = ['All', ...Array.from(new Set(allCourses.map(c => c.category).filter(Boolean)))];

  const handleSearch = (e) => {
    e.preventDefault();
    const query = searchQuery.trim().toLowerCase();
    let results = allCourses;
    if (selectedCategory !== 'All') results = results.filter(c => c.category === selectedCategory);
    if (query) results = results.filter(c =>
      c.title?.toLowerCase().includes(query) ||
      c.notes?.toLowerCase().includes(query) ||
      c.category?.toLowerCase().includes(query)
    );
    setSearchResults(results);
    setHasSearched(true);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSearchResults([]);
    setHasSearched(false);
  };

  const completedCount = Object.values(courseProgress).filter(p => p.status === 'COMPLETED').length;

  return (
    <>
      {/* course search */}
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

          <button type="submit" style={{ padding: '14px 28px', borderRadius: '12px', border: 'none', backgroundColor: '#4f46e5', color: 'white', fontSize: '15px', fontWeight: '600', cursor: 'pointer', fontFamily: 'Arial, sans-serif', boxShadow: '0 4px 12px rgba(79,70,229,0.3)' }}>
            Search
          </button>

          {hasSearched && (
            <button type="button" onClick={handleClearSearch} style={{ padding: '14px 20px', borderRadius: '12px', border: '2px solid #e8e8f0', backgroundColor: 'white', color: '#7c7c9a', fontSize: '15px', cursor: 'pointer', fontFamily: 'Arial, sans-serif' }}>
              Clear
            </button>
          )}
        </form>

        {hasSearched && (
          <div style={{ marginTop: '16px' }}>
            <p style={{ fontSize: '0.85rem', color: '#7c7c9a', fontFamily: 'Arial, sans-serif', marginBottom: '12px' }}>
              {searchResults.length === 0
                ? 'No courses found. Try a different keyword or category.'
                : `${searchResults.length} course${searchResults.length !== 1 ? 's' : ''} found`}
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {searchResults.map((course, index) => (
                <li key={course.id || index} style={{ padding: '16px 20px', borderRadius: '12px', border: '1px solid #e8e8f0', marginBottom: '10px', backgroundColor: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
                  <div style={{ flex: 1 }}>
                    <span style={{ color: '#1a1a2e', fontSize: '1rem', fontWeight: '600', display: 'block', marginBottom: '6px' }}>{course.title}</span>
                    <span style={{ backgroundColor: '#ede9fe', color: '#6d28d9', padding: '3px 10px', borderRadius: '99px', fontSize: '0.78rem', fontFamily: 'Arial, sans-serif' }}>
                      {course.category || 'Uncategorized'}
                    </span>
                  </div>
                  <a href={course.url} target="_blank" rel="noopener noreferrer" style={{ padding: '8px 18px', borderRadius: '8px', backgroundColor: '#4f46e5', color: 'white', fontSize: '0.85rem', fontWeight: '600', textDecoration: 'none', fontFamily: 'Arial, sans-serif', whiteSpace: 'nowrap' }}>
                    Open →
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      {/* stats grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '36px' }}>
        {[
          { label: 'Current Level', value: user.level || user.currentLevel || 1, accent: '#4f46e5' },
          { label: 'Total XP',      value: user.xp || user.experiencePoints || 0, accent: '#f59e0b' },
          { label: 'Courses Done',  value: completedCount,                          accent: '#10b981' },
          { label: 'Badges',        value: 0,                                       accent: '#ef4444' },
        ].map((stat) => (
          <div key={stat.label} style={{ backgroundColor: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', borderTop: `4px solid ${stat.accent}` }}>
            <div style={{ fontSize: '2.2rem', fontWeight: '700', color: '#1a1a2e', lineHeight: 1, marginBottom: '6px' }}>{stat.value}</div>
            <div style={{ fontSize: '0.85rem', color: '#7c7c9a', fontFamily: 'Arial, sans-serif' }}>{stat.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {/* xp card */}
        <div style={{ backgroundColor: '#4f46e5', borderRadius: '16px', padding: '28px', boxShadow: '0 4px 20px rgba(79,70,229,0.3)', color: 'white' }}>
          <p style={{ fontSize: '0.85rem', opacity: 0.75, textTransform: 'uppercase', letterSpacing: '1px', fontFamily: 'Arial, sans-serif', margin: '0 0 8px 0' }}>Total Points</p>
          <p style={{ fontSize: '3rem', fontWeight: '700', lineHeight: 1, margin: '0 0 16px 0' }}>{user.xp || user.experiencePoints || 0} XP</p>
          <div style={{ backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '99px', height: '8px', marginBottom: '8px' }}>
            <div style={{ backgroundColor: 'white', borderRadius: '99px', height: '8px', width: `${Math.min((((user.xp || 0) % 150) / 150) * 100, 100)}%` }} />
          </div>
          <p style={{ fontSize: '0.8rem', opacity: 0.65, fontFamily: 'Arial, sans-serif', margin: 0 }}>
            {150 - ((user.xp || 0) % 150)} XP to reach Level {(user.level || user.currentLevel || 1) + 1}
          </p>
        </div>

        {/* activity card */}
        <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '28px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
          <p style={{ fontSize: '1.1rem', fontWeight: '700', color: '#1a1a2e', margin: '0 0 20px 0' }}>Activity Summary</p>
          {[
            { icon: '📚', value: completedCount,                             label: 'Courses Completed' },
            { icon: '🏆', value: 0,                                          label: 'Badges Earned' },
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
    </>
  );
};

export default OverviewPage;
