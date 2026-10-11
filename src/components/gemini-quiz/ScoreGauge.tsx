import React, { useEffect, useState } from 'react';

interface ScoreGaugeProps {
  score: number;
  total: number;
  accuracyPercentage: number;
}

export const ScoreGauge: React.FC<ScoreGaugeProps> = ({
  score,
  total,
  accuracyPercentage,
}) => {
  const [animatedPercent, setAnimatedPercent] = useState(0);

  // Semicircle arc perimeter: π * r = π * 85 ≈ 267
  const ARC_LENGTH = 267;

  useEffect(() => {
    // Smooth reveal animation
    const timer = setTimeout(() => {
      setAnimatedPercent(accuracyPercentage);
    }, 150);
    return () => clearTimeout(timer);
  }, [accuracyPercentage]);

  const strokeDashoffset = ARC_LENGTH - (ARC_LENGTH * animatedPercent) / 100;

  // Determine dynamic gradient accent
  const gradientStart = accuracyPercentage >= 70 ? '#81C995' : accuracyPercentage >= 50 ? '#8AB4F8' : '#F28B82';
  const gradientEnd = accuracyPercentage >= 70 ? '#34A853' : accuracyPercentage >= 50 ? '#C58AF9' : '#EA4335';

  return (
    <div className="g-score-gauge-wrap" role="img" aria-label={`Score: ${score} out of ${total}, ${accuracyPercentage}%`}>
      <svg className="g-gauge-svg" viewBox="0 0 200 115">
        <defs>
          <linearGradient id="geminiGaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={gradientStart} />
            <stop offset="100%" stopColor={gradientEnd} />
          </linearGradient>
        </defs>

        {/* Background Arc */}
        <path
          className="g-gauge-bg-path"
          d="M 15 100 A 85 85 0 0 1 185 100"
        />

        {/* Animated Fill Arc */}
        <path
          className="g-gauge-value-path"
          d="M 15 100 A 85 85 0 0 1 185 100"
          strokeDasharray={ARC_LENGTH}
          strokeDashoffset={strokeDashoffset}
        />
      </svg>

      <div className="g-gauge-content">
        <div className="g-gauge-percentage">{animatedPercent}%</div>
        <div className="g-gauge-score-sub">{score} / {total} Correct</div>
      </div>
    </div>
  );
};
