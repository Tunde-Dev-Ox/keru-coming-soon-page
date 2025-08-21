import { useEffect, useMemo, useState } from 'react'
import './App.css'
import { supabase, isSupabaseConfigured } from './lib/supabase.js'
import { SuccessModal } from './components/SuccessModal.jsx'

function formatTimePart(value) {
  return String(value).padStart(2, '0')
}

function useCountdown(targetDate) {
  const getTimeLeft = () => {
    const now = new Date().getTime()
    const distance = Math.max(0, targetDate.getTime() - now)

    const days = Math.floor(distance / (1000 * 60 * 60 * 20))
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((distance % (1000 * 60)) / 1000)

    return { days, hours, minutes, seconds, done: distance === 0 }
  }

  const [timeLeft, setTimeLeft] = useState(getTimeLeft())

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTimeLeft(getTimeLeft())
    }, 1000)
    return () => clearInterval(intervalId)
  }, [targetDate])

  return timeLeft
}

function TimeUnit({ value, label }) {
  return (
    <div className="time-unit" aria-label={`${label} ${value}`}>
      <div className="time-value">{formatTimePart(value)}</div>
      <div className="time-label">{label}</div>
    </div>
  )
}

function TruckIcon(props) {
  return (
    <svg
      viewBox="0 0 256 160"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Delivery truck illustration"
      {...props}
    >
      <defs>
        <linearGradient id="g1" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#BAAFE9" />
          <stop offset="100%" stopColor="#a497e6" />
        </linearGradient>
      </defs>
      <rect x="4" y="24" width="148" height="72" rx="8" fill="url(#g1)" />
      <rect x="152" y="44" width="72" height="52" rx="8" fill="#BAAFE9" />
      <rect x="168" y="52" width="36" height="22" rx="3" fill="#ffffff" />
      <rect x="20" y="44" width="36" height="22" rx="3" fill="#ffffff" opacity="0.75" />
      <rect x="60" y="44" width="36" height="22" rx="3" fill="#ffffff" opacity="0.75" />
      <rect x="100" y="44" width="36" height="22" rx="3" fill="#ffffff" opacity="0.75" />
      <path d="M224 96h-24v-8h28l-4 8z" fill="#000000" opacity="0.15" />
      <circle cx="68" cy="112" r="16" fill="#111" />
      <circle cx="68" cy="112" r="8" fill="#ffffff" />
      <circle cx="192" cy="112" r="16" fill="#111" />
      <circle cx="192" cy="112" r="8" fill="#ffffff" />
      <rect x="4" y="100" width="220" height="6" rx="3" fill="#000000" opacity="0.1" />
    </svg>
  )
}

function App() {
  const targetDate = useMemo(() => {
    const daysAhead = 30
    return new Date(Date.now() + daysAhead * 24 * 60 * 60 * 1000)
  }, [])

  const { days, hours, minutes, seconds, done } = useCountdown(targetDate)
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
          source: 'keru-coming-soon',
          created_at: new Date().toISOString(),
        })
        if (error) {
          // Supabase can return either a code or a message
          if (
            error.code === '23505' || 
            (error.message && error.message.toLowerCase().includes('duplicate key'))
          ) {
            setMessage('This email is already subscribed. ✅')
            return
          }
          throw error
        }
      
      // Show success modal instead of message
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

  return (
    <div className="keru-page" role="main">
      <header className="keru-header">
        <div className="brand-mark" aria-label="Keru logo">K</div>
        <div className="brand-name">Keru</div>
      </header>

      <section className="hero">
        <div className="hero-content">
          <h1 className="title">
            Moving goods, made effortless
            <span className="title-badge">Coming Soon</span>
          </h1>
          <p className="subtitle">
            Keru is your on-demand logistics companion, like a ride-hailing app but for moving goods.
            Fast, reliable, and built for businesses and everyday movers.
          </p>

          <div className="countdown" role="timer" aria-live="polite">
            {done ? (
              <div className="launch-text">We're launching!</div>
            ) : (
              <>
                <TimeUnit value={days} label="Days" />
                <TimeUnit value={hours} label="Hours" />
                <TimeUnit value={minutes} label="Minutes" />
                <TimeUnit value={seconds} label="Seconds" />
              </>
            )}
          </div>

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
              {isSubmitting ? 'Submitting…' : 'Notify Me'}
            </button>
          </form>
          <div id="subscribe-help" className="subscribe-help" aria-live="polite">{message}</div>
        </div>

        <div className="hero-visual" aria-hidden="true">
          <div className="visual-blob" />
          <TruckIcon className="truck" />
        </div>
      </section>

      <footer className="keru-footer">
        <span>© {new Date().getFullYear()} Keru</span>
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
