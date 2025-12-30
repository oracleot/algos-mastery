# User Guide: Learning Resources

**Feature**: Learning Resources  
**Version**: 1.0  
**Last Updated**: 30 December 2025

---

## Overview

Learning Resources allows you to attach helpful study materials—video tutorials, articles, documentation, and course content—directly to your algorithm problems. This creates a personalized reference library that helps you understand the concepts behind each problem.

**Key Benefits:**
- 🎯 Keep relevant tutorials linked to specific problems
- 🔍 Auto-detect source platforms (YouTube, LeetCode, NeetCode, etc.)
- 📚 Build a curated learning path for each topic
- 🏷️ Organize resources by type (video, article, documentation, course)

---

## Features

### 1. Adding Learning Resources

You can add learning resources when creating a new problem or editing an existing one.

**Steps to Add a Resource:**

1. **Open the Problem Form**
   - Click **"Add Problem"** to create a new problem, OR
   - Click the **pencil icon** on an existing problem to edit it

2. **Expand the Resources Section**
   - Scroll to "Learning Resources (optional)"
   - Click the **"Add Resource"** button to show the form

3. **Fill in Resource Details**
   - **Title** (required): A descriptive name like "NeetCode Two Sum Explanation"
   - **URL** (required): The full URL to the resource

4. **Select Resource Type**
   - **Video** 🎬: YouTube tutorials, course videos
   - **Article** 📄: Blog posts, medium articles, written explanations
   - **Documentation** 📖: Official docs, API references
   - **Course** 🎓: Full courses from platforms like Coursera, Udemy

5. **Source Auto-Detection**
   When you enter a URL and move to the next field, the app automatically detects the source platform:
   
   | URL Pattern | Detected Source |
   |-------------|-----------------|
   | youtube.com, youtu.be | YouTube |
   | leetcode.com | LeetCode |
   | neetcode.io | NeetCode |
   | geeksforgeeks.org | GeeksforGeeks |
   | github.com | GitHub |
   | medium.com | Medium |
   | stackoverflow.com | Stack Overflow |
   | w3schools.com | W3Schools |
   | freecodecamp.org | freeCodeCamp |
   | khanacademy.org | Khan Academy |
   | coursera.org | Coursera |
   | udemy.com | Udemy |
   | hackerrank.com | HackerRank |
   | codewars.com | Codewars |
   | algoexpert.io | AlgoExpert |

   You can also manually select a source if auto-detection doesn't match.

6. **Add Multiple Resources**
   - Click **"Add Resource"** button to add the resource to the list
   - Repeat to add more resources
   - Resources appear in a list above the form

7. **Save the Problem**
   - Click **"Add Problem"** or **"Save Changes"** to save everything

---

### 2. Viewing Learning Resources

Resources are visible in multiple places:

#### On Problem Cards
- Problems with resources show a **book icon with a count badge** (e.g., "📚 2")
- This gives you a quick visual indicator of available study materials

#### On Problem Detail Page
- Navigate to a problem by clicking **"View solutions"**
- Scroll to the **"Learning Resources"** section below solutions
- Each resource shows:
  - **Icon** indicating type (🎬 video, 📄 article, 📖 documentation, 🎓 course)
  - **Title** as a clickable link
  - **Source** platform name
  - **External link icon** indicating it opens in a new tab

#### Empty State
If a problem has no resources, you'll see:
> "No learning resources yet. Add resources when editing this problem."

With a link to quickly navigate to the edit form.

---

### 3. Removing Learning Resources

You can remove resources when editing a problem:

1. Click the **pencil icon** to edit the problem
2. In the "Learning Resources" section, find the resource to remove
3. Click the **trash icon** (🗑️) next to the resource
4. The resource is immediately removed from the list
5. Click **"Save Changes"** to persist the removal

**Note:** Removal is immediate in the form, but only saved when you click "Save Changes". Canceling will restore removed resources.

---

## Tips & Best Practices

### Curating Your Resource Library

1. **Add resources as you learn**
   - Found a helpful video? Add it immediately so you can find it later
   - Include the specific timestamp if the video is long

2. **Use descriptive titles**
   - ❌ "Video 1"
   - ✅ "NeetCode - Two Sum Optimal O(n) Solution"

3. **Mix resource types**
   - Video for visual explanation
   - Article for detailed written walkthrough
   - Documentation for language-specific syntax

4. **Quality over quantity**
   - 2-3 excellent resources are better than 10 mediocre ones
   - Focus on resources that explain the core concept

### Organizing by Topic

When working through a topic (e.g., "Arrays & Hashing"):
1. Start with a general topic overview video
2. Add problem-specific resources as you encounter them
3. Include documentation for relevant data structures (e.g., Python dict, JavaScript Map)

---

## Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| Focus search | `/` |
| Close dialog | `Escape` |

---

## Data Storage

- All resources are stored **locally in your browser** using IndexedDB
- Resources are part of the problem data—they persist across sessions
- Use **Export/Import** to backup your data including all resources
- Resources are included in exported JSON files

---

## Troubleshooting

### Resource not saving?
- Ensure both **Title** and **URL** fields are filled
- The URL must be a valid web address starting with http:// or https://
- Click the **"Add Resource"** button before saving the problem

### Source not detected correctly?
- Auto-detection works on common platforms
- You can manually select any source from the dropdown
- If the URL is non-standard, choose "Other" or the closest match

### Resources not showing on problem card?
- The badge only appears when there's at least 1 resource
- Make sure you saved the problem after adding resources
- Try refreshing the page

### Lost your resources?
- Check if you're on the same browser/device where you added them
- Data is stored locally—it doesn't sync across devices
- Use Export to create backups you can Import elsewhere

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | Dec 2025 | Initial release with add/view/remove functionality |

---

## Related Features

- **Problem Catalog** - Browse curated problems with pre-attached resources
- **Solutions Journal** - Track your solution attempts for each problem
- **Spaced Repetition** - Schedule reviews based on your mastery level
