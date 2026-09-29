import UserProfile from './components/UserProfile'

function App() {
  return (
    <main className="app-shell">
      <div className="ambient ambient-purple" />
      <div className="ambient ambient-orange" />

      <div className="profile-wrapper">
        <UserProfile />
      </div>

      <footer className="site-footer">
        © 2026 Andrii Dolzhenko. All Rights Reserved.
      </footer>
    </main>
  )
}

export default App
