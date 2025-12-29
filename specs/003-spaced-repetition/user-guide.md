# User Guide: Spaced Repetition System

**Feature**: Spaced Repetition for Algorithm Practice  
**Version**: 1.2 (Phase 5 - Progress Dashboard)  
**Last Updated**: December 29, 2025

## Overview

The Spaced Repetition System helps you retain algorithm knowledge long-term by scheduling reviews at optimal intervals. Using the scientifically-proven SM-2 algorithm, problems you find easy are reviewed less frequently, while challenging ones are reviewed more often.

The Progress Dashboard gives you visibility into your learning journey with streak tracking, weekly statistics, smart problem suggestions, and topic unlock progress.

## Features

### Progress Dashboard

The home page features a comprehensive dashboard showing your learning progress:

#### Streak Counter
- **Flame Icon** displays your current streak (consecutive days with reviews)
- Active state (colored flame) indicates you've reviewed today
- Inactive state (gray flame) reminds you to review to maintain your streak
- Your longest streak is displayed when it exceeds your current streak

#### Weekly Statistics
- **This Week** - Total reviews completed in the last 7 days
- **Daily Avg** - Average reviews per day this week
- **Bar Chart** - Visual breakdown by day (Tue-Mon) with color-coded ratings:
  - Red: Again (struggled to recall)
  - Orange: Hard
  - Green: Good
  - Blue: Easy

#### Suggested Next Problem
- **Smart Recommendations** - Suggests problems from your weakest unlocked topic
- **Reason Displayed** - Shows why this problem was suggested (e.g., "Strengthen your stack skills")
- **Refresh Button** - Get a different suggestion if the current one doesn't fit
- Click the problem card to navigate directly to it

#### Next to Unlock
- **Progress Indicator** - Shows the next topic you'll unlock
- **Current Topic** - Displays which topic you're working on
- **Problems Needed** - How many more problems to solve to reach 70% mastery
- **Progress Bar** - Visual representation of progress toward unlocking

### Adding Problems to Review Queue

Once you've solved a problem, you can enroll it in the spaced repetition system:

1. **Navigate to a Solved Problem** - Go to any problem you've marked as "solved"
2. **Find the "Spaced Repetition" Section** - Located in the Problem Details area
3. **Click "Add to Review"** - Enrolls the problem with default SM-2 values
4. **See Next Review Date** - The scheduled review date is displayed immediately

**Note**: Only solved problems can be added to the review system. Complete a problem first!

### Adding to Today's Queue (Manual Override)

Want extra practice? You can add any enrolled problem to today's queue:

1. **View a Problem in Review** - Navigate to a problem already in the system
2. **Click "Add to Today"** - The problem is added to today's review queue
3. **Next Review Updates** - Shows "Due today" after adding

This is useful when:
- You want to practice a specific problem again
- You have extra study time
- You want to reinforce a challenging concept

### Due Today Queue

When you open the app, the home page displays problems scheduled for review today:

- **"Due for Review (N)"** - Shows the count of problems ready for review
- Each problem shows its title, topic, difficulty, and whether it's new or returning
- **"New"** badge indicates first-time reviews
- Click **"Start Review"** to begin a review session

### Review Session

The review session presents problems one at a time:

1. **See the Problem** - The problem title, topic, difficulty, and any notes are displayed
2. **Try to Recall** - Attempt to remember your solution before revealing
3. **Click "Show Solution"** - Reveals your saved solutions organized by programming language
4. **Rate Your Recall** - Choose how well you remembered:
   - **Again** - Couldn't recall (resets interval)
   - **Hard** - Struggled but eventually recalled
   - **Good** - Recalled with moderate effort
   - **Easy** - Recalled instantly

### Keyboard Shortcuts

During review (after revealing solutions):
- **1** - Rate as "Again"
- **2** - Rate as "Hard"
- **3** - Rate as "Good"
- **4** - Rate as "Easy"

### Session Progress

- Progress indicator shows "X / Y" (current/total)
- Visual dots track completed vs. remaining problems
- Exit button (X) allows ending session early with confirmation

### Empty State

When no problems are due:
- Shows "All caught up!" message
- Celebrates your progress staying on top of reviews

## How the SM-2 Algorithm Works

The SM-2 algorithm calculates when to next review each problem:

| Rating | Effect |
|--------|--------|
| Again | Resets to 1 day, resets repetition count |
| Hard | Short interval, slightly decreases ease |
| Good | Normal interval growth |
| Easy | Longer interval, increases ease |

**First Review**: All ratings result in a 1-day interval  
**Subsequent Reviews**: Intervals grow exponentially based on your ratings

## Data Storage

- All data is stored locally in your browser using IndexedDB
- No data leaves your device
- Review history is preserved for streak calculations (coming in Phase 5)
- Clearing browser data will erase all problems and review progress

## Troubleshooting

### Problems not showing in Due Today
- Check that problems have been added to the review system first
- Navigate to a solved problem and click "Add to Review"
- Verify the problem's next review date is today or earlier

### "Add to Review" button not visible
- Ensure the problem status is "solved"
- Unsolved or attempted problems cannot be added to review

### Review not recording
- Ensure you have a stable browser session
- Check browser console for any IndexedDB errors

### Keyboard shortcuts not working
- Make sure the solution is revealed first
- Ensure focus is on the review page (click anywhere on the page)

## Best Practices

1. **Review Daily** - Consistent daily reviews build stronger retention
2. **Be Honest** - Rate accurately for optimal scheduling
3. **Add Solutions First** - Problems with solutions provide better review context
4. **Start with Solved Problems** - Add problems you've already solved for best results

## Version History

### v1.2 (Phase 5) - December 2025
- **Progress Dashboard** on home page with all statistics
- **Streak Counter** with flame icon and active/inactive states
- **Weekly Stats Chart** using Recharts bar chart with rating breakdown
- **Suggested Next** with smart recommendations and refresh
- **Next to Unlock** showing topic progress and problems needed
- Dashboard data updates in real-time after reviews

### v1.1 (Phase 4) - December 2025
- Add problems to review queue from Problem page
- "Add to Review" button for solved problems
- Next review date display with calendar icon
- "Add to Today" manual queue override
- Toast notifications for queue actions

### v1.0 (Phase 3) - December 2025
- Initial release with core review flow
- Due Today queue on home page
- Review session with rating buttons
- SM-2 algorithm implementation
- Keyboard shortcuts for ratings
- Session exit confirmation

### Coming Soon
- **Phase 6**: Enhanced session flow with progress indicator and summary screen
