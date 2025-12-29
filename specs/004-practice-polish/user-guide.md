# User Guide: Timed Practice & Data Management

**Feature**: Timed Practice & Polish  
**Version**: 1.1  
**Last Updated**: 29 December 2025

---

## Overview

The Timed Practice feature lets you simulate interview conditions by practicing algorithm problems under time pressure. The Export/Import feature enables you to back up your data and restore it on any device.

---

## Features

### Part 1: Timed Practice

### 1. Starting a Timed Practice Session

**Navigate to Timed Practice:**
- Click "Timed Practice" from the home page
- Or navigate directly to `/practice`

**Select a Problem:**
- **Random Unsolved Problem**: Click to get a random problem you haven't solved yet
- **Manual Selection**: Browse the problem list and click any problem to start

### 2. Timer Controls

**Timer Presets:**
- **25m**: Quick practice session (Pomodoro-style)
- **45m**: Standard practice session (recommended)
- **60m**: Extended session for harder problems

**Timer Actions:**
| Button | Action |
|--------|--------|
| ▶️ Play | Start or resume the timer |
| ⏸️ Pause | Pause the countdown |
| 🔄 Reset | Reset timer to preset duration |

**Timer States:**
- **Ready**: Timer is set but not started
- **Running**: Countdown active (MM:SS displayed)
- **Paused**: Timer stopped, can resume

### 3. During Practice

**Problem Information:**
- Problem title, topic, and difficulty are displayed
- Notes you've saved for the problem appear below
- "View Problem" link opens the original problem (e.g., LeetCode)

**Reveal Template:**
- Click "Reveal Template" to see the pattern template for this topic
- Shows common algorithm patterns with code examples
- Useful when you're stuck and need a hint

**Reveal Solution:**
- Click "Reveal Solution" to see your saved solutions
- Solutions are grouped by programming language
- Click on a language to expand and view the code

**Navigation:**
- **Next Problem**: Move to the next problem in your queue
- **Exit Practice**: End the session and return to problem selection

### 4. When Time Expires

When the timer reaches 0:00, you'll see a dialog:
- **Continue Practicing**: Keep working on the problem with no timer
- **End Session**: Finish and see your session summary

### 5. Session Summary

After ending a session, you'll see:
- Number of problems practiced
- Total time spent
- List of problems with time per problem
- Whether you viewed solutions or templates

---

## Tips for Effective Practice

### Interview Simulation
1. **Use the 45-minute preset** - matches typical interview timing
2. **Don't reveal solutions immediately** - try to solve first
3. **Use templates as hints** - not complete solutions

### Building Speed
1. **Start with 60 minutes** for unfamiliar patterns
2. **Reduce to 45 minutes** as you improve
3. **Challenge yourself with 25 minutes** for well-known patterns

### Using Templates Effectively
- Templates show the pattern structure, not the complete answer
- Study the template, then close it and implement yourself
- Templates are organized by topic (Arrays, Trees, Graphs, etc.)

---

## Keyboard Shortcuts (Coming Soon)

| Shortcut | Action |
|----------|--------|
| Space | Pause/Resume timer |
| ? | Show keyboard shortcuts help |

---

## Data Persistence

- **Time Tracking**: Time spent on each problem is automatically logged
- **Session Recovery**: If you accidentally close the tab or refresh during a session, a recovery banner will appear offering to resume your session
- **Problem Progress**: Your problem status (unsolved/attempted/solved) persists across sessions

### Session Recovery

If you refresh the page or close your browser during an active timed practice session, when you return to the Practice page you'll see a "Resume Previous Session?" banner. You can:

- **Resume**: Continue where you left off with the same problem
- **Discard**: Clear the saved session and start fresh

---

## Troubleshooting

### Timed Practice Issues

#### Timer Not Starting
- Make sure you've selected a problem first
- Check that JavaScript is enabled in your browser

#### Templates Not Showing
- Some topics may not have templates yet
- Ensure the problem has a topic assigned

#### Solutions Not Appearing
- You need to have saved solutions for the problem first
- Go to the problem page to add solutions

### Export/Import Issues

#### Export Not Downloading
- Check your browser's download settings
- Try a different browser
- Ensure pop-ups are not blocked

#### Import Failing
- Verify the file is a valid backup from this app
- Check the file wasn't corrupted during transfer
- Try re-exporting from the source

#### Data Not Appearing After Import
- Refresh the page (Ctrl/Cmd + R)
- Check browser console for errors
- Ensure import completed successfully

---

## Best Practices

### Timed Practice
1. **Practice Regularly**: Even 25 minutes daily builds strong problem-solving skills
2. **Review Templates First**: Before each session, review the pattern template for the topic
3. **Track Your Time**: Use the time logging to identify which topics take you longer
4. **Mix Difficulties**: Alternate between easy and medium problems to build confidence
5. **Reflect on Sessions**: After each session, note what patterns you struggled with

### Data Backup
6. **Back Up Weekly**: Export your data regularly to prevent data loss
7. **Multiple Copies**: Keep backups in cloud storage (Google Drive, Dropbox, etc.)
8. **Before Major Changes**: Export before clearing browser data
9. **Date Your Files**: Keep several backup versions by date

---

## Part 2: Export & Import Data

### Overview

Your data is stored locally in your browser using IndexedDB. The Export/Import feature allows you to:
- **Back up your progress** to a JSON file
- **Restore your data** on the same or different device
- **Transfer data** between browsers or computers

### Accessing Data Management

1. Click **Settings** from the home page (or navigate to `/settings`)
2. Find the **Data Management** section

### Exporting Your Data

1. Click the **Export** button
2. Review the export summary showing:
   - Number of problems
   - Number of solutions
   - Number of reviews
   - Review history count
   - Time logs count
   - Estimated file size
3. Click **Export** to download the backup file
4. The file will be saved as `algomastery-backup-YYYY-MM-DD.json`

**What's Included in Export:**
| Data | Description |
|------|-------------|
| Problems | All problems you've added with notes, links, and status |
| Solutions | Your saved code solutions for each problem |
| Reviews | Spaced repetition review scheduling data |
| Review History | Historical record of all reviews completed |
| Time Logs | Time spent practicing each problem |

**Export Features:**
- ✅ Checksum verification for data integrity
- ✅ Version metadata for compatibility
- ✅ Human-readable JSON format
- ✅ Includes all database tables

### Importing Your Data

⚠️ **Warning**: Importing will **replace all existing data** in your browser.

1. Click the **Import** button
2. Either:
   - **Drag and drop** your backup file into the drop zone
   - **Click** the drop zone to browse for your file
3. The file will be validated automatically:
   - ✅ Valid files show a green success message
   - ❌ Invalid files show an error with details
4. Click **Import** to restore your data
5. The page will refresh to load the imported data

**Validation Checks:**
| Check | Description |
|-------|-------------|
| File format | Must be valid JSON |
| Structure | Must have correct export format |
| Checksum | Data integrity verification |
| Version | Compatibility with current app version |

**Common Import Errors:**
| Error | Solution |
|-------|----------|
| "Invalid file format" | Ensure file is a valid JSON export |
| "Checksum mismatch" | File may be corrupted; try a fresh export |
| "Unsupported version" | Export from a newer app version |

### Data Privacy

- All data stays on your device - nothing is sent to any server
- Export files are stored locally where you choose
- You control all your data completely

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.1 | 2025-12-29 | Added Export/Import data feature |
| 1.0 | 2025-12-29 | Initial release with timer, presets, reveal template/solution |
