import React from 'react';
import './about.css'; // Import the corresponding CSS file

export default function About() {
    return (
        <div className="about-container">
            <header className="about-header">
                <h1>Discover Our Music Heaven!</h1>
                <p>The ultimate destination to find the perfect soundtrack for your life's moments.</p>
            </header>

            <section className="about-section mission">
                <h2 className="section-title">Our Mission</h2>
                <div className="mission-card">
                    <p>Our mission is simple: to make music accessible anytime, anywhere. We aim to connect you with millions of songs, help you discover new artists, and curate the perfect playlists for every mood and occasion, all in one seamless platform.</p>
                </div>
            </section>

            <section className="about-section features">
                <h2 className="section-title">Key Features</h2>
                <ul className="features-list">
                    <li>
                        <h3>Vast and Diverse Library</h3>
                        <p>From the latest trending hits to the old-school classics, explore a library spanning every genre, language, and era.</p>
                    </li>
                    <li>
                        <h3>Personalized Discovery</h3>
                        <p>Our intelligent recommendation engine learns your taste in music and suggests songs and artists you'll love, guaranteed.</p>
                    </li>
                    <li>
                        <h3>Seamless Playback</h3>
                        <p>Enjoy uninterrupted, high-quality audio streaming across all your devices, whether you're at home or on the go.</p>
                    </li>
                    <li>
                        <h3>Curated Collections</h3>
                        <p>Dive into expertly crafted playlists for working out, relaxing, studying, or partying—always updated and ready to play.</p>
                    </li>
                </ul>
            </section>
            
            <section className="about-section team">
                <h2 className="section-title">Our Team</h2>
                <p>We are a passionate team of developers, designers, and, most importantly, music lovers. We constantly strive to improve this platform to ensure you have the best possible listening experience. Your feedback is what drives the next feature we build!</p>
            </section>

            <footer className="about-footer">
                <p>Thank you for choosing our Music Heaven...</p>
            </footer>
        </div>
    );
}