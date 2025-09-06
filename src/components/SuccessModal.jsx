import { useEffect, useRef } from 'react'
import confetti from 'canvas-confetti'
import './SuccessModal.css'

export function SuccessModal({ isOpen, onClose, email }) {
  const modalRef = useRef(null)

  useEffect(() => {
    if (isOpen) {
      // Trigger confetti animation
      const duration = 3 * 1000
      const animationEnd = Date.now() + duration
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 }

      function randomInRange(min, max) {
        return Math.random() * (max - min) + min
      }

      const interval = setInterval(function() {
        const timeLeft = animationEnd - Date.now()

        if (timeLeft <= 0) {
          return clearInterval(interval)
        }

        const particleCount = 50 * (timeLeft / duration)
        
        // since particles fall down, start a bit higher than random
        confetti(Object.assign({}, defaults, {
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
        }))
        confetti(Object.assign({}, defaults, {
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
        }))
      }, 250)

      // Focus trap for accessibility
      const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
          onClose()
        }
      }
      document.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'

      return () => {
        clearInterval(interval)
        document.removeEventListener('keydown', handleKeyDown)
        document.body.style.overflow = 'unset'
      }
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content" 
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-labelledby="success-title"
        aria-describedby="success-description"
      >
        <button 
          className="modal-close" 
          onClick={onClose}
          aria-label="Close modal"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        
        <div className="modal-body">
          <div className="success-icon">
            <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
              <circle cx="32" cy="32" r="32" fill="#BAAFE9"/>
              <path d="M20 32L28 40L44 24" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          
          <h2 id="success-title" className="success-title">
            You’re on the Skoolboots list! 🎉
          </h2>
          
          <p id="success-description" className="success-description">
            Thanks for subscribing. We’ll keep you updated and get you matched to a top STEM tutor as soon as slots open up.
          </p>
          
          <div className="email-display">
            <span className="email-label">Subscribed with:</span>
            <span className="email-value">{email}</span>
          </div>
          
          <button className="modal-cta" onClick={onClose}>
            Got it!
          </button>
        </div>
      </div>
    </div>
  )
}
