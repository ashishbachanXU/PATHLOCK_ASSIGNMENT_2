# 📋 Mini Project Manager

> A modern, full-stack project management application built with React, TypeScript, and .NET 8

[![.NET](https://img.shields.io/badge/.NET-8.0-512BD4?logo=dotnet)](https://dotnet.microsoft.com/)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-7.0-646CFF?logo=vite)](https://vitejs.dev/)

## 🌟 Overview

Mini Project Manager is a comprehensive full-stack web application that enables users to efficiently manage projects and tasks. Built with modern technologies and featuring a premium dark mode UI , it provides an intuitive and visually appealing experience for project management.

### ✨ Key Features

- 🔐 **Secure Authentication** - JWT-based user registration and login
- 📊 **Project Management** - Create, view, and delete projects with ease
- ✅ **Task Management** - Add, edit, delete, and toggle task completion
- 🤖 **Smart Scheduler** - AI-powered task scheduling with dependency resolution
- 🎨 **Premium Dark Mode** - Modern grey shades with liquid glass effects
- 📱 **Responsive Design** - Mobile-friendly interface with auto-height cards
- ⚡ **Optimistic Updates** - Instant UI updates with error recovery

---

## 🏗️ Architecture

### Technology Stack

#### Backend
- **Framework**: .NET 8 Core
- **Database**: SQLite (Entity Framework Core)
- **Authentication**: JWT (JSON Web Tokens)
- **API Style**: RESTful
- **Architecture**: Layered (Controllers → Services → Data)

#### Frontend
- **Framework**: React 18
- **Language**: TypeScript
- **Build Tool**: Vite
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Styling**: CSS with CSS Variables

### Project Structure

```
mini-project-manager/
├── MiniProjectManager.Api/          # Backend (.NET 8)
│   ├── Controllers/                 # API endpoints
│   │   ├── AuthController.cs       # Authentication endpoints
│   │   ├── ProjectsController.cs   # Project CRUD operations
│   │   └── TasksController.cs      # Task CRUD operations
│   ├── Services/                    # Business logic layer
│   │   ├── AuthService.cs          # JWT generation & validation
│   │   ├── ProjectService.cs       # Project operations
│   │   ├── TaskService.cs          # Task operations
│   │   └── SchedulerService.cs     # Smart scheduling algorithm
│   ├── Models/                      # Entity models
│   │   ├── User.cs                 # User entity
│   │   ├── Project.cs              # Project entity
│   │   └── Task.cs                 # Task entity
│   ├── DTOs/                        # Data transfer objects
│   ├── Data/                        # Database context
│   │   └── ApplicationDbContext.cs # EF Core DbContext
│   ├── Migrations/                  # Database migrations
│   ├── Program.cs                   # Application entry point
│   └── appsettings.json            # Configuration
│
└── mini-project-manager-ui/         # Frontend (React + TypeScript)
    ├── src/
    │   ├── components/              # React components
    │   │   ├── Login.tsx           # Login page
    │   │   ├── Register.tsx        # Registration page
    │   │   ├── Dashboard.tsx       # Main dashboard
    │   │   ├── ProjectDetails.tsx  # Project detail view
    │   │   ├── ProjectForm.tsx     # Project creation form
    │   │   ├── TaskItem.tsx        # Task component
    │   │   ├── ThemeToggle.tsx     # Dark/light mode toggle
    │   │   ├── MobileMenu.tsx      # Mobile navigation
    │   │   ├── ScheduleModal.tsx   # Smart scheduler modal
    │   │   └── Toast.tsx           # Notification component
    │   ├── services/                # API services
    │   │   ├── api.ts              # Axios configuration
    │   │   ├── authService.ts      # Authentication API
    │   │   ├── projectService.ts   # Project API
    │   │   ├── taskService.ts      # Task API
    │   │   └── schedulerService.ts # Scheduler API
    │   ├── context/                 # React context
    │   │   └── ToastContext.tsx    # Toast notifications
    │   ├── hooks/                   # Custom hooks
    │   │   └── useToast.ts         # Toast hook
    │   ├── types/                   # TypeScript types
    │   │   └── index.ts            # Type definitions
    │   ├── App.tsx                  # Main app component
    │   ├── index.css               # Global styles
    │   └── main.tsx                # Application entry
    ├── public/                      # Static assets
    ├── package.json                 # Dependencies
    ├── tsconfig.json               # TypeScript config
    └── vite.config.ts              # Vite configuration
```

---

## 🎨 Design System

### Color Palette (Dark Mode)

```css
--bg: #0f0f0f              /* Main background */
--panel: #1e1e1e           /* Card background */
--panel-2: #2a2a2a         /* Input background */
--text: #eaeaea            /* Primary text */
--text-secondary: #d1d1d1  /* Secondary text */
--accent: gradient         /* Button gradient */
```

### UI Features

- **Auto-Height Cards**: Cards expand based on content
- **Smart Scrolling**: Task lists scroll after 5 items
- **Liquid Glass Effects**: Backdrop blur with translucent backgrounds
- **Smooth Animations**: Cubic-bezier transitions
- **Responsive Grid**: Auto-fit layout with minmax
- **Custom Scrollbars**: Slim, themed scrollbars

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v20.14.0 or higher
- **.NET SDK**: 8.0 or higher
- **Git**: For cloning the repository

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd mini-project-manager
   ```

2. **Install Backend Dependencies**
   ```bash
   cd MiniProjectManager.Api
   dotnet restore
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd mini-project-manager-ui
   npm install
   ```

### Configuration

#### Backend Configuration

Edit `MiniProjectManager.Api/appsettings.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Data Source=miniprojectmanager.db"
  },
  "Jwt": {
    "SecretKey": "your-secret-key-min-32-characters-long",
    "Issuer": "MiniProjectManager",
    "Audience": "MiniProjectManagerUsers",
    "ExpirationHours": 24
  }
}
```

#### Frontend Configuration

The frontend is pre-configured to connect to `http://localhost:5055`.

To change the API URL, edit `mini-project-manager-ui/src/services/api.ts`:

```typescript
const api = axios.create({
  baseURL: 'http://localhost:5055/api',
});
```

---

## ▶️ Running the Application

### Option 1: Run Both Servers Separately

#### Start Backend (Terminal 1)
```bash
cd MiniProjectManager.Api
dotnet run
```
Backend will start at: **http://localhost:5055**

#### Start Frontend (Terminal 2)
```bash
cd mini-project-manager-ui
npm run dev
```
Frontend will start at: **http://localhost:5173**

### Option 2: Using PowerShell Scripts

#### Windows (PowerShell)
```powershell
# Start Backend
cd MiniProjectManager.Api
Start-Process powershell -ArgumentList "dotnet run"

# Start Frontend
cd mini-project-manager-ui
Start-Process powershell -ArgumentList "npm run dev"
```

### Access the Application

Open your browser and navigate to:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5055
- **API Documentation**: http://localhost:5055/swagger (if enabled)

---
---

## 📡 API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |

### Projects

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/projects` | Get all user projects | ✅ |
| POST | `/api/projects` | Create new project | ✅ |
| GET | `/api/projects/{id}` | Get project by ID | ✅ |
| DELETE | `/api/projects/{id}` | Delete project | ✅ |

### Tasks

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/projects/{projectId}/tasks` | Create task | ✅ |
| PUT | `/api/tasks/{taskId}` | Update task | ✅ |
| DELETE | `/api/tasks/{taskId}` | Delete task | ✅ |

### Smart Scheduler

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/v1/projects/{projectId}/schedule` | Generate optimal task order | ✅ |

---

## 🔧 Development

### Build for Production

#### Backend
```bash
cd MiniProjectManager.Api
dotnet publish -c Release -o ./publish
```

#### Frontend
```bash
cd mini-project-manager-ui
npm run build
```

The production build will be in `mini-project-manager-ui/dist/`

### Run Tests

#### Backend
```bash
cd MiniProjectManager.Api
dotnet test
```

#### Frontend
```bash
cd mini-project-manager-ui
npm run test
```

### Code Quality

#### Frontend Linting
```bash
cd mini-project-manager-ui
npm run lint
```

---

## 🎯 Features in Detail

### 1. Authentication System
- JWT-based authentication
- Secure password hashing with BCrypt
- Token stored in localStorage
- Automatic token inclusion in API requests
- Protected routes with authentication guards

### 2. Project Management
- Create projects with title and description
- View all projects in a responsive grid
- Delete projects with confirmation
- Auto-height cards based on content
- Task count display

### 3. Task Management
- Add tasks to projects
- Edit tasks inline
- Delete tasks with confirmation
- Toggle task completion status
- Visual feedback for completed tasks

### 4. Smart Scheduler
- Dependency resolution algorithm
- Topological sort for task ordering
- Estimated hours consideration
- Due date awareness
- Visual task order display

### 5. UI/UX Features
- **Dark Mode**: Premium grey theme with liquid glass effects
- **Theme Toggle**: Switch between light and dark modes
- **Mobile Menu**: Responsive navigation for mobile devices
- **Auto-Height Cards**: Cards expand naturally with content
- **Smart Scrolling**: Task lists scroll after threshold
- **Smooth Animations**: Professional transitions and effects

---

## 🔒 Security Features

- ✅ JWT token authentication
- ✅ Password hashing with BCrypt
- ✅ CORS configuration
- ✅ User data isolation (users can only access their own data)
- ✅ Input validation (client and server-side)
- ✅ SQL injection prevention (EF Core parameterization)
- ✅ XSS protection (React's default escaping)

---

## 📱 Responsive Design

The application is fully responsive and works on:
- 📱 Mobile devices (320px+)
- 📱 Tablets (768px+)
- 💻 Desktops (1024px+)
- 🖥️ Large screens (1440px+)
---

## 📦 Dependencies

### Backend
- Microsoft.EntityFrameworkCore (8.0.0)
- Microsoft.EntityFrameworkCore.Sqlite (8.0.0)
- Microsoft.AspNetCore.Authentication.JwtBearer (8.0.0)
- BCrypt.Net-Next (4.0.3)
- System.IdentityModel.Tokens.Jwt (7.0.0)

### Frontend
- react (18.3.1)
- react-dom (18.3.1)
- react-router-dom (6.28.0)
- axios (1.7.9)
- typescript (5.6.2)
- vite (7.1.12)


<img width="1498" height="884" alt="Screenshot 2025-10-31 143844" src="https://github.com/user-attachments/assets/3522d76e-662e-4899-b810-ecab1d637c86" />


---


<div align="center">

</div>
