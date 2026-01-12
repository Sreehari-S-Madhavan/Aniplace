import './Home.css'

/**
 * Home Page Component
 * 
 * Landing page of AniHub.
 * Shows welcome message and quick links to main features.
 */
function Home() {
  return (
    <div className="home-page">
      <section className="hero">
        <h1>Welcome to AniHub</h1>
        <p>Your ultimate destination for anime and manga discovery</p>
        <div className="hero-buttons">
          <a href="/browse" className="btn-primary">Browse Anime</a>
          <a href="/discussions" className="btn-secondary">Join Discussions</a>
        </div>
      </section>

      <section className="features">
        <h2>What You Can Do</h2>
        <div className="features-grid">
          <div className="feature-card">
            <h3>🔍 Discover</h3>
            <p>Browse thousands of anime and manga titles</p>
          </div>
          <div className="feature-card">
            <h3>📊 Track</h3>
            <p>Keep track of what you're watching and reading</p>
          </div>
          <div className="feature-card">
            <h3>💬 Discuss</h3>
            <p>Share your thoughts and debate with the community</p>
          </div>
          <div className="feature-card">
            <h3>📺 Legal Streaming</h3>
            <p>Find where to legally watch your favorite anime</p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
