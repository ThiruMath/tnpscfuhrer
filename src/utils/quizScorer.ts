import type {
  QuizQuestion,
  QuizSubmission,
  QuizPerformanceReport,
  TopicStat,
  SyllabusRecommendation,
} from '../types/quiz';

/**
 * Maps syllabus topics/subjects to functional local routes within TNPSC Fuhrer.
 */
function resolveTopicStudyUrl(subject: string, topic: string): string {
  const s = subject.toLowerCase();
  const t = topic.toLowerCase();

  if (s.includes('tamil') || t.includes('sangam') || t.includes('kural')) {
    return '/tamil-literature';
  }
  if (s.includes('math') || t.includes('aptitude')) {
    return '/math';
  }
  if (s.includes('history') || t.includes('pallava') || t.includes('kingdom')) {
    return '/notes';
  }
  if (s.includes('polity') || t.includes('constitution') || t.includes('panchayat')) {
    return '/notes';
  }
  if (s.includes('economy') || t.includes('banking') || t.includes('niti')) {
    return '/notes';
  }
  return '/syllabus';
}

export function formatTimeSeconds(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (mins === 0) return `${secs}s`;
  return `${mins}m ${secs.toString().padStart(2, '0')}s`;
}

export function calculateQuizPerformance(
  questions: QuizQuestion[],
  submission: QuizSubmission
): QuizPerformanceReport {
  let correctCount = 0;
  let incorrectCount = 0;
  let skippedCount = 0;

  const topicMap: Record<string, { subject: string; questionIds: string[]; correct: number; total: number }> = {};

  questions.forEach((q) => {
    if (!topicMap[q.topic]) {
      topicMap[q.topic] = {
        subject: q.subject,
        questionIds: [],
        correct: 0,
        total: 0,
      };
    }

    topicMap[q.topic].total += 1;
    topicMap[q.topic].questionIds.push(q.id);

    const userSelected = submission.selectedAnswers[q.id];

    if (userSelected === undefined || userSelected === -1) {
      skippedCount += 1;
    } else if (userSelected === q.correctAnswer) {
      correctCount += 1;
      topicMap[q.topic].correct += 1;
    } else {
      incorrectCount += 1;
    }
  });

  const totalQuestions = questions.length;
  const score = correctCount;
  const accuracyPercentage = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

  // Generate topic stats
  const topicStats: TopicStat[] = Object.entries(topicMap).map(([topic, data]) => {
    const accuracy = Math.round((data.correct / data.total) * 100);
    let status: TopicStat['status'] = 'needs-focus';
    if (accuracy >= 80) status = 'mastered';
    else if (accuracy >= 50) status = 'proficient';

    return {
      topic,
      subject: data.subject,
      total: data.total,
      correct: data.correct,
      accuracy,
      questionIds: data.questionIds,
      status,
    };
  });

  // Sort topic stats by accuracy descending
  topicStats.sort((a, b) => b.accuracy - a.accuracy);

  // Identify strengths (accuracy >= 65% or top 2)
  const strengthTopics = topicStats.filter((t) => t.accuracy >= 65);
  const strengths = (strengthTopics.length > 0 ? strengthTopics : topicStats.slice(0, 1)).map((t) => ({
    topic: t.topic,
    subject: t.subject,
    accuracy: t.accuracy,
    insight: `Demonstrated accurate recall in ${t.topic} (${t.correct}/${t.total} questions verified).`,
  }));

  // Identify focus areas (accuracy < 65% or bottom topics)
  const weakTopics = topicStats.filter((t) => t.accuracy < 65);
  const focusAreas = (weakTopics.length > 0 ? weakTopics : topicStats.slice(-1)).map((t) => {
    const studyUrl = resolveTopicStudyUrl(t.subject, t.topic);
    const rec: SyllabusRecommendation = {
      topic: t.topic,
      subject: t.subject,
      description: `Revisit ${t.subject} fundamentals and practice previous year variations on ${t.topic}.`,
      studyNoteUrl: studyUrl,
      relatedQuestionIds: t.questionIds,
      priority: t.accuracy === 0 ? 'high' : 'medium',
    };

    return {
      topic: t.topic,
      subject: t.subject,
      accuracy: t.accuracy,
      insight: `Scored ${t.correct} out of ${t.total} (${t.accuracy}%). Key conceptual nuances need revision before exam day.`,
      recommendation: rec,
    };
  });

  // Personalized summary narrative
  let personalizedSummary = '';
  if (accuracyPercentage >= 80) {
    personalizedSummary = `Exceptional mastery! You secured ${score}/${totalQuestions} (${accuracyPercentage}%), demonstrating high-level exam readiness. Keep sharpening time-management and fine-tuning edge cases in ${focusAreas.length > 0 ? focusAreas[0].topic : 'advanced topics'}.`;
  } else if (accuracyPercentage >= 60) {
    personalizedSummary = `Solid performance! You scored ${score}/${totalQuestions} (${accuracyPercentage}%), clearing the standard preliminary cutoff threshold. Reinforcing high-yield areas like ${focusAreas.map(f => f.topic).slice(0, 2).join(' & ')} will push you into the top percentiles.`;
  } else if (accuracyPercentage >= 40) {
    personalizedSummary = `Good diagnostic attempt with ${score}/${totalQuestions} correct. You have a dependable grasp in ${strengths.map(s => s.topic).slice(0, 1).join(', ')}, but dedicated revision in ${focusAreas.map(f => f.topic).slice(0, 2).join(' & ')} will quickly build scoring momentum.`;
  } else {
    personalizedSummary = `Foundational benchmark established (${score}/${totalQuestions}). Use the detailed rationale and study notes below to systematically master core syllabus units one topic at a time.`;
  }

  return {
    score,
    totalQuestions,
    accuracyPercentage,
    correctCount,
    incorrectCount,
    skippedCount,
    timeSpentFormatted: formatTimeSeconds(submission.totalTimeSeconds),
    personalizedSummary,
    strengths,
    focusAreas,
    topicStats,
    generatedAt: new Date().toISOString(),
    isAiEnhanced: false,
  };
}
