# Algorithms Mastery Tracker - Product Plan

A local-first React web app to help master LeetCode-style problems through structured topic progression, pre-populated pattern templates, spaced repetition reviews, and a multi-language solution journal.

---

## Vision

Build a personal tool that guides algorithmic learning through a structured path, reinforces understanding via spaced repetition, and provides a journal to track solutions and growth over time.

---

## Core Features

### 1. Structured Topic Progression
- **15 ordered topics** following a logical learning path
- **70% mastery threshold** required to unlock the next topic
- First topic (Arrays & Hashing) always unlocked
- Visual progression ladder showing locked/unlocked/mastery status

**Topic Order:**
1. Arrays & Hashing
2. Two Pointers
3. Sliding Window
4. Stack
5. Binary Search
6. Linked List
7. Trees
8. Tries
9. Backtracking
10. Heap / Priority Queue
11. Graphs
12. Dynamic Programming
13. Greedy
14. Intervals
15. Bit Manipulation

### 2. Problem Management
- Add/edit problems with: title, URL, topic, difficulty, status, notes
- Filter by topic, difficulty, status, locked/unlocked
- Quick actions: Mark Solved, Add to Today's Queue, Start Review
- Locked topics greyed out in selectors

### 3. Solution Journal
- **CodeMirror 6** editor with syntax highlighting
- Support for **any programming language**
- Multiple solutions per problem with timestamps
- **Insert Template** dropdown pre-fills topic's pattern
- Copy/edit/delete solution entries

### 4. Pattern Templates Library
Pre-populated code templates per topic with explanatory comments:

| Topic | Template |
|-------|----------|
| Sliding Window | `left/right` pointers, expand/shrink logic, result tracking |
| Binary Search | `low/high/mid`, condition check, boundary adjustment |
| BFS | Queue setup, visited set, level-order traversal |
| DFS / Backtracking | Recursive structure, base case, choose/explore/unchoose |
| DP (Memoization) | Cache setup, recursive with memo, base cases |
| DP (Tabulation) | Table initialization, iteration order, state transitions |
| Two Pointers | Sorted array setup, pointer movement conditions |
| Heap | Priority queue operations, top-k pattern |
| Graphs | Adjacency list, traversal, cycle detection |
| Greedy | Sort/prioritize, local optimal choice |

### 5. Spaced Repetition System (SRS)
- **SM-2 algorithm** calculates next review date
- Ease ratings: Again / Hard / Good / Easy
- Automatic "Due Today" queue on dashboard
- **Manual override**: Add any problem to today's queue
- Review session flow with solution reveal option

### 6. Progress Dashboard
- Topic progression ladder with mastery percentages
- "Next to Unlock" indicator with progress bar
- Current streak counter
- Weekly review stats chart
- Suggested next problem (based on weakest unlocked topic)
- Difficulty breakdown visualization

### 7. Timed Practice Mode
- Timer presets: 25 / 45 / 60 minutes (or custom)
- Pull from review queue or select by topic
- Countdown with pause/resume
- Auto-log time spent to problem
- "Reveal Template" and "Reveal Solution" buttons

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | React 18 + TypeScript |
| Build Tool | Vite |
| Styling | Tailwind CSS |
| Routing | React Router v6 |
| Code Editor | CodeMirror 6 |
| Local Storage | IndexedDB via Dexie.js |
| Charts | Recharts |
| Icons | Lucide React |

---

## Data Models

```typescript
interface Problem {
  id: string;
  title: string;
  url?: string;
  topic: Topic;
  difficulty: 'easy' | 'medium' | 'hard';
  status: 'unsolved' | 'attempted' | 'solved';
  notes: string;
  createdAt: Date;
}

interface Solution {
  id: string;
  problemId: string;
  code: string;
  language: string;
  createdAt: Date;
}

interface Review {
  problemId: string;
  ease: number;        // SM-2 ease factor (default 2.5)
  interval: number;    // days until next review
  nextReview: Date;
  reviewCount: number;
}

interface TopicProgress {
  topic: Topic;
  totalProblems: number;
  solvedProblems: number;
  masteryPercent: number;
  unlocked: boolean;
}
```

---

## Project Structure

```
src/
├── components/        # Reusable UI components
│   ├── ui/            # Base components (Button, Card, Modal)
│   ├── ProblemList.tsx
│   ├── ProblemForm.tsx
│   ├── SolutionEditor.tsx
│   ├── ReviewCard.tsx
│   ├── ProgressLadder.tsx
│   ├── Timer.tsx
│   └── Dashboard.tsx
├── hooks/             # Custom React hooks
│   ├── useDB.ts
│   ├── useProblems.ts
│   ├── useReviewQueue.ts
│   ├── useProgress.ts
│   └── useTimer.ts
├── lib/               # Utilities and algorithms
│   ├── db.ts          # Dexie database setup
│   ├── sm2.ts         # Spaced repetition algorithm
│   └── utils.ts
├── data/              # Static data
│   ├── topics.ts      # Topic taxonomy and order
│   └── templates.ts   # Code pattern templates
├── types/             # TypeScript interfaces
│   └── index.ts
├── pages/             # Route components
│   ├── Home.tsx
│   ├── Problems.tsx
│   ├── Review.tsx
│   ├── Practice.tsx
│   └── Progress.tsx
├── App.tsx
├── main.tsx
└── index.css
```

---

## Milestone Roadmap

### Phase 1: MVP (Weekend)
- [ ] Project setup (Vite + React + TS + Tailwind)
- [ ] IndexedDB schema with Dexie.js
- [ ] Topic taxonomy definition
- [ ] Problem CRUD (add, edit, delete, list)
- [ ] Basic status tracking (unsolved/attempted/solved)
- [ ] Simple topic filter

### Phase 2: V1 - Core Features (Week 1-2)
- [ ] Solution journal with CodeMirror
- [ ] Pattern templates library
- [ ] Template insertion in editor
- [ ] Topic mastery calculation
- [ ] Topic unlock system (70% threshold)
- [ ] Progress ladder visualization

### Phase 3: V2 - Review System (Week 3-4)
- [ ] SM-2 algorithm implementation
- [ ] Review scheduling
- [ ] "Due Today" queue
- [ ] Manual queue override
- [ ] Review session flow
- [ ] Dashboard with charts (Recharts)

### Phase 4: V3 - Practice & Polish (Week 5+)
- [ ] Timed practice mode
- [ ] Streak tracking
- [ ] JSON export/import
- [ ] Dark mode
- [ ] Keyboard shortcuts
- [ ] Mobile responsiveness
- [ ] PWA support (offline)

---

## Future Nice-to-Haves

- Cloud sync (optional account)
- LeetCode API integration for auto-import
- Problem difficulty rating based on solve time
- Shared template library
- Study group / accountability features
- AI-powered hint system

---

## Design Principles

1. **Local-first**: All data stored in browser; no account required
2. **Language-agnostic**: Practice in Python, JavaScript, Go, Rust, or any language
3. **Progressive**: Structured path prevents overwhelm; mastery gates progression
4. **Retention-focused**: SRS ensures long-term understanding, not just one-time solves
5. **Minimal friction**: Quick add, easy review, fast practice sessions

---

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

---

*Last updated: December 27, 2025*
