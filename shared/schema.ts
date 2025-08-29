import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, jsonb, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  totalScore: integer("total_score").default(0),
  missionsCompleted: integer("missions_completed").default(0),
  achievements: jsonb("achievements").$type<string[]>().default([]),
  globalRank: integer("global_rank"),
  level: text("level").default("Beginner"),
});

export const missions = pgTable("missions", {
  id: varchar("id").primaryKey(),
  title: text("title").notNull(),
  icon: text("icon").notNull(),
  difficulty: text("difficulty").notNull(), // EASY, MEDIUM, HARD, EXPERT
  pointsPerQuestion: integer("points_per_question").notNull(),
  description: text("description").notNull(),
  totalQuestions: integer("total_questions").notNull(),
  colorScheme: text("color_scheme").notNull(), // red, amber, emerald, purple, blue, orange
});

export const questions = pgTable("questions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  missionId: varchar("mission_id").references(() => missions.id).notNull(),
  type: text("type").notNull(), // drag-drop, image, text, audio, social, video, multiple-choice
  questionText: text("question_text").notNull(),
  content: jsonb("content").notNull(), // Flexible content based on question type
  correctAnswer: text("correct_answer").notNull(),
  explanation: text("explanation").notNull(),
  newsUrl: text("news_url"),
  order: integer("order").notNull(),
});

export const userMissionProgress = pgTable("user_mission_progress", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  missionId: varchar("mission_id").references(() => missions.id).notNull(),
  questionsCompleted: integer("questions_completed").default(0),
  totalScore: integer("total_score").default(0),
  isCompleted: boolean("is_completed").default(false),
  lastPlayedAt: timestamp("last_played_at").default(sql`now()`),
});

export const userAnswers = pgTable("user_answers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  questionId: varchar("question_id").references(() => questions.id).notNull(),
  userAnswer: text("user_answer").notNull(),
  isCorrect: boolean("is_correct").notNull(),
  pointsEarned: integer("points_earned").notNull(),
  answeredAt: timestamp("answered_at").default(sql`now()`),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertMissionSchema = createInsertSchema(missions);
export const insertQuestionSchema = createInsertSchema(questions);
export const insertUserMissionProgressSchema = createInsertSchema(userMissionProgress);
export const insertUserAnswerSchema = createInsertSchema(userAnswers);

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Mission = typeof missions.$inferSelect;
export type Question = typeof questions.$inferSelect;
export type UserMissionProgress = typeof userMissionProgress.$inferSelect;
export type UserAnswer = typeof userAnswers.$inferSelect;
