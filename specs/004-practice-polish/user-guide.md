# User Guide: Timed Practice

**Feature**: Timed Practice & Polish  
**Version**: 1.0  
**Last Updated**: 29 December 2025

---

## Overview

The Timed Practice feature lets you simulate interview conditions by practicing algorithm problems under time pressure. Set a timer, work through problems, and track your progress - all while having access to hints, templates, and your saved solutions.

---

## Features

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

### Timer Not Starting
- Make sure you've selected a problem first
- Check that JavaScript is enabled in your browser

### Templates Not Showing
- Some topics may not have templates yet
- Ensure the problem has a topic assigned

### Solutions Not Appearing
- You need to have saved solutions for the problem first
- Go to the problem page to add solutions

---

## Best Practices

1. **Practice Regularly**: Even 25 minutes daily builds strong problem-solving skills
2. **Review Templates First**: Before each session, review the pattern template for the topic
3. **Track Your Time**: Use the time logging to identify which topics take you longer
4. **Mix Difficulties**: Alternate between easy and medium problems to build confidence
5. **Reflect on Sessions**: After each session, note what patterns you struggled with

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2025-12-29 | Initial release with timer, presets, reveal template/solution |
