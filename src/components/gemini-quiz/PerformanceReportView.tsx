import React from 'react';
import type { QuizPerformanceReport } from '../../types/quiz';
import { ScoreGauge } from './ScoreGauge';
import { KeepLearningCards } from './KeepLearningCards';

interface PerformanceReportViewProps {
  report: QuizPerformanceReport;
  onReviewAnswers: () => void;
  onRetakeQuiz: () => void;
}

export const PerformanceReportView: React.FC<PerformanceReportViewProps> = ({
  report,
  onReviewAnswers,
  onRetakeQuiz,
}) => {
  return (
    <div className="g-report-card" role="region" aria-label="AI Performance Report">
      {/* Results Hero Header */}
      <div className="g-results-hero">
        <span className="g-quiz-badge" style={{ marginBottom: '1rem' }}>
          Diagnostic Assessment Complete
        </span>
        <h1 className="g-results-title">AI Performance Report</h1>
        <p className="g-results-intro">{report.personalizedSummary}</p>
      </div>

      {/* Semicircular SVG Gauge */}
      <ScoreGauge
        score={report.score}
        total={report.totalQuestions}
        accuracyPercentage={report.accuracyPercentage}
      />

      {/* Accuracy & Breakdown Metrics Grid */}
      <div className="g-score-metrics-grid">
        <div className="g-metric-card">
          <span className="g-metric-val correct">{report.correctCount}</span>
          <span className="g-metric-label">Correct Answers</span>
        </div>
        <div className="g-metric-card">
          <span className="g-metric-val incorrect">{report.incorrectCount}</span>
          <span className="g-metric-label">Incorrect Answers</span>
        </div>
        <div className="g-metric-card">
          <span className="g-metric-val skipped">{report.skippedCount}</span>
          <span className="g-metric-label">Skipped / Unanswered</span>
        </div>
      </div>

      {/* Quick Actions Bar */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '3rem', flexWrap: 'wrap' }}>
        <button
          type="button"
          className="g-btn g-btn-primary"
          onClick={onReviewAnswers}
        >
          🔍 Review Detailed Answers
        </button>
        <button
          type="button"
          className="g-btn g-btn-secondary"
          onClick={onRetakeQuiz}
        >
          🔄 Retake Quiz
        </button>
      </div>

      {/* ── Strengths Section ─────────────────────────────────────────── */}
      <section style={{ marginBottom: '2.5rem' }}>
        <h3 className="g-section-heading">
          <span style={{ color: 'var(--g-correct-solid)' }}>⭐</span>
          Your Strengths
        </h3>
        <p style={{ color: 'var(--g-text-secondary)', fontSize: '0.9rem', marginBottom: '1rem' }}>
          Units where your recall accuracy met or exceeded preliminary qualifying standards:
        </p>
        <div className="g-strengths-grid">
          {report.strengths.map((st, i) => (
            <div key={i} className="g-insight-card strength">
              <div className="g-insight-top">
                <span className="g-insight-topic">{st.topic}</span>
                <span className="g-insight-acc" style={{ color: 'var(--g-correct-text)' }}>
                  {st.accuracy}% Accuracy
                </span>
              </div>
              <p className="g-insight-desc">{st.insight}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Focus Areas Section ───────────────────────────────────────── */}
      <section style={{ marginBottom: '2.5rem' }}>
        <h3 className="g-section-heading">
          <span style={{ color: 'var(--g-error-solid)' }}>🎯</span>
          Focus & Revision Areas
        </h3>
        <p style={{ color: 'var(--g-text-secondary)', fontSize: '0.9rem', marginBottom: '1rem' }}>
          Targeted topics with highest score upside. Click the revision guides to study high-yield notes:
        </p>
        <div className="g-focus-grid">
          {report.focusAreas.map((fa, i) => (
            <div key={i} className="g-insight-card focus">
              <div className="g-insight-top">
                <span className="g-insight-topic">{fa.topic}</span>
                <span className="g-insight-acc" style={{ color: 'var(--g-error-text)' }}>
                  {fa.accuracy}% Accuracy
                </span>
              </div>
              <p className="g-insight-desc">{fa.insight}</p>
              {fa.recommendation.studyNoteUrl && (
                <a
                  href={fa.recommendation.studyNoteUrl}
                  className="g-rec-link"
                >
                  📖 Open {fa.recommendation.subject} Study Guide →
                </a>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── Keep Learning Section ─────────────────────────────────────── */}
      <KeepLearningCards
        onRevisitQuiz={onReviewAnswers}
        onRetakeQuiz={onRetakeQuiz}
      />
    </div>
  );
};
