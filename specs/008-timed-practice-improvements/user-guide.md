# User Guide: Timed Practice Improvements

**Feature**: Timed Practice Improvements  
**Version**: 2.0 (Phases 1-7 Complete)  
**Last Updated**: 2 January 2026

## Overview

The Timed Practice Improvements feature enhances your algorithm practice experience with four key capabilities:

1. **Timer-Enforced Coding Discipline**: The code editor is locked until you start the timer, ensuring you practice under realistic time pressure and accurately track your solving time.

2. **In-Editor JavaScript Code Validation**: Run JavaScript and TypeScript code directly in the editor to test your solutions without switching to external tools.

3. **Fullscreen Focus Mode**: Enter a distraction-free fullscreen overlay during timed practice to maximize concentration.

4. **Smart Navigation**: Navigation buttons intelligently show/hide based on available problems, preventing confusion from non-functional buttons.

## Features

### Timer-Enforced Coding Discipline

This feature ensures you develop the discipline of coding under time pressure by only allowing code input when the timer is actively running.

#### How It Works

1. **Before Starting Timer**
   - When you enter a practice session, the code editor displays a semi-transparent overlay
   - You'll see the message: **"Start timer to begin coding"**
   - The editor is read-only - you cannot type or modify code

2. **Timer Running**
   - Click the play button to start the timer
   - The overlay disappears immediately
   - You can now type freely in the editor
   - Your code is auto-saved as you type

3. **Timer Paused**
   - If you pause the timer, the overlay reappears
   - You'll see the message: **"Resume timer to continue"**
   - Click the play button again to continue coding

4. **Timer Completed**
   - Once you mark a session complete or time runs out
   - The editor remains editable for final adjustments
   - You can add notes and polish your solution

#### Why This Matters

- **Accurate Time Tracking**: Your practice time reflects actual coding time, not thinking time
- **Interview Simulation**: Real interviews don't allow unlimited pauses
- **Focus Building**: Creates intentional practice habits

### In-Editor JavaScript Code Validation

Run and test your JavaScript/TypeScript solutions directly in the practice editor without switching to an external IDE.

#### How It Works

1. **Select JavaScript or TypeScript**
   - Use the language dropdown to select JavaScript or TypeScript
   - The **Run** button becomes enabled

2. **Write Your Code**
   - Write your solution with `console.log()` statements to verify output
   - Example:
   ```javascript
   function twoSum(nums, target) {
       const hashmap = {};
       for (let i = 0; i < nums.length; i++) {
           const complement = target - nums[i];
           if (complement in hashmap) {
               return [hashmap[complement], i];
           }
           hashmap[nums[i]] = i;
       }
   }
   
   // Test your solution
   console.log(twoSum([2, 7, 11, 15], 9)); // [0, 1]
   console.log(twoSum([3, 2, 4], 6));      // [1, 2]
   ```

3. **Click Run**
   - The output panel appears below the editor
   - Console output displays with type indicators: `[log]`, `[warn]`, `[error]`, `[info]`
   - Errors are highlighted in red for easy identification

4. **View Results**
   - Successful output shows your `console.log` values
   - Syntax errors show clear error messages
   - Runtime errors display the error message

5. **Clear Output**
   - Click the **Clear** button to reset the output panel
   - Running again automatically clears previous output

#### Supported Languages

| Language | Run Button |
|----------|------------|
| JavaScript | ✅ Enabled |
| TypeScript | ✅ Enabled |
| Python | ❌ Disabled (tooltip explains why) |
| Java | ❌ Disabled |
| C++ | ❌ Disabled |
| Rust | ❌ Disabled |
| Go | ❌ Disabled |

**Why only JavaScript/TypeScript?** These languages can run directly in the browser without additional setup. Other languages would require server-side execution or large WebAssembly runtimes.

#### Code Execution Limits

To protect your browser from infinite loops and excessive output:

- **Timeout**: Code that takes longer than 5 seconds is automatically stopped
- **Output Lines**: Maximum 1,000 lines of output
- **Output Size**: Maximum 100KB of output text

If limits are exceeded, you'll see a warning message explaining the truncation.

#### Where Code Validation Works

The Run button is available in:
- ✅ Timed Practice sessions
- ✅ Problem Detail page (when adding/editing solutions)
- ✅ Fullscreen Focus Mode

### Fullscreen Focus Mode

Enter a distraction-free fullscreen environment during timed practice to maximize your concentration.

#### How to Use

1. **Enter Fullscreen**
   - Click the **Focus Mode** button in your practice session (appears when editor is visible)
   - The entire screen becomes a minimal, focused practice environment

2. **What You See in Fullscreen**
   - Timer display with pause button
   - Problem title in the header
   - Collapsible problem details (topic, difficulty)
   - Full-size code editor
   - Run button and output panel (for JS/TS)
   - Exit button

3. **Problem Details**
   - Click the "Problem Details" bar to expand/collapse
   - Shows topic badge and difficulty
   - Collapsed by default to minimize distractions

4. **Exit Fullscreen**
   - Press **Escape** key, or
   - Click the **Exit** button in the top-right corner

#### Features Available in Fullscreen
- ✅ Timer display and pause control
- ✅ Code editing (when timer is running)
- ✅ Code execution for JavaScript/TypeScript
- ✅ Problem details toggle
- ✅ Keyboard shortcut to exit (Escape)

#### Automatic Exit
- Fullscreen mode automatically exits when you:
  - Navigate away from the practice session
  - Complete the session
  - Press the back button

### Smart Navigation

Navigation buttons intelligently appear and disappear based on what's actually available.

#### Random Unsolved Problem Button

- **Shown**: When you have unsolved (attempted) problems to practice
- **Hidden**: When no unsolved problems exist
- **Message**: "No unsolved problems available for practice" appears instead

#### Next Problem Button

- **Shown**: When there are more problems available in the practice queue or pool
- **Hidden**: When you've exhausted all available problems
- **Behavior**: Automatically adds random unsolved problems to your queue when clicked

#### What Counts as "Available for Practice"?

Only problems with these statuses appear in timed practice:
- ✅ **Attempted**: Problems you've started but not fully solved
- ✅ **Solved**: Problems you've completed (for review practice)
- ❌ **Unsolved**: Not available for timed practice (use regular problem view first)

## Tips and Best Practices

### For Timer-Enforced Practice

1. **Read the problem first** - Before starting the timer, read and understand the problem statement
2. **Plan your approach** - Think through your solution strategy before the timer starts
3. **Start when ready** - Only click start when you're ready to code
4. **Minimize pauses** - Try to avoid pausing mid-session to simulate real conditions

### For Code Validation

1. **Test incrementally** - Add `console.log` statements to verify each step of your algorithm
2. **Test edge cases** - Run your solution with empty arrays, single elements, and boundary values
3. **Check return values** - Log your function's return value to verify correctness
4. **Use descriptive logs** - Add labels to your output: `console.log("Result:", result)`

### For Fullscreen Focus Mode

1. **Use for deep work** - Enter fullscreen when you need maximum concentration
2. **Minimize distractions** - Close other browser tabs before entering
3. **Learn the shortcut** - Escape key is the fastest way to exit
4. **Keep problem visible** - Expand problem details if you need to reference it

### For Navigation

1. **Start with attempted problems** - Mark problems as "Attempted" to add them to practice pool
2. **Review solved problems** - Use timed practice to review solutions you've already written
3. **Let the app guide you** - Trust the button visibility to know what's available

## Data Storage

- All features work offline - no internet required
- Code is stored locally in your browser using IndexedDB
- Your data never leaves your device
- Practice session times are tracked locally

## Troubleshooting

### "Start timer to begin coding" won't disappear
- Click the play button (▶) in the timer area
- Ensure the timer shows a running state

### Run button is disabled
- Check that JavaScript or TypeScript is selected
- Ensure the timer is running (Run is disabled when paused)
- Look at the tooltip for an explanation

### Code execution times out
- Check for infinite loops (while loops without exit conditions)
- Very large data structures can cause slowdowns
- Recursive functions need proper base cases

### Output appears truncated
- Your code produced more than 1,000 lines of output
- Or more than 100KB of text
- Reduce logging in loops

### Fullscreen mode won't open
- Ensure the editor is visible (not hidden)
- The Focus Mode button only appears when the editor is shown

### No problems available for practice
- Mark at least one problem as "Attempted" or "Solved"
- Unsolved problems aren't available for timed practice

### Next Problem button missing
- All available problems have been added to your queue
- No more attempted/solved problems to add

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 2.0 | 2 Jan 2026 | Added fullscreen focus mode and smart navigation |
| 1.0 | 2 Jan 2026 | Initial release with timer-enforced editing and code validation |
