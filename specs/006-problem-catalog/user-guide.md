# User Guide: Problem Catalog

**Feature**: Problem Catalog
**Version**: 1.0
**Last Updated**: June 2025

---

## Overview

The Problem Catalog is a curated collection of 150 algorithm problems from three popular study lists:
- **Blind 75** - The famous 75 essential problems for coding interviews
- **NeetCode 150** - An expanded list covering more patterns and edge cases
- **Grind 75** - A flexible study plan organized by time investment

This feature helps you discover new problems to practice and add them to your personal problem list with pre-filled metadata, saving you time on manual data entry.

---

## Features

### Browse the Catalog

Access the catalog from the main navigation by clicking **Catalog** or navigating to `/catalog`.

The catalog displays all 150 problems in a responsive grid layout. Each problem card shows:
- **LeetCode Number** - The problem's official LeetCode ID
- **Problem Title** - Click the external link icon to open the problem on LeetCode
- **Difficulty** - Color-coded badge (Easy = green, Medium = yellow, Hard = red)
- **Topic** - The primary algorithm topic/pattern
- **Source** - Which curated list(s) include this problem

### Add Problems to Your List

1. Find a problem you want to practice
2. Click the **"Add to My Problems"** button on the problem card
3. The problem is instantly added to your personal list with:
   - Title and LeetCode URL pre-filled
   - Difficulty and topic automatically set
   - Source attribution preserved
4. A success toast notification confirms the addition
5. The button changes to **"Already Added"** (disabled)

### Filter Problems

Use the filter bar at the top of the catalog to narrow down problems:

#### Filter by Topic
Click the **Topic** dropdown to filter by algorithm category:
- Arrays & Hashing
- Two Pointers
- Sliding Window
- Stack
- Binary Search
- Linked List
- Trees
- Tries
- Backtracking
- Heap / Priority Queue
- Graphs
- Dynamic Programming
- Greedy
- Intervals
- Bit Manipulation

#### Filter by Difficulty
Click the **Difficulty** dropdown to filter by:
- Easy
- Medium
- Hard

#### Filter by Source
Click the **Source** dropdown to focus on a specific study list:
- Blind 75 (75 problems)
- NeetCode 150 (150 problems)
- Grind 75 (75 problems)
- Curated (custom additions)

#### Search by Name
Type in the search box to find problems by title. The search is case-insensitive and matches partial text.

#### Clear Filters
Click the **"Clear filters"** button to reset all filters and see the full catalog.

### Stats Bar

The stats bar below the filters shows:
- **Showing X of 150 problems** - How many problems match your current filters
- **Y already added** - How many filtered problems are already in your list

---

## Tips and Best Practices

### Recommended Study Approach

1. **Start with Blind 75** - Filter by "Blind 75" source and work through all 75 problems
2. **Progress by Difficulty** - Start with Easy, then Medium, then Hard
3. **Focus on Topics** - Use topic filters to practice pattern recognition
4. **Expand with NeetCode 150** - Once comfortable, add the remaining NeetCode problems

### Efficient Workflow

1. Filter to your current topic of study
2. Add problems that look interesting
3. Navigate to your Problem List to start practicing
4. Use the Solution Journal to track your approaches
5. Let Spaced Repetition remind you when to review

### Avoid Duplicates

The catalog automatically detects problems you've already added:
- Problems show "Already Added" with a disabled button
- This prevents duplicate entries in your problem list
- The stats bar shows how many problems you've already added

---

## Keyboard Shortcuts

Currently, the catalog uses mouse/touch interactions. Future updates may include:
- Arrow key navigation through problem cards
- Enter to add highlighted problem
- `/` to focus search box

---

## Data Storage

All catalog interactions are stored locally in IndexedDB:
- **No account required** - Your data never leaves your device
- **Instant sync** - Added problems appear immediately in your list
- **Persistent** - Data survives browser refreshes and sessions
- **Privacy-first** - You control your data completely

---

## Troubleshooting

### Problems Not Loading
- Refresh the page
- Check your browser console for errors
- Ensure JavaScript is enabled

### "Add to My Problems" Not Working
- Check if the problem is already added (button should show "Already Added")
- Ensure IndexedDB is not blocked by browser privacy settings
- Try clearing browser cache and reloading

### Filters Not Applying
- Click "Clear filters" to reset
- Ensure you're not combining filters that have no matching problems
- Check that the filter dropdown value is actually selected

---

## Version History

### v1.0 (June 2025)
- Initial release with 150 curated problems
- Browse, filter, and add functionality
- Topic, difficulty, and source filtering
- Search by problem name
- Duplicate detection with "Already Added" state
- Success toast notifications
