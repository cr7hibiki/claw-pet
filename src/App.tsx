function App() {
  console.log('App rendered');
  
  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        padding: '60px',
        borderRadius: '30px',
        background: 'rgba(255, 255, 255, 0.15)',
        backdropFilter: 'blur(10px)',
        border: '2px solid rgba(255, 255, 255, 0.3)',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '120px', marginBottom: '20px' }}>🦞</div>
        <h1 style={{ margin: '0 0 10px 0', fontSize: '32px' }}>Claw-Pet</h1>
        <p style={{ margin: '0', fontSize: '18px', opacity: 0.9 }}>
          Live2D 桌面宠物应用
        </p>
        <p style={{ marginTop: '20px', fontSize: '14px', opacity: 0.7 }}>
          状态: 应用正常运行 ✓
        </p>
      </div>
    </div>
  );
}

export default App;
