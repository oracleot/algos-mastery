# User Guide: Solution Journal & Pattern Templates

**Feature**: Solution Journal & Pattern Templates  
**Version**: 1.0  
**Last Updated**: 29 December 2025

## Overview

The Solution Journal feature allows you to save, organize, and manage your code solutions for algorithm problems. It includes a powerful code editor with syntax highlighting, pre-built algorithm pattern templates, and a visual progress tracking system.

---

## Features

### 1. Adding Solutions to Problems

Save your code solutions with syntax highlighting for any problem in your collection.

**How to Add a Solution:**

1. Navigate to the **Problems** page
2. Click on a problem's **View solutions** button (eye icon)
3. Click the **Add Solution** button in the header
4. Select your programming language from the dropdown
5. Write or paste your code in the editor
6. Click **Save Solution**

**Supported Languages:**
- Python
- JavaScript
- TypeScript
- Java
- C++
- Go
- Rust
- Plain Text

**Tips:**
- The editor provides line numbers and syntax highlighting
- Your solution is automatically timestamped
- Solutions are stored locally in your browser (IndexedDB)

---

### 2. Managing Your Solutions

View, edit, copy, and delete your saved solutions.

#### Viewing Solutions

Solutions are displayed in a collapsible list format:
- Click the **expand/collapse** button (chevron) to show/hide the code
- Solutions are sorted by date (newest first)
- Each solution shows its language and timestamp

#### Copying Code

1. Hover over a solution card
2. Click the **Copy** button (clipboard icon)
3. A toast notification confirms "Code copied to clipboard"

#### Editing Solutions

1. Click the **Edit** button (pencil icon) on a solution
2. The solution expands into an inline editor
3. Modify the code or change the language
4. Click **Save** to apply changes, or **Cancel** to discard

#### Deleting Solutions

1. Click the **Delete** button (trash icon)
2. A confirmation dialog appears: "Are you sure you want to delete this solution?"
3. Click **Delete** to confirm, or **Cancel** to keep the solution

---

### 3. Using Pattern Templates

Accelerate your coding with pre-built algorithm pattern templates.

**How to Insert a Template:**

1. Open the solution editor (Add Solution or Edit)
2. Click the **Insert Template** button
3. Browse templates organized by topic
4. Click on a template to insert it at your cursor position

**Available Templates:**

| Topic | Templates |
|-------|-----------|
| Arrays & Hashing | Hash Map Frequency Counter |
| Two Pointers | Two Pointers (Opposite Ends) |
| Sliding Window | Fixed Size Window, Variable Size Window |
| Stack | Monotonic Stack |
| Binary Search | Binary Search Template |
| Linked List | Fast & Slow Pointers |
| Trees | DFS Traversal, BFS Level Order |
| Backtracking | Backtracking Template |
| Heap / Priority Queue | Top K Elements |
| Graphs | Graph BFS, Graph DFS |
| Dynamic Programming | DP with Memoization, DP with Tabulation |
| Greedy | Greedy Interval Scheduling |
| Intervals | Merge Overlapping Intervals |
| Bit Manipulation | Bit Manipulation Basics |

**Template Features:**
- Includes explanatory comments
- Shows usage examples
- Matches your selected language (Python default)

---

### 4. Progress Ladder & Mastery Tracking

Track your learning journey across 15 algorithm topics.

**Accessing the Progress Ladder:**

1. Click **Progress** in the navigation header, or
2. Click **Progress Ladder** on the home page

**Understanding the Ladder:**

- **Overall Progress**: Shows percentage of topics mastered
- **Topic Cards**: Each topic displays its mastery status
- **Lock/Unlock System**: Topics unlock sequentially

**Mastery Calculation:**

- Mastery % = (Solved Problems / Total Problems) × 100
- Topics unlock when the previous topic reaches **70% mastery**
- First topic (Arrays & Hashing) is always unlocked

**Topic States:**

| State | Appearance | Meaning |
|-------|------------|---------|
| Unlocked + Mastered | Green checkmark | 70%+ problems solved |
| Unlocked + In Progress | Progress shown | Less than 70% solved |
| Unlocked + Empty | "No problems added" | Add problems to start |
| Locked | Lock icon, greyed out | Complete previous topic first |

**The 15 Topics (in order):**

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

---

## Keyboard Shortcuts

The code editor supports standard keyboard shortcuts:

| Shortcut | Action |
|----------|--------|
| `Ctrl/Cmd + A` | Select all code |
| `Ctrl/Cmd + C` | Copy selection |
| `Ctrl/Cmd + V` | Paste |
| `Ctrl/Cmd + Z` | Undo |
| `Ctrl/Cmd + Shift + Z` | Redo |
| `Tab` | Indent |
| `Shift + Tab` | Outdent |

---

## Data Storage

All your data is stored locally in your browser using IndexedDB:

- **Persistence**: Data survives browser restarts
- **Privacy**: Your solutions never leave your device
- **Limits**: Browser-dependent, typically several GB

**Caution:**
- Clearing browser data will delete your solutions
- Data is not synced across devices
- Consider exporting important solutions manually

---

## Troubleshooting

### Solutions not saving?
- Ensure you have sufficient browser storage
- Check for JavaScript errors in the console
- Try refreshing the page

### Editor not loading?
- The editor loads lazily for performance
- Wait a moment for CodeMirror to initialize
- Check your internet connection for initial load

### Topics not unlocking?
- Verify the previous topic has 70%+ mastery
- Mark problems as "Solved" status
- Refresh the page to update calculations

---

## Best Practices

1. **One solution per attempt**: Save each attempt separately to track your improvement
2. **Use templates as starting points**: Customize templates for your specific problem
3. **Add notes to problems**: Document your approach in the problem notes
4. **Follow the progression**: Topics are ordered by learning dependency
5. **Review past solutions**: Use the copy feature to reference previous work

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 29 Dec 2025 | Initial release with full Solution Journal functionality |
