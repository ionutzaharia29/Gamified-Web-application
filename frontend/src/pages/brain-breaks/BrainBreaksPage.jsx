import { useNavigate } from 'react-router-dom';

const GAMES = [
  {
    id: 'tic-tac-toe',
    title: 'Tic Tac Toe',
    description: 'Challenge yourself or a friend in the classic 3×3 strategy game.',
    icon: '⭕',
    path: '/dashboard/brain-breaks/tic-tac-toe',
  },
  {
    id: 'cyber-typer',
    title: 'Cyber Typer',
    description: 'A fast-paced typing mini-game where students type coding terms and snippets as quickly and accurately as possible to improve their typing speed.',
    icon: '⌨️',
    path: '/dashboard/brain-breaks/cyber-typer',
  },
];

const BrainBreaksPage = () => {
  const navigate = useNavigate();

  return (
    <section>
      {/* page header */}
      <div style={{ marginBottom: '28px' }}>
        <h2 style={{ margin: '0 0 8px 0', fontSize: '1.4rem', fontWeight: '700', color: '#1a1a2e' }}>
          Brain Breaks
        </h2>
        <p style={{ margin: 0, fontSize: '0.95rem', color: '#7c7c9a', fontFamily: 'Arial, sans-serif' }}>
          Take a short mental break between study sessions. Pick an activity below.
        </p>
      </div>

      {/* game cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '20px' }}>
        {GAMES.map((game) => (
          <div
            key={game.id}
            onClick={() => navigate(game.path)}
            style={{
              backgroundColor: 'white',
              borderRadius: '16px',
              padding: '28px 24px',
              boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
              cursor: 'pointer',
              border: '2px solid transparent',
              transition: 'border-color 0.2s, box-shadow 0.2s, transform 0.15s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#4f46e5';
              e.currentTarget.style.boxShadow = '0 6px 24px rgba(79,70,229,0.15)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'transparent';
              e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.06)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <span style={{ fontSize: '2.4rem', display: 'block', marginBottom: '14px' }}>{game.icon}</span>
            <p style={{ margin: '0 0 8px 0', fontSize: '1rem', fontWeight: '700', color: '#1a1a2e' }}>
              {game.title}
            </p>
            <p style={{ margin: '0 0 20px 0', fontSize: '0.85rem', color: '#7c7c9a', fontFamily: 'Arial, sans-serif', lineHeight: 1.5 }}>
              {game.description}
            </p>
            <span style={{ fontSize: '0.8rem', fontWeight: '600', color: '#4f46e5', fontFamily: 'Arial, sans-serif' }}>
              Play →
            </span>
          </div>
        ))}

        {/* filler card */}
        <div style={{ backgroundColor: '#f8f8fc', borderRadius: '16px', padding: '28px 24px', border: '2px dashed #e8e8f0', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '160px', gap: '8px' }}>
          <span style={{ fontSize: '1.8rem' }}>🎮</span>
          <p style={{ margin: 0, fontSize: '0.85rem', color: '#7c7c9a', fontFamily: 'Arial, sans-serif', textAlign: 'center' }}>
            More activities coming soon
          </p>
        </div>
      </div>
    </section>
  );
};

export default BrainBreaksPage;
