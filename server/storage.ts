import { type User, type InsertUser, type Mission, type Question, type UserMissionProgress, type UserAnswer } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserScore(userId: string, additionalScore: number): Promise<User>;
  
  // Mission methods
  getAllMissions(): Promise<Mission[]>;
  getMission(id: string): Promise<Mission | undefined>;
  
  // Question methods
  getQuestionsByMissionId(missionId: string): Promise<Question[]>;
  getQuestion(id: string): Promise<Question | undefined>;
  
  // Progress methods
  getUserMissionProgress(userId: string, missionId: string): Promise<UserMissionProgress | undefined>;
  updateUserMissionProgress(userId: string, missionId: string, questionsCompleted: number, totalScore: number, isCompleted: boolean): Promise<UserMissionProgress>;
  
  // Answer methods
  saveUserAnswer(userId: string, questionId: string, userAnswer: string, isCorrect: boolean, pointsEarned: number): Promise<UserAnswer>;
  
  // Leaderboard
  getTopUsers(limit: number): Promise<User[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private missions: Map<string, Mission>;
  private questions: Map<string, Question>;
  private userMissionProgress: Map<string, UserMissionProgress>;
  private userAnswers: Map<string, UserAnswer>;

  constructor() {
    this.users = new Map();
    this.missions = new Map();
    this.questions = new Map();
    this.userMissionProgress = new Map();
    this.userAnswers = new Map();
    
    // Initialize with sample data
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Sample missions
    const sampleMissions: Mission[] = [
      {
        id: "spot-fake",
        title: "Spot the Fake",
        icon: "🔍",
        difficulty: "MEDIUM",
        pointsPerQuestion: 10,
        description: "Identify AI-generated content from real content. Test your ability to detect deepfakes, synthetic text, and manipulated media.",
        totalQuestions: 5,
        colorScheme: "red"
      },
      {
        id: "ethics",
        title: "Ethics Challenge",
        icon: "⚖️",
        difficulty: "HARD",
        pointsPerQuestion: 15,
        description: "Navigate complex ethical scenarios involving AI usage. Learn responsible AI practices and understand the impact on different communities.",
        totalQuestions: 4,
        colorScheme: "amber"
      },
      {
        id: "myths",
        title: "Myth Busters",
        icon: "💡",
        difficulty: "EASY",
        pointsPerQuestion: 8,
        description: "Debunk common misconceptions about AI and technology. Separate fact from fiction with evidence-based reasoning.",
        totalQuestions: 6,
        colorScheme: "emerald"
      },
      {
        id: "bias",
        title: "Bias Detective",
        icon: "🧠",
        difficulty: "EXPERT",
        pointsPerQuestion: 20,
        description: "Identify algorithmic bias and discrimination patterns in AI systems. Learn to recognize and address fairness issues.",
        totalQuestions: 7,
        colorScheme: "purple"
      },
      {
        id: "privacy",
        title: "Privacy Guardian",
        icon: "🔒",
        difficulty: "MEDIUM",
        pointsPerQuestion: 12,
        description: "Master data privacy principles and protection strategies. Learn to identify privacy risks and implement safeguards.",
        totalQuestions: 5,
        colorScheme: "blue"
      },
      {
        id: "misinformation",
        title: "Truth Seeker",
        icon: "📰",
        difficulty: "HARD",
        pointsPerQuestion: 18,
        description: "Combat misinformation and disinformation campaigns. Learn fact-checking techniques and source verification methods.",
        totalQuestions: 8,
        colorScheme: "orange"
      }
    ];

    sampleMissions.forEach(mission => {
      this.missions.set(mission.id, mission);
    });

    // Sample questions for "spot-fake" mission
    const spotFakeQuestions: Question[] = [
      {
        id: "q1-spot-fake",
        missionId: "spot-fake",
        type: "image",
        questionText: "Which of these images is AI-generated?",
        content: {
          optionA: { img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop", isAI: false },
          optionB: { img: "https://pixabay.com/get/g642309a52e8962ceab70082b09c898bdd50df77c9ec365390b0894105fe57c00095b22c3fdb3c7600c3624afabc78041f26e90809e58e6d494d1d9bab963e325_1280.jpg", isAI: true },
          optionC: { img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop", isAI: false }
        },
        correctAnswer: "B",
        explanation: "AI-generated portraits often have subtle asymmetries and unnatural details in eyes, teeth, or hair patterns.",
        newsUrl: "https://www.digitalbrew.com/the-hidden-downsides-of-ai-generated-videos/",
        order: 1
      },
      {
        id: "q2-spot-fake",
        missionId: "spot-fake",
        type: "text",
        questionText: "Which news headline was likely generated by AI?",
        content: {
          optionA: { text: "Local Mayor Announces New Park Development Plan", isAI: false },
          optionB: { text: "Breaking: Revolutionary Scientists Discover Unprecedented Breakthrough in Quantum Computing Applications", isAI: true },
          optionC: { text: "Weather Alert: Heavy Rain Expected This Weekend", isAI: false }
        },
        correctAnswer: "B",
        explanation: "AI-generated headlines often use excessive superlatives and buzzwords like 'revolutionary,' 'unprecedented,' and 'breakthrough' together.",
        newsUrl: "https://www.digitalbrew.com/the-hidden-downsides-of-ai-generated-videos/",
        order: 2
      }
    ];

    spotFakeQuestions.forEach(question => {
      this.questions.set(question.id, question);
    });

    // Sample users
    const sampleUsers: User[] = [
      {
        id: "user1",
        username: "player",
        password: "password",
        totalScore: 1250,
        missionsCompleted: 3,
        achievements: ["Mission Master", "Sharp Eye", "Speed Demon"],
        globalRank: 3,
        level: "Intermediate"
      }
    ];

    sampleUsers.forEach(user => {
      this.users.set(user.id, user);
    });
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id,
      totalScore: 0,
      missionsCompleted: 0,
      achievements: [],
      globalRank: null,
      level: "Beginner"
    };
    this.users.set(id, user);
    return user;
  }

  async updateUserScore(userId: string, additionalScore: number): Promise<User> {
    const user = this.users.get(userId);
    if (!user) throw new Error("User not found");
    
    user.totalScore = (user.totalScore || 0) + additionalScore;
    this.users.set(userId, user);
    return user;
  }

  async getAllMissions(): Promise<Mission[]> {
    return Array.from(this.missions.values());
  }

  async getMission(id: string): Promise<Mission | undefined> {
    return this.missions.get(id);
  }

  async getQuestionsByMissionId(missionId: string): Promise<Question[]> {
    return Array.from(this.questions.values())
      .filter(q => q.missionId === missionId)
      .sort((a, b) => a.order - b.order);
  }

  async getQuestion(id: string): Promise<Question | undefined> {
    return this.questions.get(id);
  }

  async getUserMissionProgress(userId: string, missionId: string): Promise<UserMissionProgress | undefined> {
    const key = `${userId}-${missionId}`;
    return this.userMissionProgress.get(key);
  }

  async updateUserMissionProgress(userId: string, missionId: string, questionsCompleted: number, totalScore: number, isCompleted: boolean): Promise<UserMissionProgress> {
    const key = `${userId}-${missionId}`;
    const existing = this.userMissionProgress.get(key);
    
    const progress: UserMissionProgress = {
      id: existing?.id || randomUUID(),
      userId,
      missionId,
      questionsCompleted,
      totalScore,
      isCompleted,
      lastPlayedAt: new Date()
    };
    
    this.userMissionProgress.set(key, progress);
    return progress;
  }

  async saveUserAnswer(userId: string, questionId: string, userAnswer: string, isCorrect: boolean, pointsEarned: number): Promise<UserAnswer> {
    const id = randomUUID();
    const answer: UserAnswer = {
      id,
      userId,
      questionId,
      userAnswer,
      isCorrect,
      pointsEarned,
      answeredAt: new Date()
    };
    
    this.userAnswers.set(id, answer);
    return answer;
  }

  async getTopUsers(limit: number): Promise<User[]> {
    return Array.from(this.users.values())
      .sort((a, b) => (b.totalScore || 0) - (a.totalScore || 0))
      .slice(0, limit);
  }
}

export const storage = new MemStorage();
