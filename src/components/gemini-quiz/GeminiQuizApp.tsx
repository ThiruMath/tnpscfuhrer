import React, { useState, useEffect, useMemo } from 'react';
import type { QuizQuestion, QuizSubmission, QuizPerformanceReport } from '../../types/quiz';
import { DEMO_QUIZ_QUESTIONS, GEMINI_QUIZ_DEMO_METADATA } from '../../data/geminiQuizDemo';
import { calculateQuizPerformance, formatTimeSeconds } from '../../utils/quizScorer';
import { QuizQuestionCard } from './QuizQuestionCard';
import { PerformanceReportView } from './PerformanceReportView';
import { QuestionReviewModal } from './QuestionReviewModal';

export const GeminiQuizApp: React.FC = () => {
  const [viewState, setViewState] = useState<'start' | 'quiz' | 'summary' | 'review'>('start');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [submission, setSubmission] = useState<QuizSubmission | null>(null);
  const [performanceReport, setPerformanceReport] = useState<QuizPerformanceReport | null>(null);

  const questions: QuizQuestion[] = DEMO_QUIZ_QUESTIONS;
  const currentQuestion = questions[currentIndex];

  // Timer while quiz is active
  useEffect(() => {
    if (viewState !== 'quiz') return;
    const interval = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [viewState]);

  // Answer selection handler (supports changing/re-selecting before submit)
  const handleSelectOption = (optionIndex: number) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: optionIndex,
    }));
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleSkip = () => {
    // If not answered, keep as skipped or move forward
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    const sub: QuizSubmission = {
      quizId: GEMINI_QUIZ_DEMO_METADATA.id,
      title: GEMINI_QUIZ_DEMO_METADATA.title,
      startedAt: new Date(Date.now() - elapsedSeconds * 1000).toISOString(),
      completedAt: new Date().toISOString(),
      totalTimeSeconds: elapsedSeconds,
      selectedAnswers,
    };

    const report = calculateQuizPerformance(questions, sub);

    // Save attempt to localStorage for dashboard history
    try {
      const existingHistoryStr = localStorage.getItem('tnpsc_gemini_quiz_history');
      const history = existingHistoryStr ? JSON.parse(existingHistoryStr) : [];
      history.unshift({
        id: Date.now(),
        date: new Date().toLocaleString(),
        score: report.score,
        total: report.totalQuestions,
        accuracy: report.accuracyPercentage,
        timeSpent: formatTimeSeconds(elapsedSeconds),
      });
      localStorage.setItem('tnpsc_gemini_quiz_history', JSON.stringify(history.slice(0, 10)));
    } catch {
      // LocalStorage access fallback (e.g. private mode)
    }

    setSubmission(sub);
    setPerformanceReport(report);
    setViewState('summary');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRetakeQuiz = () => {
    setSelectedAnswers({});
    setCurrentIndex(0);
    setElapsedSeconds(0);
    setSubmission(null);
    setPerformanceReport(null);
    setViewState('quiz');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Progress metrics
  const answeredCount = useMemo(() => {
    return Object.values(selectedAnswers).filter((v) => v !== undefined && v !== -1).length;
  }, [selectedAnswers]);

  const progressPercent = Math.round(((currentIndex + 1) / questions.length) * 100);

  return (
    <div className="gemini-quiz-root">
      <div className="gemini-quiz-container">
        {/* Navigation & Header */}
        <header className="g-quiz-header">
          <div className="g-header-title-wrap">
            <a
              href="/dashboard"
              className="g-btn g-btn-ghost"
              style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
              title="Return to Project Dashboard"
            >
              ← Dashboard
            </a>
            <span className="g-quiz-badge">Gemini-Style Quiz Lab</span>
          </div>

          <div className="g-quiz-meta">
            {viewState === 'quiz' && (
              <span>⏱ {formatTimeSeconds(elapsedSeconds)}</span>
            )}
          </div>
        </header>

        {/* ── START SCREEN ──────────────────────────────────────────────── */}
        {viewState === 'start' && (
          <div className="g-report-card" style={{ textAlign: 'center' }}>
            <span className="g-quiz-badge" style={{ marginBottom: '1rem' }}>
              Standard TNPSC Assessment
            </span>
            <h1 className="g-results-title">{GEMINI_QUIZ_DEMO_METADATA.title}</h1>
            <p className="g-results-intro" style={{ marginBottom: '2rem' }}>
              {GEMINI_QUIZ_DEMO_METADATA.description}
            </p>

            {/* Assessment Specs Grid */}
            <div className="g-score-metrics-grid" style={{ marginBottom: '2.5rem' }}>
              <div className="g-metric-card">
                <span className="g-metric-val">{questions.length}</span>
                <span className="g-metric-label">Curated Questions</span>
              </div>
              <div className="g-metric-card">
                <span className="g-metric-val">{GEMINI_QUIZ_DEMO_METADATA.recommendedDurationMinutes}m</span>
                <span className="g-metric-label">Recommended Time</span>
              </div>
              <div className="g-metric-card">
                <span className="g-metric-val">6</span>
                <span className="g-metric-label">Syllabus Subjects</span>
              </div>
            </div>

            {/* Covered Syllabus Topics */}
            <div style={{ textAlign: 'left', background: 'var(--g-surface-elevated)', padding: '1.5rem', borderRadius: 'var(--g-radius-md)', marginBottom: '2.5rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.75rem', color: 'var(--g-text-primary)' }}>
                Syllabus Units Tested in this Diagnostic:
              </h3>
              <ul style={{ color: 'var(--g-text-secondary)', fontSize: '0.9rem', lineHeight: '1.8', margin: 0, paddingLeft: '1.25rem' }}>
                <li>Indian Polity: Constitutional Remedies (Article 32) & Panchayati Raj (73rd Amendment)</li>
                <li>History & Culture: Pallava Architecture (Shore Temple) & V.O.C. Swadeshi Navigation</li>
                <li>Tamil Heritage: Thirukkural structure & Aimperumkappiyam (Silappadikaram)</li>
                <li>Indian Economy: Reserve Bank Repo Rates & NITI Aayog Transition</li>
                <li>General Science: Vitamin deficiencies & Scurvy etiology</li>
                <li>Geography of Tamil Nadu: Cauvery River drainage system & tributaries</li>
              </ul>
            </div>

            <button
              type="button"
              className="g-btn g-btn-primary"
              style={{ fontSize: '1.1rem', padding: '1rem 2.5rem' }}
              onClick={() => {
                setViewState('quiz');
                setElapsedSeconds(0);
              }}
            >
              Start Diagnostic Exam →
            </button>
          </div>
        )}

        {/* ── QUIZ IN-PROGRESS SCREEN ───────────────────────────────────── */}
        {viewState === 'quiz' && (
          <div>
            {/* Top Progress Row */}
            <div className="g-progress-bar-wrap">
              <div className="g-progress-track">
                <div
                  className="g-progress-fill"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              <div className="g-progress-meta-row">
                <span>
                  Question {currentIndex + 1} of {questions.length}
                </span>
                <div className="g-indicator-dots">
                  {questions.map((q, i) => {
                    const isAnswered = selectedAnswers[q.id] !== undefined && selectedAnswers[q.id] !== -1;
                    const isActive = i === currentIndex;
                    return (
                      <span
                        key={q.id}
                        className={`g-dot ${isActive ? 'active' : isAnswered ? 'answered' : ''}`}
                        title={`Question ${i + 1}`}
                      />
                    );
                  })}
                </div>
                <span>{answeredCount} answered</span>
              </div>
            </div>

            {/* Active Question Card */}
            <QuizQuestionCard
              question={currentQuestion}
              currentIndex={currentIndex}
              totalQuestions={questions.length}
              selectedOptionIndex={selectedAnswers[currentQuestion.id]}
              onSelectOption={handleSelectOption}
              onNext={handleNext}
              onPrevious={handlePrevious}
              onSkip={handleSkip}
              onSubmit={handleSubmit}
              isFirst={currentIndex === 0}
              isLast={currentIndex === questions.length - 1}
            />
          </div>
        )}

        {/* ── SUMMARY / PERFORMANCE REPORT SCREEN ───────────────────────── */}
        {viewState === 'summary' && performanceReport && (
          <PerformanceReportView
            report={performanceReport}
            onReviewAnswers={() => {
              setViewState('review');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onRetakeQuiz={handleRetakeQuiz}
          />
        )}

        {/* ── DETAILED QUESTION REVIEW SCREEN ───────────────────────────── */}
        {viewState === 'review' && submission && (
          <QuestionReviewModal
            questions={questions}
            submission={submission}
            onBackToSummary={() => {
              setViewState('summary');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}
      </div>
    </div>
  );
};
