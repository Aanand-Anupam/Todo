# Do2Done Application

A full-stack web application for managing todos, tasks, and leveraging AI assistance. Built with React, TypeScript, Express, and MongoDB.

## Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Setup](#environment-setup)
- [Running the Project](#running-the-project)
- [Available Scripts](#available-scripts)
- [Project Architecture](#project-architecture)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)
- [License](#license)

## Project Overview

This is a comprehensive todo management application with the following capabilities:

- **Todo Management**: Create, read, update, and delete todos organized in documents
- **AI Assistant**: Leverage AI to generate, enhance, and organize your tasks
- **Audio Tasks**: Support for audio-based task input
- **User Authentication**: Secure user registration and login with JWT
- **File Management**: Upload and manage files associated with tasks
- **Analytics**: Track your productivity and task completion statistics

## Features

✨ **Core Features:**

- User authentication (Login/Signup)
- Create and manage todo documents
- Add, edit, and delete todo items
- Organize tasks with draft editing capabilities
- AI-powered task generation and suggestions
- Audio input support for tasks
- File upload and management via Cloudinary
- User dashboard with analytics
- Protected routes for authenticated users
- Real-time todo synchronization

## Tech Stack

### Frontend

- **React** 19.2.7 - UI framework
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **React Router** 7.18 - Client-side routing
- **TailwindCSS** 4.3.1 - Utility-first CSS framework

### Backend

- **Node.js** with **Express** 5.2.1 - REST API server
- **TypeScript** - Type-safe backend development
- **MongoDB** with **Mongoose** 9.4.1 - NoSQL database
- **JWT** - Authentication tokens
- **Bcrypt** - Password hashing
- **Cloudinary** - Cloud file storage and management
- **Multer** 2.1.1 - File upload middleware

### Development Tools

- **Nodemon** - Auto-restart development server
- **Oxlint** - Fast linter for frontend
- **ts-node-dev** - TypeScript development runner

## Project Structure

```
Todo/
├── client/                          # Frontend React application
│   ├── src/
│   │   ├── api/                    # API client modules
│   │   │   ├── ai.ts              # AI service integration
│   │   │   ├── auth.ts            # Authentication API
│   │   │   ├── client.ts          # HTTP client setup
│   │   │   └── todos.ts           # Todo API endpoints
│   │   ├── components/            # Reusable components
│   │   │   ├── layout/            # Layout components (Navbar, Sidebar, Footer)
│   │   │   ├── Pages/             # Page components
│   │   │   ├── tasks/             # Task-related components
│   │   │   └── todos/             # Todo-related components
│   │   ├── context/               # React Context
│   │   │   ├── AuthContext.tsx    # Authentication state
│   │   │   └── TodosContext.tsx   # Todos state management
│   │   ├── pages/                 # Page components
│   │   │   ├── LoginPage.tsx
│   │   │   ├── SignupPage.tsx
│   │   │   ├── LandingPage.tsx
│   │   │   ├── TodoDocumentPage.tsx
│   │   │   ├── AiAssistantPage.tsx
│   │   │   └── DashboardLayout.tsx
│   │   ├── types/                 # TypeScript type definitions
│   │   ├── utils/                 # Utility functions
│   │   ├── App.tsx                # Main App component
│   │   └── main.tsx               # Entry point
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── index.html
│
├── server/                          # Backend Express application
│   ├── src/
│   │   ├── controllers/           # Request handlers
│   │   │   ├── auth.controller.ts
│   │   │   ├── user.controller.ts
│   │   │   ├── todo.controller.ts
│   │   │   └── ai.controller.ts
│   │   ├── services/              # Business logic
│   │   │   ├── ai.service.ts
│   │   │   ├── analytics.service.ts
│   │   │   └── todo.service.ts
│   │   ├── models/                # Database models
│   │   │   ├── user.model.ts
│   │   │   └── todo.model.ts
│   │   ├── routes/                # API routes
│   │   │   ├── auth.route.ts
│   │   │   ├── user.route.ts
│   │   │   ├── todo.route.ts
│   │   │   ├── ai.route.ts
│   │   │   └── api.route.ts
│   │   ├── middleware/            # Express middleware
│   │   │   ├── authenticate.ts
│   │   │   ├── error.middleware.ts
│   │   │   └── multer.middleware.ts
│   │   ├── utils/                 # Utility functions
│   │   │   ├── ApiError.ts
│   │   │   ├── response.ts
│   │   │   ├── jwt.verify.ts
│   │   │   ├── cloudinary.ts
│   │   │   ├── todoItem.ts
│   │   │   └── remove_local_file.ts
│   │   ├── workers/               # Background workers
│   │   │   └── deleteTodo.worker.ts
│   │   ├── types/                 # TypeScript interfaces
│   │   │   ├── model.interface.ts
│   │   │   └── other.interface.ts
│   │   ├── config/
│   │   │   └── env.ts            # Environment configuration
│   │   ├── db/
│   │   │   └── db.connection.ts  # Database connection
│   │   └── index.ts              # Entry point
│   ├── uploads/                   # Local file uploads directory
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example              # Environment variables template
│
└── README.md                        # This file
```

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **npm** or **yarn** - Comes with Node.js
- **MongoDB** (local or cloud) - [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) or local installation
- **Git** - For version control

## Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Todo
```

### 2. Install Frontend Dependencies

```bash
cd client
npm install
```

### 3. Install Backend Dependencies

```bash
cd ../server
npm install
```

## Environment Setup

### Backend Configuration

Create a `.env` file in the `server` directory with the following variables:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/todo-app
# Or use MongoDB Atlas:
# MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/todo-app

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d

# Cloudinary Configuration (for file uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# AI Service Configuration (if using external AI API)
AI_API_KEY=your_ai_api_key
AI_API_URL=your_ai_api_endpoint

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173
```

### Frontend Configuration

Create a `.env` file in the `client` directory (if needed):

```env
VITE_API_URL=http://localhost:5000/api
```

## Running the Project

### Development Mode

Open two terminals and run:

**Terminal 1 - Backend:**

```bash
cd server
npm run dev
```

The backend will start on `http://localhost:5000`

**Terminal 2 - Frontend:**

```bash
cd client
npm run dev
```

The frontend will start on `http://localhost:5173`

### Production Build

**Build Backend:**

```bash
cd server
npm run build
npm start
```

**Build Frontend:**

```bash
cd client
npm run build
npm run preview
```

## Available Scripts

### Frontend (client/)

- `npm run dev` - Start development server with Vite
- `npm run build` - Build the project for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run code linting with Oxlint

### Backend (server/)

- `npm run dev` - Start development server with Nodemon (auto-restart)
- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Run production build

## Project Architecture

### Authentication Flow

1. User signs up/logs in via the **LoginPage** or **SignupPage**
2. Backend validates credentials and returns JWT token
3. Token is stored in browser storage
4. **AuthContext** manages authentication state
5. **ProtectedRoute** component restricts access to authenticated users

### Todo Management Flow

1. Users view their todo documents on the **Dashboard**
2. Click to open a **TodoDocumentPage**
3. Add items using **AddTodoItemModal**
4. Edit draft items with **DraftItemEditor**
5. View tasks as **TaskCard** components
6. Backend synchronizes changes with MongoDB

### AI Integration

1. Users access the **AiAssistantPage**
2. Submit requests to generate or enhance tasks
3. Backend calls AI service via **ai.service.ts**
4. Results are displayed in the UI

### File Upload

1. Users upload files through task/todo components
2. **Multer** middleware handles file reception
3. Files are uploaded to **Cloudinary**
4. File URLs are stored in MongoDB

## API Documentation

### Authentication Endpoints

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Todo Endpoints

- `GET /api/todos` - Get all todos
- `POST /api/todos` - Create new todo
- `GET /api/todos/:id` - Get todo by ID
- `PUT /api/todos/:id` - Update todo
- `DELETE /api/todos/:id` - Delete todo

### AI Endpoints

- `POST /api/ai/generate` - Generate tasks with AI
- `POST /api/ai/enhance` - Enhance existing tasks
- `GET /api/ai/suggestions` - Get task suggestions

### User Endpoints

- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/analytics` - Get user analytics

_For detailed endpoint documentation, refer to route files in `server/src/routes/`_

## Contributing

1. Create a feature branch: `git checkout -b feature/your-feature-name`
2. Commit your changes: `git commit -m 'Add your feature'`
3. Push to the branch: `git push origin feature/your-feature-name`
4. Open a Pull Request

### Code Style

- Use TypeScript for type safety
- Follow ESLint/Oxlint recommendations
- Use meaningful commit messages
- Add comments for complex logic

## License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

---

## Troubleshooting

### MongoDB Connection Issues

- Ensure MongoDB service is running
- Check connection string in `.env` file
- Verify network access for MongoDB Atlas

### Port Already in Use

- Change PORT in `.env` file
- Or kill the process using the port:
  - Windows: `netstat -ano | findstr :5000`
  - Mac/Linux: `lsof -i :5000`

### Module Not Found Errors

- Delete `node_modules` and `package-lock.json`
- Run `npm install` again

### CORS Issues

- Verify `FRONTEND_URL` in backend `.env`
- Check Express CORS middleware configuration

---

**Happy Coding!** 🚀

For more information or issues, please open an GitHub issue.
