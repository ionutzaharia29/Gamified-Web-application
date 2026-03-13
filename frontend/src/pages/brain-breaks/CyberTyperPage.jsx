import { useNavigate } from 'react-router-dom';

const CyberTyperPage = () => {
  const navigate = useNavigate();

  return (
    <section>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
        <button
          onClick={() => navigate('/dashboard/brain-breaks')}
          style={{ background: 'none', border: '2px solid #e8e8f0', borderRadius: '10px', padding: '6px 14px', fontSize: '0.85rem', color: '#7c7c9a', cursor: 'pointer', fontFamily: 'Arial, sans-serif', fontWeight: '600' }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#4f46e5'; e.currentTarget.style.color = '#4f46e5'; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e8e8f0'; e.currentTarget.style.color = '#7c7c9a'; }}
        >
          ← Back
        </button>
        <h2 style={{ margin: 0, fontSize: '1.4rem', fontWeight: '700', color: '#1a1a2e' }}>Cyber Typer</h2>
      </div>

      <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '60px', textAlign: 'center', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
        <p style={{ fontSize: '3rem', margin: '0 0 12px 0' }}>⌨️</p>
        <p style={{ fontSize: '1.1rem', color: '#7c7c9a', fontFamily: 'Arial, sans-serif', margin: 0 }}>Game coming soon.</p>
      </div>
    </section>
  );
};

export default CyberTyperPage;
