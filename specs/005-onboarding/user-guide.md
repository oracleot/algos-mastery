# User Guide: App Onboarding Tour

**Feature**: App Onboarding  
**Version**: 1.0  
**Last Updated**: 2024-12-30

---

## Overview

The Algorithms Mastery Tracker includes an interactive onboarding tour that introduces new users to the app's key features. The tour uses visual spotlights and step-by-step tooltips to guide you through the main functionality.

---

## Features

### First-Time User Tour

When you first open the app, you'll see a guided tour with 6 steps:

1. **Welcome**: Introduction to the app and its purpose
2. **Add Problems**: Learn how to add algorithm problems from LeetCode, HackerRank, or any source
3. **Timed Practice**: Discover how to practice under interview-like conditions with timers
4. **Progress Ladder**: Understand the 15-topic learning path and unlock system
5. **Dashboard Stats**: View your streak, weekly stats, and daily averages
6. **Spaced Repetition**: Learn how the SM-2 algorithm schedules reviews for optimal retention

### Tour Navigation

During the tour, you can:

- **Next**: Advance to the next step
- **Previous**: Go back to the previous step
- **Skip Tour**: Exit the tour immediately (won't show again)
- **Finish**: Complete the tour on the final step

### Keyboard Shortcuts

The tour supports full keyboard navigation:

| Key | Action |
|-----|--------|
| Tab | Cycle through buttons (Close, Skip, Previous, Next) |
| Enter | Activate the focused button |
| Escape | Advance to next step |

### Restart Tour

If you want to see the tour again after completing it:

1. Click **Settings** from the home page
2. Find the **Onboarding** section
3. Click **Restart Tour**
4. You'll be redirected to the home page where the tour starts from Step 1

---

## Mobile Support

The onboarding tour is fully responsive:

- **Tooltips**: Automatically sized to fit smaller screens (max 90% viewport width)
- **Touch Targets**: All buttons are touch-friendly with 44px minimum height
- **Positioning**: Tooltips reposition to stay visible on all screen sizes

---

## How It Works

### Automatic Start
- The tour starts automatically for first-time users
- The app detects first-time users by checking if onboarding has been completed

### Completion State
- When you complete or skip the tour, the state is saved
- The tour won't appear again on subsequent visits
- You can restart it anytime from Settings

### Navigation During Tour
- If you navigate away from the home page during the tour, it closes gracefully
- When you return to the home page, the tour resumes from Step 1
- The tour is only marked complete when you click "Finish" or "Skip"

---

## Troubleshooting

### Tour doesn't appear
- Clear your browser's localStorage to reset the app
- Refresh the page
- The tour should appear for "first-time" users

### Tour covers important content
- Use the Skip Tour button to close immediately
- Or complete the tour by clicking Next through all steps

### Restart Tour button not working
- Make sure you're on the Settings page
- Click the "Restart Tour" button in the Onboarding section
- You should see a notification and be redirected to the home page

---

## Best Practices

1. **Complete the full tour** on first use to learn all features
2. **Use Restart Tour** if you forget how something works
3. **Try keyboard navigation** for faster tour completion
4. **On mobile**, use touch gestures naturally - all buttons work with tap

---

## Technical Details

- **Storage**: Tour completion state is stored in localStorage via user preferences
- **Library**: Built with react-joyride for spotlight and tooltip effects
- **Accessibility**: Supports keyboard navigation and focus management
- **Offline**: Works fully offline since it's client-side only

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2024-12-30 | Initial release with 6-step tour, mobile support, keyboard navigation |
