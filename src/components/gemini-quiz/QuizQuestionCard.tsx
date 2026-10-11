import React, { useEffect } from 'react';
import type { QuizQuestion } from '../../types/quiz';

interface QuizQuestionCardProps {
  question: QuizQuestion;
  currentIndex: number;
  totalQuestions: number;
  selectedOptionIndex?: number;
  onSelectOption: (optionIndex: number) => void;
  onNext: () => void;
  onPrevious: () => void;
  onSkip: () => void;
  onSubmit: () => void;
  isFirst: boolean;
  isLast: boolean;
  showFeedback?: boolean; // When in instant-feedback or review mode
}

export const QuizQuestionCard: React.FC<QuizQuestionCardProps> = ({
  question,
  currentIndex,
  totalQuestions,
  selectedOptionIndex,
  onSelectOption,
  onNext,
  onPrevious,
  onSkip,
  onSubmit,
  isFirst,
  isLast,
  showFeedback = false,
}) => {
  // Keyboard navigation listener (A, B, C, D / 1, 2, 3, 4)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is in an input or textarea
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      const key = e.key.toUpperCase();
      if (key === 'A' || key === '1') onSelectOption(0);
      else if (key === 'B' || key === '2') onSelectOption(1);
      else if (key === 'C' || key === '3') onSelectOption(2);
      else if (key === 'D' || key === '4') onSelectOption(3);
      else if (e.key === 'ArrowRight' && !isLast) onNext();
      else if (e.key === 'ArrowLeft' && !isFirst) onPrevious();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onSelectOption, onNext, onPrevious, isFirst, isLast]);

  return (
    <article className="g-question-card" aria-label={`Question ${currentIndex + 1} of ${totalQuestions}`}>
      {/* Topic Pill */}
      <div className="g-question-topic-pill">
        <span>{question.subject}</span>
        <span>•</span>
        <span className="sub">{question.topic}</span>
        {question.code && (
          <>
            <span>•</span>
            <span style={{ opacity: 0.7 }}>{question.code}</span>
          </>
        )}
      </div>

      {/* Question Text */}
      <h2 className="g-question-text">{question.question}</h2>

      {/* Tamil Question Translation */}
      {question.questionTamil && (
        <p className="g-question-tamil" lang="ta">
          {question.questionTamil}
        </p>
      )}

      {/* Options List */}
      <div
        className="g-options-list"
        role="radiogroup"
        aria-label="Answer options"
      >
        {question.options.map((opt, idx) => {
          const isSelected = selectedOptionIndex === idx;
          let extraClass = '';

          if (showFeedback) {
            if (idx === question.correctAnswer) {
              extraClass = 'correct';
            } else if (isSelected && idx !== question.correctAnswer) {
              extraClass = 'incorrect';
            }
          } else if (isSelected) {
            extraClass = 'selected';
          }

          return (
            <button
              key={opt.id}
              type="button"
              role="radio"
              aria-checked={isSelected}
              className={`g-option-card ${extraClass}`}
              onClick={() => onSelectOption(idx)}
            >
              <span className="g-opt-badge" aria-hidden="true">
                {opt.id}
              </span>
              <div className="g-opt-text-wrap">
                <span className="g-opt-text">{opt.text}</span>
                {opt.textTamil && (
                  <span className="g-opt-tamil" lang="ta">
                    {opt.textTamil}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Review Feedback Explanation (if active) */}
      {showFeedback && (
        <div className="g-review-rationale-box">
          <div className="g-review-rationale-title">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 16v-4" />
              <path d="M12 8h.01" />
            </svg>
            Verified Explanation
          </div>
          <p>{question.explanation}</p>
          {question.explanationTamil && (
            <p style={{ marginTop: '0.4rem', fontFamily: 'var(--g-font-tamil)' }} lang="ta">
              {question.explanationTamil}
            </p>
          )}
          {question.sourceDocument && (
            <div className="g-source-ref">
              Source: {question.sourceDocument} (Page {question.pageNumber})
            </div>
          )}
        </div>
      )}

      {/* Action Controls */}
      <footer className="g-quiz-actions">
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            type="button"
            className="g-btn g-btn-secondary"
            onClick={onPrevious}
            disabled={isFirst}
            aria-label="Previous question"
          >
            ← Previous
          </button>
          <button
            type="button"
            className="g-btn g-btn-ghost"
            onClick={onSkip}
            aria-label="Skip question"
          >
            Skip
          </button>
        </div>

        <div>
          {isLast ? (
            <button
              type="button"
              className="g-btn g-btn-primary"
              onClick={onSubmit}
            >
              Submit Exam ✓
            </button>
          ) : (
            <button
              type="button"
              className="g-btn g-btn-primary"
              onClick={onNext}
            >
              Next →
            </button>
          )}
        </div>
      </footer>
    </article>
  );
};
