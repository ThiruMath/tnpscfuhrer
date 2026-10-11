import React, { useState, useEffect } from 'react';
import { GEMINI_QUIZ_DEMO_METADATA } from '../../data/geminiQuizDemo';

interface AttemptRecord {
  id: number;
  date: string;
  score: number;
  total: number;
  accuracy: number;
  timeSpent: string;
}

export const ProjectDashboard: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [attempts, setAttempts] = useState<AttemptRecord[]>([]);
  const [currentPassword, setCurrentPassword] = useState('Thiru@1432');
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [statusFeedback, setStatusFeedback] = useState('');

  // Check login state and stored password
  useEffect(() => {
    try {
      const storedPass = localStorage.getItem('tnpsc_portal_pass') || 'Thiru@1432';
      setCurrentPassword(storedPass);

      const authSession = sessionStorage.getItem('tnpsc_portal_auth') || localStorage.getItem('tnpsc_portal_auth');
      if (authSession === 'true') {
        setIsAuthenticated(true);
      }

      const storedHistory = localStorage.getItem('tnpsc_gemini_quiz_history');
      if (storedHistory) {
        setAttempts(JSON.parse(storedHistory));
      }
    } catch {
      // Storage fallback
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput.trim() === currentPassword) {
      setIsAuthenticated(true);
      setErrorMsg('');
      try {
        sessionStorage.setItem('tnpsc_portal_auth', 'true');
        localStorage.setItem('tnpsc_portal_auth', 'true');
      } catch {}
    } else {
      setErrorMsg('Incorrect password. Please try again.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPasswordInput('');
    try {
      sessionStorage.removeItem('tnpsc_portal_auth');
      localStorage.removeItem('tnpsc_portal_auth');
    } catch {}
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPasswordInput.trim().length < 4) {
      setStatusFeedback('Password must be at least 4 characters.');
      return;
    }
    const updated = newPasswordInput.trim();
    setCurrentPassword(updated);
    try {
      localStorage.setItem('tnpsc_portal_pass', updated);
    } catch {}
    setStatusFeedback('Password updated successfully!');
    setNewPasswordInput('');
    setTimeout(() => {
      setStatusFeedback('');
      setShowPasswordChange(false);
    }, 2000);
  };

  const handleClearHistory = () => {
    if (confirm('Clear all local quiz attempt records?')) {
      setAttempts([]);
      try {
        localStorage.removeItem('tnpsc_gemini_quiz_history');
      } catch {}
    }
  };

  // ── 1. Password Gate Screen ──────────────────────────────────────────────
  if (!isAuthenticated) {
    return (
      <div className="gemini-quiz-root" style={{ justifyContent: 'center' }}>
        <div className="g-gate-card">
          <div className="g-gate-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>

          <h1 className="g-results-title" style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>
            Project Lab Login
          </h1>
          <p style={{ color: 'var(--g-text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            Enter your passcode to access your private Project Dashboard and Gemini Assessment Engine.
          </p>

          <form onSubmit={handleLogin}>
            <input
              type="password"
              className="g-input"
              placeholder="Enter passcode"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              autoFocus
              required
            />

            {errorMsg && (
              <p style={{ color: 'var(--g-error-text)', fontSize: '0.85rem', marginBottom: '1rem' }}>
                {errorMsg}
              </p>
            )}

            <button type="submit" className="g-btn g-btn-primary" style={{ width: '100%', marginBottom: '1rem' }}>
              Unlock Dashboard →
            </button>
          </form>

          <div style={{ marginTop: '1.5rem', padding: '0.75rem', background: 'var(--g-surface-elevated)', borderRadius: 'var(--g-radius-sm)', fontSize: '0.8rem', color: 'var(--g-text-muted)' }}>
            <span>Default Passcode: </span>
            <code style={{ color: 'var(--g-blue)', background: 'rgba(138, 180, 248, 0.1)', padding: '2px 6px', borderRadius: '4px' }}>
              Thiru@1432
            </code>
          </div>
        </div>
      </div>
    );
  }

  // ── 2. Authenticated Dashboard Screen ─────────────────────────────────────
  return (
    <div className="gemini-quiz-root">
      <div className="gemini-quiz-container">
        {/* Top Navbar */}
        <header className="g-quiz-header">
          <div className="g-header-title-wrap">
            <span className="g-quiz-badge">Lab Portal Active</span>
            <span style={{ fontSize: '0.9rem', color: 'var(--g-text-secondary)' }}>
              Project Control Center
            </span>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              type="button"
              className="g-btn g-btn-ghost"
              style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
              onClick={() => setShowPasswordChange(!showPasswordChange)}
            >
              ⚙ Security
            </button>
            <button
              type="button"
              className="g-btn g-btn-ghost"
              style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem', color: 'var(--g-error-text)' }}
              onClick={handleLogout}
            >
              Sign Out
            </button>
          </div>
        </header>

        {/* Change Password Panel (toggleable) */}
        {showPasswordChange && (
          <div className="g-question-card" style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.5rem' }}>
              Update Dashboard Passcode
            </h3>
            <form onSubmit={handleChangePassword} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <input
                type="password"
                className="g-input"
                style={{ maxWidth: '300px', margin: 0 }}
                placeholder="Enter new passcode"
                value={newPasswordInput}
                onChange={(e) => setNewPasswordInput(e.target.value)}
                required
              />
              <button type="submit" className="g-btn g-btn-primary" style={{ padding: '0.7rem 1.25rem' }}>
                Save Passcode
              </button>
              {statusFeedback && (
                <span style={{ color: 'var(--g-blue)', fontSize: '0.85rem' }}>{statusFeedback}</span>
              )}
            </form>
          </div>
        )}

        {/* Hero Card: New Project Launchpad */}
        <section className="g-report-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
            <div>
              <span className="g-quiz-badge" style={{ marginBottom: '0.75rem' }}>
                New Active Project
              </span>
              <h1 className="g-results-title" style={{ fontSize: '1.85rem', marginBottom: '0.5rem' }}>
                Gemini-Style Quiz & AI Performance Report
              </h1>
              <p style={{ color: 'var(--g-text-secondary)', fontSize: '0.95rem', maxWidth: '600px', lineHeight: '1.6' }}>
                A modern diagnostic assessment module replicating Gemini's dark charcoal quiz design,
                animated SVG score gauge, deterministic strengths/focus areas, and Keep Learning study guides.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <a
                href="/quiz/gemini"
                className="g-btn g-btn-primary"
                style={{ fontSize: '1rem', padding: '0.9rem 1.8rem' }}
              >
                🚀 Launch Quiz App →
              </a>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="g-score-metrics-grid" style={{ marginBottom: '1.5rem' }}>
            <div className="g-metric-card">
              <span className="g-metric-val" style={{ color: 'var(--g-blue)' }}>10</span>
              <span className="g-metric-label">Demo Questions Ready</span>
            </div>
            <div className="g-metric-card">
              <span className="g-metric-val correct">6</span>
              <span className="g-metric-label">TNPSC Syllabus Units</span>
            </div>
            <div className="g-metric-card">
              <span className="g-metric-val" style={{ color: 'var(--g-text-primary)' }}>{attempts.length}</span>
              <span className="g-metric-label">Completed Attempts</span>
            </div>
          </div>
        </section>

        {/* Past Attempts History Section */}
        <section className="g-report-card" style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 className="g-section-heading" style={{ margin: 0 }}>
              <span>📊</span> Recent Performance Log
            </h2>
            {attempts.length > 0 && (
              <button
                type="button"
                className="g-btn g-btn-ghost"
                style={{ fontSize: '0.8rem', padding: '0.3rem 0.6rem' }}
                onClick={handleClearHistory}
              >
                Clear Log
              </button>
            )}
          </div>

          {attempts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2.5rem', background: 'var(--g-surface-elevated)', borderRadius: 'var(--g-radius-md)' }}>
              <p style={{ color: 'var(--g-text-muted)', marginBottom: '1rem' }}>
                No quiz attempts logged yet on this device.
              </p>
              <a href="/quiz/gemini" className="g-btn g-btn-primary" style={{ padding: '0.6rem 1.25rem', fontSize: '0.9rem' }}>
                Take Your First Quiz Now →
              </a>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '0.75rem' }}>
              {attempts.map((att) => (
                <div
                  key={att.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: 'var(--g-surface-elevated)',
                    border: '1px solid var(--g-border-subtle)',
                    padding: '1rem 1.25rem',
                    borderRadius: 'var(--g-radius-sm)',
                    flexWrap: 'wrap',
                    gap: '0.75rem',
                  }}
                >
                  <div>
                    <span style={{ fontWeight: 600, fontSize: '1rem', color: 'var(--g-text-primary)' }}>
                      Score: {att.score} / {att.total}
                    </span>
                    <span style={{ fontSize: '0.85rem', color: 'var(--g-text-muted)', marginLeft: '1rem' }}>
                      {att.date}
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <span
                      style={{
                        padding: '0.2rem 0.6rem',
                        borderRadius: 'var(--g-radius-full)',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        background: att.accuracy >= 70 ? 'var(--g-correct-bg)' : 'rgba(138, 180, 248, 0.1)',
                        color: att.accuracy >= 70 ? 'var(--g-correct-text)' : 'var(--g-blue)',
                      }}
                    >
                      {att.accuracy}% Accuracy
                    </span>
                    <span style={{ fontSize: '0.85rem', color: 'var(--g-text-muted)' }}>
                      ⏱ {att.timeSpent}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Quick Nav to Website Sections */}
        <section className="g-report-card">
          <h2 className="g-section-heading">
            <span>🌐</span> Explore TNPSC Fuhrer Resources
          </h2>
          <div className="g-keep-learning-grid" style={{ marginTop: '1rem' }}>
            <a href="/pyq" className="g-learn-card">
              <span className="g-learn-icon">📝</span>
              <span className="g-learn-title">PYQ Bank</span>
              <span className="g-learn-desc">Official past year exam questions with checkmarks.</span>
            </a>
            <a href="/syllabus" className="g-learn-card">
              <span className="g-learn-icon">📋</span>
              <span className="g-learn-title">Syllabus Matrix</span>
              <span className="g-learn-desc">Group 2, 2A, and Group 4 unit mapping.</span>
            </a>
            <a href="/notes" className="g-learn-card">
              <span className="g-learn-icon">📚</span>
              <span className="g-learn-title">Study Notes</span>
              <span className="g-learn-desc">Over 600 structured markdown lesson notes.</span>
            </a>
            <a href="/revision" className="g-learn-card">
              <span className="g-learn-icon">⚡</span>
              <span className="g-learn-title">Flashcards</span>
              <span className="g-learn-desc">High-speed revision and memory drills.</span>
            </a>
          </div>
        </section>
      </div>
    </div>
  );
};
