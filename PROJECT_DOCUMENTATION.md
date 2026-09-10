# ParentApp - ScholarOS: Complete Project Documentation

A multi-service School ERP system for parents, teachers, students, and administrators.  
Built with 4 independent sub-projects under a single monorepo.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [System Architecture](#2-system-architecture)
3. [Technology Stack](#3-technology-stack)
4. [Directory Structure](#4-directory-structure)
5. [Service: server/ (Node.js Parent API)](#5-service-server-nodejs-parent-api)
6. [Service: backend/ (Java Homework Intelligence)](#6-service-backend-java-homework-intelligence)
7. [Service: frontend/ (React Web Dashboard)](#7-service-frontend-react-web-dashboard)
8. [Service: mobile/ (React Native Parent App)](#8-service-mobile-react-native-parent-app)
9. [Database Schema](#9-database-schema)
10. [API Reference](#10-api-reference)
11. [Authentication & Authorization](#11-authentication--authorization)
12. [Running Commands](#12-running-commands)
13. [Development Workflow](#13-development-workflow)

---

## 1. Project Overview

**ParentApp** is a comprehensive School ERP ecosystem called **ScholarOS** that connects:

- **Parents** - Track children's attendance, grades, fees, events via mobile app
- **Teachers** - Manage lessons, assessments, homework, and AI-powered analytics via web dashboard
- **Students** - View lessons, take assessments, check performance via web dashboard
- **Admins** - Manage curriculum, boards, classes, and view system health via web dashboard

### System Boundaries

| Sub-project | Purpose | Connects To |
|---|---|---|
| `server/` | Parent App backend (auth, profile, children, attendance, fees, messaging) | PostgreSQL (`parentapp` DB) |
| `backend/` | Homework Intelligence microservice (curriculum, assessments, AI homework, analytics) | PostgreSQL (`scholaros` DB) |
| `frontend/` | Web dashboard (Admin/Teacher/Student portals) | `backend/` API |
| `mobile/` | Mobile parent app (iOS + Android) | `server/` API |

---

## 2. System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                          FRONTEND LAYER                            │
│                                                                     │
│  ┌──────────────────────┐         ┌──────────────────────────────┐  │
│  │   mobile/            │         │      frontend/               │  │
│  │   React Native/Expo  │         │      React 19 / Vite         │  │
│  │   (Parent App)       │         │      (Web Dashboard)         │  │
│  │   Port: Expo default │         │      Port: 5173              │  │
│  └──────────┬───────────┘         └──────────────┬───────────────┘  │
└─────────────┼─────────────────────────────────────┼─────────────────┘
              │                                     │
              │ HTTPS                               │ HTTP
              ▼                                     ▼
┌──────────────────────────┐     ┌─────────────────────────────────────┐
│     server/              │     │          backend/                    │
│     Node.js / Express    │     │          Java 21 / Spring Boot 3.4.2│
│     Port: 8080           │     │          Port: 8080                 │
│                          │     │                                     │
│  - Parent auth (JWT)     │     │  - Curriculum management           │
│  - Children data         │     │  - Assessment engine               │
│  - Attendance            │     │  - AI Homework (Gemini)            │
│  - Fees & Payments       │     │  - Student analytics               │
│  - Events & Announcements│     │  - Swagger/OpenAPI docs            │
│  - Notifications         │     │                                     │
│  - Parent-Teacher msgs   │     │                                     │
└──────────┬───────────────┘     └──────────────────┬──────────────────┘
           │                                        │
           │ SQL                                    │ SQL/JPA
           ▼                                        ▼
┌──────────────────────┐           ┌──────────────────────────────┐
│  PostgreSQL          │           │  PostgreSQL                   │
│  DB: parentapp       │           │  DB: scholaros                │
│  Port: 5432          │           │  Port: 5432                   │
│  Migrations: Knex    │           │  Migrations: Flyway           │
└──────────────────────┘           └──────────────────────────────┘
```

### Service Communication Flow

```
Parent Mobile App
       │
       ▼
   server/ (Express :8080)
       │
       ├── Auth (JWT issued here)
       ├── Parent profile, children, attendance
       ├── Fees, payments, receipts
       ├── Events, announcements
       ├── Notifications (read/unread)
       └── Parent-Teacher messaging
       │
       ▼
   PostgreSQL (parentapp DB)


Web Dashboard (Admin/Teacher/Student)
       │
       ▼
   backend/ (Spring Boot :8080)
       │
       ├── Boards, Curricula, Chapters, Topics
       ├── Lessons & Lesson Sessions
       ├── Assessments & Questions
       ├── Assessment Attempts & Grading
       ├── AI-Powered Homework Generation (Gemini)
       ├── AI Learning Analysis & Recommendations
       └── Student/Class/Teacher Analytics
       │
       ▼
   PostgreSQL (scholaros DB)
```

---

## 3. Technology Stack

### Backend Services

| Component | Technology | Version |
|---|---|---|
| `server/` Runtime | Node.js | Latest LTS |
| `server/` Framework | Express | 4.18.x |
| `server/` ORM | Knex.js | 3.1.x |
| `server/` Database | PostgreSQL (pg) | 8.12.x |
| `server/` Auth | jsonwebtoken + bcryptjs | 9.0.2 / 2.4.3 |
| `backend/` Runtime | Java | 21 LTS |
| `backend/` Framework | Spring Boot | 3.4.2 |
| `backend/` ORM | Spring Data JPA / Hibernate | (via Spring Boot) |
| `backend/` Migrations | Flyway | (via Spring Boot) |
| `backend/` Build | Gradle | (Groovy DSL) |
| `backend/` API Docs | SpringDoc OpenAPI | 2.8.5 |
| `backend/` AI | Google Gemini | 1.5 Flash |
| `backend/` Mapping | MapStruct + Lombok | 1.6.3 |

### Frontend Clients

| Component | Technology | Version |
|---|---|---|
| `frontend/` Framework | React | 19.2.x |
| `frontend/` Bundler | Vite | 8.2.x |
| `frontend/` Styling | Tailwind CSS | 4.3.x |
| `frontend/` State | TanStack React Query | 5.101.x |
| `frontend/` Routing | React Router DOM | 7.18.x |
| `frontend/` Charts | Recharts | 3.10.x |
| `frontend/` Icons | Lucide React | 1.31.x |
| `frontend/` Linting | Oxlint | 1.75.x |
| `mobile/` Framework | React Native | 0.86.x |
| `mobile/` SDK | Expo | 57.x |
| `mobile/` Language | TypeScript | 6.0.x |
| `mobile/` Routing | Expo Router (file-based) | 57.x |
| `mobile/` Storage | Expo SecureStore + AsyncStorage | 57.x |

### Shared Infrastructure

| Component | Details |
|---|---|
| Database | PostgreSQL 16 (Alpine) via Docker |
| Auth | JWT (stateless, per-service) |
| Containerization | Docker + Docker Compose |
| Version Control | Git |

---

## 4. Directory Structure

```
ParentApp/
├── server/                          # Node.js Express API (Parent App Backend)
│   ├── package.json                 # Dependencies & scripts
│   ├── knexfile.js                  # Knex PostgreSQL config (dev + prod)
│   ├── migrations/                  # Database migrations (Knex)
│   │   └── 20240101000001_initial_schema.js
│   ├── seeds/                       # Demo/seed data
│   │   └── 001_seed_data.js
│   └── src/
│       ├── server.js                # Express entry point (port 8080)
│       ├── config/
│       │   └── database.js          # Knex connection setup
│       ├── middleware/
│       │   ├── auth.js              # JWT authenticate + authorize
│       │   ├── errorHandler.js      # Global error handler
│       │   └── validate.js          # express-validator wrapper
│       ├── routes/
│       │   ├── auth.js              # POST /login, /register, /forgot-password, /refresh, /logout
│       │   └── parent.js            # All /parent/* endpoints
│       ├── controllers/
│       │   ├── authController.js
│       │   ├── parentController.js
│       │   ├── academicsController.js
│       │   ├── announcementController.js
│       │   ├── assignmentController.js
│       │   ├── attendanceController.js
│       │   ├── eventController.js
│       │   ├── feeController.js
│       │   ├── messageController.js
│       │   └── notificationController.js
│       └── utils/
│           └── responses.js         # Standardized API response helpers
│
├── backend/                         # Java Spring Boot (ScholarOS Homework Intelligence)
│   ├── build.gradle                 # Gradle build config
│   ├── settings.gradle              # rootProject.name = 'scholaros'
│   ├── Dockerfile                   # Multi-stage JDK 21 build
│   ├── docker-compose.yml           # PostgreSQL 16 + Spring Boot
│   ├── .env                         # Environment variables
│   ├── .env.example                 # Env template
│   ├── README.md                    # API docs + architecture
│   ├── PROJECT_CONTEXT.md           # Detailed architecture guide
│   └── src/
│       └── main/
│           ├── java/com/scholaros/homework/
│           │   ├── ScholarosApplication.java
│           │   ├── ai/              # AI integration (Gemini)
│           │   │   ├── AIProvider.java
│           │   │   ├── GeminiProvider.java
│           │   │   ├── PromptBuilder.java
│           │   │   ├── AIResponseParser.java
│           │   │   └── AIAnalysisResult.java
│           │   ├── common/
│           │   │   └── ApiResponse.java
│           │   ├── config/          # Spring configs (Security, Jackson, OpenAPI, etc.)
│           │   ├── controller/      # 13 REST controllers
│           │   ├── dto/             # 54 DTOs (request + response)
│           │   ├── entity/          # 33 JPA entities + enums
│           │   ├── exception/       # 8 custom exceptions
│           │   ├── mapper/          # 21 MapStruct mappers
│           │   ├── repository/      # 25 JPA repositories
│           │   ├── security/        # JWT filter, token provider, principal
│           │   ├── service/         # 39 service interfaces + implementations
│           │   ├── util/            # Utility classes
│           │   └── validation/      # Custom validators
│           └── resources/
│               ├── application.yml          # Main config
│               ├── application-dev.yml      # Dev (H2 in-memory)
│               ├── application-prod.yml     # Prod (PostgreSQL)
│               └── db/migration/            # 13 Flyway SQL migrations (V1-V13)
│
├── frontend/                        # React Web Dashboard
│   ├── package.json                 # Dependencies & scripts
│   ├── vite.config.js               # Vite + React + Tailwind plugins
│   ├── index.html                   # HTML entry
│   └── src/
│       ├── main.jsx                 # React entry
│       ├── App.jsx                  # Root (QueryClient, Auth, Theme, Router)
│       ├── index.css                # Tailwind base styles
│       ├── api/                     # Axios API client modules
│       │   ├── axios.js             # Base Axios instance
│       │   ├── authApi.js           # Demo login logic
│       │   ├── analysisApi.js
│       │   ├── analyticsApi.js
│       │   ├── assessmentApi.js
│       │   ├── assessmentAttemptApi.js
│       │   ├── curriculumApi.js
│       │   ├── healthApi.js
│       │   ├── homeworkApi.js
│       │   ├── lessonApi.js
│       │   └── studentApi.js
│       ├── context/
│       │   ├── AuthContext.jsx       # JWT auth + demo user login
│       │   └── ThemeContext.jsx
│       ├── hooks/
│       │   ├── useAuth.js
│       │   └── useTheme.js
│       ├── utils/
│       │   ├── formatters.js
│       │   ├── jwtHelper.js         # Dev JWT token creation
│       │   └── permissions.js
│       ├── routes/
│       │   ├── AppRoutes.jsx        # Route tree (admin/teacher/student)
│       │   ├── ProtectedRoute.jsx
│       │   └── RoleRoute.jsx
│       ├── pages/
│       │   ├── auth/Login.jsx
│       │   ├── errors/NotFound.jsx, Unauthorized.jsx
│       │   ├── admin/              # 10 pages (Dashboard, Boards, Curricula, etc.)
│       │   ├── teacher/            # 8 pages (Dashboard, Lessons, Assessments, etc.)
│       │   └── student/            # 8 pages (Dashboard, Lessons, Homework, etc.)
│       └── components/
│           ├── charts/             # 4 chart components
│           ├── common/             # 10 reusable UI components
│           ├── dashboard/          # 9 dashboard widgets
│           ├── layout/             # 4 layout components
│           └── layouts/            # DashboardLayout wrapper
│
├── mobile/                          # React Native (Expo) Parent Mobile App
│   ├── package.json                 # Dependencies & scripts
│   ├── app.json                     # Expo config
│   ├── tsconfig.json                # TypeScript config
│   ├── .env                         # API_BASE_URL
│   └── src/
│       ├── global.css
│       ├── app/                     # Expo Router file-based routes
│       │   ├── _layout.tsx          # Root layout (AuthProvider, ChildProvider)
│       │   ├── index.tsx            # Auth redirect
│       │   ├── (auth)/             # Auth screens (login, register, forgot-password)
│       │   ├── (tabs)/             # Tab navigator (Home, Children, Messages, Alerts, Profile)
│       │   ├── academics/
│       │   ├── announcements/
│       │   ├── assignments/
│       │   ├── attendance/
│       │   ├── events/
│       │   ├── fees/
│       │   ├── messages/
│       │   └── notifications/
│       ├── components/
│       │   ├── common/             # 4 components (EmptyState, ErrorState, Header, LoadingScreen)
│       │   ├── dashboard/          # 6 components (AcademicsCard, AttendanceCard, etc.)
│       │   └── ui/                 # 5 UI primitives (Badge, Button, Card, Input, collapsible)
│       ├── constants/
│       │   ├── colors.ts           # Design system colors
│       │   ├── config.ts           # API_BASE_URL, STORAGE_KEYS, ROLES
│       │   └── theme.ts
│       ├── context/
│       │   ├── AuthContext.tsx      # JWT auth (login/register/logout/refresh)
│       │   └── ChildContext.tsx     # Multi-child selection
│       ├── hooks/
│       │   ├── useAuth.ts
│       │   ├── useChild.ts
│       │   ├── use-color-scheme.ts
│       │   └── use-theme.ts
│       ├── services/
│       │   └── api.ts              # Axios instance + all service exports
│       ├── screens/
│       │   ├── DashboardScreen.tsx
│       │   ├── homescreen.tsx
│       │   └── ProfileScreen.tsx
│       ├── Theme/
│       │   ├── colors.ts
│       │   ├── spacing.ts
│       │   └── typography.ts
│       └── utils/
│           ├── storage.ts          # SecureStore / AsyncStorage wrapper
│           └── helpers.ts          # Date formatting, currency, etc.
```

---

## 5. Service: server/ (Node.js Parent API)

### Purpose
Serves as the backend for the **Parent Mobile App**. Handles parent authentication, profile management, children data, attendance tracking, fees, events, announcements, notifications, and parent-teacher messaging.

### Entry Point
`server/src/server.js` - Express app on port **8080**

### Key Dependencies
- **express** - HTTP framework
- **knex** - SQL query builder & migrations
- **pg** - PostgreSQL driver
- **jsonwebtoken** - JWT token creation & verification
- **bcryptjs** - Password hashing
- **helmet** - Security headers
- **cors** - Cross-origin requests
- **morgan** - HTTP request logging
- **express-validator** - Input validation

### Routes Structure

| Route Group | Path | Auth Required |
|---|---|---|
| Health | `GET /health` | No |
| Auth | `POST /api/v1/auth/login` | No |
| Auth | `POST /api/v1/auth/register` | No |
| Auth | `POST /api/v1/auth/forgot-password` | No |
| Auth | `POST /api/v1/auth/refresh` | No |
| Auth | `POST /api/v1/auth/logout` | Yes |
| Profile | `GET /api/v1/parent/me` | Yes (PARENT) |
| Profile | `PUT /api/v1/parent/me` | Yes (PARENT) |
| Children | `GET /api/v1/parent/children` | Yes (PARENT) |
| Children | `GET /api/v1/parent/children/:id` | Yes (PARENT) |
| Dashboard | `GET /api/v1/parent/dashboard` | Yes (PARENT) |
| Attendance | `GET /api/v1/parent/children/:id/attendance` | Yes (PARENT) |
| Attendance | `GET /api/v1/parent/children/:id/attendance/summary` | Yes (PARENT) |
| Academics | `GET /api/v1/parent/children/:id/academics` | Yes (PARENT) |
| Academics | `GET /api/v1/parent/children/:id/academics/exams` | Yes (PARENT) |
| Academics | `GET /api/v1/parent/children/:id/academics/subjects` | Yes (PARENT) |
| Assignments | `GET /api/v1/parent/children/:id/assignments` | Yes (PARENT) |
| Assignments | `GET /api/v1/parent/children/:id/assignments/:aId` | Yes (PARENT) |
| Fees | `GET /api/v1/parent/children/:id/fees` | Yes (PARENT) |
| Fees | `GET /api/v1/parent/children/:id/payments` | Yes (PARENT) |
| Fees | `GET /api/v1/parent/children/:id/receipts` | Yes (PARENT) |
| Events | `GET /api/v1/parent/events` | Yes (PARENT) |
| Events | `GET /api/v1/parent/events/:eventId` | Yes (PARENT) |
| Announcements | `GET /api/v1/parent/announcements` | Yes (PARENT) |
| Announcements | `GET /api/v1/parent/announcements/:id` | Yes (PARENT) |
| Notifications | `GET /api/v1/parent/notifications` | Yes (PARENT) |
| Notifications | `PATCH /api/v1/parent/notifications/:id/read` | Yes (PARENT) |
| Notifications | `PATCH /api/v1/parent/notifications/read-all` | Yes (PARENT) |
| Messages | `GET /api/v1/parent/conversations` | Yes (PARENT) |
| Messages | `GET /api/v1/parent/conversations/teachers` | Yes (PARENT) |
| Messages | `POST /api/v1/parent/conversations` | Yes (PARENT) |
| Messages | `GET /api/v1/parent/conversations/:id/messages` | Yes (PARENT) |
| Messages | `POST /api/v1/parent/conversations/:id/messages` | Yes (PARENT) |

---

## 6. Service: backend/ (Java Homework Intelligence)

### Purpose
Microservice for **ScholarOS** curriculum management, AI-powered homework generation, assessment engine, and student analytics. Serves the web dashboard.

### Entry Point
`ScholarosApplication.java` - Spring Boot on port **8080** (configurable)

### Key Dependencies
- **Spring Boot Starter Web** - REST API
- **Spring Boot Starter Security** - JWT-based authentication
- **Spring Boot Starter Data JPA** - ORM / repository pattern
- **Spring Boot Starter Validation** - Bean validation
- **Spring Boot Starter Actuator** - Health checks & metrics
- **Flyway** - Database migrations
- **PostgreSQL** - Production database
- **H2** - Development/test in-memory database
- **MapStruct** - DTO-entity mapping
- **Lombok** - Boilerplate reduction
- **SpringDoc OpenAPI** - Swagger UI documentation
- **Google Gemini API** - AI-powered homework & analysis

### REST Controllers (13)

| Controller | Path Prefix | Description |
|---|---|---|
| `HealthController` | `/health`, `/actuator` | Health checks |
| `BoardController` | `/api/v1/boards` | Education boards |
| `CurriculumController` | `/api/v1/curricula` | Curriculum management |
| `ChapterController` | `/api/v1/chapters` | Chapter CRUD |
| `TopicController` | `/api/v1/topics` | Topic CRUD |
| `LessonSessionController` | `/api/v1/lessons` | Lesson sessions |
| `AssessmentController` | `/api/v1/assessments` | Assessment management |
| `QuestionController` | `/api/v1/questions` | Question bank |
| `QuestionOptionController` | `/api/v1/question-options` | MCQ options |
| `AssessmentAttemptController` | `/api/v1/assessment-attempts` | Student attempts |
| `HomeworkController` | `/api/v1/homework` | AI-generated homework |
| `LearningAnalysisController` | `/api/v1/analysis` | AI learning analysis |
| `AnalyticsController` | `/api/v1/analytics` | Student/class analytics |

### AI Integration

The backend integrates with **Google Gemini** for:

1. **Homework Generation** - AI creates personalized homework based on student performance
2. **Learning Analysis** - AI analyzes student assessment data for weaknesses
3. **Recommendations** - AI suggests targeted study materials

**Flow:**
```
Student completes assessment
       │
       ▼
AssessmentAttemptController.submit()
       │
       ▼
LearningAnalysisController.generate()
       │
       ▼
PromptBuilder → Gemini API → AIResponseParser → AIAnalysisResult
       │
       ▼
Stored in ai_analysis table
```

---

## 7. Service: frontend/ (React Web Dashboard)

### Purpose
Web-based dashboard for **Admins, Teachers, and Students** to manage curriculum, view analytics, create assessments, and interact with AI-powered homework.

### Entry Point
`frontend/src/main.jsx` → `App.jsx`

### Port
**5173** (Vite dev server)

### Role-Based Portals

| Role | Pages |
|---|---|
| **Admin** | Dashboard, Boards, Curricula, Chapters, Topics, Lessons, Assessments, ClassAnalytics, TeacherAnalytics, SystemHealth |
| **Teacher** | Dashboard, Lessons, Assessments, CreateAssessment, Homework, AIAnalysis, AIRecommendations, Analytics |
| **Student** | Dashboard, Lessons, Assessments, TakeAssessment, Homework, Performance, AIAnalysis, AIRecommendations |

### Key Features
- **Demo Login** - Switch between Admin/Teacher/Student personas without backend
- **JWT Auth** - Custom token creation via `jwtHelper.js`
- **React Query** - Server state management
- **Recharts** - Data visualization
- **Tailwind CSS** - Utility-first styling

---

## 8. Service: mobile/ (React Native Parent App)

### Purpose
Cross-platform mobile app (iOS + Android) for parents to monitor their children's school activities.

### Entry Point
`mobile/src/app/_layout.tsx` → Expo Router

### Expo Configuration
- **Package**: `com.mounesh_v.ParentApp`
- **SDK**: Expo 57
- **Router**: File-based (Expo Router)

### Tab Navigator

| Tab | Icon | Screen |
|---|---|---|
| Home | `home` | Dashboard with quick actions |
| Children | `people` | Child selector + child details |
| Messages | `chatbubble-ellipses` | Parent-Teacher conversations |
| Alerts | `notifications` | Notifications list |
| Profile | `person` | Parent profile |

### App Screens

| Route | Screen |
|---|---|
| `(auth)/login` | Login |
| `(auth)/register` | Register |
| `(auth)/forgot-password` | Forgot Password |
| `academics/` | Academic overview |
| `announcements/` | School announcements |
| `assignments/` | Assignment list |
| `assignments/[id]` | Assignment detail |
| `attendance/` | Attendance records |
| `events/` | School events |
| `fees/` | Fee overview |
| `fees/payments` | Payment history |
| `fees/receipts` | Receipts |
| `messages/[id]` | Conversation detail |
| `notifications/` | Notification list |

### API Configuration
- **Base URL**: `http://192.168.0.103:8080/api/v1` (set in `.env`)
- **Token Storage**: Expo SecureStore (primary) / AsyncStorage (fallback)
- **Auto-refresh**: Token refresh on 401 with request queue

---

## 9. Database Schema

### server/ Database (`parentapp`) - 16 Tables

| Table | Purpose |
|---|---|
| `users` | Parents, teachers, admins (role enum: PARENT, TEACHER, ADMIN) |
| `classes` | School classes with grade/section |
| `students` | Student records linked to classes |
| `parent_students` | Parent-to-student relationship (many-to-many) |
| `subjects` | School subjects |
| `student_subjects` | Student-subject enrollment with assigned teacher |
| `attendance` | Daily attendance per student (PRESENT, ABSENT, LATE, EXCUSED) |
| `exams` | Exam definitions |
| `exam_results` | Student exam results per subject |
| `assignments` | Assignments with status (PENDING, SUBMITTED, GRADED, OVERDUE) |
| `fees` | Fee records with payment tracking (PENDING, PAID, OVERDUE, PARTIAL) |
| `events` | School events (EXAM, HOLIDAY, PTM, COMPETITION, OTHER) |
| `announcements` | School announcements with priority levels |
| `notifications` | User notifications (ATTENDANCE, FEE, ACADEMIC, etc.) |
| `conversations` | Parent-Teacher chat threads |
| `conversation_participants` | Conversation membership |
| `messages` | Chat messages |

### backend/ Database (`scholaros`) - Flyway Migrations

| Migration | Description |
|---|---|
| V1 | Infrastructure tables |
| V2 | Curriculum tables (boards, curricula, chapters, topics) |
| V3 | Seed curriculum data |
| V4 | Lesson tables |
| V5 | Assessment tables (assessments, questions, options) |
| V6 | Attempt tables (assessment attempts, answers) |
| V7 | AI analysis tables |
| V8 | Homework tables |
| V9 | Analytics tables |
| V10 | Seed demo student performance data |
| V11 | Seed grade 9/10 curricula |
| V12 | Seed grade 8 curricula and topics |
| V13 | Seed full curricula, chapters, topics |

---

## 10. API Reference

### server/ API (Parent App)

#### Authentication

```
POST /api/v1/auth/login
Body: { email, password }
Response: { success, data: { accessToken, refreshToken, user } }

POST /api/v1/auth/register
Body: { name, email, password }
Response: { success, data: { user } }

POST /api/v1/auth/forgot-password
Body: { email }
Response: { success, message }

POST /api/v1/auth/refresh
Body: { refreshToken }
Response: { success, data: { accessToken, refreshToken } }

POST /api/v1/auth/logout
Headers: Authorization: Bearer <token>
Response: { success, message }
```

#### Parent Profile & Dashboard

```
GET /api/v1/parent/me
Response: { success, data: { id, name, email, role, ... } }

PUT /api/v1/parent/me
Body: { name?, phone_number? }
Response: { success, data: { user } }

GET /api/v1/parent/children
Response: { success, data: [{ id, name, class, ... }] }

GET /api/v1/parent/children/:studentId
Response: { success, data: { student details } }

GET /api/v1/parent/dashboard
Response: { success, data: { summary stats } }
```

#### Attendance

```
GET /api/v1/parent/children/:studentId/attendance?month=&year=
Response: { success, data: [{ date, status, remark }] }

GET /api/v1/parent/children/:studentId/attendance/summary
Response: { success, data: { present, absent, late, excused, percentage } }
```

#### Academics

```
GET /api/v1/parent/children/:studentId/academics
Response: { success, data: { subjects, exams, ... } }

GET /api/v1/parent/children/:studentId/academics/exams
Response: { success, data: [{ exam, marks, grade }] }

GET /api/v1/parent/children/:studentId/academics/subjects
Response: { success, data: [{ subject, teacher }] }
```

#### Assignments

```
GET /api/v1/parent/children/:studentId/assignments?status=
Response: { success, data: [{ id, title, status, due_date, ... }] }

GET /api/v1/parent/children/:studentId/assignments/:assignmentId
Response: { success, data: { assignment details } }
```

#### Fees

```
GET /api/v1/parent/children/:studentId/fees
Response: { success, data: [{ id, name, amount, status, ... }] }

GET /api/v1/parent/children/:studentId/payments
Response: { success, data: [{ id, amount, date, method }] }

GET /api/v1/parent/children/:studentId/receipts
Response: { success, data: [{ id, receipt_number, date, amount }] }
```

#### Events & Announcements

```
GET /api/v1/parent/events
Response: { success, data: [{ id, title, type, date }] }

GET /api/v1/parent/announcements
Response: { success, data: [{ id, title, priority, date }] }
```

#### Notifications

```
GET /api/v1/parent/notifications
Response: { success, data: [{ id, title, message, is_read }] }

PATCH /api/v1/parent/notifications/:notificationId/read
Response: { success }

PATCH /api/v1/parent/notifications/read-all
Response: { success }
```

#### Messages

```
GET /api/v1/parent/conversations
Response: { success, data: [{ id, name, last_message, ... }] }

GET /api/v1/parent/conversations/teachers
Response: { success, data: [{ id, name, email }] }

POST /api/v1/parent/conversations
Body: { title?, participantIds? }
Response: { success, data: { conversation } }

GET /api/v1/parent/conversations/:conversationId/messages
Response: { success, data: [{ id, content, sender, timestamp }] }

POST /api/v1/parent/conversations/:conversationId/messages
Body: { content }
Response: { success, data: { message } }
```

### backend/ API (ScholarOS Homework Intelligence)

Full Swagger documentation available at:  
`http://localhost:8080/swagger-ui.html`

#### Curriculum Management

```
GET    /api/v1/boards                    # List all boards
POST   /api/v1/boards                    # Create board
GET    /api/v1/boards/{id}               # Get board
PUT    /api/v1/boards/{id}               # Update board
DELETE /api/v1/boards/{id}               # Delete board

GET    /api/v1/curricula                 # List curricula
POST   /api/v1/curricula                 # Create curriculum
GET    /api/v1/curricula/{id}            # Get curriculum
PUT    /api/v1/curricula/{id}            # Update curriculum

GET    /api/v1/chapters                  # List chapters
POST   /api/v1/chapters                  # Create chapter
GET    /api/v1/chapters/{id}             # Get chapter

GET    /api/v1/topics                    # List topics
POST   /api/v1/topics                    # Create topic
GET    /api/v1/topics/{id}               # Get topic
```

#### Lessons

```
GET    /api/v1/lessons                   # List lessons
POST   /api/v1/lessons                   # Create lesson session
GET    /api/v1/lessons/{id}              # Get lesson
PUT    /api/v1/lessons/{id}              # Update lesson
POST   /api/v1/lessons/{id}/complete     # Mark lesson complete
```

#### Assessments

```
GET    /api/v1/assessments               # List assessments
POST   /api/v1/assessments               # Create assessment
GET    /api/v1/assessments/{id}          # Get assessment
POST   /api/v1/assessments/{id}/publish  # Publish assessment

GET    /api/v1/assessments/{id}/questions  # Get questions
POST   /api/v1/assessments/{id}/questions  # Add question
```

#### Assessment Attempts

```
POST   /api/v1/assessment-attempts/start           # Start attempt
POST   /api/v1/assessment-attempts/{id}/submit     # Submit attempt
GET    /api/v1/assessment-attempts/{id}            # Get attempt
```

#### AI Engine

```
POST   /api/v1/analysis/generate          # Generate AI learning analysis
POST   /api/v1/analysis/recommendations   # Generate AI recommendations
```

#### Homework

```
POST   /api/v1/homework/generate          # AI-generate homework
POST   /api/v1/homework/{id}/submit       # Submit homework
GET    /api/v1/homework/{id}              # Get homework
```

#### Analytics

```
GET    /api/v1/analytics/student/{id}     # Student analytics
GET    /api/v1/analytics/class            # Class analytics
GET    /api/v1/analytics/teacher/{id}     # Teacher analytics
```

#### Health & Docs

```
GET    /health                            # Health check
GET    /actuator/health                   # Spring Actuator health
GET    /swagger-ui.html                   # Swagger UI
GET    /v3/api-docs                       # OpenAPI 3.0 docs
```

---

## 11. Authentication & Authorization

### server/ Authentication

- **Algorithm**: HS256
- **Secret**: `JWT_SECRET` env variable
- **Token Lifetime**: Configurable via `JWT_EXPIRATION_MS`
- **Roles**: `PARENT`, `TEACHER`, `ADMIN`

**JWT Payload:**
```json
{
  "userId": "uuid",
  "email": "user@example.com",
  "role": "PARENT",
  "iat": 1234567890,
  "exp": 1234567890
}
```

**Flow:**
1. Client sends `POST /api/v1/auth/login` with email + password
2. Server verifies password via bcryptjs
3. Server issues JWT access token + refresh token
4. Client sends `Authorization: Bearer <token>` on subsequent requests
5. `authenticate` middleware verifies token and attaches `req.user`
6. `authorize('PARENT')` middleware checks role

### backend/ Authentication

- **Algorithm**: HS256
- **Secret**: `JWT_SECRET` env variable (default: base64-encoded string)
- **Token Lifetime**: `JWT_EXPIRATION_MS` (default: 24 hours)
- **User Management**: Stateless - validates JWT from external ERP auth server
- **No user creation/login endpoints** - this service only validates tokens

**JWT Payload (from external auth server):**
```json
{
  "sub": "user-id",
  "username": "teacher.roberts",
  "role": "ROLE_TEACHER",
  "schoolId": "uuid",
  "sectionId": "uuid",
  "gradeId": "uuid",
  "academicYearId": "uuid",
  "iat": 1234567890,
  "exp": 1234567890
}
```

### frontend/ Authentication

- **Demo Mode**: Creates dev JWT tokens locally without backend
- **Custom JWT**: Users can paste a real JWT token for testing
- **Storage**: `localStorage` (browser)
- **Roles**: `ROLE_ADMIN`, `ROLE_TEACHER`, `ROLE_STUDENT`

### mobile/ Authentication

- **Token Storage**: Expo SecureStore (encrypted) with AsyncStorage fallback
- **Auto-refresh**: Interceptor catches 401 → refresh token → retry request
- **Request Queue**: Multiple concurrent 401s share a single refresh call
- **Logout**: Clears tokens from storage and resets auth state

---

## 12. Running Commands

### Prerequisites

| Tool | Version | Purpose |
|---|---|---|
| Node.js | 18+ LTS | server/ and frontend/ runtime |
| Java | 21 LTS | backend/ runtime |
| Gradle | 8+ | backend/ build (or use `./gradlew`) |
| Docker | 24+ | PostgreSQL database |
| npm | 9+ | Package manager |
| Expo CLI | Latest | mobile/ development |

### 1. Start Database

**Option A: Docker (Recommended)**

```bash
# From backend/ directory - starts PostgreSQL 16
cd backend
docker-compose up -d scholaros-db
```

**Option B: Local PostgreSQL**

Ensure PostgreSQL is running on port 5432 with:
- User: `postgres`
- Password: `postgres`
- Create database: `parentapp` (for server/)
- Create database: `scholaros` (for backend/)

### 2. Start server/ (Node.js Parent API)

```bash
cd server

# Install dependencies
npm install

# Run database migrations
npm run migrate

# Seed demo data
npm run seed

# Start development server (port 8080)
npm run dev
```

**Available scripts:**
| Command | Description |
|---|---|
| `npm start` | Production start |
| `npm run dev` | Development with auto-reload (`--watch`) |
| `npm run migrate` | Run latest Knex migrations |
| `npm run migrate:rollback` | Rollback last migration |
| `npm run seed` | Run seed files |
| `npm run seed:make` | Create new seed file |

### 3. Start backend/ (Java Spring Boot)

**Option A: Docker Compose (Full Stack)**

```bash
cd backend

# Copy and configure environment
cp .env.example .env

# Start PostgreSQL + Spring Boot
docker-compose up -d

# View logs
docker-compose logs -f homework-service
```

**Option B: Local Development**

```bash
cd backend

# Using Gradle wrapper
./gradlew bootRun

# Or on Windows
gradlew.bat bootRun
```

**Option C: Build & Run**

```bash
cd backend

# Build
./gradlew build

# Run JAR
java -jar build/libs/scholaros-0.0.1-SNAPSHOT.jar

# Or with dev profile (H2 in-memory DB)
java -jar build/libs/scholaros-0.0.1-SNAPSHOT.jar --spring.profiles.active=dev
```

**Available Gradle tasks:**
| Command | Description |
|---|---|
| `./gradlew bootRun` | Start Spring Boot app |
| `./gradlew build` | Build JAR |
| `./gradlew test` | Run tests |
| `./gradlew clean` | Clean build artifacts |

### 4. Start frontend/ (React Web Dashboard)

```bash
cd frontend

# Install dependencies
npm install

# Start dev server (port 5173)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint
npm run lint
```

**Available scripts:**
| Command | Description |
|---|---|
| `npm run dev` | Vite dev server (port 5173) |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview production build |
| `npm run lint` | Oxlint |

### 5. Start mobile/ (React Native Expo App)

```bash
cd mobile

# Install dependencies
npm install

# Start Expo dev server
npm start

# Start for specific platform
npm run android    # Android emulator/device
npm run ios        # iOS simulator/device
npm run web        # Web browser

# Lint
npm run lint
```

**Available scripts:**
| Command | Description |
|---|---|
| `npm start` | Expo dev server (QR code) |
| `npm run android` | Run on Android |
| `npm run ios` | Run on iOS |
| `npm run web` | Run on web |
| `npm run lint` | ESLint |
| `npm run reset-project` | Reset project to template |

### Quick Start (All Services)

```bash
# Terminal 1: Database
cd backend && docker-compose up -d scholaros-db

# Terminal 2: Node.js API
cd server && npm install && npm run migrate && npm run seed && npm run dev

# Terminal 3: Spring Boot
cd backend && ./gradlew bootRun

# Terminal 4: React Dashboard
cd frontend && npm install && npm run dev

# Terminal 5: Expo Mobile
cd mobile && npm install && npm start
```

---

## 13. Development Workflow

### Branch Strategy
- `main` - Production-ready code
- `develop` - Integration branch
- Feature branches - `feature/<name>`
- Bug fixes - `fix/<name>`

### Environment Variables

#### server/
| Variable | Default | Description |
|---|---|---|
| `PORT` | `8080` | Server port |
| `DB_HOST` | `localhost` | PostgreSQL host |
| `DB_PORT` | `5432` | PostgreSQL port |
| `DB_NAME` | `parentapp` | Database name |
| `DB_USER` | `postgres` | Database user |
| `DB_PASSWORD` | `postgres` | Database password |
| `JWT_SECRET` | - | JWT signing secret |

#### backend/
| Variable | Default | Description |
|---|---|---|
| `SERVER_PORT` | `8080` | Server port |
| `SPRING_PROFILES_ACTIVE` | `dev` | Spring profile |
| `POSTGRES_DB` | `scholaros` | Database name |
| `POSTGRES_USER` | `postgres` | Database user |
| `POSTGRES_PASSWORD` | `root123` | Database password |
| `GEMINI_API_KEY` | `mock` | Google Gemini API key |
| `JWT_SECRET` | - | JWT signing secret |

#### mobile/
| Variable | Default | Description |
|---|---|---|
| `EXPO_PUBLIC_API_URL` | `http://192.168.0.103:8080/api/v1` | Backend API URL |

### Testing

**server/**
```bash
# No test framework configured yet
# Manual testing via API client (Postman, curl)
```

**backend/**
```bash
cd backend
./gradlew test    # JUnit 5 tests
```

**frontend/**
```bash
cd frontend
npm run lint      # Oxlint
```

**mobile/**
```bash
cd mobile
npm run lint      # ESLint
```

### API Testing

```bash
# Health checks
curl http://localhost:8080/health                    # server/
curl http://localhost:8080/health                    # backend/

# Login
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@parentapp.com","password":"password123"}'

# Get children (with token)
curl http://localhost:8080/api/v1/parent/children \
  -H "Authorization: Bearer <token>"

# Swagger UI (backend/)
open http://localhost:8080/swagger-ui.html
```

### Database Operations

```bash
# server/ - Knex migrations
cd server
npm run migrate              # Apply all pending migrations
npm run migrate:rollback     # Rollback last batch
npm run seed                 # Run seed data
npm run seed:make            # Create new seed file

# backend/ - Flyway (auto-runs on startup)
# Migrations are in: backend/src/main/resources/db/migration/
# Versioned: V1, V2, ..., V13
# naming: V{version}__{description}.sql
```

### Production Deployment

```bash
# 1. Build backend/
cd backend
./gradlew build
docker build -t scholaros-backend .

# 2. Build frontend/
cd frontend
npm run build
# Serve dist/ with Nginx or similar

# 3. Start server/
cd server
npm install --production
NODE_ENV=production npm start

# 4. Docker Compose (full stack)
cd backend
docker-compose up -d
```

---

## Appendix: Key Configuration Files

| File | Path | Purpose |
|---|---|---|
| `knexfile.js` | `server/knexfile.js` | Knex PostgreSQL config |
| `application.yml` | `backend/src/main/resources/application.yml` | Spring Boot main config |
| `application-dev.yml` | `backend/src/main/resources/application-dev.yml` | H2 in-memory dev DB |
| `application-prod.yml` | `backend/src/main/resources/application-prod.yml` | PostgreSQL prod DB |
| `build.gradle` | `backend/build.gradle` | Gradle build dependencies |
| `docker-compose.yml` | `backend/docker-compose.yml` | Docker services |
| `Dockerfile` | `backend/Dockerfile` | Multi-stage JDK 21 build |
| `vite.config.js` | `frontend/vite.config.js` | Vite + React + Tailwind |
| `app.json` | `mobile/app.json` | Expo app configuration |
| `.env` | `mobile/.env` | Mobile API base URL |
| `.env.example` | `backend/.env.example` | Backend env template |

---

*Generated for ParentApp / ScholarOS project*
