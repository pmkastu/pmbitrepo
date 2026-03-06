# 🚀 BiteMaster Random Bit Generator

Welcome to **BiteMaster Random Bit Generator** — a modern, interactive learning platform designed to make knowledge acquisition fun, engaging, and rewarding! 

Think of it as your personal learning companion that delivers bite-sized knowledge nuggets, tracks your progress, challenges your peers, and celebrates your achievements with gamified learning mechanics. 🎮✨

---

## 🎯 What is BiteMaster?

BiteMaster is a gamified learning platform that helps you master knowledge through:

- 📚 **Knowledge Bites** — Short, focused learning content delivered as quizzes, facts, and challenges
- 🔥 **Streaks & Rewards** — Build daily learning streaks and earn certificates for achievements
- 📊 **Progress Tracking** — Visualize your learning journey with detailed analytics and heatmaps
- 🏆 **Leaderboards & Peer Challenges** — Compete with friends and collaborate with peers
- 💎 **Subscription Tiers** — Unlock premium features and exclusive content
- 🎤 **Text-to-Speech** — Listen to content instead of reading (perfect for multitasking!)
- 📱 **Responsive Design** — Learn on desktop, tablet, or mobile

---

## ⚡ Quick Start

### Prerequisites

- **Node.js** (v16 or higher)
- **Bun** (package manager) - [Install here](https://bun.sh)
- **Git** (for cloning the repository)

### Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone <YOUR_GIT_URL>
   cd bitemaster-random-bit-generator
   ```

2. **Install dependencies:**
   ```bash
   bun install
   ```

3. **Start the development server:**
   ```bash
   bun run dev
   ```

4. **Open in your browser:**
   Navigate to `http://localhost:8080` and start exploring!

---

## 📦 Project Structure

```
bitemaster-random-bit-generator/
├── src/
│   ├── components/          # Reusable React components
│   │   ├── ui/              # Shadcn UI components library
│   │   ├── BiteCard.tsx      # Knowledge bite display
│   │   ├── QuizCard.tsx      # Interactive quiz component
│   │   ├── Leaderboard.tsx   # User rankings
│   │   ├── MemoryHeatmap.tsx # Learning activity visualization
│   │   └── ...
│   ├── pages/               # Page components (Dashboard, Library, etc.)
│   ├── contexts/            # React Context (Authentication, etc.)
│   ├── hooks/               # Custom hooks (useTheme, useLearningStore, etc.)
│   ├── lib/                 # Utilities and helpers
│   ├── data/                # Data loaders and stores
│   ├── integrations/        # External service integrations (Supabase, Grok AI)
│   └── main.tsx             # App entry point
├── public/
│   └── data/
│       ├── knowledge_bites.json    # Quiz and fact database
│       └── users_1500.json         # Sample user data
├── supabase/                # Supabase configuration & migrations
├── vite.config.ts           # Vite build configuration
├── tailwind.config.ts       # Tailwind CSS configuration
└── package.json             # Dependencies & scripts
```

---

## 🛠 Available Commands

| Command | Description |
|---------|-------------|
| `bun run dev` | Start development server with hot reload |
| `bun run build` | Build for production |
| `bun run build:dev` | Build in development mode (with debugging) |
| `bun run lint` | Run ESLint to check code quality |
| `bun run preview` | Preview the production build locally |
| `bun run test` | Run tests once |
| `bun run test:watch` | Run tests in watch mode (auto-rerun on changes) |

---

## 🎨 Tech Stack

- **Frontend Framework:** React 18+ with TypeScript
- **Build Tool:** Vite (lightning-fast bundler)
- **Styling:** Tailwind CSS + custom components
- **UI Components:** Shadcn UI (built on Radix UI)
- **State Management:** Zustand (learning store), React Query
- **Routing:** React Router v6
- **Backend/Database:** Supabase (PostgreSQL + Auth)
- **AI Integration:** Grok AI client
- **Testing:** Vitest
- **Code Quality:** ESLint
- **Package Manager:** Bun

---

## 🔐 Authentication

BiteMaster uses **Supabase Authentication** for secure user management. You can:

- Sign up with email/password
- Reset forgotten passwords
- Manage user profiles and preferences
- Track user progress across sessions

---

## 📊 Core Features

### 1. Dashboard 📈
Your personal learning hub showing:
- Daily streaks and goals
- Recent bites completed
- Upcoming challenges
- Weekly progress chart

### 2. Knowledge Library 📚
Browse and search through thousands of knowledge bites organized by:
- Category (Technical, General Knowledge, etc.)
- Type (Quiz, Fact)
- Difficulty level
- Tags

### 3. Interactive Quizzes 🧠
- Multiple-choice questions with explanations
- Timed challenges for competitive learning
- Instant feedback and score tracking
- Difficulty progression

### 4. Peer Challenges 🤝
- Challenge friends to knowledge duels
- Leaderboards to track top learners
- Collaborative learning communities

### 5. Certificates 🎓
Earn and download certificates for:
- Completing learning milestones
- Achieving streak goals
- Mastering specific topics

### 6. Preferences & Customization ⚙️
- Dark/Light theme toggle
- Text-to-speech settings
- Learning goals customization
- Content preferences

---

## 🚀 Development Workflow

### Working Locally

```bash
# 1. Start dev server
bun run dev

# 2. Make changes to files in src/
# (Auto-reload will kick in)

# 3. Check for linting issues
bun run lint

# 4. Run tests
bun run test:watch

# 5. Build for production when ready
bun run build
```

### Component Structure

All components follow React best practices:
- Functional components with hooks
- TypeScript for type safety
- Shadcn UI components for consistency
- Responsive design with Tailwind CSS

Example:
```tsx
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function MyComponent() {
  return (
    <Card>
      <Button onClick={() => console.log("Clicked!")}>
        Click me!
      </Button>
    </Card>
  );
}
```

---

## 🌐 Integrations

### Supabase
Database and authentication service. Configuration in `supabase/config.toml`

### Grok AI
AI-powered insights and recommendations. Client in `src/integrations/grok/`

---

## 📝 Testing

Run the test suite:
```bash
# Run once
bun run test

# Run in watch mode (great for TDD)
bun run test:watch
```

Tests are located in `src/test/` directory.

---

## 🎯 Performance Tips

- **Code Splitting:** Pages are lazily loaded for faster initial load
- **Vite:** Lightning-fast HMR (Hot Module Replacement) during development
- **Tailwind CSS:** Optimized CSS with tree-shaking in production
- **React Query:** Efficient data fetching and caching

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| Port 8080 already in use | Kill the process or change port in `vite.config.ts` |
| Dependencies not installing | Delete `node_modules` and `bun.lockb`, then run `bun install` |
| Hot reload not working | Restart the dev server |
| TypeScript errors | Run `bun install` to ensure all types are installed |

---

## 📚 Learn More

- [React Docs](https://react.dev)
- [Vite Docs](https://vitejs.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Shadcn UI](https://ui.shadcn.com)
- [Supabase Docs](https://supabase.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

## 📄 License

This project is licensed under the MIT License — feel free to use it for your own projects!

---

## 💬 Support & Feedback

Have questions or feedback? We'd love to hear from you! 

- 🐛 Report bugs on GitHub Issues
- 💡 Suggest features and improvements
- 📧 Reach out for collaboration opportunities

---

**Happy Learning! 🎉**

*Built with ❤️ to make learning spark and shine.*
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## Features added by the Bitsize Master application

- User can select topic preferences during signup and adjust them later in the dashboard.
- Daily bite selection respects user preferences when available.
