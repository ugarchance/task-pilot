# Task Pilot 📋

Task Pilot is a modern and user-friendly task management application. Built with Next.js and TypeScript, it utilizes Firebase infrastructure for real-time collaboration and data management.

## 🚀 Features

- Kanban board style task management
- Real-time updates and collaboration
- Task status tracking and statistics
- Modern and responsive user interface

## 🛠 Tech Stack

- **Frontend Framework:** Next.js
- **Programming Language:** TypeScript
- **Backend & Database:** Firebase (Firestore)
- **State Management:** Redux Toolkit
- **UI Components:** Tailwind CSS

## 📁 Project Structure

```
task-pilot/
├── web-app/                # Web application root
│   ├── src/
│   │   ├── app/           # Next.js app router configuration
│   │   ├── features/      # Feature-based modules (tasks, auth, etc.)
│   │   ├── shared/        # Shared components, hooks and utilities
│   │   └── core/          # Core application configuration
├── functions/             # Firebase Cloud Functions
├── public/               # Static files
└── firebase.json         # Firebase configuration
```

## 🚀 Getting Started

### Prerequisites

The following software must be installed to run the project:

- Node.js (v18 or higher)
- npm (v9 or higher)
- Git
- Firebase CLI (`npm install -g firebase-tools`)

### Development Environment Setup

1. **Clone the Project**
```bash
git clone [repo-url]
cd task-pilot
```

2. **Create Firebase Project**
- Go to [Firebase Console](https://console.firebase.google.com)
- Create a new project
- Enable Authentication and Firestore services
- Create a web application and get configuration details

3. **Set Environment Variables**
```bash
cd web-app
cp .env.example .env.local
```
Update `.env.local` with your Firebase configuration:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

4. **Install Dependencies**
```bash
# In root directory
npm install

# In web-app directory
cd web-app
npm install

# In functions directory
cd ../functions
npm install
```

5. **Start Development Server**
```bash
# For web application
cd web-app
npm run dev

# For Firebase emulators (new terminal)
firebase emulators:start
```

### 🔨 Available Commands

For web application (in `web-app` directory):
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Run production build
npm run lint         # Run ESLint checks
npm run type-check   # Run TypeScript type checking
```

For Firebase Functions (in `functions` directory):
```bash
npm run serve   # Run Firebase functions locally
npm run deploy  # Deploy Firebase functions
npm run build   # Build TypeScript code
```

### 🌐 Browser Support

Task Pilot supports the last two versions of these modern browsers:
- Chrome
- Firefox
- Safari
- Edge

### 💻 Development Tools

Recommended VS Code extensions:
- ESLint
- Prettier
- Tailwind CSS IntelliSense
- Firebase Explorer

## 📱 Web Application (web-app)

The web application is a Next.js project utilizing modern web technologies. Here's the detailed structure:

### 🔍 Core Components

#### `/src` Directory
- **app/**: Next.js 13+ App Router structure
  - Page templates
  - Layout components
  - Route handlers

- **features/**: Feature-based modules
  - `tasks/`: All task management related components
    - `components/`: Task cards, board view
    - `store/`: Redux state management
    - `types/`: TypeScript type definitions
    - `validation/`: Form validation schemas
    - `api/`: API route handlers

- **shared/**: Reusable components
  - `components/`: Common UI components
  - `hooks/`: Custom React hooks
  - `utils/`: Helper functions
  - `store/`: Global state management

- **core/**: Core configurations
  - Firebase configuration
  - Authentication structure
  - Global types

### 🎨 Styling and Design
- Modern and responsive design with Tailwind CSS
- Custom theme configuration
- Shadcn/ui component library integration

### 🔒 Security and Performance
- Type safety with TypeScript
- Firebase Authentication integration
- Next.js optimizations (Image, Font, Layout)
- Environment variables management

### 📦 Dependencies
Core packages:
- Next.js: ^14.0.0
- React: ^18.0.0
- TypeScript: ^5.0.0
- Firebase: ^10.0.0
- Redux Toolkit: ^2.0.0
- Tailwind CSS: ^3.0.0
- Zod: Form validation
- React Hook Form: Form management

## 🌐 Live Demo

[Live demo link coming soon]

## 📝 License

This project is licensed under the MIT License. 