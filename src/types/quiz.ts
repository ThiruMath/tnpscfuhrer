export type QuestionLanguage = 'en' | 'ta' | 'bilingual';

export interface QuizOption {
  id: string; // e.g., 'A', 'B', 'C', 'D'
  text: string;
  textTamil?: string;
}

export interface QuizQuestion {
  id: string;
  code?: string; // e.g. "TNPSC-2026-Q14"
  question: string;
  questionTamil?: string;
  language: QuestionLanguage;
  options: QuizOption[];
  correctAnswer: number; // 0-based index matching options
  explanation: string;
  explanationTamil?: string;
  sourceDocument?: string; // e.g. "11th Std History (Samacheer Kalvi)"
  pageNumber?: number | string;
  subject: string; // e.g. "History & Culture of India"
  topic: string; // e.g. "South Indian Kingdoms"
  subtopic?: string; // e.g. "Pallava & Chola Administration"
  syllabusConfidence: 'verified' | 'provisional';
  reviewStatus: 'reviewed' | 'pending';
  year?: number;
  examCode?: string; // e.g. "GRP2A", "GRP4"
}

export interface QuizSubmission {
  quizId: string;
  title: string;
  startedAt: string; // ISO string
  completedAt: string; // ISO string
  totalTimeSeconds: number;
  selectedAnswers: Record<string, number>; // questionId -> optionIndex (-1 or omitted if skipped)
  flaggedQuestionIds?: string[];
}

export interface TopicStat {
  topic: string;
  subject: string;
  total: number;
  correct: number;
  accuracy: number; // 0 to 100
  questionIds: string[];
  status: 'mastered' | 'proficient' | 'needs-focus';
}

export interface SyllabusRecommendation {
  topic: string;
  subject: string;
  description: string;
  studyNoteUrl?: string;
  relatedQuestionIds: string[];
  priority: 'high' | 'medium' | 'low';
}

export interface QuizPerformanceReport {
  score: number;
  totalQuestions: number;
  accuracyPercentage: number;
  correctCount: number;
  incorrectCount: number;
  skippedCount: number;
  timeSpentFormatted: string;
  personalizedSummary: string;
  strengths: {
    topic: string;
    subject: string;
    accuracy: number;
    insight: string;
  }[];
  focusAreas: {
    topic: string;
    subject: string;
    accuracy: number;
    insight: string;
    recommendation: SyllabusRecommendation;
  }[];
  topicStats: TopicStat[];
  generatedAt: string;
  isAiEnhanced: boolean;
}

/**
 * Service interface boundary for future AI integration (Phase 6).
 * Ground rule: AI generation can suggest rationales or personalized commentary,
 * but can NEVER override verified answers or calculated scores.
 */
export interface AIQuizReportService {
  generatePersonalizedReport(
    questions: QuizQuestion[],
    submission: QuizSubmission,
    deterministicScore: number
  ): Promise<Partial<QuizPerformanceReport>>;

  explainQuestionRationale(
    question: QuizQuestion,
    userSelectedOptionIndex?: number
  ): Promise<string>;
}
