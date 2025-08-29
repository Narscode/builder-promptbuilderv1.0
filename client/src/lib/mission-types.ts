export interface MissionCardData {
  id: string;
  title: string;
  icon: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD' | 'EXPERT';
  pointsPerQuestion: number;
  description: string;
  totalQuestions: number;
  colorScheme: 'red' | 'amber' | 'emerald' | 'purple' | 'blue' | 'orange';
  progress?: {
    questionsCompleted: number;
    isCompleted: boolean;
    totalScore: number;
  };
}

export interface QuestionData {
  id: string;
  type: 'drag-drop' | 'image' | 'text' | 'audio' | 'social' | 'video' | 'multiple-choice';
  questionText: string;
  content: Record<string, any>;
  correctAnswer: string;
  explanation: string;
  newsUrl?: string;
}

export interface UserStats {
  totalScore: number;
  missionsCompleted: number;
  achievements: string[];
  globalRank: number | null;
  level: string;
}

export interface LeaderboardEntry {
  id: string;
  username: string;
  totalScore: number;
  level: string;
  rank: number;
}

export interface SubmitAnswerResult {
  isCorrect: boolean;
  pointsEarned: number;
  explanation: string;
  newsUrl?: string;
  questionsCompleted: number;
  isCompleted: boolean;
}
