import Link from "next/link";

export default function Pricing() {
  return (
    <div style={{
      backgroundColor: '#111827',
      color: 'white',
      fontFamily: 'sans-serif',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
    }}>
      <header style={{
        padding: '1rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid #374151'
      }}>
        <h1 style={{ fontSize: '1.5rem' }}>My Awesome App</h1>
        <nav>
          <ul style={{ listStyle: 'none', display: 'flex', gap: '1rem' }}>
            <li><Link href="/" style={{ textDecoration: 'none', color: 'white' }}>Home</Link></li>
            <li><Link href="/pricing" style={{ textDecoration: 'none', color: 'white' }}>Pricing</Link></li>
            <li><Link href="/contact" style={{ textDecoration: 'none', color: 'white' }}>Contact</Link></li>
          </ul>
        </nav>
      </header>

      <main style={{
        flex: '1',
        padding: '2rem',
        textAlign: 'center'
      }}>
        <h2 style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '1rem' }}>Pricing Plans</h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '2rem',
          marginTop: '4rem'
        }}>
          <div style={{
            backgroundColor: '#1F2937',
            padding: '2rem',
            borderRadius: '0.5rem',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>Basic</h3>
            <p style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>$10</p>
            <p style={{ color: '#9CA3AF', marginBottom: '2rem' }}>per month</p>
            <ul style={{ listStyle: 'none', marginBottom: '2rem', textAlign: 'left' }}>
              <li style={{ marginBottom: '0.5rem' }}>Feature 1</li>
              <li style={{ marginBottom: '0.5rem' }}>Feature 2</li>
              <li style={{ marginBottom: '0.5rem' }}>Feature 3</li>
            </ul>
            <button style={{
              backgroundColor: '#3B82F6',
              color: 'white',
              padding: '0.75rem 1.5rem',
              borderRadius: '0.5rem',
              border: 'none',
              fontSize: '1rem',
              cursor: 'pointer'
            }}>
              Choose Plan
            </button>
          </div>

          <div style={{
            backgroundColor: '#1F2937',
            padding: '2rem',
            borderRadius: '0.5rem',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>Pro</h3>
            <p style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>$25</p>
            <p style={{ color: '#9CA3AF', marginBottom: '2rem' }}>per month</p>
            <ul style={{ listStyle: 'none', marginBottom: '2rem', textAlign: 'left' }}>
              <li style={{ marginBottom: '0.5rem' }}>All Basic Features</li>
              <li style={{ marginBottom: '0.5rem' }}>Feature 4</li>
              <li style={{ marginBottom: '0.5rem' }}>Feature 5</li>
            </ul>
            <button style={{
              backgroundColor: '#3B82F6',
              color: 'white',
              padding: '0.75rem 1.5rem',
              borderRadius: '0.5rem',
              border: 'none',
              fontSize: '1rem',
              cursor: 'pointer'
            }}>
              Choose Plan
            </button>
          </div>
        </div>
      </main>

      <footer style={{
        padding: '1rem 2rem',
        textAlign: 'center',
        borderTop: '1px solid #374151'
      }}>
        <p>&copy; 2024 My Awesome App. All rights reserved.</p>
      </footer>
    </div>
  );
}
