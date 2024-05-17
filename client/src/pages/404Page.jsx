const NotFoundPage = () => {
  return (
    <div className="section" style={styles.section}>
      <div className="center-content">
        <h1 className="error" style={styles.error}>404</h1>
        <div className="page" style={styles.page}>Ooops!!! The page you are looking for is not found</div>
        <a className="back-home" href="/home" style={styles.backHome}>Back to home</a>
      </div>
    </div>
  );
};

const styles = {
  section: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    textAlign: 'center',
    fontFamily: 'sans-serif',
    backgroundColor: '#E7FFFF',
  },
  centerContent: {
    maxWidth: '400px',
    width: '100%',
    padding: '0 20px',
  },
  error: {
    fontSize: '150px',
    color: '#008B62',
    textShadow: '1px 1px 1px #00593E, 2px 2px 1px #00593E, 3px 3px 1px #00593E, 4px 4px 1px #00593E, 5px 5px 1px #00593E, 6px 6px 1px #00593E, 7px 7px 1px #00593E, 8px 8px 1px #00593E, 25px 25px 8px rgba(0,0,0, 0.2)',
  },
  page: {
    margin: '2rem 0',
    fontSize: '20px',
    fontWeight: '600',
    color: '#444',
  },
  backHome: {
    display: 'inline-block',
    border: '2px solid #222',
    color: '#fff',
    textTransform: 'uppercase',
    fontWeight: '600',
    padding: '0.75rem 1rem 0.6rem',
    transition: 'all 0.2s linear',
    boxShadow: '0 15px 15px -11px rgba(0,0,0, 0.4)',
    background: '#222',
    borderRadius: '6px',
  },
};

export default NotFoundPage;
