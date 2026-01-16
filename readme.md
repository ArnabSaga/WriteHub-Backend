# 📝 Prisma Blog Application

![Blog Application Banner](https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1200&h=300&fit=crop)

> A modern, secure, and scalable blogging platform built with TypeScript, Express.js, and Prisma ORM

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Tech Stack](#-tech-stack)
- [Project Architecture](#-project-architecture)
- [API Endpoints](#-api-endpoints)
- [Features](#-features)
- [Installation & Setup](#-installation--setup)
- [Folder Structure](#-folder-structure)
- [Environment Variables](#-environment-variables)
- [Database Models](#-database-models)
- [Future Improvements](#-future-improvements)

---

## 🎯 Overview

The **Prisma Blog Application** is a modern, role-based blogging platform that provides a secure foundation for content creation and community engagement. Built with enterprise-grade technologies, it supports:

- ✅ Secure user authentication (Email/Password & OAuth)
- ✅ Role-based access control (User, Admin)
- ✅ Blog post creation, editing, and deletion
- ✅ Nested commenting system with admin moderation
- ✅ Advanced pagination and sorting
- ✅ Featured posts and post categorization with tags
- ✅ Comprehensive error handling

### Core Purpose

Enable users to publish blog content, engage through comments, while providing administrators with the tools to manage content and moderate discussions.

---

## 🛠️ Tech Stack

| Layer              | Technology               | Purpose                                                 |
| ------------------ | ------------------------ | ------------------------------------------------------- |
| **Runtime**        | Node.js                  | JavaScript runtime for server-side execution            |
| **Framework**      | Express.js 5.x           | Lightweight, flexible web application framework         |
| **Language**       | TypeScript 5.x           | Type-safe JavaScript with enhanced developer experience |
| **Database**       | PostgreSQL               | Robust, open-source relational database                 |
| **ORM**            | Prisma 7.x               | Modern, type-safe ORM with excellent DX                 |
| **Authentication** | Better Auth              | Flexible authentication solution with OAuth support     |
| **CORS**           | CORS 2.x                 | Cross-Origin Resource Sharing middleware                |
| **Email**          | Nodemailer               | Email sending capability for notifications              |
| **Dev Tools**      | TSX, TypeScript Compiler | Development & compilation tools                         |

### Why These Technologies?

- **TypeScript**: Provides static type checking, reducing runtime errors and improving code maintainability
- **Prisma ORM**: Type-safe database queries, automatic migrations, and excellent schema management
- **PostgreSQL**: Reliable, feature-rich database with strong ACID compliance
- **Express.js**: Minimal and flexible framework with extensive middleware ecosystem
- **Better Auth**: Seamless authentication with multiple providers and session management

---

## 🏗️ Project Architecture

### High-Level Flow

```
┌─────────────────────────────────────────────────────────┐
│                    Client Application                   │
└────────────────────────┬────────────────────────────────┘
                         │ HTTP Requests
                         ▼
┌─────────────────────────────────────────────────────────┐
│                   Express Server                        │
│  ┌───────────────────────────────────────────────────┐  │
│  │ Routes & Controllers                              │  │
│  │  • /api/v1/posts (CRUD operations)                │  │
│  │  • /api/v1/comments (CRUD + moderation)           │  │
│  │  • /api/auth (Authentication)                     │  │
│  └───────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────┐  │
│  │ Middleware Layer                                  │  │
│  │  • Authentication & Authorization                 │  │
│  │  • CORS & Security Headers                        │  │
│  │  • Global Error Handling                          │  │
│  └───────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────┐  │
│  │ Service Layer                                     │  │
│  │  • Business Logic Implementation                  │  │
│  │  • Data Processing & Validation                   │  │
│  └───────────────────────────────────────────────────┘  │
└────────────────────────┬────────────────────────────────┘
                         │ Database Queries
                         ▼
┌─────────────────────────────────────────────────────────┐
│                  Prisma Client                          │
│         (Type-safe Database Abstraction)                │
└────────────────────────┬────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│                   PostgreSQL Database                   │
│  • Posts • Comments • Users • Sessions • Accounts       │
└─────────────────────────────────────────────────────────┘
```

### Component Interaction

1. **Request Entry**: Client sends HTTP request to Express server
2. **Routing**: Express routes request to appropriate controller
3. **Authentication**: Auth middleware validates user identity and role
4. **Business Logic**: Service layer processes the request
5. **Data Access**: Prisma queries the database
6. **Response**: Data is transformed and sent back to client

---

## 📡 API Endpoints

### Authentication Endpoints

```
POST   /api/auth/*         Better Auth Routes (registration, login, OAuth)
```

### Post Endpoints

```
GET    /api/v1/posts              Get all published posts (public)
GET    /api/v1/posts/stats        Get post statistics (Admin only)
GET    /api/v1/posts/my-posts     Get user's own posts (Authenticated)
GET    /api/v1/posts/:postId      Get single post by ID
POST   /api/v1/posts              Create new post (Authenticated)
PATCH  /api/v1/posts/:postId      Update post (Owner or Admin)
DELETE /api/v1/posts/:postId      Delete post (Owner or Admin)
```

### Comment Endpoints

```
GET    /api/v1/comments/:commentId         Get single comment
GET    /api/v1/comments/author/:authorId   Get comments by author
POST   /api/v1/comments                    Create new comment (Authenticated)
PATCH  /api/v1/comments/:commentId         Update comment (Owner or Admin)
PATCH  /api/v1/comments/:commentId/moderate  Approve/reject comment (Admin)
DELETE /api/v1/comments/:commentId         Delete comment (Owner or Admin)
```

### Data Flow Examples

#### Creating a Post

```
1. Client sends POST /api/v1/posts with { title, content, tags, ... }
2. Auth middleware verifies user is authenticated
3. PostController.createPost processes the request
4. PostService validates and prepares data
5. Prisma client creates record in database
6. Response: Created post object with generated ID
```

#### Commenting on a Post

```
1. Client sends POST /api/v1/comments with { content, postId, ... }
2. Auth middleware verifies user is authenticated
3. CommentController.createComment processes request
4. CommentService validates post exists and data is valid
5. Prisma creates comment (status defaults to APPROVED or awaits moderation)
6. Response: Created comment object
```

#### Admin Moderation

```
1. Admin sends PATCH /api/v1/comments/:commentId/moderate with { status }
2. Auth middleware verifies user has ADMIN role
3. CommentController.moderateComment processes request
4. Prisma updates comment status (APPROVED / REJECT)
5. Response: Updated comment with new status
```

---

## ✨ Features

### 🔐 Authentication & Security

- **Multi-method Authentication**: Email/password and Google OAuth
- **Session Management**: Secure session tokens with expiration
- **Role-Based Access Control**: User, Admin roles with granular permissions
- **Protected Routes**: Middleware-based route protection
- **Email Verification**: Account verification workflow

### 📝 Content Management

- **Create Posts**: Authenticated users can create and publish blog posts
- **Rich Post Metadata**: Title, content, tags, featured status, views counter
- **Update & Delete**: Full CRUD operations with ownership validation
- **Post Drafts**: Support for draft posts (DRAFT status)
- **Post Archival**: Archive posts instead of permanent deletion

### 💬 Commenting System

- **Nested Replies**: Reply to comments with parent-child relationships
- **Comment Moderation**: Admin approval/rejection of user comments
- **Ownership Validation**: Users can only edit/delete their own comments
- **Threaded Display**: Organize comments hierarchically

### 📊 Advanced Features

- **Pagination & Sorting**: Efficient data retrieval with customizable sorting
- **View Counting**: Track post engagement with view metrics
- **Featured Posts**: Highlight important content
- **Tag System**: Categorize posts with multiple tags
- **User Profiles**: Extended user information (name, email, phone, etc.)

### 🛡️ Admin Features

- **Content Moderation**: Approve or reject user comments
- **Post Analytics**: View platform statistics (posts count, users, etc.)
- **Full Access**: Manage all posts and comments
- **User Management**: Control user roles and status

---

## 📥 Installation & Setup

### Prerequisites

- **Node.js** v18+ and npm
- **PostgreSQL** 12+
- **Git** (optional)

### Step 1: Clone & Navigate

```bash
# Clone the repository
git clone https://github.com/ArnabSaga/Blog-app.git
cd Prisma-Blog-Application

# Or if manually downloaded, navigate to project directory
cd Prisma-Blog-Application
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Configure Environment Variables

Create a `.env` file in the project root:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/blog_db"

# Server
PORT=5000
APP_URL="http://localhost:5000"

# Better Auth
BETTER_AUTH_SECRET="your-secret-key-here"
BETTER_AUTH_URL="http://localhost:5000"

# OAuth (Optional - Google)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Email Configuration (Optional - Nodemailer)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your-email@gmail.com"
SMTP_PASSWORD="your-app-password"
```

### Step 4: Setup Database

```bash
# Create PostgreSQL database
createdb blog_db

# Run Prisma migrations
npx prisma migrate dev

# Seed admin user (optional)
npm run seed:admin
```

### Step 5: Start Development Server

```bash
npm run dev
```

The server will start on `http://localhost:5000`

### Step 6: Test the API

Use Postman, Insomnia, or cURL to test endpoints:

```bash
# Get all posts
curl http://localhost:5000/api/v1/posts

# Health check
curl http://localhost:5000/
```

---

## 📁 Folder Structure

```
Prisma-Blog-Application/
├── src/                                # Source code
│   ├── app.ts                         # Express app setup & routes
│   ├── server.ts                      # Server entry point
│   │
│   ├── lib/                           # Utilities & library functions
│   │   ├── prisma.ts                 # Prisma client instance
│   │   └── auth.ts                   # Authentication logic
│   │
│   ├── middleware/                    # Express middleware
│   │   ├── auth.ts                   # Authentication & authorization
│   │   ├── globalErrorHandler.ts     # Centralized error handling
│   │   └── NotFound.ts               # 404 handler
│   │
│   ├── modules/                       # Feature modules
│   │   ├── post/                     # Blog posts module
│   │   │   ├── post.controller.ts   # HTTP request handlers
│   │   │   ├── post.service.ts      # Business logic
│   │   │   └── post.route.ts        # Route definitions
│   │   │
│   │   └── comment/                  # Comments module
│   │       ├── comment.controller.ts # HTTP request handlers
│   │       ├── comment.service.ts   # Business logic
│   │       └── comment.route.ts     # Route definitions
│   │
│   ├── helpers/                       # Utility functions
│   │   └── paginationSortingHelper.ts # Pagination logic
│   │
│   └── scripts/                       # Database scripts
│       └── seedAdmin.ts              # Seed initial admin user
│
├── prisma/                            # Prisma ORM configuration
│   ├── schema.prisma                 # Database schema definition
│   ├── migrations/                   # Database migrations
│   └── migration_lock.toml           # Migration lock file
│
├── generated/                         # Auto-generated code
│   └── prisma/                       # Prisma client types
│
├── resources/                         # Project resources
│   └── what-to-do.md                 # Project requirements
│
├── .env                              # Environment variables (create this)
├── .env.example                      # Environment template (optional)
├── .gitignore                        # Git ignore rules
├── package.json                      # Project dependencies
├── tsconfig.json                     # TypeScript configuration
├── prisma.config.ts                  # Prisma configuration
└── README.md                         # This file
```

### Key Directories Explained

- **`src/`**: Contains all application source code organized by concerns
- **`src/modules/`**: Feature-based modules (MVC pattern) with controllers, services, and routes
- **`src/middleware/`**: Reusable middleware functions (auth, error handling)
- **`prisma/`**: Database schema and migration files
- **`generated/`**: Auto-generated Prisma client (don't edit manually)

---

## 🔧 Environment Variables

| Variable               | Description                  | Example                                         |
| ---------------------- | ---------------------------- | ----------------------------------------------- |
| `DATABASE_URL`         | PostgreSQL connection string | `postgresql://user:pass@localhost:5432/blog_db` |
| `PORT`                 | Server port                  | `5000`                                          |
| `APP_URL`              | Application URL              | `http://localhost:5000`                         |
| `BETTER_AUTH_SECRET`   | Auth secret key              | `your-secret-key-123`                           |
| `BETTER_AUTH_URL`      | Auth callback URL            | `http://localhost:5000`                         |
| `GOOGLE_CLIENT_ID`     | Google OAuth client ID       | (from Google Console)                           |
| `GOOGLE_CLIENT_SECRET` | Google OAuth secret          | (from Google Console)                           |
| `SMTP_HOST`            | Email SMTP host              | `smtp.gmail.com`                                |
| `SMTP_PORT`            | Email SMTP port              | `587`                                           |
| `SMTP_USER`            | Email account username       | `your-email@gmail.com`                          |
| `SMTP_PASSWORD`        | Email account password       | (app-specific password)                         |

---

## 📦 Database Models

### Post

```
┌─ Posts ─────────────────────────────┐
│ id           String   (UUID)        │
│ title        String   (max 225)     │
│ content      Text                   │
│ thumbnail    String?                │
│ isFeatured   Boolean  (default: false)
│ status       Enum     (DRAFT, PUBLISHED, ARCHIVED)
│ tags         String[] (array of tags)
│ views        Int      (default: 0)  │
│ authorId     String   (foreign key) │
│ createdAt    DateTime               │
│ updatedAt    DateTime               │
│ comments     Comment[] (one-to-many)
└─────────────────────────────────────┘
```

### Comment

```
┌─ Comments ──────────────────────────┐
│ id        String   (UUID)           │
│ content   Text                      │
│ authorId  String   (foreign key)    │
│ postId    String   (foreign key)    │
│ post      Post     (many-to-one)    │
│ parentId  String?  (self-relation)  │
│ parent    Comment? (for replies)    │
│ replies   Comment[] (nested replies)│
│ status    Enum     (APPROVED, REJECT)
│ createdAt DateTime                  │
│ updatedAt DateTime                  │
└─────────────────────────────────────┘
```

### User

```
┌─ User ──────────────────────────────┐
│ id            String   (PK)         │
│ name          String                │
│ email         String   (unique)     │
│ emailVerified Boolean               │
│ image         String?               │
│ role          String   (USER, ADMIN)│
│ phone         String?               │
│ status        String   (ACTIVE)     │
│ sessions      Session[] (one-to-many)
│ accounts      Account[] (one-to-many)
│ createdAt     DateTime              │
│ updatedAt     DateTime              │
└─────────────────────────────────────┘
```

### Session & Account

Used internally by Better Auth for session and OAuth management.

---

## 🚀 Useful Commands

```bash
# Development
npm run dev                    # Start development server with hot reload
npm run seed:admin            # Seed initial admin user to database

# Database
npx prisma migrate dev        # Create and apply new migrations
npx prisma migrate reset      # Reset database (development only!)
npx prisma studio            # Open Prisma Studio GUI for database management

# Build (if needed)
npx tsc                       # Compile TypeScript
```

---

## 🔮 Future Improvements

- [ ] **Full-Text Search**: Advanced search functionality for posts and comments
- [ ] **Post Scheduling**: Schedule posts for future publication
- [ ] **Email Notifications**: Notify users of replies and new posts
- [ ] **Rate Limiting**: Prevent API abuse with rate limiting
- [ ] **Post Liking System**: Users can like/heart posts
- [ ] **User Profiles**: Extended user pages with authored posts
- [ ] **Rich Text Editor**: Support for markdown or WYSIWYG editing
- [ ] **Image Upload**: Media management for post thumbnails
- [ ] **Analytics Dashboard**: Admin dashboard for metrics and insights
- [ ] **API Documentation**: OpenAPI/Swagger documentation
- [ ] **Unit & Integration Tests**: Comprehensive test coverage
- [ ] **Caching**: Redis integration for performance optimization
- [ ] **Webhooks**: External service integrations
- [ ] **Draft Auto-save**: Periodically save drafts to prevent data loss
- [ ] **Multi-language Support**: i18n implementation

---

## 📄 License

This project is licensed under the ISC License - see the LICENSE file for details.

---

## 🔗 Resources

- [Prisma Documentation](https://www.prisma.io/docs/)
- [Express.js Guide](https://expressjs.com/)
- [Better Auth](https://better-auth.dev/)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

## 👨‍💻 Contributing

Contributions are welcome! Feel free to fork the repository and submit pull requests.

---

**Happy Blogging! 🎉**
