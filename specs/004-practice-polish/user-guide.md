# User Guide: Timed Practice & Polish Features

**Feature**: Timed Practice & Polish  
**Version**: 1.3  
**Last Updated**: 29 December 2025

---

## Overview

This guide covers the enhanced practice and productivity features in Algorithms Mastery Tracker:

- **Timed Practice**: Simulate interview conditions with countdown timer
- **Export/Import**: Back up and restore your data
- **Dark Mode**: Comfortable viewing in any lighting
- **Keyboard Shortcuts**: Navigate efficiently without the mouse
- **PWA Support**: Install the app and use it offline
- **Mobile Support**: Full functionality on any device

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

## Keyboard Shortcuts

Power users can navigate the app efficiently with keyboard shortcuts:

### Global Shortcuts (work on any page)

| Shortcut | Action |
|----------|--------|
| `?` | Show keyboard shortcuts help |
| `Esc` | Close dialog or cancel action |

### Problems List Page

| Shortcut | Action |
|----------|--------|
| `/` | Focus search input |
| `n` | Open new problem dialog |

### Review Session

| Shortcut | Action |
|----------|--------|
| `r` | Reveal solution |
| `1` | Rate "Again" (forgot) |
| `2` | Rate "Hard" |
| `3` | Rate "Good" |
| `4` | Rate "Easy" |

### Timed Practice

| Shortcut | Action |
|----------|--------|
| `Space` | Pause/resume timer |

### Viewing Shortcuts Help

Press `?` from any page to see the complete shortcuts reference dialog. The dialog shows shortcuts organized by context.

---

## Part 3: Dark Mode

### Theme Options

The app supports three theme settings:

| Theme | Description |
|-------|-------------|
| **Light** | Bright theme for daytime use |
| **Dark** | Dark theme for low-light environments |
| **System** | Follows your operating system preference |

### Changing the Theme

1. Look for the **sun/moon icon** button in the header (visible on all pages)
2. Click the theme toggle button
3. Select your preferred theme from the dropdown:
   - ☀️ Light
   - 🌙 Dark
   - 💻 System

### Theme Features

- **Instant Switching**: Theme changes immediately without page reload
- **Persistence**: Your preference is saved and restored on next visit
- **System Detection**: "System" mode automatically matches your OS setting
- **Smooth Transitions**: Theme changes with a smooth visual transition
- **Full Coverage**: All components including code editors respect the theme

### Code Editor Theme

The solution code editor (CodeMirror) automatically switches between:
- **Light mode**: GitHub Light theme
- **Dark mode**: GitHub Dark theme

---

## Data Persistence

- **Time Tracking**: Time spent on each problem is automatically logged
- **Session Recovery**: If you accidentally close the tab or refresh during a session, a recovery banner will appear offering to resume your session
- **Problem Progress**: Your problem status (unsolved/attempted/solved) persists across sessions
- **Theme Preference**: Your selected theme persists across sessions

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
| 1.3 | 2025-12-29 | Added PWA Support and Mobile Responsiveness sections |
| 1.2 | 2025-12-29 | Added Dark Mode and Keyboard Shortcuts |
| 1.1 | 2025-12-29 | Added Export/Import data feature |
| 1.0 | 2025-12-29 | Initial release with timer, presets, reveal template/solution |

---

## Part 4: PWA Support (Install & Offline)

### What is PWA?

PWA (Progressive Web App) allows you to install Algorithms Mastery Tracker on your device like a native app. Once installed, you can:

- Launch from your home screen or dock
- Use the app without an internet connection
- Get automatic updates when available

### Installing the App

**On Desktop (Chrome, Edge):**
1. Look for the **install icon** in the address bar (usually a ⊕ or 📥 symbol)
2. Click "Install" in the prompt
3. The app will open in its own window

**On Mobile (iOS Safari):**
1. Tap the **Share** button (box with arrow)
2. Scroll down and tap **"Add to Home Screen"**
3. Tap **"Add"** to confirm

**On Mobile (Android Chrome):**
1. Look for the install banner at the bottom of the screen
2. Tap **"Install"** or **"Add to Home Screen"**
3. Tap **"Add"** to confirm

**Via Install Banner:**
If you see a "Install App" banner at the bottom of the screen:
1. Click **"Install"** to add to your device
2. Or click **"Not now"** to dismiss

### Using Offline

The app works fully offline once installed:

- All your problems, solutions, and reviews are stored locally
- Timed practice works without internet
- Dark mode and all features function normally

**Note**: Some features that require external links (like "View Problem" links to LeetCode) won't work offline, but all local functionality remains available.

### Checking App Status

Visit the **Settings** page to see:
- **PWA Status**: "Installed" or "Not installed"
- **Network**: "Online" or "Offline"

### App Updates

When a new version is available:
1. You'll see an "Update Available" banner at the top
2. Click **"Reload"** to get the latest version
3. The app will refresh with new features

---

## Part 5: Mobile Support

### Designed for Mobile

The app is fully responsive and works great on phones and tablets:

- **Touch-friendly buttons**: All buttons are sized for easy tapping
- **Readable text**: Font sizes adjust for smaller screens
- **Optimized layouts**: Cards stack vertically on mobile

### Mobile-Specific Features

**Timer on Mobile:**
- Large, easy-to-read countdown display
- Preset buttons (25m, 45m, 60m) easy to tap
- Play/pause controls sized for touch

**Rating Buttons on Mobile:**
- Full-width buttons in a 2x2 grid
- Large tap targets for accurate selection
- Keyboard shortcut hints hidden (since you're using touch)

**Problem Cards on Mobile:**
- Vertical layout on narrow screens
- Action buttons (edit, delete) easy to tap
- Notes and badges wrap properly

### Recommended Usage

**On Phone (320-428px):**
- Use for quick reviews during commute
- Timer works great in portrait mode
- Rating buttons are easy to tap

**On Tablet (768px+):**
- Full desktop experience
- Side-by-side layouts where applicable
- Great for extended practice sessions

### Tips for Mobile Use

1. **Add to Home Screen**: Install as a PWA for the best experience
2. **Use Landscape for Code**: When viewing solutions, rotate to landscape for more code visibility
3. **Quick Reviews**: The review session is optimized for one-handed use
4. **Offline Practice**: Download the PWA to practice anywhere without internet
