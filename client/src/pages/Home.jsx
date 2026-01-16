import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { Sparkles, Zap, ShieldCheck } from 'lucide-react'
import './Home.css'

function Home() {
  const targetRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end start"]
  })

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8])

  return (
    <div className="home-page">
      {/* Mesmerising Hero */}
      <section ref={targetRef} className="hero-section">
        <motion.div
          style={{ y, opacity, scale }}
          className="hero-parallax-bg"
        >
          <div className="hero-mesh"></div>
          <div className="art-layer sil-1"></div>
          <div className="art-layer sil-2"></div>
        </motion.div>

        <div className="hero-overlay"></div>

        <div className="container" style={{ position: 'relative', zIndex: 10 }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hero-content"
          >
            <div className="brand-tag">ANIPLACE EXCLUSIVE</div>

            <h1 className="glitch-text">Where Legends <br />Are Watched</h1>
            <p>Step into the ultimate digital sanctuary for anime enthusiasts. Track, discover, and immerse yourself in stories that redefine reality.</p>
            <div className="hero-buttons">
              <Link to="/register">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn btn-primary"
                >
                  Enter Sanctuary
                </motion.button>
              </Link>
              <Link to="/browse">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn btn-secondary"
                >
                  Scan Library
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>

        <div className="scroll-indicator">
          <div className="mouse"></div>
        </div>
      </section>

      {/* Feature Sections with Reveal */}
      <section className="feature-section container">
        {[
          {
            title: "Holographic Tracking",
            desc: "Your progress, visualized. Our precision tracking engine keeps your watch-list in perfect sync across all neural interfaces.",
            icon: <Zap className="feature-icon" />,
            rev: false
          },
          {
            title: "The Neural Library",
            desc: "Search through over 15k curated titles with sub-second latency. Character bios, deep-dive synopses, and community ratings at your fingertips.",
            icon: <Sparkles className="feature-icon" />,
            rev: true
          },
          {
            title: "Verified Channels",
            desc: "Direct access to official transmission nodes. Zero latency, 100% legal, supporting the creators who shape our world.",
            icon: <ShieldCheck className="feature-icon" />,
            rev: false
          }
        ].map((feature, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: feature.rev ? 50 : -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className={`feature-row ${feature.rev ? 'reverse' : ''}`}
          >
            <div className="feature-text">
              <div className="icon-box">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.desc}</p>
            </div>
            <div className="feature-hologram">
              <div className="hologram-effect"></div>
              <div className="hologram-circle"></div>
            </div>
          </motion.div>
        ))}
      </section>

      {/* CTA Section */}
      <section className="container cta-section">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          className="cta-card glass"
        >
          <h2>Begin Your Odyssey</h2>
          <p>Join the global sanctuary of anime enthusiasts. Experience tracking and discovery like never before.</p>
          <div className="cta-actions">
            <Link to="/register">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn btn-primary"
              >
                JOIN SANCTUARY
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  )
}

export default Home
