import React from 'react';

interface KeepLearningCardsProps {
  onRevisitQuiz: () => void;
  onRetakeQuiz: () => void;
}

export const KeepLearningCards: React.FC<KeepLearningCardsProps> = ({
  onRevisitQuiz,
  onRetakeQuiz,
}) => {
  return (
    <div style={{ marginTop: '2.5rem' }}>
      <h3 className="g-section-heading">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
          <path d="M6 6h10" />
          <path d="M6 10h10" />
        </svg>
        Keep Learning
      </h3>

      <div className="g-keep-learning-grid">
        {/* Card 1: Review Exam Answers */}
        <button
          type="button"
          className="g-learn-card"
          onClick={onRevisitQuiz}
          aria-label="Review all quiz answers with detailed explanations"
        >
          <span className="g-learn-icon">🔍</span>
          <span className="g-learn-title">Review Answers</span>
          <span className="g-learn-desc">Inspect your choices against the verified SCERT answer key.</span>
        </button>

        {/* Card 2: Revise Flashcards */}
        <a
          href="/revision"
          className="g-learn-card"
          aria-label="Revise with high-yield syllabus flashcards"
        >
          <span className="g-learn-icon">⚡</span>
          <span className="g-learn-title">Revise Flashcards</span>
          <span className="g-learn-desc">Rapid-fire memory retention cards for high-yield dates & formulas.</span>
        </a>

        {/* Card 3: Study Notes */}
        <a
          href="/notes"
          className="g-learn-card"
          aria-label="Read in-depth study notes across all syllabus units"
        >
          <span className="g-learn-icon">📚</span>
          <span className="g-learn-title">Study Guides</span>
          <span className="g-learn-desc">Access 600+ curated notes on Polity, History, and Economy.</span>
        </a>

        {/* Card 4: Retake Quiz */}
        <button
          type="button"
          className="g-learn-card"
          onClick={onRetakeQuiz}
          aria-label="Retake the quiz to improve your score"
        >
          <span className="g-learn-icon">🔄</span>
          <span className="g-learn-title">Retake Quiz</span>
          <span className="g-learn-desc">Reset answers and practice again for a 100% mastery score.</span>
        </button>
      </div>
    </div>
  );
};
