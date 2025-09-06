import { useState } from 'react'
import './App.css'
import { supabase, isSupabaseConfigured } from './lib/supabase.js'
import { SuccessModal } from './components/SuccessModal.jsx'

function App() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [subscribedEmail, setSubscribedEmail] = useState('')

  async function handleSubscribe(event) {
    event.preventDefault()
    const isValid = /[^@\s]+@[^@\s]+\.[^@\s]+/.test(email)
    if (!isValid) {
      setMessage('Please enter a valid email address.')
      return
    }
    if (!isSupabaseConfigured) {
      setMessage('Subscription service is not configured yet.')
      return
    }
    try {
      setIsSubmitting(true)
      setMessage('')
      const { error } = await supabase
        .from('subscribers')
        .insert({
          email,
          source: 'skoolboots-landing',
          created_at: new Date().toISOString(),
        })
      if (error) {
        if (
          error.code === '23505' ||
          (error.message && error.message.toLowerCase().includes('duplicate key'))
        ) {
          setMessage('This email is already subscribed. ✅')
          return
        }
        throw error
      }

      setSubscribedEmail(email)
      setShowSuccessModal(true)
      setEmail('')
    } catch (err) {
      setMessage('Something went wrong. Please try again later.')
    } finally {
      setIsSubmitting(false)
    }
  }

  function closeSuccessModal() {
    setShowSuccessModal(false)
    setSubscribedEmail('')
  }

  const subjects = [
    'Mathematics',
    'Physics',
    'Chemistry',
    'Biology',
    'Computer Science',
    'Further Maths',
  ]

  const highlights = [
    { value: 'Top 1%', label: 'Tutors across Africa' },
    { value: '50k+', label: 'Hours of tutoring delivered' },
    { value: '24', label: 'Countries represented' },
  ]

  const steps = [
    { title: 'Tell us your goals', desc: 'Exam prep, homework help, or mastery — we tailor the plan.' },
    { title: 'Match with a top tutor', desc: 'We hand-match you to elite subject specialists.' },
    { title: 'Start in 24 hours', desc: 'Flexible sessions online or in-person where available.' },
  ]

  const tutors = [
    { name: 'Adaeze · Mathematics', stat: '98th percentile', blurb: 'IB HL and A-Level specialist' },
    { name: 'Kwame · Physics', stat: 'Cambridge First', blurb: 'Mechanics & Electricity' },
    { name: 'Zainab · Chemistry', stat: 'PhD Candidate', blurb: 'Organic & Physical Chem' },
  ]

  const testimonials = [
    { quote: 'My daughter went from a C to an A in 8 weeks.', author: 'Chinwe, Lagos' },
    { quote: 'The matching was instant and the tutor was world-class.', author: 'Samuel, Accra' },
    { quote: 'Best STEM prep we have used — structured, caring, effective.', author: 'Amina, Nairobi' },
  ]

  return (
    <div className="sb-page" role="main">
      <header className="sb-header">
        <div className="brand">
          <div className="brand-mark" aria-label="Skoolboots logo">SB</div>
          <div className="brand-name">Skoolboots</div>
        </div>
        <nav className="sb-nav" aria-label="Primary">
          <a href="#subjects">Subjects</a>
          <a href="#how">How it works</a>
          <a href="#tutors">Tutors</a>
          <a href="#testimonials">Stories</a>
          <a className="cta-small" href="#get-started">Get started</a>
        </nav>
      </header>

      <section className="hero">
        <div className="hero-content">
          <div className="eyebrow">Africa’s best STEM tutors</div>
          <h1 className="title">Master STEM with elite tutors — matched in 24 hours</h1>
          <p className="subtitle">
            Skoolboots connects students with top 1% tutors across Africa for Mathematics, Physics,
            Chemistry, Biology and Computer Science. Smarter prep. Better results.
          </p>
          <div className="hero-ctas">
            <a href="#get-started" className="primary-cta">Find a tutor</a>
            <a href="#subjects" className="secondary-cta">Explore subjects</a>
          </div>
          <div className="highlights" role="list">
            {highlights.map((h) => (
              <div className="highlight" role="listitem" key={h.label}>
                <div className="highlight-value">{h.value}</div>
                <div className="highlight-label">{h.label}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="hero-visual" aria-hidden="true">
          <div className="beam beam-1" />
          <div className="beam beam-2" />
          <div className="beam beam-3" />
          <div className="orb" />
        </div>
      </section>

      <section id="subjects" className="subjects">
        <h2 className="section-title">Subjects we cover</h2>
        <div className="subjects-grid">
          {subjects.map((s) => (
            <div key={s} className="subject-card">{s}</div>
          ))}
        </div>
      </section>

      <section id="how" className="how">
        <h2 className="section-title">How it works</h2>
        <ol className="steps">
          {steps.map((s, i) => (
            <li key={s.title} className="step">
              <div className="step-badge">{i + 1}</div>
              <div className="step-content">
                <div className="step-title">{s.title}</div>
                <div className="step-desc">{s.desc}</div>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section id="tutors" className="tutors">
        <h2 className="section-title">Meet a few of our tutors</h2>
        <div className="tutor-grid">
          {tutors.map((t) => (
            <article className="tutor-card" key={t.name}>
              <div className="tutor-top">
                <div className="avatar" aria-hidden="true" />
                <div className="tutor-name">{t.name}</div>
              </div>
              <div className="tutor-stat">{t.stat}</div>
              <div className="tutor-blurb">{t.blurb}</div>
            </article>
          ))}
        </div>
      </section>

      <section id="testimonials" className="testimonials">
        <h2 className="section-title">Parents and students love Skoolboots</h2>
        <div className="testimonial-grid">
          {testimonials.map((t) => (
            <blockquote className="testimonial" key={t.quote}>
              <p>“{t.quote}”</p>
              <footer>— {t.author}</footer>
            </blockquote>
          ))}
        </div>
      </section>

      <section id="get-started" className="cta">
        <div className="cta-inner">
          <h2 className="cta-title">Get matched to a tutor</h2>
          <p className="cta-subtitle">Join the waitlist — we’ll notify you when your perfect tutor is available.</p>
          <form className="subscribe" onSubmit={handleSubscribe} noValidate>
            <label htmlFor="email" className="visually-hidden">Email address</label>
            <input
              id="email"
              className="email-input"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-describedby="subscribe-help"
              required
            />
            <button className="subscribe-button" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting…' : 'Join waitlist'}
            </button>
          </form>
          <div id="subscribe-help" className="subscribe-help" aria-live="polite">{message}</div>
        </div>
      </section>

      <footer className="sb-footer">
        <span>© {new Date().getFullYear()} Skoolboots</span>
        <span className="dot">|</span>
        <span>All Rights Reserved</span>
      </footer>

      <SuccessModal
        isOpen={showSuccessModal}
        onClose={closeSuccessModal}
        email={subscribedEmail}
      />
    </div>
  )
}

export default App
