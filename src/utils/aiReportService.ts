import type {
  AIQuizReportService,
  QuizPerformanceReport,
  QuizQuestion,
  QuizSubmission,
} from '../types/quiz';
import { calculateQuizPerformance } from './quizScorer';

/**
 * Mock / deterministic implementation of the AI Quiz Report Service (Phase 6).
 *
 * CRITICAL ARCHITECTURAL CONSTRAINTS:
 * 1. An AI-generated report MUST NEVER override the verified answer key or calculated score.
 * 2. Deterministic scores, question status, and accuracy metrics are computed first.
 * 3. AI commentary only enhances summaries, provides mnemonic learning tips, and syllabus guidance.
 * 4. API keys are never exposed in browser code.
 */
export class DeterministicQuizReportService implements AIQuizReportService {
  async generatePersonalizedReport(
    questions: QuizQuestion[],
    submission: QuizSubmission,
    deterministicScore: number
  ): Promise<Partial<QuizPerformanceReport>> {
    // Generate deterministic baseline report
    const baseline = calculateQuizPerformance(questions, submission);

    // AI enhancement layer (simulated deterministic intelligence)
    const enhancedSummary = `${baseline.personalizedSummary} [AI Synthesis: Verified score of ${deterministicScore}/${questions.length}. High retention observed in recall-based units; analytical question frameworks recommended.]`;

    return {
      personalizedSummary: enhancedSummary,
      isAiEnhanced: true,
    };
  }

  async explainQuestionRationale(
    question: QuizQuestion,
    userSelectedOptionIndex?: number
  ): Promise<string> {
    const isCorrect = userSelectedOptionIndex === question.correctAnswer;
    const correctOpt = question.options[question.correctAnswer];

    if (isCorrect) {
      return `Spot on! You correctly identified "${correctOpt.text}". Key takeaway: ${question.explanation}`;
    }

    if (userSelectedOptionIndex !== undefined && userSelectedOptionIndex >= 0) {
      const chosenOpt = question.options[userSelectedOptionIndex];
      return `You selected "${chosenOpt.text}", but the verified answer is "${correctOpt.text}". Why? ${question.explanation} (Reference: ${question.sourceDocument || 'TN SCERT Syllabus'})`;
    }

    return `This question was skipped. The verified correct answer is "${correctOpt.text}". Explanation: ${question.explanation}`;
  }
}

export const defaultAiReportService = new DeterministicQuizReportService();
