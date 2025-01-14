import React from 'react';
import './Home.css';

const Home = () => {
  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Welcome to PTIT Platform</h1>
          <p>Discover amazing features and services</p>
          <button className="cta-button">Get Started</button>
        </div>
      </section>

      {/* Main Content */}
      <main className="main-content">
        <section className="features-section">
          <h2>Our Features</h2>
          <div className="features-grid">
            <div className="feature-card">
              <h3>Feature 1</h3>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
            </div>
            <div className="feature-card">
              <h3>Feature 2</h3>
              <p>Sed do eiusmod tempor incididunt ut labore et dolore.</p>
            </div>
            <div className="feature-card">
              <h3>Feature 3</h3>
              <p>Ut enim ad minim veniam, quis nostrud exercitation.</p>
            </div>
          </div>
        </section>

        <section className="news-section">
          <h2>Latest News</h2>
          <div className="news-grid">
            <div className="news-card">
              <div className="news-image"></div>
              <div className="news-content">
                <h3>News Title 1</h3>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                <a href="#" className="read-more">Read More</a>
              </div>
            </div>
            <div className="news-card">
              <div className="news-image"></div>
              <div className="news-content">
                <h3>News Title 2</h3>
                <p>Sed do eiusmod tempor incididunt ut labore et dolore.</p>
                <a href="#" className="read-more">Read More</a>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;
