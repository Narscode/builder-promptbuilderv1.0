import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";

const submitAnswerSchema = z.object({
  questionId: z.string(),
  answer: z.string(),
  timeSpent: z.number().optional()
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all missions
  app.get("/api/missions", async (req, res) => {
    try {
      const missions = await storage.getAllMissions();
      res.json(missions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch missions" });
    }
  });

  // Get specific mission
  app.get("/api/missions/:id", async (req, res) => {
    try {
      const mission = await storage.getMission(req.params.id);
      if (!mission) {
        return res.status(404).json({ message: "Mission not found" });
      }
      res.json(mission);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch mission" });
    }
  });

  // Get questions for a mission
  app.get("/api/missions/:id/questions", async (req, res) => {
    try {
      const questions = await storage.getQuestionsByMissionId(req.params.id);
      res.json(questions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch questions" });
    }
  });

  // Get user progress for all missions
  app.get("/api/user/:userId/progress", async (req, res) => {
    try {
      const { userId } = req.params;
      const missions = await storage.getAllMissions();
      
      const progressPromises = missions.map(async (mission) => {
        const progress = await storage.getUserMissionProgress(userId, mission.id);
        return {
          missionId: mission.id,
          questionsCompleted: progress?.questionsCompleted || 0,
          totalQuestions: mission.totalQuestions,
          isCompleted: progress?.isCompleted || false,
          totalScore: progress?.totalScore || 0
        };
      });

      const allProgress = await Promise.all(progressPromises);
      res.json(allProgress);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user progress" });
    }
  });

  // Submit an answer
  app.post("/api/user/:userId/answer", async (req, res) => {
    try {
      const { userId } = req.params;
      const body = submitAnswerSchema.parse(req.body);
      
      const question = await storage.getQuestion(body.questionId);
      if (!question) {
        return res.status(404).json({ message: "Question not found" });
      }

      const mission = await storage.getMission(question.missionId);
      if (!mission) {
        return res.status(404).json({ message: "Mission not found" });
      }

      const isCorrect = body.answer === question.correctAnswer;
      const pointsEarned = isCorrect ? mission.pointsPerQuestion : 0;

      // Save the answer
      await storage.saveUserAnswer(userId, body.questionId, body.answer, isCorrect, pointsEarned);

      // Update user's total score
      if (pointsEarned > 0) {
        await storage.updateUserScore(userId, pointsEarned);
      }

      // Get current progress
      const currentProgress = await storage.getUserMissionProgress(userId, question.missionId);
      const questionsCompleted = (currentProgress?.questionsCompleted || 0) + 1;
      const totalScore = (currentProgress?.totalScore || 0) + pointsEarned;
      const isCompleted = questionsCompleted >= mission.totalQuestions;

      // Update mission progress
      await storage.updateUserMissionProgress(userId, question.missionId, questionsCompleted, totalScore, isCompleted);

      res.json({
        isCorrect,
        pointsEarned,
        explanation: question.explanation,
        newsUrl: question.newsUrl,
        questionsCompleted,
        isCompleted
      });
    } catch (error) {
      console.error("Error submitting answer:", error);
      res.status(500).json({ message: "Failed to submit answer" });
    }
  });

  // Get leaderboard
  app.get("/api/leaderboard", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const topUsers = await storage.getTopUsers(limit);
      res.json(topUsers);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch leaderboard" });
    }
  });

  // Get user profile
  app.get("/api/user/:userId", async (req, res) => {
    try {
      const user = await storage.getUser(req.params.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
