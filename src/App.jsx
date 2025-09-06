import { useState } from 'react'
import './App.css'
import { supabase, isSupabaseConfigured } from './lib/supabase.js'
import { SuccessModal } from './components/SuccessModal.jsx'

function App() {
  // Lead form state
  const [studentName, setStudentName] = useState('')
  const [parentName, setParentName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [city, setCity] = useState('')
  const [country, setCountry] = useState('')
  const [level, setLevel] = useState('')
  const [curriculum, setCurriculum] = useState('')
  const [selectedSubjects, setSelectedSubjects] = useState([])
  const [modality, setModality] = useState('')
  const [availability, setAvailability] = useState('')
  const [goals, setGoals] = useState('')
  const [timeline, setTimeline] = useState('')
  const [budgetRange, setBudgetRange] = useState('')
  const [referral, setReferral] = useState('')
  const [consent, setConsent] = useState(false)

  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [subscribedEmail, setSubscribedEmail] = useState('')

  function toggleSubject(subject) {
    setSelectedSubjects((prev) =>
      prev.includes(subject) ? prev.filter((s) => s !== subject) : [...prev, subject]
    )
  }

  function validateForm() {
    if (!studentName.trim()) return 'Please enter the student’s name.'
    if (!/[^@\s]+@[^@\s]+\.[^@\s]+/.test(email)) return 'Please enter a valid email address.'
    if (!country.trim()) return 'Please enter your country.'
    if (!level) return 'Please select the student level.'
    if (!curriculum) return 'Please select a curriculum.'
    if (selectedSubjects.length === 0) return 'Select at least one subject.'
    if (!modality) return 'Please select preferred learning mode.'
    if (!availability.trim()) return 'Please share availability (days and times).'
    if (!consent) return 'Please accept the privacy consent to proceed.'
    return ''
  }

  async function handleLeadSubmit(event) {
    event.preventDefault()
    const validationError = validateForm()
    if (validationError) {
      setMessage(validationError)
      return
    }
    if (!isSupabaseConfigured) {
      setMessage('Lead form service is not configured yet.')
      return
    }
    try {
      setIsSubmitting(true)
      setMessage('')
      const payload = {
        student_name: studentName,
        parent_name: parentName || null,
        email,
        phone: phone || null,
        city: city || null,
        country,
        level,
        curriculum,
        subjects: selectedSubjects,
        modality,
        availability,
        goals: goals || null,
        timeline: timeline || null,
        budget_range: budgetRange || null,
        referral: referral || null,
      }
      const { error } = await supabase
        .from('leads')
        .insert({
          ...payload,
          source: 'skoolboots-landing',
          created_at: new Date().toISOString(),
        })
      if (error) throw error

      setSubscribedEmail(email)
      setShowSuccessModal(true)
      // reset minimal fields
      setStudentName('')
      setParentName('')
      setEmail('')
      setPhone('')
      setCity('')
      setCountry('')
      setLevel('')
      setCurriculum('')
      setSelectedSubjects([])
      setModality('')
      setAvailability('')
      setGoals('')
      setTimeline('')
      setBudgetRange('')
      setReferral('')
      setConsent(false)
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
          <p className="cta-subtitle">Tell us a bit about the student. We’ll hand-match an elite STEM tutor.</p>
          <form className="lead-form" onSubmit={handleLeadSubmit} noValidate>
            <div className="form-row">
              <div className="form-field">
                <label htmlFor="studentName">Student name</label>
                <input id="studentName" type="text" value={studentName} onChange={(e) => setStudentName(e.target.value)} placeholder="First and last name" required />
              </div>
              <div className="form-field">
                <label htmlFor="parentName">Parent/Guardian (optional)</label>
                <input id="parentName" type="text" value={parentName} onChange={(e) => setParentName(e.target.value)} placeholder="Name of contact" />
              </div>
            </div>

            <div className="form-row">
              <div className="form-field">
                <label htmlFor="email">Email</label>
                <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@email.com" required />
              </div>
              <div className="form-field">
                <label htmlFor="phone">Phone (optional)</label>
                <input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+234 801 234 5678" />
              </div>
            </div>

            <div className="form-row">
              <div className="form-field">
                <label htmlFor="country">Country</label>
                <input id="country" type="text" value={country} onChange={(e) => setCountry(e.target.value)} placeholder="Nigeria" required />
              </div>
              <div className="form-field">
                <label htmlFor="city">City (optional)</label>
                <input id="city" type="text" value={city} onChange={(e) => setCity(e.target.value)} placeholder="Lagos" />
              </div>
            </div>

            <div className="form-row">
              <div className="form-field">
                <label htmlFor="level">Student level</label>
                <select id="level" value={level} onChange={(e) => setLevel(e.target.value)} required>
                  <option value="">Select level</option>
                  <option>Primary</option>
                  <option>Junior Secondary</option>
                  <option>Senior Secondary</option>
                  <option>IGCSE</option>
                  <option>Cambridge A-Level</option>
                  <option>IB</option>
                  <option>University</option>
                </select>
              </div>
              <div className="form-field">
                <label htmlFor="curriculum">Curriculum</label>
                <select id="curriculum" value={curriculum} onChange={(e) => setCurriculum(e.target.value)} required>
                  <option value="">Select curriculum</option>
                  <option>WAEC/NECO</option>
                  <option>IGCSE</option>
                  <option>Cambridge A-Level</option>
                  <option>IB</option>
                  <option>American</option>
                  <option>Other</option>
                </select>
              </div>
            </div>

            <div className="form-field">
              <label>Subjects of interest</label>
              <div className="pill-grid" role="group" aria-label="Subjects">
                {subjects.map((s) => (
                  <label key={s} className={`pill ${selectedSubjects.includes(s) ? 'selected' : ''}`}>
                    <input type="checkbox" checked={selectedSubjects.includes(s)} onChange={() => toggleSubject(s)} />
                    <span>{s}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="form-row">
              <div className="form-field">
                <label htmlFor="modality">Preferred mode</label>
                <select id="modality" value={modality} onChange={(e) => setModality(e.target.value)} required>
                  <option value="">Select mode</option>
                  <option>Online</option>
                  <option>In-person</option>
                  <option>Either</option>
                </select>
              </div>
              <div className="form-field">
                <label htmlFor="timeline">Timeline</label>
                <select id="timeline" value={timeline} onChange={(e) => setTimeline(e.target.value)}>
                  <option value="">Select timeline</option>
                  <option>Urgent (within a week)</option>
                  <option>Soon (2–4 weeks)</option>
                  <option>Exploring options</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-field">
                <label htmlFor="budget">Budget range (optional)</label>
                <select id="budget" value={budgetRange} onChange={(e) => setBudgetRange(e.target.value)}>
                  <option value="">Select range</option>
                  <option>Under $10/hour</option>
                  <option>$10–$20/hour</option>
                  <option>$20–$40/hour</option>
                  <option>$40+/hour</option>
                </select>
              </div>
              <div className="form-field">
                <label htmlFor="referral">How did you hear about us? (optional)</label>
                <select id="referral" value={referral} onChange={(e) => setReferral(e.target.value)}>
                  <option value="">Select one</option>
                  <option>Friend/Family</option>
                  <option>School</option>
                  <option>Social Media</option>
                  <option>Google</option>
                  <option>Other</option>
                </select>
              </div>
            </div>

            <div className="form-field">
              <label htmlFor="availability">Availability</label>
              <textarea id="availability" rows="2" value={availability} onChange={(e) => setAvailability(e.target.value)} placeholder="e.g., Weekdays 5–7pm, Saturdays 10–12pm" required />
            </div>

            <div className="form-field">
              <label htmlFor="goals">Goals (optional)</label>
              <textarea id="goals" rows="3" value={goals} onChange={(e) => setGoals(e.target.value)} placeholder="Tell us what success looks like." />
            </div>

            <div className="form-consent">
              <label className="consent">
                <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
                <span>I agree to be contacted about tutoring and accept the privacy policy.</span>
              </label>
              <button className="submit-lead" type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Submitting…' : 'Get matched'}
              </button>
            </div>

            <div id="subscribe-help" className="subscribe-help" aria-live="polite">{message}</div>
          </form>
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
