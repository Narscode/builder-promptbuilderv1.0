# Overview

This is a full-stack media literacy education platform built with React, Express, and PostgreSQL. The application provides interactive missions and quizzes designed to help users develop critical thinking skills around media consumption, with a focus on UNESCO Media and Information Literacy (MIL) principles. Users can complete various types of questions (drag-and-drop, multiple-choice, image-based, etc.) to earn points and track their progress through different missions.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **React with TypeScript**: Modern component-based architecture using functional components and hooks
- **Vite Build Tool**: Fast development server and optimized production builds
- **UI Framework**: Shadcn/ui components built on Radix UI primitives with Tailwind CSS for styling
- **State Management**: TanStack Query (React Query) for server state management and caching
- **Routing**: Wouter for lightweight client-side routing
- **Form Handling**: React Hook Form with Zod validation for type-safe form management

## Backend Architecture
- **Express.js Server**: RESTful API with TypeScript for type safety
- **In-Memory Storage**: Currently using a memory-based storage implementation with interfaces designed for easy database migration
- **API Design**: Clean REST endpoints following `/api/{resource}` pattern with proper HTTP status codes
- **Middleware**: Custom logging middleware for API request tracking

## Data Storage Solutions
- **Database ORM**: Drizzle ORM configured for PostgreSQL with type-safe schema definitions
- **Database Provider**: Configured for Neon Database (serverless PostgreSQL)
- **Schema Management**: Shared TypeScript schema definitions between client and server
- **Migration System**: Drizzle Kit for database migrations and schema changes

## Authentication and Authorization
- **Session Management**: Prepared for PostgreSQL-based sessions using connect-pg-simple
- **User System**: Basic user accounts with progress tracking and scoring
- **Authorization**: Simple user-based access control for missions and progress

## External Dependencies
- **Neon Database**: Serverless PostgreSQL database for production data storage
- **Radix UI**: Accessible component primitives for building the user interface
- **TanStack Query**: Server state management and caching layer
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Lucide React**: Icon library for consistent iconography
- **Zod**: Runtime type validation and schema definition
- **React Hook Form**: Form state management and validation
- **Wouter**: Lightweight routing solution for React