import React, { useState } from 'react';
import type { QuizQuestion, QuizSubmission } from '../../types/quiz';

interface QuestionReviewProps {
  questions: QuizQuestion[];
  submission: QuizSubmission;
  onBackToSummary: () => void;
}

export const QuestionReviewModal: React.FC<QuestionReviewProps> = ({
  questions,
  submission,
  onBackToSummary,
}) => {
  const [filter, setFilter] = useState<'all' | 'incorrect' | 'correct' | 'skipped'>('all');

  const filteredQuestions = questions.filter((q) => {
    const userSelected = submission.selectedAnswers[q.id];
    const isSkipped = userSelected === undefined || userSelected === -1;
    const isCorrect = userSelected === q.correctAnswer;

    if (filter === 'incorrect') return !isSkipped && !isCorrect;
    if (filter === 'correct') return isCorrect;
    if (filter === 'skipped') return isSkipped;
    return true;
  });

  return (
    <section className="g-report-card" aria-label="Detailed Question Review">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 className="g-results-title" style={{ fontSize: '1.6rem', marginBottom: '0.25rem' }}>
            Detailed Answer Review
          </h2>
          <p style={{ color: 'var(--g-text-secondary)', fontSize: '0.9rem' }}>
            Review each response against verified TNPSC answer keys and SCERT curriculum sources.
          </p>
        </div>

        <button
          type="button"
          className="g-btn g-btn-primary"
          onClick={onBackToSummary}
        >
          ← Return to Score Summary
        </button>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        {(['all', 'incorrect', 'correct', 'skipped'] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            className={`g-btn ${filter === tab ? 'g-btn-primary' : 'g-btn-secondary'}`}
            style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', textTransform: 'capitalize' }}
            onClick={() => setFilter(tab)}
          >
            {tab} Questions
          </button>
        ))}
      </div>

      {/* Questions Review List */}
      <div className="g-review-list">
        {filteredQuestions.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--g-text-muted)' }}>
            No questions found matching the "{filter}" filter.
          </div>
        ) : (
          filteredQuestions.map((q, idx) => {
            const userSelected = submission.selectedAnswers[q.id];
            const isSkipped = userSelected === undefined || userSelected === -1;
            const isCorrect = userSelected === q.correctAnswer;
            const statusClass = isCorrect ? 'is-correct' : isSkipped ? 'is-skipped' : 'is-incorrect';
            const badgeClass = isCorrect ? 'correct' : isSkipped ? 'skipped' : 'incorrect';

            return (
              <div key={q.id} className={`g-review-item ${statusClass}`}>
                <div className="g-review-meta">
                  <span style={{ fontSize: '0.85rem', color: 'var(--g-text-muted)', fontWeight: 600 }}>
                    Question {idx + 1} of {questions.length} • {q.topic}
                  </span>
                  <span className={`g-review-status-badge ${badgeClass}`}>
                    {isCorrect ? '✓ Correct' : isSkipped ? '⚠ Skipped' : '✗ Incorrect'}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.15rem', lineHeight: '1.5', margin: '0.5rem 0 0.75rem', fontWeight: 500 }}>
                  {q.question}
                </h3>

                {q.questionTamil && (
                  <p style={{ fontFamily: 'var(--g-font-tamil)', color: 'var(--g-text-secondary)', fontSize: '0.95rem', marginBottom: '1.25rem' }}>
                    {q.questionTamil}
                  </p>
                )}

                {/* Options Review Breakdown */}
                <div style={{ display: 'grid', gap: '0.6rem', marginTop: '1rem' }}>
                  {q.options.map((opt, optIdx) => {
                    const isUserChoice = userSelected === optIdx;
                    const isVerifiedAnswer = q.correctAnswer === optIdx;

                    let optStyle: React.CSSProperties = {
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      padding: '0.75rem 1rem',
                      borderRadius: 'var(--g-radius-sm)',
                      background: 'var(--g-surface)',
                      border: '1px solid var(--g-border-subtle)',
                      fontSize: '0.925rem',
                    };

                    if (isVerifiedAnswer) {
                      optStyle.borderColor = 'var(--g-correct-border)';
                      optStyle.background = 'var(--g-correct-bg)';
                      optStyle.color = 'var(--g-correct-text)';
                    } else if (isUserChoice && !isCorrect) {
                      optStyle.borderColor = 'var(--g-error-border)';
                      optStyle.background = 'var(--g-error-bg)';
                      optStyle.color = 'var(--g-error-text)';
                    }

                    return (
                      <div key={opt.id} style={optStyle}>
                        <span style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.8rem',
                          fontWeight: 700,
                          background: isVerifiedAnswer ? 'var(--g-correct-solid)' : isUserChoice ? 'var(--g-error-solid)' : 'var(--g-surface-elevated)',
                          color: (isVerifiedAnswer || isUserChoice) ? '#FFF' : 'var(--g-text-secondary)',
                        }}>
                          {opt.id}
                        </span>
                        <div style={{ flex: 1 }}>
                          <span>{opt.text}</span>
                          {opt.textTamil && (
                            <span style={{ display: 'block', fontSize: '0.85rem', opacity: 0.8, fontFamily: 'var(--g-font-tamil)' }}>
                              {opt.textTamil}
                            </span>
                          )}
                        </div>
                        {isVerifiedAnswer && (
                          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--g-correct-text)' }}>
                            [Verified Correct]
                          </span>
                        )}
                        {isUserChoice && !isVerifiedAnswer && (
                          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--g-error-text)' }}>
                            [Your Answer]
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Rationale Box */}
                <div className="g-review-rationale-box">
                  <div className="g-review-rationale-title">
                    <span>💡</span> Explanation & Syllabus Reference
                  </div>
                  <p>{q.explanation}</p>
                  {q.explanationTamil && (
                    <p style={{ marginTop: '0.35rem', fontFamily: 'var(--g-font-tamil)' }}>
                      {q.explanationTamil}
                    </p>
                  )}
                  {q.sourceDocument && (
                    <div className="g-source-ref">
                      Verified Curriculum Source: {q.sourceDocument} {q.pageNumber && `(Page ${q.pageNumber})`}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <button
          type="button"
          className="g-btn g-btn-primary"
          onClick={onBackToSummary}
        >
          ← Return to Score Summary
        </button>
      </div>
    </section>
  );
};
