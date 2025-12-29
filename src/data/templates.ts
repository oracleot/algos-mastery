// data/templates.ts - Pre-built algorithm pattern templates (multi-language)

import type { Template, TopicSlug } from '../types';

/**
 * Pattern templates organized by topic
 * Each template provides code snippets in multiple languages
 */
export const TEMPLATES: readonly Template[] = [
  // Arrays & Hashing
  {
    id: 'hash-map-frequency',
    topic: 'arrays-hashing',
    name: 'Hash Map Frequency Counter',
    description: 'Count occurrences of elements using a hash map',
    defaultLanguage: 'python',
    codeByLanguage: {
      python: `def frequency_counter(arr):
    """Count occurrences of each element in array."""
    freq = {}
    for item in arr:
        freq[item] = freq.get(item, 0) + 1
    return freq

# Usage:
# counts = frequency_counter([1, 2, 2, 3, 3, 3])
# counts = {1: 1, 2: 2, 3: 3}`,
      javascript: `function frequencyCounter(arr) {
  // Count occurrences of each element in array
  const freq = {};
  for (const item of arr) {
    freq[item] = (freq[item] || 0) + 1;
  }
  return freq;
}

// Usage:
// const counts = frequencyCounter([1, 2, 2, 3, 3, 3]);
// counts = {1: 1, 2: 2, 3: 3}`,
      typescript: `function frequencyCounter<T extends string | number>(arr: T[]): Record<T, number> {
  // Count occurrences of each element in array
  const freq = {} as Record<T, number>;
  for (const item of arr) {
    freq[item] = (freq[item] || 0) + 1;
  }
  return freq;
}

// Usage:
// const counts = frequencyCounter([1, 2, 2, 3, 3, 3]);
// counts = { 1: 1, 2: 2, 3: 3 }`,
      java: `import java.util.*;

public class FrequencyCounter {
    public static Map<Integer, Integer> frequencyCounter(int[] arr) {
        // Count occurrences of each element in array
        Map<Integer, Integer> freq = new HashMap<>();
        for (int item : arr) {
            freq.put(item, freq.getOrDefault(item, 0) + 1);
        }
        return freq;
    }

    // Usage:
    // Map<Integer, Integer> counts = frequencyCounter(new int[]{1, 2, 2, 3, 3, 3});
    // counts = {1=1, 2=2, 3=3}
}`,
      cpp: `#include <unordered_map>
#include <vector>
using namespace std;

unordered_map<int, int> frequencyCounter(vector<int>& arr) {
    // Count occurrences of each element in array
    unordered_map<int, int> freq;
    for (int item : arr) {
        freq[item]++;
    }
    return freq;
}

// Usage:
// vector<int> arr = {1, 2, 2, 3, 3, 3};
// auto counts = frequencyCounter(arr);
// counts = {{1, 1}, {2, 2}, {3, 3}}`,
      go: `package main

func frequencyCounter(arr []int) map[int]int {
    // Count occurrences of each element in array
    freq := make(map[int]int)
    for _, item := range arr {
        freq[item]++
    }
    return freq
}

// Usage:
// counts := frequencyCounter([]int{1, 2, 2, 3, 3, 3})
// counts = map[1:1 2:2 3:3]`,
      rust: `use std::collections::HashMap;

fn frequency_counter(arr: &[i32]) -> HashMap<i32, i32> {
    // Count occurrences of each element in array
    let mut freq = HashMap::new();
    for &item in arr {
        *freq.entry(item).or_insert(0) += 1;
    }
    freq
}

// Usage:
// let counts = frequency_counter(&[1, 2, 2, 3, 3, 3]);
// counts = {1: 1, 2: 2, 3: 3}`,
    },
  },

  // Two Pointers
  {
    id: 'two-pointers-opposite',
    topic: 'two-pointers',
    name: 'Two Pointers (Opposite Ends)',
    description: 'Pointers starting at both ends, moving towards center',
    defaultLanguage: 'python',
    codeByLanguage: {
      python: `def two_pointers_opposite(arr, target):
    """Find pair that sums to target using two pointers."""
    left, right = 0, len(arr) - 1
    
    while left < right:
        current_sum = arr[left] + arr[right]
        
        if current_sum == target:
            return [left, right]
        elif current_sum < target:
            left += 1
        else:
            right -= 1
    
    return []  # No pair found

# Usage (array must be sorted):
# result = two_pointers_opposite([1, 2, 3, 4, 5], 7)
# result = [1, 4]  (indices of 2 and 5)`,
      javascript: `function twoPointersOpposite(arr, target) {
  // Find pair that sums to target using two pointers
  let left = 0;
  let right = arr.length - 1;

  while (left < right) {
    const currentSum = arr[left] + arr[right];

    if (currentSum === target) {
      return [left, right];
    } else if (currentSum < target) {
      left++;
    } else {
      right--;
    }
  }

  return []; // No pair found
}

// Usage (array must be sorted):
// const result = twoPointersOpposite([1, 2, 3, 4, 5], 7);
// result = [1, 4] (indices of 2 and 5)`,
      typescript: `function twoPointersOpposite(arr: number[], target: number): [number, number] | [] {
  // Find pair that sums to target using two pointers
  let left = 0;
  let right = arr.length - 1;

  while (left < right) {
    const currentSum = arr[left] + arr[right];

    if (currentSum === target) {
      return [left, right];
    } else if (currentSum < target) {
      left++;
    } else {
      right--;
    }
  }

  return []; // No pair found
}

// Usage (array must be sorted):
// const result = twoPointersOpposite([1, 2, 3, 4, 5], 7);
// result = [1, 4] (indices of 2 and 5)`,
      java: `public class TwoPointers {
    public static int[] twoPointersOpposite(int[] arr, int target) {
        // Find pair that sums to target using two pointers
        int left = 0;
        int right = arr.length - 1;

        while (left < right) {
            int currentSum = arr[left] + arr[right];

            if (currentSum == target) {
                return new int[]{left, right};
            } else if (currentSum < target) {
                left++;
            } else {
                right--;
            }
        }

        return new int[]{}; // No pair found
    }

    // Usage (array must be sorted):
    // int[] result = twoPointersOpposite(new int[]{1, 2, 3, 4, 5}, 7);
    // result = [1, 4] (indices of 2 and 5)
}`,
      cpp: `#include <vector>
using namespace std;

pair<int, int> twoPointersOpposite(vector<int>& arr, int target) {
    // Find pair that sums to target using two pointers
    int left = 0;
    int right = arr.size() - 1;

    while (left < right) {
        int currentSum = arr[left] + arr[right];

        if (currentSum == target) {
            return {left, right};
        } else if (currentSum < target) {
            left++;
        } else {
            right--;
        }
    }

    return {-1, -1}; // No pair found
}

// Usage (array must be sorted):
// vector<int> arr = {1, 2, 3, 4, 5};
// auto result = twoPointersOpposite(arr, 7); // {1, 4}`,
      go: `package main

func twoPointersOpposite(arr []int, target int) []int {
    // Find pair that sums to target using two pointers
    left, right := 0, len(arr)-1

    for left < right {
        currentSum := arr[left] + arr[right]

        if currentSum == target {
            return []int{left, right}
        } else if currentSum < target {
            left++
        } else {
            right--
        }
    }

    return []int{} // No pair found
}

// Usage (array must be sorted):
// result := twoPointersOpposite([]int{1, 2, 3, 4, 5}, 7)
// result = [1, 4] (indices of 2 and 5)`,
      rust: `fn two_pointers_opposite(arr: &[i32], target: i32) -> Option<(usize, usize)> {
    // Find pair that sums to target using two pointers
    if arr.is_empty() {
        return None;
    }
    
    let mut left = 0;
    let mut right = arr.len() - 1;

    while left < right {
        let current_sum = arr[left] + arr[right];

        if current_sum == target {
            return Some((left, right));
        } else if current_sum < target {
            left += 1;
        } else {
            right -= 1;
        }
    }

    None // No pair found
}

// Usage (array must be sorted):
// let result = two_pointers_opposite(&[1, 2, 3, 4, 5], 7);
// result = Some((1, 4)) (indices of 2 and 5)`,
    },
  },

  // Sliding Window
  {
    id: 'sliding-window-fixed',
    topic: 'sliding-window',
    name: 'Fixed Size Sliding Window',
    description: 'Window of fixed size k sliding through array',
    defaultLanguage: 'python',
    codeByLanguage: {
      python: `def max_sum_subarray(arr, k):
    """Find maximum sum of any subarray of size k."""
    if len(arr) < k:
        return 0
    
    # Calculate sum of first window
    window_sum = sum(arr[:k])
    max_sum = window_sum
    
    # Slide the window
    for i in range(k, len(arr)):
        window_sum += arr[i] - arr[i - k]  # Add new, remove old
        max_sum = max(max_sum, window_sum)
    
    return max_sum

# Usage:
# result = max_sum_subarray([1, 4, 2, 10, 2, 3, 1, 0, 20], 4)
# result = 24 (subarray [2, 10, 2, 10])`,
      javascript: `function maxSumSubarray(arr, k) {
  // Find maximum sum of any subarray of size k
  if (arr.length < k) return 0;

  // Calculate sum of first window
  let windowSum = arr.slice(0, k).reduce((a, b) => a + b, 0);
  let maxSum = windowSum;

  // Slide the window
  for (let i = k; i < arr.length; i++) {
    windowSum += arr[i] - arr[i - k]; // Add new, remove old
    maxSum = Math.max(maxSum, windowSum);
  }

  return maxSum;
}

// Usage:
// const result = maxSumSubarray([1, 4, 2, 10, 2, 3, 1, 0, 20], 4);
// result = 24 (subarray [2, 10, 2, 10])`,
      typescript: `function maxSumSubarray(arr: number[], k: number): number {
  // Find maximum sum of any subarray of size k
  if (arr.length < k) return 0;

  // Calculate sum of first window
  let windowSum = arr.slice(0, k).reduce((a, b) => a + b, 0);
  let maxSum = windowSum;

  // Slide the window
  for (let i = k; i < arr.length; i++) {
    windowSum += arr[i] - arr[i - k]; // Add new, remove old
    maxSum = Math.max(maxSum, windowSum);
  }

  return maxSum;
}

// Usage:
// const result = maxSumSubarray([1, 4, 2, 10, 2, 3, 1, 0, 20], 4);
// result = 24 (subarray [2, 10, 2, 10])`,
      java: `public class SlidingWindowFixed {
    public static int maxSumSubarray(int[] arr, int k) {
        // Find maximum sum of any subarray of size k
        if (arr.length < k) return 0;

        // Calculate sum of first window
        int windowSum = 0;
        for (int i = 0; i < k; i++) {
            windowSum += arr[i];
        }
        int maxSum = windowSum;

        // Slide the window
        for (int i = k; i < arr.length; i++) {
            windowSum += arr[i] - arr[i - k]; // Add new, remove old
            maxSum = Math.max(maxSum, windowSum);
        }

        return maxSum;
    }

    // Usage:
    // int result = maxSumSubarray(new int[]{1, 4, 2, 10, 2, 3, 1, 0, 20}, 4);
    // result = 24 (subarray [2, 10, 2, 10])
}`,
      cpp: `#include <vector>
#include <algorithm>
using namespace std;

int maxSumSubarray(vector<int>& arr, int k) {
    // Find maximum sum of any subarray of size k
    if (arr.size() < k) return 0;

    // Calculate sum of first window
    int windowSum = 0;
    for (int i = 0; i < k; i++) {
        windowSum += arr[i];
    }
    int maxSum = windowSum;

    // Slide the window
    for (int i = k; i < arr.size(); i++) {
        windowSum += arr[i] - arr[i - k]; // Add new, remove old
        maxSum = max(maxSum, windowSum);
    }

    return maxSum;
}

// Usage:
// vector<int> arr = {1, 4, 2, 10, 2, 3, 1, 0, 20};
// int result = maxSumSubarray(arr, 4); // 24`,
      go: `package main

func maxSumSubarray(arr []int, k int) int {
    // Find maximum sum of any subarray of size k
    if len(arr) < k {
        return 0
    }

    // Calculate sum of first window
    windowSum := 0
    for i := 0; i < k; i++ {
        windowSum += arr[i]
    }
    maxSum := windowSum

    // Slide the window
    for i := k; i < len(arr); i++ {
        windowSum += arr[i] - arr[i-k] // Add new, remove old
        if windowSum > maxSum {
            maxSum = windowSum
        }
    }

    return maxSum
}

// Usage:
// result := maxSumSubarray([]int{1, 4, 2, 10, 2, 3, 1, 0, 20}, 4)
// result = 24`,
      rust: `fn max_sum_subarray(arr: &[i32], k: usize) -> i32 {
    // Find maximum sum of any subarray of size k
    if arr.len() < k {
        return 0;
    }

    // Calculate sum of first window
    let mut window_sum: i32 = arr[..k].iter().sum();
    let mut max_sum = window_sum;

    // Slide the window
    for i in k..arr.len() {
        window_sum += arr[i] - arr[i - k]; // Add new, remove old
        max_sum = max_sum.max(window_sum);
    }

    max_sum
}

// Usage:
// let result = max_sum_subarray(&[1, 4, 2, 10, 2, 3, 1, 0, 20], 4);
// result = 24`,
    },
  },
  {
    id: 'sliding-window-variable',
    topic: 'sliding-window',
    name: 'Variable Size Sliding Window',
    description: 'Dynamic window size based on condition',
    defaultLanguage: 'python',
    codeByLanguage: {
      python: `def min_subarray_sum(arr, target):
    """Find minimum length subarray with sum >= target."""
    left = 0
    current_sum = 0
    min_length = float('inf')
    
    for right in range(len(arr)):
        current_sum += arr[right]
        
        while current_sum >= target:
            min_length = min(min_length, right - left + 1)
            current_sum -= arr[left]
            left += 1
    
    return min_length if min_length != float('inf') else 0

# Usage:
# result = min_subarray_sum([2, 3, 1, 2, 4, 3], 7)
# result = 2 (subarray [4, 3])`,
      javascript: `function minSubarraySum(arr, target) {
  // Find minimum length subarray with sum >= target
  let left = 0;
  let currentSum = 0;
  let minLength = Infinity;

  for (let right = 0; right < arr.length; right++) {
    currentSum += arr[right];

    while (currentSum >= target) {
      minLength = Math.min(minLength, right - left + 1);
      currentSum -= arr[left];
      left++;
    }
  }

  return minLength === Infinity ? 0 : minLength;
}

// Usage:
// const result = minSubarraySum([2, 3, 1, 2, 4, 3], 7);
// result = 2 (subarray [4, 3])`,
      typescript: `function minSubarraySum(arr: number[], target: number): number {
  // Find minimum length subarray with sum >= target
  let left = 0;
  let currentSum = 0;
  let minLength = Infinity;

  for (let right = 0; right < arr.length; right++) {
    currentSum += arr[right];

    while (currentSum >= target) {
      minLength = Math.min(minLength, right - left + 1);
      currentSum -= arr[left];
      left++;
    }
  }

  return minLength === Infinity ? 0 : minLength;
}

// Usage:
// const result = minSubarraySum([2, 3, 1, 2, 4, 3], 7);
// result = 2 (subarray [4, 3])`,
      java: `public class SlidingWindowVariable {
    public static int minSubarraySum(int[] arr, int target) {
        // Find minimum length subarray with sum >= target
        int left = 0;
        int currentSum = 0;
        int minLength = Integer.MAX_VALUE;

        for (int right = 0; right < arr.length; right++) {
            currentSum += arr[right];

            while (currentSum >= target) {
                minLength = Math.min(minLength, right - left + 1);
                currentSum -= arr[left];
                left++;
            }
        }

        return minLength == Integer.MAX_VALUE ? 0 : minLength;
    }

    // Usage:
    // int result = minSubarraySum(new int[]{2, 3, 1, 2, 4, 3}, 7);
    // result = 2 (subarray [4, 3])
}`,
      cpp: `#include <vector>
#include <algorithm>
#include <climits>
using namespace std;

int minSubarraySum(vector<int>& arr, int target) {
    // Find minimum length subarray with sum >= target
    int left = 0;
    int currentSum = 0;
    int minLength = INT_MAX;

    for (int right = 0; right < arr.size(); right++) {
        currentSum += arr[right];

        while (currentSum >= target) {
            minLength = min(minLength, right - left + 1);
            currentSum -= arr[left];
            left++;
        }
    }

    return minLength == INT_MAX ? 0 : minLength;
}

// Usage:
// vector<int> arr = {2, 3, 1, 2, 4, 3};
// int result = minSubarraySum(arr, 7); // 2`,
      go: `package main

import "math"

func minSubarraySum(arr []int, target int) int {
    // Find minimum length subarray with sum >= target
    left := 0
    currentSum := 0
    minLength := math.MaxInt

    for right := 0; right < len(arr); right++ {
        currentSum += arr[right]

        for currentSum >= target {
            if right-left+1 < minLength {
                minLength = right - left + 1
            }
            currentSum -= arr[left]
            left++
        }
    }

    if minLength == math.MaxInt {
        return 0
    }
    return minLength
}

// Usage:
// result := minSubarraySum([]int{2, 3, 1, 2, 4, 3}, 7)
// result = 2 (subarray [4, 3])`,
      rust: `fn min_subarray_sum(arr: &[i32], target: i32) -> usize {
    // Find minimum length subarray with sum >= target
    let mut left = 0;
    let mut current_sum = 0;
    let mut min_length = usize::MAX;

    for right in 0..arr.len() {
        current_sum += arr[right];

        while current_sum >= target {
            min_length = min_length.min(right - left + 1);
            current_sum -= arr[left];
            left += 1;
        }
    }

    if min_length == usize::MAX { 0 } else { min_length }
}

// Usage:
// let result = min_subarray_sum(&[2, 3, 1, 2, 4, 3], 7);
// result = 2 (subarray [4, 3])`,
    },
  },

  // Stack
  {
    id: 'monotonic-stack',
    topic: 'stack',
    name: 'Monotonic Stack',
    description: 'Stack maintaining monotonic order for next greater/smaller element',
    defaultLanguage: 'python',
    codeByLanguage: {
      python: `def next_greater_element(arr):
    """Find next greater element for each position."""
    n = len(arr)
    result = [-1] * n
    stack = []  # Stores indices
    
    for i in range(n):
        # Pop elements smaller than current
        while stack and arr[stack[-1]] < arr[i]:
            idx = stack.pop()
            result[idx] = arr[i]
        stack.append(i)
    
    return result

# Usage:
# result = next_greater_element([4, 5, 2, 10, 8])
# result = [5, 10, 10, -1, -1]`,
      javascript: `function nextGreaterElement(arr) {
  // Find next greater element for each position
  const n = arr.length;
  const result = new Array(n).fill(-1);
  const stack = []; // Stores indices

  for (let i = 0; i < n; i++) {
    // Pop elements smaller than current
    while (stack.length && arr[stack[stack.length - 1]] < arr[i]) {
      const idx = stack.pop();
      result[idx] = arr[i];
    }
    stack.push(i);
  }

  return result;
}

// Usage:
// const result = nextGreaterElement([4, 5, 2, 10, 8]);
// result = [5, 10, 10, -1, -1]`,
      typescript: `function nextGreaterElement(arr: number[]): number[] {
  // Find next greater element for each position
  const n = arr.length;
  const result: number[] = new Array(n).fill(-1);
  const stack: number[] = []; // Stores indices

  for (let i = 0; i < n; i++) {
    // Pop elements smaller than current
    while (stack.length && arr[stack[stack.length - 1]] < arr[i]) {
      const idx = stack.pop()!;
      result[idx] = arr[i];
    }
    stack.push(i);
  }

  return result;
}

// Usage:
// const result = nextGreaterElement([4, 5, 2, 10, 8]);
// result = [5, 10, 10, -1, -1]`,
      java: `import java.util.*;

public class MonotonicStack {
    public static int[] nextGreaterElement(int[] arr) {
        // Find next greater element for each position
        int n = arr.length;
        int[] result = new int[n];
        Arrays.fill(result, -1);
        Deque<Integer> stack = new ArrayDeque<>(); // Stores indices

        for (int i = 0; i < n; i++) {
            // Pop elements smaller than current
            while (!stack.isEmpty() && arr[stack.peek()] < arr[i]) {
                int idx = stack.pop();
                result[idx] = arr[i];
            }
            stack.push(i);
        }

        return result;
    }

    // Usage:
    // int[] result = nextGreaterElement(new int[]{4, 5, 2, 10, 8});
    // result = [5, 10, 10, -1, -1]
}`,
      cpp: `#include <vector>
#include <stack>
using namespace std;

vector<int> nextGreaterElement(vector<int>& arr) {
    // Find next greater element for each position
    int n = arr.size();
    vector<int> result(n, -1);
    stack<int> st; // Stores indices

    for (int i = 0; i < n; i++) {
        // Pop elements smaller than current
        while (!st.empty() && arr[st.top()] < arr[i]) {
            int idx = st.top();
            st.pop();
            result[idx] = arr[i];
        }
        st.push(i);
    }

    return result;
}

// Usage:
// vector<int> arr = {4, 5, 2, 10, 8};
// auto result = nextGreaterElement(arr); // [5, 10, 10, -1, -1]`,
      go: `package main

func nextGreaterElement(arr []int) []int {
    // Find next greater element for each position
    n := len(arr)
    result := make([]int, n)
    for i := range result {
        result[i] = -1
    }
    stack := []int{} // Stores indices

    for i := 0; i < n; i++ {
        // Pop elements smaller than current
        for len(stack) > 0 && arr[stack[len(stack)-1]] < arr[i] {
            idx := stack[len(stack)-1]
            stack = stack[:len(stack)-1]
            result[idx] = arr[i]
        }
        stack = append(stack, i)
    }

    return result
}

// Usage:
// result := nextGreaterElement([]int{4, 5, 2, 10, 8})
// result = [5, 10, 10, -1, -1]`,
      rust: `fn next_greater_element(arr: &[i32]) -> Vec<i32> {
    // Find next greater element for each position
    let n = arr.len();
    let mut result = vec![-1; n];
    let mut stack: Vec<usize> = Vec::new(); // Stores indices

    for i in 0..n {
        // Pop elements smaller than current
        while !stack.is_empty() && arr[*stack.last().unwrap()] < arr[i] {
            let idx = stack.pop().unwrap();
            result[idx] = arr[i];
        }
        stack.push(i);
    }

    result
}

// Usage:
// let result = next_greater_element(&[4, 5, 2, 10, 8]);
// result = [5, 10, 10, -1, -1]`,
    },
  },

  // Binary Search
  {
    id: 'binary-search-template',
    topic: 'binary-search',
    name: 'Binary Search Template',
    description: 'Standard binary search with left/right boundary variations',
    defaultLanguage: 'python',
    codeByLanguage: {
      python: `def binary_search(arr, target):
    """Find target in sorted array, return index or -1."""
    left, right = 0, len(arr) - 1
    
    while left <= right:
        mid = left + (right - left) // 2
        
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    
    return -1

def left_bound(arr, target):
    """Find leftmost position where target could be inserted."""
    left, right = 0, len(arr)
    
    while left < right:
        mid = left + (right - left) // 2
        if arr[mid] < target:
            left = mid + 1
        else:
            right = mid
    
    return left

# Usage:
# idx = binary_search([1, 2, 3, 4, 5], 3)  # Returns 2
# pos = left_bound([1, 2, 2, 2, 3], 2)      # Returns 1`,
      javascript: `function binarySearch(arr, target) {
  // Find target in sorted array, return index or -1
  let left = 0;
  let right = arr.length - 1;

  while (left <= right) {
    const mid = left + Math.floor((right - left) / 2);

    if (arr[mid] === target) {
      return mid;
    } else if (arr[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }

  return -1;
}

function leftBound(arr, target) {
  // Find leftmost position where target could be inserted
  let left = 0;
  let right = arr.length;

  while (left < right) {
    const mid = left + Math.floor((right - left) / 2);
    if (arr[mid] < target) {
      left = mid + 1;
    } else {
      right = mid;
    }
  }

  return left;
}

// Usage:
// const idx = binarySearch([1, 2, 3, 4, 5], 3); // Returns 2
// const pos = leftBound([1, 2, 2, 2, 3], 2);    // Returns 1`,
      typescript: `function binarySearch(arr: number[], target: number): number {
  // Find target in sorted array, return index or -1
  let left = 0;
  let right = arr.length - 1;

  while (left <= right) {
    const mid = left + Math.floor((right - left) / 2);

    if (arr[mid] === target) {
      return mid;
    } else if (arr[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }

  return -1;
}

function leftBound(arr: number[], target: number): number {
  // Find leftmost position where target could be inserted
  let left = 0;
  let right = arr.length;

  while (left < right) {
    const mid = left + Math.floor((right - left) / 2);
    if (arr[mid] < target) {
      left = mid + 1;
    } else {
      right = mid;
    }
  }

  return left;
}

// Usage:
// const idx = binarySearch([1, 2, 3, 4, 5], 3); // Returns 2
// const pos = leftBound([1, 2, 2, 2, 3], 2);    // Returns 1`,
      java: `public class BinarySearch {
    public static int binarySearch(int[] arr, int target) {
        // Find target in sorted array, return index or -1
        int left = 0;
        int right = arr.length - 1;

        while (left <= right) {
            int mid = left + (right - left) / 2;

            if (arr[mid] == target) {
                return mid;
            } else if (arr[mid] < target) {
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }

        return -1;
    }

    public static int leftBound(int[] arr, int target) {
        // Find leftmost position where target could be inserted
        int left = 0;
        int right = arr.length;

        while (left < right) {
            int mid = left + (right - left) / 2;
            if (arr[mid] < target) {
                left = mid + 1;
            } else {
                right = mid;
            }
        }

        return left;
    }

    // Usage:
    // int idx = binarySearch(new int[]{1, 2, 3, 4, 5}, 3); // Returns 2
    // int pos = leftBound(new int[]{1, 2, 2, 2, 3}, 2);    // Returns 1
}`,
      cpp: `#include <vector>
using namespace std;

int binarySearch(vector<int>& arr, int target) {
    // Find target in sorted array, return index or -1
    int left = 0;
    int right = arr.size() - 1;

    while (left <= right) {
        int mid = left + (right - left) / 2;

        if (arr[mid] == target) {
            return mid;
        } else if (arr[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }

    return -1;
}

int leftBound(vector<int>& arr, int target) {
    // Find leftmost position where target could be inserted
    int left = 0;
    int right = arr.size();

    while (left < right) {
        int mid = left + (right - left) / 2;
        if (arr[mid] < target) {
            left = mid + 1;
        } else {
            right = mid;
        }
    }

    return left;
}

// Usage:
// vector<int> arr = {1, 2, 3, 4, 5};
// int idx = binarySearch(arr, 3); // Returns 2
// int pos = leftBound(arr, 2);    // Returns 1`,
      go: `package main

func binarySearch(arr []int, target int) int {
    // Find target in sorted array, return index or -1
    left, right := 0, len(arr)-1

    for left <= right {
        mid := left + (right-left)/2

        if arr[mid] == target {
            return mid
        } else if arr[mid] < target {
            left = mid + 1
        } else {
            right = mid - 1
        }
    }

    return -1
}

func leftBound(arr []int, target int) int {
    // Find leftmost position where target could be inserted
    left, right := 0, len(arr)

    for left < right {
        mid := left + (right-left)/2
        if arr[mid] < target {
            left = mid + 1
        } else {
            right = mid
        }
    }

    return left
}

// Usage:
// idx := binarySearch([]int{1, 2, 3, 4, 5}, 3) // Returns 2
// pos := leftBound([]int{1, 2, 2, 2, 3}, 2)    // Returns 1`,
      rust: `fn binary_search(arr: &[i32], target: i32) -> i32 {
    // Find target in sorted array, return index or -1
    let mut left: i32 = 0;
    let mut right: i32 = arr.len() as i32 - 1;

    while left <= right {
        let mid = left + (right - left) / 2;

        if arr[mid as usize] == target {
            return mid;
        } else if arr[mid as usize] < target {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }

    -1
}

fn left_bound(arr: &[i32], target: i32) -> usize {
    // Find leftmost position where target could be inserted
    let mut left = 0;
    let mut right = arr.len();

    while left < right {
        let mid = left + (right - left) / 2;
        if arr[mid] < target {
            left = mid + 1;
        } else {
            right = mid;
        }
    }

    left
}

// Usage:
// let idx = binary_search(&[1, 2, 3, 4, 5], 3); // Returns 2
// let pos = left_bound(&[1, 2, 2, 2, 3], 2);    // Returns 1`,
    },
  },

  // Linked List
  {
    id: 'fast-slow-pointers',
    topic: 'linked-list',
    name: 'Fast & Slow Pointers',
    description: 'Detect cycles or find middle of linked list',
    defaultLanguage: 'python',
    codeByLanguage: {
      python: `def has_cycle(head):
    """Detect if linked list has a cycle."""
    slow = fast = head
    
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        
        if slow == fast:
            return True
    
    return False

def find_middle(head):
    """Find middle node of linked list."""
    slow = fast = head
    
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
    
    return slow

# Usage:
# has_cycle(head)    # Returns True/False
# middle = find_middle(head)  # Returns middle node`,
      javascript: `function hasCycle(head) {
  // Detect if linked list has a cycle
  let slow = head;
  let fast = head;

  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;

    if (slow === fast) {
      return true;
    }
  }

  return false;
}

function findMiddle(head) {
  // Find middle node of linked list
  let slow = head;
  let fast = head;

  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
  }

  return slow;
}

// Usage:
// hasCycle(head);        // Returns true/false
// const middle = findMiddle(head); // Returns middle node`,
      typescript: `interface ListNode<T> {
  val: T;
  next: ListNode<T> | null;
}

function hasCycle<T>(head: ListNode<T> | null): boolean {
  // Detect if linked list has a cycle
  let slow = head;
  let fast = head;

  while (fast && fast.next) {
    slow = slow!.next;
    fast = fast.next.next;

    if (slow === fast) {
      return true;
    }
  }

  return false;
}

function findMiddle<T>(head: ListNode<T> | null): ListNode<T> | null {
  // Find middle node of linked list
  let slow = head;
  let fast = head;

  while (fast && fast.next) {
    slow = slow!.next;
    fast = fast.next.next;
  }

  return slow;
}

// Usage:
// hasCycle(head);        // Returns true/false
// const middle = findMiddle(head); // Returns middle node`,
      java: `class ListNode {
    int val;
    ListNode next;
    ListNode(int val) { this.val = val; }
}

public class FastSlowPointers {
    public static boolean hasCycle(ListNode head) {
        // Detect if linked list has a cycle
        ListNode slow = head;
        ListNode fast = head;

        while (fast != null && fast.next != null) {
            slow = slow.next;
            fast = fast.next.next;

            if (slow == fast) {
                return true;
            }
        }

        return false;
    }

    public static ListNode findMiddle(ListNode head) {
        // Find middle node of linked list
        ListNode slow = head;
        ListNode fast = head;

        while (fast != null && fast.next != null) {
            slow = slow.next;
            fast = fast.next.next;
        }

        return slow;
    }

    // Usage:
    // hasCycle(head);        // Returns true/false
    // ListNode middle = findMiddle(head); // Returns middle node
}`,
      cpp: `struct ListNode {
    int val;
    ListNode* next;
    ListNode(int x) : val(x), next(nullptr) {}
};

bool hasCycle(ListNode* head) {
    // Detect if linked list has a cycle
    ListNode* slow = head;
    ListNode* fast = head;

    while (fast && fast->next) {
        slow = slow->next;
        fast = fast->next->next;

        if (slow == fast) {
            return true;
        }
    }

    return false;
}

ListNode* findMiddle(ListNode* head) {
    // Find middle node of linked list
    ListNode* slow = head;
    ListNode* fast = head;

    while (fast && fast->next) {
        slow = slow->next;
        fast = fast->next->next;
    }

    return slow;
}

// Usage:
// hasCycle(head);        // Returns true/false
// ListNode* middle = findMiddle(head); // Returns middle node`,
      go: `package main

type ListNode struct {
    Val  int
    Next *ListNode
}

func hasCycle(head *ListNode) bool {
    // Detect if linked list has a cycle
    slow, fast := head, head

    for fast != nil && fast.Next != nil {
        slow = slow.Next
        fast = fast.Next.Next

        if slow == fast {
            return true
        }
    }

    return false
}

func findMiddle(head *ListNode) *ListNode {
    // Find middle node of linked list
    slow, fast := head, head

    for fast != nil && fast.Next != nil {
        slow = slow.Next
        fast = fast.Next.Next
    }

    return slow
}

// Usage:
// hasCycle(head)        // Returns true/false
// middle := findMiddle(head) // Returns middle node`,
      rust: `use std::rc::Rc;
use std::cell::RefCell;

type Link = Option<Rc<RefCell<ListNode>>>;

struct ListNode {
    val: i32,
    next: Link,
}

fn has_cycle(head: &Link) -> bool {
    // Detect if linked list has a cycle (using HashSet approach in Rust)
    use std::collections::HashSet;
    let mut visited = HashSet::new();
    let mut current = head.clone();

    while let Some(node) = current {
        let ptr = Rc::as_ptr(&node) as usize;
        if visited.contains(&ptr) {
            return true;
        }
        visited.insert(ptr);
        current = node.borrow().next.clone();
    }

    false
}

fn find_middle(arr: &[i32]) -> Option<i32> {
    // Find middle element (simplified for array)
    if arr.is_empty() {
        return None;
    }
    Some(arr[arr.len() / 2])
}

// Usage:
// let has = has_cycle(&head); // Returns true/false
// let mid = find_middle(&[1, 2, 3, 4, 5]); // Some(3)`,
    },
  },

  // Trees
  {
    id: 'dfs-tree-traversal',
    topic: 'trees',
    name: 'DFS Tree Traversal',
    description: 'Recursive and iterative DFS for binary trees',
    defaultLanguage: 'python',
    codeByLanguage: {
      python: `def inorder_recursive(root, result=None):
    """Inorder traversal: Left -> Root -> Right."""
    if result is None:
        result = []
    if root:
        inorder_recursive(root.left, result)
        result.append(root.val)
        inorder_recursive(root.right, result)
    return result

def inorder_iterative(root):
    """Iterative inorder using stack."""
    result = []
    stack = []
    current = root
    
    while current or stack:
        while current:
            stack.append(current)
            current = current.left
        current = stack.pop()
        result.append(current.val)
        current = current.right
    
    return result

# Usage:
# values = inorder_recursive(root)
# values = inorder_iterative(root)`,
      javascript: `function inorderRecursive(root, result = []) {
  // Inorder traversal: Left -> Root -> Right
  if (root) {
    inorderRecursive(root.left, result);
    result.push(root.val);
    inorderRecursive(root.right, result);
  }
  return result;
}

function inorderIterative(root) {
  // Iterative inorder using stack
  const result = [];
  const stack = [];
  let current = root;

  while (current || stack.length) {
    while (current) {
      stack.push(current);
      current = current.left;
    }
    current = stack.pop();
    result.push(current.val);
    current = current.right;
  }

  return result;
}

// Usage:
// const values = inorderRecursive(root);
// const values = inorderIterative(root);`,
      typescript: `interface TreeNode<T> {
  val: T;
  left: TreeNode<T> | null;
  right: TreeNode<T> | null;
}

function inorderRecursive<T>(root: TreeNode<T> | null, result: T[] = []): T[] {
  // Inorder traversal: Left -> Root -> Right
  if (root) {
    inorderRecursive(root.left, result);
    result.push(root.val);
    inorderRecursive(root.right, result);
  }
  return result;
}

function inorderIterative<T>(root: TreeNode<T> | null): T[] {
  // Iterative inorder using stack
  const result: T[] = [];
  const stack: TreeNode<T>[] = [];
  let current = root;

  while (current || stack.length) {
    while (current) {
      stack.push(current);
      current = current.left;
    }
    current = stack.pop()!;
    result.push(current.val);
    current = current.right;
  }

  return result;
}

// Usage:
// const values = inorderRecursive(root);
// const values = inorderIterative(root);`,
      java: `import java.util.*;

class TreeNode {
    int val;
    TreeNode left, right;
    TreeNode(int val) { this.val = val; }
}

public class DFSTreeTraversal {
    public static List<Integer> inorderRecursive(TreeNode root, List<Integer> result) {
        // Inorder traversal: Left -> Root -> Right
        if (result == null) result = new ArrayList<>();
        if (root != null) {
            inorderRecursive(root.left, result);
            result.add(root.val);
            inorderRecursive(root.right, result);
        }
        return result;
    }

    public static List<Integer> inorderIterative(TreeNode root) {
        // Iterative inorder using stack
        List<Integer> result = new ArrayList<>();
        Deque<TreeNode> stack = new ArrayDeque<>();
        TreeNode current = root;

        while (current != null || !stack.isEmpty()) {
            while (current != null) {
                stack.push(current);
                current = current.left;
            }
            current = stack.pop();
            result.add(current.val);
            current = current.right;
        }

        return result;
    }

    // Usage:
    // List<Integer> values = inorderRecursive(root, null);
    // List<Integer> values = inorderIterative(root);
}`,
      cpp: `#include <vector>
#include <stack>
using namespace std;

struct TreeNode {
    int val;
    TreeNode* left;
    TreeNode* right;
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
};

void inorderRecursive(TreeNode* root, vector<int>& result) {
    // Inorder traversal: Left -> Root -> Right
    if (root) {
        inorderRecursive(root->left, result);
        result.push_back(root->val);
        inorderRecursive(root->right, result);
    }
}

vector<int> inorderIterative(TreeNode* root) {
    // Iterative inorder using stack
    vector<int> result;
    stack<TreeNode*> st;
    TreeNode* current = root;

    while (current || !st.empty()) {
        while (current) {
            st.push(current);
            current = current->left;
        }
        current = st.top();
        st.pop();
        result.push_back(current->val);
        current = current->right;
    }

    return result;
}

// Usage:
// vector<int> result;
// inorderRecursive(root, result);
// vector<int> values = inorderIterative(root);`,
      go: `package main

type TreeNode struct {
    Val   int
    Left  *TreeNode
    Right *TreeNode
}

func inorderRecursive(root *TreeNode, result *[]int) {
    // Inorder traversal: Left -> Root -> Right
    if root != nil {
        inorderRecursive(root.Left, result)
        *result = append(*result, root.Val)
        inorderRecursive(root.Right, result)
    }
}

func inorderIterative(root *TreeNode) []int {
    // Iterative inorder using stack
    result := []int{}
    stack := []*TreeNode{}
    current := root

    for current != nil || len(stack) > 0 {
        for current != nil {
            stack = append(stack, current)
            current = current.Left
        }
        current = stack[len(stack)-1]
        stack = stack[:len(stack)-1]
        result = append(result, current.Val)
        current = current.Right
    }

    return result
}

// Usage:
// result := []int{}
// inorderRecursive(root, &result)
// values := inorderIterative(root)`,
      rust: `use std::rc::Rc;
use std::cell::RefCell;

type TreeLink = Option<Rc<RefCell<TreeNode>>>;

struct TreeNode {
    val: i32,
    left: TreeLink,
    right: TreeLink,
}

fn inorder_recursive(root: &TreeLink, result: &mut Vec<i32>) {
    // Inorder traversal: Left -> Root -> Right
    if let Some(node) = root {
        let node = node.borrow();
        inorder_recursive(&node.left, result);
        result.push(node.val);
        inorder_recursive(&node.right, result);
    }
}

fn inorder_iterative(root: &TreeLink) -> Vec<i32> {
    // Iterative inorder using stack
    let mut result = Vec::new();
    let mut stack: Vec<Rc<RefCell<TreeNode>>> = Vec::new();
    let mut current = root.clone();

    while current.is_some() || !stack.is_empty() {
        while let Some(node) = current {
            stack.push(node.clone());
            current = node.borrow().left.clone();
        }
        if let Some(node) = stack.pop() {
            result.push(node.borrow().val);
            current = node.borrow().right.clone();
        }
    }

    result
}

// Usage:
// let mut result = Vec::new();
// inorder_recursive(&root, &mut result);
// let values = inorder_iterative(&root);`,
    },
  },
  {
    id: 'bfs-level-order',
    topic: 'trees',
    name: 'BFS Level Order Traversal',
    description: 'Traverse tree level by level using queue',
    defaultLanguage: 'python',
    codeByLanguage: {
      python: `from collections import deque

def level_order(root):
    """Level order traversal returning list of levels."""
    if not root:
        return []
    
    result = []
    queue = deque([root])
    
    while queue:
        level_size = len(queue)
        level = []
        
        for _ in range(level_size):
            node = queue.popleft()
            level.append(node.val)
            
            if node.left:
                queue.append(node.left)
            if node.right:
                queue.append(node.right)
        
        result.append(level)
    
    return result

# Usage:
# levels = level_order(root)
# levels = [[3], [9, 20], [15, 7]]`,
      javascript: `function levelOrder(root) {
  // Level order traversal returning list of levels
  if (!root) return [];

  const result = [];
  const queue = [root];

  while (queue.length) {
    const levelSize = queue.length;
    const level = [];

    for (let i = 0; i < levelSize; i++) {
      const node = queue.shift();
      level.push(node.val);

      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }

    result.push(level);
  }

  return result;
}

// Usage:
// const levels = levelOrder(root);
// levels = [[3], [9, 20], [15, 7]]`,
      typescript: `interface TreeNode<T> {
  val: T;
  left: TreeNode<T> | null;
  right: TreeNode<T> | null;
}

function levelOrder<T>(root: TreeNode<T> | null): T[][] {
  // Level order traversal returning list of levels
  if (!root) return [];

  const result: T[][] = [];
  const queue: TreeNode<T>[] = [root];

  while (queue.length) {
    const levelSize = queue.length;
    const level: T[] = [];

    for (let i = 0; i < levelSize; i++) {
      const node = queue.shift()!;
      level.push(node.val);

      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }

    result.push(level);
  }

  return result;
}

// Usage:
// const levels = levelOrder(root);
// levels = [[3], [9, 20], [15, 7]]`,
      java: `import java.util.*;

class TreeNode {
    int val;
    TreeNode left, right;
    TreeNode(int val) { this.val = val; }
}

public class BFSLevelOrder {
    public static List<List<Integer>> levelOrder(TreeNode root) {
        // Level order traversal returning list of levels
        List<List<Integer>> result = new ArrayList<>();
        if (root == null) return result;

        Queue<TreeNode> queue = new LinkedList<>();
        queue.offer(root);

        while (!queue.isEmpty()) {
            int levelSize = queue.size();
            List<Integer> level = new ArrayList<>();

            for (int i = 0; i < levelSize; i++) {
                TreeNode node = queue.poll();
                level.add(node.val);

                if (node.left != null) queue.offer(node.left);
                if (node.right != null) queue.offer(node.right);
            }

            result.add(level);
        }

        return result;
    }

    // Usage:
    // List<List<Integer>> levels = levelOrder(root);
    // levels = [[3], [9, 20], [15, 7]]
}`,
      cpp: `#include <vector>
#include <queue>
using namespace std;

struct TreeNode {
    int val;
    TreeNode* left;
    TreeNode* right;
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
};

vector<vector<int>> levelOrder(TreeNode* root) {
    // Level order traversal returning list of levels
    vector<vector<int>> result;
    if (!root) return result;

    queue<TreeNode*> q;
    q.push(root);

    while (!q.empty()) {
        int levelSize = q.size();
        vector<int> level;

        for (int i = 0; i < levelSize; i++) {
            TreeNode* node = q.front();
            q.pop();
            level.push_back(node->val);

            if (node->left) q.push(node->left);
            if (node->right) q.push(node->right);
        }

        result.push_back(level);
    }

    return result;
}

// Usage:
// vector<vector<int>> levels = levelOrder(root);
// levels = [[3], [9, 20], [15, 7]]`,
      go: `package main

type TreeNode struct {
    Val   int
    Left  *TreeNode
    Right *TreeNode
}

func levelOrder(root *TreeNode) [][]int {
    // Level order traversal returning list of levels
    result := [][]int{}
    if root == nil {
        return result
    }

    queue := []*TreeNode{root}

    for len(queue) > 0 {
        levelSize := len(queue)
        level := []int{}

        for i := 0; i < levelSize; i++ {
            node := queue[0]
            queue = queue[1:]
            level = append(level, node.Val)

            if node.Left != nil {
                queue = append(queue, node.Left)
            }
            if node.Right != nil {
                queue = append(queue, node.Right)
            }
        }

        result = append(result, level)
    }

    return result
}

// Usage:
// levels := levelOrder(root)
// levels = [[3], [9, 20], [15, 7]]`,
      rust: `use std::collections::VecDeque;
use std::rc::Rc;
use std::cell::RefCell;

type TreeLink = Option<Rc<RefCell<TreeNode>>>;

struct TreeNode {
    val: i32,
    left: TreeLink,
    right: TreeLink,
}

fn level_order(root: &TreeLink) -> Vec<Vec<i32>> {
    // Level order traversal returning list of levels
    let mut result = Vec::new();
    if root.is_none() {
        return result;
    }

    let mut queue = VecDeque::new();
    queue.push_back(root.clone().unwrap());

    while !queue.is_empty() {
        let level_size = queue.len();
        let mut level = Vec::new();

        for _ in 0..level_size {
            if let Some(node) = queue.pop_front() {
                let node = node.borrow();
                level.push(node.val);

                if let Some(left) = &node.left {
                    queue.push_back(left.clone());
                }
                if let Some(right) = &node.right {
                    queue.push_back(right.clone());
                }
            }
        }

        result.push(level);
    }

    result
}

// Usage:
// let levels = level_order(&root);
// levels = [[3], [9, 20], [15, 7]]`,
    },
  },

  // Backtracking
  {
    id: 'backtracking-template',
    topic: 'backtracking',
    name: 'Backtracking Template',
    description: 'General backtracking pattern for combinations/permutations',
    defaultLanguage: 'python',
    codeByLanguage: {
      python: `def backtrack(candidates, target):
    """Find all combinations that sum to target."""
    result = []
    
    def helper(start, path, remaining):
        if remaining == 0:
            result.append(path[:])
            return
        if remaining < 0:
            return
        
        for i in range(start, len(candidates)):
            # Skip duplicates (if array has duplicates)
            if i > start and candidates[i] == candidates[i-1]:
                continue
            
            path.append(candidates[i])
            helper(i + 1, path, remaining - candidates[i])
            path.pop()  # Backtrack
    
    candidates.sort()  # Sort for duplicate handling
    helper(0, [], target)
    return result

# Usage:
# combos = backtrack([2, 3, 6, 7], 7)
# combos = [[7], [2, 2, 3]]  (if allowing reuse)`,
      javascript: `function backtrack(candidates, target) {
  // Find all combinations that sum to target
  const result = [];

  function helper(start, path, remaining) {
    if (remaining === 0) {
      result.push([...path]);
      return;
    }
    if (remaining < 0) return;

    for (let i = start; i < candidates.length; i++) {
      // Skip duplicates (if array has duplicates)
      if (i > start && candidates[i] === candidates[i - 1]) continue;

      path.push(candidates[i]);
      helper(i + 1, path, remaining - candidates[i]);
      path.pop(); // Backtrack
    }
  }

  candidates.sort((a, b) => a - b); // Sort for duplicate handling
  helper(0, [], target);
  return result;
}

// Usage:
// const combos = backtrack([2, 3, 6, 7], 7);
// combos = [[7], [2, 2, 3]] (if allowing reuse)`,
      typescript: `function backtrack(candidates: number[], target: number): number[][] {
  // Find all combinations that sum to target
  const result: number[][] = [];

  function helper(start: number, path: number[], remaining: number): void {
    if (remaining === 0) {
      result.push([...path]);
      return;
    }
    if (remaining < 0) return;

    for (let i = start; i < candidates.length; i++) {
      // Skip duplicates (if array has duplicates)
      if (i > start && candidates[i] === candidates[i - 1]) continue;

      path.push(candidates[i]);
      helper(i + 1, path, remaining - candidates[i]);
      path.pop(); // Backtrack
    }
  }

  candidates.sort((a, b) => a - b); // Sort for duplicate handling
  helper(0, [], target);
  return result;
}

// Usage:
// const combos = backtrack([2, 3, 6, 7], 7);
// combos = [[7], [2, 2, 3]] (if allowing reuse)`,
      java: `import java.util.*;

public class Backtracking {
    public static List<List<Integer>> backtrack(int[] candidates, int target) {
        // Find all combinations that sum to target
        List<List<Integer>> result = new ArrayList<>();
        Arrays.sort(candidates); // Sort for duplicate handling
        helper(candidates, target, 0, new ArrayList<>(), result);
        return result;
    }

    private static void helper(int[] candidates, int remaining, int start,
                                List<Integer> path, List<List<Integer>> result) {
        if (remaining == 0) {
            result.add(new ArrayList<>(path));
            return;
        }
        if (remaining < 0) return;

        for (int i = start; i < candidates.length; i++) {
            // Skip duplicates (if array has duplicates)
            if (i > start && candidates[i] == candidates[i - 1]) continue;

            path.add(candidates[i]);
            helper(candidates, remaining - candidates[i], i + 1, path, result);
            path.remove(path.size() - 1); // Backtrack
        }
    }

    // Usage:
    // List<List<Integer>> combos = backtrack(new int[]{2, 3, 6, 7}, 7);
    // combos = [[7], [2, 2, 3]] (if allowing reuse)
}`,
      cpp: `#include <vector>
#include <algorithm>
using namespace std;

void helper(vector<int>& candidates, int remaining, int start,
            vector<int>& path, vector<vector<int>>& result) {
    if (remaining == 0) {
        result.push_back(path);
        return;
    }
    if (remaining < 0) return;

    for (int i = start; i < candidates.size(); i++) {
        // Skip duplicates (if array has duplicates)
        if (i > start && candidates[i] == candidates[i - 1]) continue;

        path.push_back(candidates[i]);
        helper(candidates, remaining - candidates[i], i + 1, path, result);
        path.pop_back(); // Backtrack
    }
}

vector<vector<int>> backtrack(vector<int>& candidates, int target) {
    // Find all combinations that sum to target
    vector<vector<int>> result;
    vector<int> path;
    sort(candidates.begin(), candidates.end()); // Sort for duplicate handling
    helper(candidates, target, 0, path, result);
    return result;
}

// Usage:
// vector<int> candidates = {2, 3, 6, 7};
// auto combos = backtrack(candidates, 7);`,
      go: `package main

import "sort"

func backtrack(candidates []int, target int) [][]int {
    // Find all combinations that sum to target
    result := [][]int{}
    sort.Ints(candidates) // Sort for duplicate handling

    var helper func(start int, path []int, remaining int)
    helper = func(start int, path []int, remaining int) {
        if remaining == 0 {
            temp := make([]int, len(path))
            copy(temp, path)
            result = append(result, temp)
            return
        }
        if remaining < 0 {
            return
        }

        for i := start; i < len(candidates); i++ {
            // Skip duplicates (if array has duplicates)
            if i > start && candidates[i] == candidates[i-1] {
                continue
            }

            path = append(path, candidates[i])
            helper(i+1, path, remaining-candidates[i])
            path = path[:len(path)-1] // Backtrack
        }
    }

    helper(0, []int{}, target)
    return result
}

// Usage:
// combos := backtrack([]int{2, 3, 6, 7}, 7)`,
      rust: `fn backtrack(candidates: &mut Vec<i32>, target: i32) -> Vec<Vec<i32>> {
    // Find all combinations that sum to target
    let mut result = Vec::new();
    candidates.sort(); // Sort for duplicate handling

    fn helper(
        candidates: &[i32],
        remaining: i32,
        start: usize,
        path: &mut Vec<i32>,
        result: &mut Vec<Vec<i32>>,
    ) {
        if remaining == 0 {
            result.push(path.clone());
            return;
        }
        if remaining < 0 {
            return;
        }

        for i in start..candidates.len() {
            // Skip duplicates (if array has duplicates)
            if i > start && candidates[i] == candidates[i - 1] {
                continue;
            }

            path.push(candidates[i]);
            helper(candidates, remaining - candidates[i], i + 1, path, result);
            path.pop(); // Backtrack
        }
    }

    helper(candidates, target, 0, &mut Vec::new(), &mut result);
    result
}

// Usage:
// let mut candidates = vec![2, 3, 6, 7];
// let combos = backtrack(&mut candidates, 7);`,
    },
  },

  // Heap / Priority Queue
  {
    id: 'heap-top-k',
    topic: 'heap',
    name: 'Top K Elements',
    description: 'Find k largest/smallest elements using heap',
    defaultLanguage: 'python',
    codeByLanguage: {
      python: `import heapq

def top_k_largest(nums, k):
    """Find k largest elements using min heap."""
    # Use min heap of size k
    return heapq.nlargest(k, nums)

def top_k_smallest(nums, k):
    """Find k smallest elements using max heap."""
    return heapq.nsmallest(k, nums)

def kth_largest(nums, k):
    """Find kth largest element."""
    # Min heap approach - O(n log k)
    min_heap = []
    for num in nums:
        heapq.heappush(min_heap, num)
        if len(min_heap) > k:
            heapq.heappop(min_heap)
    return min_heap[0]

# Usage:
# result = top_k_largest([3, 1, 5, 12, 2, 11], 3)  # [12, 11, 5]
# result = kth_largest([3, 2, 1, 5, 6, 4], 2)      # 5`,
      javascript: `function topKLargest(nums, k) {
  // Find k largest elements (simple sort approach)
  return [...nums].sort((a, b) => b - a).slice(0, k);
}

function topKSmallest(nums, k) {
  // Find k smallest elements
  return [...nums].sort((a, b) => a - b).slice(0, k);
}

function kthLargest(nums, k) {
  // Find kth largest element
  // Simple approach using sort - O(n log n)
  const sorted = [...nums].sort((a, b) => b - a);
  return sorted[k - 1];
}

// For optimal O(n log k), use a MinHeap class or library
// Usage:
// const result = topKLargest([3, 1, 5, 12, 2, 11], 3); // [12, 11, 5]
// const kth = kthLargest([3, 2, 1, 5, 6, 4], 2);       // 5`,
      typescript: `function topKLargest(nums: number[], k: number): number[] {
  // Find k largest elements (simple sort approach)
  return [...nums].sort((a, b) => b - a).slice(0, k);
}

function topKSmallest(nums: number[], k: number): number[] {
  // Find k smallest elements
  return [...nums].sort((a, b) => a - b).slice(0, k);
}

function kthLargest(nums: number[], k: number): number {
  // Find kth largest element
  // Simple approach using sort - O(n log n)
  const sorted = [...nums].sort((a, b) => b - a);
  return sorted[k - 1];
}

// For optimal O(n log k), use a MinHeap class or library
// Usage:
// const result = topKLargest([3, 1, 5, 12, 2, 11], 3); // [12, 11, 5]
// const kth = kthLargest([3, 2, 1, 5, 6, 4], 2);       // 5`,
      java: `import java.util.*;

public class HeapTopK {
    public static int[] topKLargest(int[] nums, int k) {
        // Find k largest elements using min heap
        PriorityQueue<Integer> minHeap = new PriorityQueue<>();
        for (int num : nums) {
            minHeap.offer(num);
            if (minHeap.size() > k) {
                minHeap.poll();
            }
        }
        int[] result = new int[k];
        for (int i = k - 1; i >= 0; i--) {
            result[i] = minHeap.poll();
        }
        return result;
    }

    public static int[] topKSmallest(int[] nums, int k) {
        // Find k smallest elements using max heap
        PriorityQueue<Integer> maxHeap = new PriorityQueue<>(Collections.reverseOrder());
        for (int num : nums) {
            maxHeap.offer(num);
            if (maxHeap.size() > k) {
                maxHeap.poll();
            }
        }
        int[] result = new int[k];
        for (int i = k - 1; i >= 0; i--) {
            result[i] = maxHeap.poll();
        }
        return result;
    }

    public static int kthLargest(int[] nums, int k) {
        // Find kth largest element - O(n log k)
        PriorityQueue<Integer> minHeap = new PriorityQueue<>();
        for (int num : nums) {
            minHeap.offer(num);
            if (minHeap.size() > k) {
                minHeap.poll();
            }
        }
        return minHeap.peek();
    }

    // Usage:
    // int[] result = topKLargest(new int[]{3, 1, 5, 12, 2, 11}, 3); // [12, 11, 5]
    // int kth = kthLargest(new int[]{3, 2, 1, 5, 6, 4}, 2);         // 5
}`,
      cpp: `#include <vector>
#include <queue>
#include <algorithm>
using namespace std;

vector<int> topKLargest(vector<int>& nums, int k) {
    // Find k largest elements using min heap
    priority_queue<int, vector<int>, greater<int>> minHeap;
    for (int num : nums) {
        minHeap.push(num);
        if (minHeap.size() > k) {
            minHeap.pop();
        }
    }
    vector<int> result;
    while (!minHeap.empty()) {
        result.push_back(minHeap.top());
        minHeap.pop();
    }
    reverse(result.begin(), result.end());
    return result;
}

int kthLargest(vector<int>& nums, int k) {
    // Find kth largest element - O(n log k)
    priority_queue<int, vector<int>, greater<int>> minHeap;
    for (int num : nums) {
        minHeap.push(num);
        if (minHeap.size() > k) {
            minHeap.pop();
        }
    }
    return minHeap.top();
}

// Usage:
// vector<int> nums = {3, 1, 5, 12, 2, 11};
// auto result = topKLargest(nums, 3); // [12, 11, 5]
// int kth = kthLargest(nums, 2);      // 5`,
      go: `package main

import (
    "container/heap"
    "sort"
)

// IntHeap implements heap.Interface for min-heap
type IntHeap []int

func (h IntHeap) Len() int           { return len(h) }
func (h IntHeap) Less(i, j int) bool { return h[i] < h[j] }
func (h IntHeap) Swap(i, j int)      { h[i], h[j] = h[j], h[i] }
func (h *IntHeap) Push(x any)        { *h = append(*h, x.(int)) }
func (h *IntHeap) Pop() any {
    old := *h
    n := len(old)
    x := old[n-1]
    *h = old[0 : n-1]
    return x
}

func topKLargest(nums []int, k int) []int {
    // Find k largest elements using min heap
    h := &IntHeap{}
    heap.Init(h)
    for _, num := range nums {
        heap.Push(h, num)
        if h.Len() > k {
            heap.Pop(h)
        }
    }
    result := make([]int, k)
    for i := k - 1; i >= 0; i-- {
        result[i] = heap.Pop(h).(int)
    }
    return result
}

func kthLargest(nums []int, k int) int {
    // Find kth largest element - O(n log n) sort approach
    sorted := make([]int, len(nums))
    copy(sorted, nums)
    sort.Sort(sort.Reverse(sort.IntSlice(sorted)))
    return sorted[k-1]
}

// Usage:
// result := topKLargest([]int{3, 1, 5, 12, 2, 11}, 3) // [12, 11, 5]
// kth := kthLargest([]int{3, 2, 1, 5, 6, 4}, 2)       // 5`,
      rust: `use std::collections::BinaryHeap;
use std::cmp::Reverse;

fn top_k_largest(nums: &[i32], k: usize) -> Vec<i32> {
    // Find k largest elements using min heap
    let mut min_heap = BinaryHeap::new();
    for &num in nums {
        min_heap.push(Reverse(num));
        if min_heap.len() > k {
            min_heap.pop();
        }
    }
    let mut result: Vec<i32> = min_heap.into_iter().map(|Reverse(x)| x).collect();
    result.sort_by(|a, b| b.cmp(a));
    result
}

fn kth_largest(nums: &[i32], k: usize) -> i32 {
    // Find kth largest element - O(n log n) sort approach
    let mut sorted = nums.to_vec();
    sorted.sort_by(|a, b| b.cmp(a));
    sorted[k - 1]
}

// Usage:
// let result = top_k_largest(&[3, 1, 5, 12, 2, 11], 3); // [12, 11, 5]
// let kth = kth_largest(&[3, 2, 1, 5, 6, 4], 2);        // 5`,
    },
  },

  // Graphs
  {
    id: 'graph-bfs',
    topic: 'graphs',
    name: 'Graph BFS',
    description: 'Breadth-first search for shortest path in unweighted graph',
    defaultLanguage: 'python',
    codeByLanguage: {
      python: `from collections import deque

def bfs_shortest_path(graph, start, end):
    """Find shortest path using BFS."""
    if start == end:
        return [start]
    
    visited = {start}
    queue = deque([(start, [start])])
    
    while queue:
        node, path = queue.popleft()
        
        for neighbor in graph.get(node, []):
            if neighbor == end:
                return path + [neighbor]
            
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append((neighbor, path + [neighbor]))
    
    return []  # No path found

# Usage:
# graph = {'A': ['B', 'C'], 'B': ['D'], 'C': ['D'], 'D': []}
# path = bfs_shortest_path(graph, 'A', 'D')  # ['A', 'B', 'D']`,
      javascript: `function bfsShortestPath(graph, start, end) {
  // Find shortest path using BFS
  if (start === end) return [start];

  const visited = new Set([start]);
  const queue = [[start, [start]]];

  while (queue.length) {
    const [node, path] = queue.shift();

    for (const neighbor of graph[node] || []) {
      if (neighbor === end) {
        return [...path, neighbor];
      }

      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push([neighbor, [...path, neighbor]]);
      }
    }
  }

  return []; // No path found
}

// Usage:
// const graph = { A: ['B', 'C'], B: ['D'], C: ['D'], D: [] };
// const path = bfsShortestPath(graph, 'A', 'D'); // ['A', 'B', 'D']`,
      typescript: `type Graph<T extends string> = Record<T, T[]>;

function bfsShortestPath<T extends string>(graph: Graph<T>, start: T, end: T): T[] {
  // Find shortest path using BFS
  if (start === end) return [start];

  const visited = new Set<T>([start]);
  const queue: [T, T[]][] = [[start, [start]]];

  while (queue.length) {
    const [node, path] = queue.shift()!;

    for (const neighbor of graph[node] || []) {
      if (neighbor === end) {
        return [...path, neighbor];
      }

      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push([neighbor, [...path, neighbor]]);
      }
    }
  }

  return []; // No path found
}

// Usage:
// const graph = { A: ['B', 'C'], B: ['D'], C: ['D'], D: [] };
// const path = bfsShortestPath(graph, 'A', 'D'); // ['A', 'B', 'D']`,
      java: `import java.util.*;

public class GraphBFS {
    public static List<String> bfsShortestPath(Map<String, List<String>> graph, String start, String end) {
        // Find shortest path using BFS
        if (start.equals(end)) return Arrays.asList(start);

        Set<String> visited = new HashSet<>();
        visited.add(start);
        Queue<List<String>> queue = new LinkedList<>();
        queue.offer(Arrays.asList(start));

        while (!queue.isEmpty()) {
            List<String> path = queue.poll();
            String node = path.get(path.size() - 1);

            for (String neighbor : graph.getOrDefault(node, Collections.emptyList())) {
                if (neighbor.equals(end)) {
                    List<String> newPath = new ArrayList<>(path);
                    newPath.add(neighbor);
                    return newPath;
                }

                if (!visited.contains(neighbor)) {
                    visited.add(neighbor);
                    List<String> newPath = new ArrayList<>(path);
                    newPath.add(neighbor);
                    queue.offer(newPath);
                }
            }
        }

        return Collections.emptyList(); // No path found
    }

    // Usage:
    // Map<String, List<String>> graph = Map.of("A", List.of("B", "C"), ...);
    // List<String> path = bfsShortestPath(graph, "A", "D"); // ["A", "B", "D"]
}`,
      cpp: `#include <unordered_map>
#include <unordered_set>
#include <vector>
#include <queue>
#include <string>
using namespace std;

vector<string> bfsShortestPath(unordered_map<string, vector<string>>& graph, 
                                string start, string end) {
    // Find shortest path using BFS
    if (start == end) return {start};

    unordered_set<string> visited;
    visited.insert(start);
    queue<vector<string>> q;
    q.push({start});

    while (!q.empty()) {
        vector<string> path = q.front();
        q.pop();
        string node = path.back();

        for (const string& neighbor : graph[node]) {
            if (neighbor == end) {
                path.push_back(neighbor);
                return path;
            }

            if (visited.find(neighbor) == visited.end()) {
                visited.insert(neighbor);
                vector<string> newPath = path;
                newPath.push_back(neighbor);
                q.push(newPath);
            }
        }
    }

    return {}; // No path found
}

// Usage:
// unordered_map<string, vector<string>> graph = {{"A", {"B", "C"}}, ...};
// auto path = bfsShortestPath(graph, "A", "D"); // ["A", "B", "D"]`,
      go: `package main

func bfsShortestPath(graph map[string][]string, start, end string) []string {
    // Find shortest path using BFS
    if start == end {
        return []string{start}
    }

    visited := map[string]bool{start: true}
    queue := [][]string{{start}}

    for len(queue) > 0 {
        path := queue[0]
        queue = queue[1:]
        node := path[len(path)-1]

        for _, neighbor := range graph[node] {
            if neighbor == end {
                return append(path, neighbor)
            }

            if !visited[neighbor] {
                visited[neighbor] = true
                newPath := make([]string, len(path))
                copy(newPath, path)
                newPath = append(newPath, neighbor)
                queue = append(queue, newPath)
            }
        }
    }

    return []string{} // No path found
}

// Usage:
// graph := map[string][]string{"A": {"B", "C"}, "B": {"D"}, "C": {"D"}, "D": {}}
// path := bfsShortestPath(graph, "A", "D") // ["A", "B", "D"]`,
      rust: `use std::collections::{HashMap, HashSet, VecDeque};

fn bfs_shortest_path(
    graph: &HashMap<String, Vec<String>>,
    start: &str,
    end: &str,
) -> Vec<String> {
    // Find shortest path using BFS
    if start == end {
        return vec![start.to_string()];
    }

    let mut visited = HashSet::new();
    visited.insert(start.to_string());
    let mut queue = VecDeque::new();
    queue.push_back(vec![start.to_string()]);

    while let Some(path) = queue.pop_front() {
        let node = path.last().unwrap();

        if let Some(neighbors) = graph.get(node) {
            for neighbor in neighbors {
                if neighbor == end {
                    let mut new_path = path.clone();
                    new_path.push(neighbor.clone());
                    return new_path;
                }

                if !visited.contains(neighbor) {
                    visited.insert(neighbor.clone());
                    let mut new_path = path.clone();
                    new_path.push(neighbor.clone());
                    queue.push_back(new_path);
                }
            }
        }
    }

    Vec::new() // No path found
}

// Usage:
// let graph = HashMap::from([("A".into(), vec!["B".into(), "C".into()]), ...]);
// let path = bfs_shortest_path(&graph, "A", "D"); // ["A", "B", "D"]`,
    },
  },
  {
    id: 'graph-dfs',
    topic: 'graphs',
    name: 'Graph DFS',
    description: 'Depth-first search for path finding and cycle detection',
    defaultLanguage: 'python',
    codeByLanguage: {
      python: `def dfs_path(graph, start, end, visited=None):
    """Find any path using DFS."""
    if visited is None:
        visited = set()
    
    if start == end:
        return [start]
    
    visited.add(start)
    
    for neighbor in graph.get(start, []):
        if neighbor not in visited:
            path = dfs_path(graph, neighbor, end, visited)
            if path:
                return [start] + path
    
    return []

def has_cycle(graph):
    """Detect cycle in directed graph."""
    WHITE, GRAY, BLACK = 0, 1, 2
    color = {node: WHITE for node in graph}
    
    def dfs(node):
        color[node] = GRAY
        for neighbor in graph.get(node, []):
            if color[neighbor] == GRAY:
                return True
            if color[neighbor] == WHITE and dfs(neighbor):
                return True
        color[node] = BLACK
        return False
    
    return any(color[node] == WHITE and dfs(node) for node in graph)

# Usage:
# path = dfs_path(graph, 'A', 'D')
# has_cycle({'A': ['B'], 'B': ['C'], 'C': ['A']})  # True`,
      javascript: `function dfsPath(graph, start, end, visited = new Set()) {
  // Find any path using DFS
  if (start === end) return [start];

  visited.add(start);

  for (const neighbor of graph[start] || []) {
    if (!visited.has(neighbor)) {
      const path = dfsPath(graph, neighbor, end, visited);
      if (path.length) {
        return [start, ...path];
      }
    }
  }

  return [];
}

function hasCycle(graph) {
  // Detect cycle in directed graph
  const WHITE = 0, GRAY = 1, BLACK = 2;
  const color = {};
  for (const node of Object.keys(graph)) {
    color[node] = WHITE;
  }

  function dfs(node) {
    color[node] = GRAY;
    for (const neighbor of graph[node] || []) {
      if (color[neighbor] === GRAY) return true;
      if (color[neighbor] === WHITE && dfs(neighbor)) return true;
    }
    color[node] = BLACK;
    return false;
  }

  return Object.keys(graph).some(node => 
    color[node] === WHITE && dfs(node)
  );
}

// Usage:
// const path = dfsPath(graph, 'A', 'D');
// hasCycle({ A: ['B'], B: ['C'], C: ['A'] }); // true`,
      typescript: `type Graph<T extends string> = Record<T, T[]>;

function dfsPath<T extends string>(
  graph: Graph<T>,
  start: T,
  end: T,
  visited: Set<T> = new Set()
): T[] {
  // Find any path using DFS
  if (start === end) return [start];

  visited.add(start);

  for (const neighbor of graph[start] || []) {
    if (!visited.has(neighbor)) {
      const path = dfsPath(graph, neighbor, end, visited);
      if (path.length) {
        return [start, ...path];
      }
    }
  }

  return [];
}

function hasCycle<T extends string>(graph: Graph<T>): boolean {
  // Detect cycle in directed graph
  const WHITE = 0, GRAY = 1, BLACK = 2;
  const color: Record<T, number> = {} as Record<T, number>;
  for (const node of Object.keys(graph) as T[]) {
    color[node] = WHITE;
  }

  function dfs(node: T): boolean {
    color[node] = GRAY;
    for (const neighbor of graph[node] || []) {
      if (color[neighbor] === GRAY) return true;
      if (color[neighbor] === WHITE && dfs(neighbor)) return true;
    }
    color[node] = BLACK;
    return false;
  }

  return (Object.keys(graph) as T[]).some(
    (node) => color[node] === WHITE && dfs(node)
  );
}

// Usage:
// const path = dfsPath(graph, 'A', 'D');
// hasCycle({ A: ['B'], B: ['C'], C: ['A'] }); // true`,
      java: `import java.util.*;

public class GraphDFS {
    public static List<String> dfsPath(Map<String, List<String>> graph, String start, String end, Set<String> visited) {
        // Find any path using DFS
        if (visited == null) visited = new HashSet<>();
        if (start.equals(end)) return new ArrayList<>(Arrays.asList(start));

        visited.add(start);

        for (String neighbor : graph.getOrDefault(start, Collections.emptyList())) {
            if (!visited.contains(neighbor)) {
                List<String> path = dfsPath(graph, neighbor, end, visited);
                if (!path.isEmpty()) {
                    List<String> result = new ArrayList<>();
                    result.add(start);
                    result.addAll(path);
                    return result;
                }
            }
        }

        return Collections.emptyList();
    }

    public static boolean hasCycle(Map<String, List<String>> graph) {
        // Detect cycle in directed graph
        final int WHITE = 0, GRAY = 1, BLACK = 2;
        Map<String, Integer> color = new HashMap<>();
        for (String node : graph.keySet()) {
            color.put(node, WHITE);
        }

        for (String node : graph.keySet()) {
            if (color.get(node) == WHITE && dfs(graph, node, color, WHITE, GRAY, BLACK)) {
                return true;
            }
        }
        return false;
    }

    private static boolean dfs(Map<String, List<String>> graph, String node, 
                                Map<String, Integer> color, int WHITE, int GRAY, int BLACK) {
        color.put(node, GRAY);
        for (String neighbor : graph.getOrDefault(node, Collections.emptyList())) {
            if (color.get(neighbor) == GRAY) return true;
            if (color.get(neighbor) == WHITE && dfs(graph, neighbor, color, WHITE, GRAY, BLACK)) return true;
        }
        color.put(node, BLACK);
        return false;
    }

    // Usage:
    // List<String> path = dfsPath(graph, "A", "D", null);
    // hasCycle(Map.of("A", List.of("B"), "B", List.of("C"), "C", List.of("A"))); // true
}`,
      cpp: `#include <unordered_map>
#include <unordered_set>
#include <vector>
#include <string>
using namespace std;

vector<string> dfsPath(unordered_map<string, vector<string>>& graph, 
                        string start, string end, unordered_set<string>& visited) {
    // Find any path using DFS
    if (start == end) return {start};

    visited.insert(start);

    for (const string& neighbor : graph[start]) {
        if (visited.find(neighbor) == visited.end()) {
            auto path = dfsPath(graph, neighbor, end, visited);
            if (!path.empty()) {
                path.insert(path.begin(), start);
                return path;
            }
        }
    }

    return {};
}

bool dfs(unordered_map<string, vector<string>>& graph, string node,
         unordered_map<string, int>& color) {
    const int WHITE = 0, GRAY = 1, BLACK = 2;
    color[node] = GRAY;
    for (const string& neighbor : graph[node]) {
        if (color[neighbor] == GRAY) return true;
        if (color[neighbor] == WHITE && dfs(graph, neighbor, color)) return true;
    }
    color[node] = BLACK;
    return false;
}

bool hasCycle(unordered_map<string, vector<string>>& graph) {
    // Detect cycle in directed graph
    const int WHITE = 0;
    unordered_map<string, int> color;
    for (auto& [node, _] : graph) {
        color[node] = WHITE;
    }

    for (auto& [node, _] : graph) {
        if (color[node] == WHITE && dfs(graph, node, color)) {
            return true;
        }
    }
    return false;
}

// Usage:
// unordered_set<string> visited;
// auto path = dfsPath(graph, "A", "D", visited);`,
      go: `package main

func dfsPath(graph map[string][]string, start, end string, visited map[string]bool) []string {
    // Find any path using DFS
    if start == end {
        return []string{start}
    }

    visited[start] = true

    for _, neighbor := range graph[start] {
        if !visited[neighbor] {
            path := dfsPath(graph, neighbor, end, visited)
            if len(path) > 0 {
                return append([]string{start}, path...)
            }
        }
    }

    return []string{}
}

func hasCycle(graph map[string][]string) bool {
    // Detect cycle in directed graph
    const (
        WHITE = 0
        GRAY  = 1
        BLACK = 2
    )
    color := make(map[string]int)
    for node := range graph {
        color[node] = WHITE
    }

    var dfs func(node string) bool
    dfs = func(node string) bool {
        color[node] = GRAY
        for _, neighbor := range graph[node] {
            if color[neighbor] == GRAY {
                return true
            }
            if color[neighbor] == WHITE && dfs(neighbor) {
                return true
            }
        }
        color[node] = BLACK
        return false
    }

    for node := range graph {
        if color[node] == WHITE && dfs(node) {
            return true
        }
    }
    return false
}

// Usage:
// visited := make(map[string]bool)
// path := dfsPath(graph, "A", "D", visited)
// hasCycle(map[string][]string{"A": {"B"}, "B": {"C"}, "C": {"A"}}) // true`,
      rust: `use std::collections::{HashMap, HashSet};

fn dfs_path(
    graph: &HashMap<String, Vec<String>>,
    start: &str,
    end: &str,
    visited: &mut HashSet<String>,
) -> Vec<String> {
    // Find any path using DFS
    if start == end {
        return vec![start.to_string()];
    }

    visited.insert(start.to_string());

    if let Some(neighbors) = graph.get(start) {
        for neighbor in neighbors {
            if !visited.contains(neighbor) {
                let mut path = dfs_path(graph, neighbor, end, visited);
                if !path.is_empty() {
                    path.insert(0, start.to_string());
                    return path;
                }
            }
        }
    }

    vec![]
}

fn has_cycle(graph: &HashMap<String, Vec<String>>) -> bool {
    // Detect cycle in directed graph
    const WHITE: i32 = 0;
    const GRAY: i32 = 1;
    const BLACK: i32 = 2;

    let mut color: HashMap<&str, i32> = HashMap::new();
    for node in graph.keys() {
        color.insert(node, WHITE);
    }

    fn dfs<'a>(
        graph: &'a HashMap<String, Vec<String>>,
        node: &'a str,
        color: &mut HashMap<&'a str, i32>,
    ) -> bool {
        color.insert(node, GRAY);
        if let Some(neighbors) = graph.get(node) {
            for neighbor in neighbors {
                if color.get(neighbor.as_str()) == Some(&GRAY) {
                    return true;
                }
                if color.get(neighbor.as_str()) == Some(&WHITE) 
                    && dfs(graph, neighbor, color) {
                    return true;
                }
            }
        }
        color.insert(node, BLACK);
        false
    }

    for node in graph.keys() {
        if color.get(node.as_str()) == Some(&WHITE) && dfs(graph, node, &mut color) {
            return true;
        }
    }
    false
}

// Usage:
// let mut visited = HashSet::new();
// let path = dfs_path(&graph, "A", "D", &mut visited);
// has_cycle(&graph); // true if cycle exists`,
    },
  },

  // Dynamic Programming
  {
    id: 'dp-memoization',
    topic: 'dynamic-programming',
    name: 'DP with Memoization',
    description: 'Top-down dynamic programming with caching',
    defaultLanguage: 'python',
    codeByLanguage: {
      python: `from functools import lru_cache

@lru_cache(maxsize=None)
def fibonacci(n):
    """Calculate nth Fibonacci number with memoization."""
    if n <= 1:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)

def climb_stairs(n):
    """Count ways to climb n stairs (1 or 2 steps at a time)."""
    memo = {}
    
    def helper(remaining):
        if remaining in memo:
            return memo[remaining]
        if remaining <= 1:
            return 1
        
        memo[remaining] = helper(remaining - 1) + helper(remaining - 2)
        return memo[remaining]
    
    return helper(n)

# Usage:
# fib = fibonacci(10)  # 55
# ways = climb_stairs(5)  # 8`,
      javascript: `function fibonacci(n, memo = {}) {
  // Calculate nth Fibonacci number with memoization
  if (n in memo) return memo[n];
  if (n <= 1) return n;

  memo[n] = fibonacci(n - 1, memo) + fibonacci(n - 2, memo);
  return memo[n];
}

function climbStairs(n) {
  // Count ways to climb n stairs (1 or 2 steps at a time)
  const memo = {};

  function helper(remaining) {
    if (remaining in memo) return memo[remaining];
    if (remaining <= 1) return 1;

    memo[remaining] = helper(remaining - 1) + helper(remaining - 2);
    return memo[remaining];
  }

  return helper(n);
}

// Usage:
// const fib = fibonacci(10); // 55
// const ways = climbStairs(5); // 8`,
      typescript: `function fibonacci(n: number, memo: Record<number, number> = {}): number {
  // Calculate nth Fibonacci number with memoization
  if (n in memo) return memo[n];
  if (n <= 1) return n;

  memo[n] = fibonacci(n - 1, memo) + fibonacci(n - 2, memo);
  return memo[n];
}

function climbStairs(n: number): number {
  // Count ways to climb n stairs (1 or 2 steps at a time)
  const memo: Record<number, number> = {};

  function helper(remaining: number): number {
    if (remaining in memo) return memo[remaining];
    if (remaining <= 1) return 1;

    memo[remaining] = helper(remaining - 1) + helper(remaining - 2);
    return memo[remaining];
  }

  return helper(n);
}

// Usage:
// const fib = fibonacci(10); // 55
// const ways = climbStairs(5); // 8`,
      java: `import java.util.*;

public class DPMemoization {
    private static Map<Integer, Long> memo = new HashMap<>();

    public static long fibonacci(int n) {
        // Calculate nth Fibonacci number with memoization
        if (memo.containsKey(n)) return memo.get(n);
        if (n <= 1) return n;

        long result = fibonacci(n - 1) + fibonacci(n - 2);
        memo.put(n, result);
        return result;
    }

    public static int climbStairs(int n) {
        // Count ways to climb n stairs (1 or 2 steps at a time)
        Map<Integer, Integer> memo = new HashMap<>();
        return helper(n, memo);
    }

    private static int helper(int remaining, Map<Integer, Integer> memo) {
        if (memo.containsKey(remaining)) return memo.get(remaining);
        if (remaining <= 1) return 1;

        int result = helper(remaining - 1, memo) + helper(remaining - 2, memo);
        memo.put(remaining, result);
        return result;
    }

    // Usage:
    // long fib = fibonacci(10); // 55
    // int ways = climbStairs(5); // 8
}`,
      cpp: `#include <unordered_map>
using namespace std;

unordered_map<int, long long> memo;

long long fibonacci(int n) {
    // Calculate nth Fibonacci number with memoization
    if (memo.count(n)) return memo[n];
    if (n <= 1) return n;

    memo[n] = fibonacci(n - 1) + fibonacci(n - 2);
    return memo[n];
}

int climbStairs(int n) {
    // Count ways to climb n stairs (1 or 2 steps at a time)
    unordered_map<int, int> memo;

    function<int(int)> helper = [&](int remaining) -> int {
        if (memo.count(remaining)) return memo[remaining];
        if (remaining <= 1) return 1;

        memo[remaining] = helper(remaining - 1) + helper(remaining - 2);
        return memo[remaining];
    };

    return helper(n);
}

// Usage:
// long long fib = fibonacci(10); // 55
// int ways = climbStairs(5);     // 8`,
      go: `package main

func fibonacci(n int, memo map[int]int) int {
    // Calculate nth Fibonacci number with memoization
    if memo == nil {
        memo = make(map[int]int)
    }
    if val, ok := memo[n]; ok {
        return val
    }
    if n <= 1 {
        return n
    }

    memo[n] = fibonacci(n-1, memo) + fibonacci(n-2, memo)
    return memo[n]
}

func climbStairs(n int) int {
    // Count ways to climb n stairs (1 or 2 steps at a time)
    memo := make(map[int]int)

    var helper func(remaining int) int
    helper = func(remaining int) int {
        if val, ok := memo[remaining]; ok {
            return val
        }
        if remaining <= 1 {
            return 1
        }

        memo[remaining] = helper(remaining-1) + helper(remaining-2)
        return memo[remaining]
    }

    return helper(n)
}

// Usage:
// fib := fibonacci(10, nil) // 55
// ways := climbStairs(5)    // 8`,
      rust: `use std::collections::HashMap;

fn fibonacci(n: i32, memo: &mut HashMap<i32, i64>) -> i64 {
    // Calculate nth Fibonacci number with memoization
    if let Some(&val) = memo.get(&n) {
        return val;
    }
    if n <= 1 {
        return n as i64;
    }

    let result = fibonacci(n - 1, memo) + fibonacci(n - 2, memo);
    memo.insert(n, result);
    result
}

fn climb_stairs(n: i32) -> i32 {
    // Count ways to climb n stairs (1 or 2 steps at a time)
    let mut memo: HashMap<i32, i32> = HashMap::new();

    fn helper(remaining: i32, memo: &mut HashMap<i32, i32>) -> i32 {
        if let Some(&val) = memo.get(&remaining) {
            return val;
        }
        if remaining <= 1 {
            return 1;
        }

        let result = helper(remaining - 1, memo) + helper(remaining - 2, memo);
        memo.insert(remaining, result);
        result
    }

    helper(n, &mut memo)
}

// Usage:
// let mut memo = HashMap::new();
// let fib = fibonacci(10, &mut memo); // 55
// let ways = climb_stairs(5); // 8`,
    },
  },
  {
    id: 'dp-tabulation',
    topic: 'dynamic-programming',
    name: 'DP with Tabulation',
    description: 'Bottom-up dynamic programming with table',
    defaultLanguage: 'python',
    codeByLanguage: {
      python: `def coin_change(coins, amount):
    """Find minimum coins needed for amount."""
    dp = [float('inf')] * (amount + 1)
    dp[0] = 0
    
    for i in range(1, amount + 1):
        for coin in coins:
            if coin <= i and dp[i - coin] + 1 < dp[i]:
                dp[i] = dp[i - coin] + 1
    
    return dp[amount] if dp[amount] != float('inf') else -1

def longest_common_subsequence(text1, text2):
    """Find length of longest common subsequence."""
    m, n = len(text1), len(text2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if text1[i-1] == text2[j-1]:
                dp[i][j] = dp[i-1][j-1] + 1
            else:
                dp[i][j] = max(dp[i-1][j], dp[i][j-1])
    
    return dp[m][n]

# Usage:
# min_coins = coin_change([1, 2, 5], 11)  # 3 (5+5+1)
# lcs = longest_common_subsequence("abcde", "ace")  # 3`,
      javascript: `function coinChange(coins, amount) {
  // Find minimum coins needed for amount
  const dp = new Array(amount + 1).fill(Infinity);
  dp[0] = 0;

  for (let i = 1; i <= amount; i++) {
    for (const coin of coins) {
      if (coin <= i && dp[i - coin] + 1 < dp[i]) {
        dp[i] = dp[i - coin] + 1;
      }
    }
  }

  return dp[amount] === Infinity ? -1 : dp[amount];
}

function longestCommonSubsequence(text1, text2) {
  // Find length of longest common subsequence
  const m = text1.length;
  const n = text2.length;
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (text1[i - 1] === text2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  return dp[m][n];
}

// Usage:
// const minCoins = coinChange([1, 2, 5], 11); // 3 (5+5+1)
// const lcs = longestCommonSubsequence('abcde', 'ace'); // 3`,
      typescript: `function coinChange(coins: number[], amount: number): number {
  // Find minimum coins needed for amount
  const dp: number[] = new Array(amount + 1).fill(Infinity);
  dp[0] = 0;

  for (let i = 1; i <= amount; i++) {
    for (const coin of coins) {
      if (coin <= i && dp[i - coin] + 1 < dp[i]) {
        dp[i] = dp[i - coin] + 1;
      }
    }
  }

  return dp[amount] === Infinity ? -1 : dp[amount];
}

function longestCommonSubsequence(text1: string, text2: string): number {
  // Find length of longest common subsequence
  const m = text1.length;
  const n = text2.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () =>
    new Array(n + 1).fill(0)
  );

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (text1[i - 1] === text2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  return dp[m][n];
}

// Usage:
// const minCoins = coinChange([1, 2, 5], 11); // 3 (5+5+1)
// const lcs = longestCommonSubsequence('abcde', 'ace'); // 3`,
      java: `public class DPTabulation {
    public static int coinChange(int[] coins, int amount) {
        // Find minimum coins needed for amount
        int[] dp = new int[amount + 1];
        Arrays.fill(dp, Integer.MAX_VALUE);
        dp[0] = 0;

        for (int i = 1; i <= amount; i++) {
            for (int coin : coins) {
                if (coin <= i && dp[i - coin] != Integer.MAX_VALUE && dp[i - coin] + 1 < dp[i]) {
                    dp[i] = dp[i - coin] + 1;
                }
            }
        }

        return dp[amount] == Integer.MAX_VALUE ? -1 : dp[amount];
    }

    public static int longestCommonSubsequence(String text1, String text2) {
        // Find length of longest common subsequence
        int m = text1.length();
        int n = text2.length();
        int[][] dp = new int[m + 1][n + 1];

        for (int i = 1; i <= m; i++) {
            for (int j = 1; j <= n; j++) {
                if (text1.charAt(i - 1) == text2.charAt(j - 1)) {
                    dp[i][j] = dp[i - 1][j - 1] + 1;
                } else {
                    dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
                }
            }
        }

        return dp[m][n];
    }

    // Usage:
    // int minCoins = coinChange(new int[]{1, 2, 5}, 11); // 3 (5+5+1)
    // int lcs = longestCommonSubsequence("abcde", "ace"); // 3
}`,
      cpp: `#include <vector>
#include <string>
#include <algorithm>
#include <climits>
using namespace std;

int coinChange(vector<int>& coins, int amount) {
    // Find minimum coins needed for amount
    vector<int> dp(amount + 1, INT_MAX);
    dp[0] = 0;

    for (int i = 1; i <= amount; i++) {
        for (int coin : coins) {
            if (coin <= i && dp[i - coin] != INT_MAX && dp[i - coin] + 1 < dp[i]) {
                dp[i] = dp[i - coin] + 1;
            }
        }
    }

    return dp[amount] == INT_MAX ? -1 : dp[amount];
}

int longestCommonSubsequence(string text1, string text2) {
    // Find length of longest common subsequence
    int m = text1.size();
    int n = text2.size();
    vector<vector<int>> dp(m + 1, vector<int>(n + 1, 0));

    for (int i = 1; i <= m; i++) {
        for (int j = 1; j <= n; j++) {
            if (text1[i - 1] == text2[j - 1]) {
                dp[i][j] = dp[i - 1][j - 1] + 1;
            } else {
                dp[i][j] = max(dp[i - 1][j], dp[i][j - 1]);
            }
        }
    }

    return dp[m][n];
}

// Usage:
// vector<int> coins = {1, 2, 5};
// int minCoins = coinChange(coins, 11); // 3 (5+5+1)
// int lcs = longestCommonSubsequence("abcde", "ace"); // 3`,
      go: `package main

import (
    "math"
    "sort"
)

func coinChange(coins []int, amount int) int {
    // Find minimum coins needed for amount
    dp := make([]int, amount+1)
    for i := range dp {
        dp[i] = math.MaxInt32
    }
    dp[0] = 0

    for i := 1; i <= amount; i++ {
        for _, coin := range coins {
            if coin <= i && dp[i-coin] != math.MaxInt32 && dp[i-coin]+1 < dp[i] {
                dp[i] = dp[i-coin] + 1
            }
        }
    }

    if dp[amount] == math.MaxInt32 {
        return -1
    }
    return dp[amount]
}

func longestCommonSubsequence(text1, text2 string) int {
    // Find length of longest common subsequence
    m, n := len(text1), len(text2)
    dp := make([][]int, m+1)
    for i := range dp {
        dp[i] = make([]int, n+1)
    }

    for i := 1; i <= m; i++ {
        for j := 1; j <= n; j++ {
            if text1[i-1] == text2[j-1] {
                dp[i][j] = dp[i-1][j-1] + 1
            } else {
                dp[i][j] = max(dp[i-1][j], dp[i][j-1])
            }
        }
    }

    return dp[m][n]
}

func max(a, b int) int {
    if a > b {
        return a
    }
    return b
}

// Usage:
// minCoins := coinChange([]int{1, 2, 5}, 11) // 3 (5+5+1)
// lcs := longestCommonSubsequence("abcde", "ace") // 3`,
      rust: `fn coin_change(coins: &[i32], amount: i32) -> i32 {
    // Find minimum coins needed for amount
    let amount = amount as usize;
    let mut dp = vec![i32::MAX; amount + 1];
    dp[0] = 0;

    for i in 1..=amount {
        for &coin in coins {
            let coin = coin as usize;
            if coin <= i && dp[i - coin] != i32::MAX && dp[i - coin] + 1 < dp[i] {
                dp[i] = dp[i - coin] + 1;
            }
        }
    }

    if dp[amount] == i32::MAX { -1 } else { dp[amount] }
}

fn longest_common_subsequence(text1: &str, text2: &str) -> i32 {
    // Find length of longest common subsequence
    let chars1: Vec<char> = text1.chars().collect();
    let chars2: Vec<char> = text2.chars().collect();
    let m = chars1.len();
    let n = chars2.len();
    let mut dp = vec![vec![0; n + 1]; m + 1];

    for i in 1..=m {
        for j in 1..=n {
            if chars1[i - 1] == chars2[j - 1] {
                dp[i][j] = dp[i - 1][j - 1] + 1;
            } else {
                dp[i][j] = dp[i - 1][j].max(dp[i][j - 1]);
            }
        }
    }

    dp[m][n]
}

// Usage:
// let min_coins = coin_change(&[1, 2, 5], 11); // 3 (5+5+1)
// let lcs = longest_common_subsequence("abcde", "ace"); // 3`,
    },
  },

  // Greedy
  {
    id: 'greedy-interval',
    topic: 'greedy',
    name: 'Greedy Interval Scheduling',
    description: 'Select maximum non-overlapping intervals',
    defaultLanguage: 'python',
    codeByLanguage: {
      python: `def max_non_overlapping(intervals):
    """Find maximum number of non-overlapping intervals."""
    if not intervals:
        return 0
    
    # Sort by end time
    intervals.sort(key=lambda x: x[1])
    
    count = 1
    end = intervals[0][1]
    
    for i in range(1, len(intervals)):
        if intervals[i][0] >= end:  # No overlap
            count += 1
            end = intervals[i][1]
    
    return count

def min_meeting_rooms(intervals):
    """Find minimum meeting rooms needed."""
    if not intervals:
        return 0
    
    starts = sorted(i[0] for i in intervals)
    ends = sorted(i[1] for i in intervals)
    
    rooms = max_rooms = 0
    s = e = 0
    
    while s < len(intervals):
        if starts[s] < ends[e]:
            rooms += 1
            max_rooms = max(max_rooms, rooms)
            s += 1
        else:
            rooms -= 1
            e += 1
    
    return max_rooms

# Usage:
# count = max_non_overlapping([[1,3], [2,4], [3,5]])  # 2
# rooms = min_meeting_rooms([[0,30], [5,10], [15,20]])  # 2`,
      javascript: `function maxNonOverlapping(intervals) {
  // Find maximum number of non-overlapping intervals
  if (!intervals.length) return 0;

  // Sort by end time
  intervals.sort((a, b) => a[1] - b[1]);

  let count = 1;
  let end = intervals[0][1];

  for (let i = 1; i < intervals.length; i++) {
    if (intervals[i][0] >= end) {
      // No overlap
      count++;
      end = intervals[i][1];
    }
  }

  return count;
}

function minMeetingRooms(intervals) {
  // Find minimum meeting rooms needed
  if (!intervals.length) return 0;

  const starts = intervals.map(i => i[0]).sort((a, b) => a - b);
  const ends = intervals.map(i => i[1]).sort((a, b) => a - b);

  let rooms = 0, maxRooms = 0;
  let s = 0, e = 0;

  while (s < intervals.length) {
    if (starts[s] < ends[e]) {
      rooms++;
      maxRooms = Math.max(maxRooms, rooms);
      s++;
    } else {
      rooms--;
      e++;
    }
  }

  return maxRooms;
}

// Usage:
// const count = maxNonOverlapping([[1,3], [2,4], [3,5]]); // 2
// const rooms = minMeetingRooms([[0,30], [5,10], [15,20]]); // 2`,
      typescript: `type Interval = [number, number];

function maxNonOverlapping(intervals: Interval[]): number {
  // Find maximum number of non-overlapping intervals
  if (!intervals.length) return 0;

  // Sort by end time
  intervals.sort((a, b) => a[1] - b[1]);

  let count = 1;
  let end = intervals[0][1];

  for (let i = 1; i < intervals.length; i++) {
    if (intervals[i][0] >= end) {
      // No overlap
      count++;
      end = intervals[i][1];
    }
  }

  return count;
}

function minMeetingRooms(intervals: Interval[]): number {
  // Find minimum meeting rooms needed
  if (!intervals.length) return 0;

  const starts = intervals.map((i) => i[0]).sort((a, b) => a - b);
  const ends = intervals.map((i) => i[1]).sort((a, b) => a - b);

  let rooms = 0,
    maxRooms = 0;
  let s = 0,
    e = 0;

  while (s < intervals.length) {
    if (starts[s] < ends[e]) {
      rooms++;
      maxRooms = Math.max(maxRooms, rooms);
      s++;
    } else {
      rooms--;
      e++;
    }
  }

  return maxRooms;
}

// Usage:
// const count = maxNonOverlapping([[1,3], [2,4], [3,5]]); // 2
// const rooms = minMeetingRooms([[0,30], [5,10], [15,20]]); // 2`,
      java: `import java.util.*;

public class GreedyInterval {
    public static int maxNonOverlapping(int[][] intervals) {
        // Find maximum number of non-overlapping intervals
        if (intervals.length == 0) return 0;

        // Sort by end time
        Arrays.sort(intervals, (a, b) -> a[1] - b[1]);

        int count = 1;
        int end = intervals[0][1];

        for (int i = 1; i < intervals.length; i++) {
            if (intervals[i][0] >= end) {
                // No overlap
                count++;
                end = intervals[i][1];
            }
        }

        return count;
    }

    public static int minMeetingRooms(int[][] intervals) {
        // Find minimum meeting rooms needed
        if (intervals.length == 0) return 0;

        int[] starts = new int[intervals.length];
        int[] ends = new int[intervals.length];
        for (int i = 0; i < intervals.length; i++) {
            starts[i] = intervals[i][0];
            ends[i] = intervals[i][1];
        }
        Arrays.sort(starts);
        Arrays.sort(ends);

        int rooms = 0, maxRooms = 0;
        int s = 0, e = 0;

        while (s < intervals.length) {
            if (starts[s] < ends[e]) {
                rooms++;
                maxRooms = Math.max(maxRooms, rooms);
                s++;
            } else {
                rooms--;
                e++;
            }
        }

        return maxRooms;
    }

    // Usage:
    // int count = maxNonOverlapping(new int[][]{{1,3}, {2,4}, {3,5}}); // 2
    // int rooms = minMeetingRooms(new int[][]{{0,30}, {5,10}, {15,20}}); // 2
}`,
      cpp: `#include <vector>
#include <algorithm>
using namespace std;

int maxNonOverlapping(vector<vector<int>>& intervals) {
    // Find maximum number of non-overlapping intervals
    if (intervals.empty()) return 0;

    // Sort by end time
    sort(intervals.begin(), intervals.end(), 
         [](auto& a, auto& b) { return a[1] < b[1]; });

    int count = 1;
    int end = intervals[0][1];

    for (int i = 1; i < intervals.size(); i++) {
        if (intervals[i][0] >= end) {
            // No overlap
            count++;
            end = intervals[i][1];
        }
    }

    return count;
}

int minMeetingRooms(vector<vector<int>>& intervals) {
    // Find minimum meeting rooms needed
    if (intervals.empty()) return 0;

    vector<int> starts, ends;
    for (auto& interval : intervals) {
        starts.push_back(interval[0]);
        ends.push_back(interval[1]);
    }
    sort(starts.begin(), starts.end());
    sort(ends.begin(), ends.end());

    int rooms = 0, maxRooms = 0;
    int s = 0, e = 0;

    while (s < intervals.size()) {
        if (starts[s] < ends[e]) {
            rooms++;
            maxRooms = max(maxRooms, rooms);
            s++;
        } else {
            rooms--;
            e++;
        }
    }

    return maxRooms;
}

// Usage:
// vector<vector<int>> intervals = {{1,3}, {2,4}, {3,5}};
// int count = maxNonOverlapping(intervals); // 2`,
      go: `package main

import "sort"

func maxNonOverlapping(intervals [][]int) int {
    // Find maximum number of non-overlapping intervals
    if len(intervals) == 0 {
        return 0
    }

    // Sort by end time
    sort.Slice(intervals, func(i, j int) bool {
        return intervals[i][1] < intervals[j][1]
    })

    count := 1
    end := intervals[0][1]

    for i := 1; i < len(intervals); i++ {
        if intervals[i][0] >= end {
            // No overlap
            count++
            end = intervals[i][1]
        }
    }

    return count
}

func minMeetingRooms(intervals [][]int) int {
    // Find minimum meeting rooms needed
    if len(intervals) == 0 {
        return 0
    }

    starts := make([]int, len(intervals))
    ends := make([]int, len(intervals))
    for i, interval := range intervals {
        starts[i] = interval[0]
        ends[i] = interval[1]
    }
    sort.Ints(starts)
    sort.Ints(ends)

    rooms, maxRooms := 0, 0
    s, e := 0, 0

    for s < len(intervals) {
        if starts[s] < ends[e] {
            rooms++
            if rooms > maxRooms {
                maxRooms = rooms
            }
            s++
        } else {
            rooms--
            e++
        }
    }

    return maxRooms
}

// Usage:
// count := maxNonOverlapping([][]int{{1,3}, {2,4}, {3,5}}) // 2
// rooms := minMeetingRooms([][]int{{0,30}, {5,10}, {15,20}}) // 2`,
      rust: `fn max_non_overlapping(intervals: &mut Vec<(i32, i32)>) -> i32 {
    // Find maximum number of non-overlapping intervals
    if intervals.is_empty() {
        return 0;
    }

    // Sort by end time
    intervals.sort_by_key(|x| x.1);

    let mut count = 1;
    let mut end = intervals[0].1;

    for i in 1..intervals.len() {
        if intervals[i].0 >= end {
            // No overlap
            count += 1;
            end = intervals[i].1;
        }
    }

    count
}

fn min_meeting_rooms(intervals: &[(i32, i32)]) -> i32 {
    // Find minimum meeting rooms needed
    if intervals.is_empty() {
        return 0;
    }

    let mut starts: Vec<i32> = intervals.iter().map(|x| x.0).collect();
    let mut ends: Vec<i32> = intervals.iter().map(|x| x.1).collect();
    starts.sort();
    ends.sort();

    let mut rooms = 0;
    let mut max_rooms = 0;
    let mut s = 0;
    let mut e = 0;

    while s < intervals.len() {
        if starts[s] < ends[e] {
            rooms += 1;
            max_rooms = max_rooms.max(rooms);
            s += 1;
        } else {
            rooms -= 1;
            e += 1;
        }
    }

    max_rooms
}

// Usage:
// let mut intervals = vec![(1, 3), (2, 4), (3, 5)];
// let count = max_non_overlapping(&mut intervals); // 2
// let rooms = min_meeting_rooms(&[(0, 30), (5, 10), (15, 20)]); // 2`,
    },
  },

  // Intervals
  {
    id: 'merge-intervals',
    topic: 'intervals',
    name: 'Merge Overlapping Intervals',
    description: 'Combine overlapping intervals into one',
    defaultLanguage: 'python',
    codeByLanguage: {
      python: `def merge_intervals(intervals):
    """Merge all overlapping intervals."""
    if not intervals:
        return []
    
    # Sort by start time
    intervals.sort(key=lambda x: x[0])
    
    merged = [intervals[0]]
    
    for current in intervals[1:]:
        last = merged[-1]
        
        if current[0] <= last[1]:  # Overlapping
            last[1] = max(last[1], current[1])
        else:
            merged.append(current)
    
    return merged

def insert_interval(intervals, new):
    """Insert new interval and merge if necessary."""
    result = []
    i = 0
    n = len(intervals)
    
    # Add all intervals before new
    while i < n and intervals[i][1] < new[0]:
        result.append(intervals[i])
        i += 1
    
    # Merge overlapping intervals
    while i < n and intervals[i][0] <= new[1]:
        new[0] = min(new[0], intervals[i][0])
        new[1] = max(new[1], intervals[i][1])
        i += 1
    result.append(new)
    
    # Add remaining intervals
    result.extend(intervals[i:])
    
    return result

# Usage:
# merged = merge_intervals([[1,3], [2,6], [8,10]])  # [[1,6], [8,10]]
# result = insert_interval([[1,3], [6,9]], [2,5])   # [[1,5], [6,9]]`,
      javascript: `function mergeIntervals(intervals) {
  // Merge all overlapping intervals
  if (!intervals.length) return [];

  // Sort by start time
  intervals.sort((a, b) => a[0] - b[0]);

  const merged = [intervals[0]];

  for (let i = 1; i < intervals.length; i++) {
    const last = merged[merged.length - 1];
    const current = intervals[i];

    if (current[0] <= last[1]) {
      // Overlapping
      last[1] = Math.max(last[1], current[1]);
    } else {
      merged.push(current);
    }
  }

  return merged;
}

function insertInterval(intervals, newInterval) {
  // Insert new interval and merge if necessary
  const result = [];
  let i = 0;
  const n = intervals.length;

  // Add all intervals before new
  while (i < n && intervals[i][1] < newInterval[0]) {
    result.push(intervals[i]);
    i++;
  }

  // Merge overlapping intervals
  while (i < n && intervals[i][0] <= newInterval[1]) {
    newInterval[0] = Math.min(newInterval[0], intervals[i][0]);
    newInterval[1] = Math.max(newInterval[1], intervals[i][1]);
    i++;
  }
  result.push(newInterval);

  // Add remaining intervals
  while (i < n) {
    result.push(intervals[i]);
    i++;
  }

  return result;
}

// Usage:
// const merged = mergeIntervals([[1,3], [2,6], [8,10]]); // [[1,6], [8,10]]
// const result = insertInterval([[1,3], [6,9]], [2,5]);  // [[1,5], [6,9]]`,
      typescript: `type Interval = [number, number];

function mergeIntervals(intervals: Interval[]): Interval[] {
  // Merge all overlapping intervals
  if (!intervals.length) return [];

  // Sort by start time
  intervals.sort((a, b) => a[0] - b[0]);

  const merged: Interval[] = [intervals[0]];

  for (let i = 1; i < intervals.length; i++) {
    const last = merged[merged.length - 1];
    const current = intervals[i];

    if (current[0] <= last[1]) {
      // Overlapping
      last[1] = Math.max(last[1], current[1]);
    } else {
      merged.push(current);
    }
  }

  return merged;
}

function insertInterval(intervals: Interval[], newInterval: Interval): Interval[] {
  // Insert new interval and merge if necessary
  const result: Interval[] = [];
  let i = 0;
  const n = intervals.length;

  // Add all intervals before new
  while (i < n && intervals[i][1] < newInterval[0]) {
    result.push(intervals[i]);
    i++;
  }

  // Merge overlapping intervals
  while (i < n && intervals[i][0] <= newInterval[1]) {
    newInterval[0] = Math.min(newInterval[0], intervals[i][0]);
    newInterval[1] = Math.max(newInterval[1], intervals[i][1]);
    i++;
  }
  result.push(newInterval);

  // Add remaining intervals
  while (i < n) {
    result.push(intervals[i]);
    i++;
  }

  return result;
}

// Usage:
// const merged = mergeIntervals([[1,3], [2,6], [8,10]]); // [[1,6], [8,10]]
// const result = insertInterval([[1,3], [6,9]], [2,5]);  // [[1,5], [6,9]]`,
      java: `import java.util.*;

public class MergeIntervals {
    public static int[][] mergeIntervals(int[][] intervals) {
        // Merge all overlapping intervals
        if (intervals.length == 0) return new int[0][];

        // Sort by start time
        Arrays.sort(intervals, (a, b) -> a[0] - b[0]);

        List<int[]> merged = new ArrayList<>();
        merged.add(intervals[0]);

        for (int i = 1; i < intervals.length; i++) {
            int[] last = merged.get(merged.size() - 1);
            int[] current = intervals[i];

            if (current[0] <= last[1]) {
                // Overlapping
                last[1] = Math.max(last[1], current[1]);
            } else {
                merged.add(current);
            }
        }

        return merged.toArray(new int[merged.size()][]);
    }

    public static int[][] insertInterval(int[][] intervals, int[] newInterval) {
        // Insert new interval and merge if necessary
        List<int[]> result = new ArrayList<>();
        int i = 0;
        int n = intervals.length;

        // Add all intervals before new
        while (i < n && intervals[i][1] < newInterval[0]) {
            result.add(intervals[i]);
            i++;
        }

        // Merge overlapping intervals
        while (i < n && intervals[i][0] <= newInterval[1]) {
            newInterval[0] = Math.min(newInterval[0], intervals[i][0]);
            newInterval[1] = Math.max(newInterval[1], intervals[i][1]);
            i++;
        }
        result.add(newInterval);

        // Add remaining intervals
        while (i < n) {
            result.add(intervals[i]);
            i++;
        }

        return result.toArray(new int[result.size()][]);
    }

    // Usage:
    // int[][] merged = mergeIntervals(new int[][]{{1,3}, {2,6}, {8,10}}); // [[1,6], [8,10]]
    // int[][] result = insertInterval(new int[][]{{1,3}, {6,9}}, new int[]{2,5}); // [[1,5], [6,9]]
}`,
      cpp: `#include <vector>
#include <algorithm>
using namespace std;

vector<vector<int>> mergeIntervals(vector<vector<int>>& intervals) {
    // Merge all overlapping intervals
    if (intervals.empty()) return {};

    // Sort by start time
    sort(intervals.begin(), intervals.end());

    vector<vector<int>> merged = {intervals[0]};

    for (int i = 1; i < intervals.size(); i++) {
        auto& last = merged.back();
        auto& current = intervals[i];

        if (current[0] <= last[1]) {
            // Overlapping
            last[1] = max(last[1], current[1]);
        } else {
            merged.push_back(current);
        }
    }

    return merged;
}

vector<vector<int>> insertInterval(vector<vector<int>>& intervals, vector<int>& newInterval) {
    // Insert new interval and merge if necessary
    vector<vector<int>> result;
    int i = 0;
    int n = intervals.size();

    // Add all intervals before new
    while (i < n && intervals[i][1] < newInterval[0]) {
        result.push_back(intervals[i]);
        i++;
    }

    // Merge overlapping intervals
    while (i < n && intervals[i][0] <= newInterval[1]) {
        newInterval[0] = min(newInterval[0], intervals[i][0]);
        newInterval[1] = max(newInterval[1], intervals[i][1]);
        i++;
    }
    result.push_back(newInterval);

    // Add remaining intervals
    while (i < n) {
        result.push_back(intervals[i]);
        i++;
    }

    return result;
}

// Usage:
// vector<vector<int>> intervals = {{1,3}, {2,6}, {8,10}};
// auto merged = mergeIntervals(intervals); // [[1,6], [8,10]]`,
      go: `package main

import "sort"

func mergeIntervals(intervals [][]int) [][]int {
    // Merge all overlapping intervals
    if len(intervals) == 0 {
        return [][]int{}
    }

    // Sort by start time
    sort.Slice(intervals, func(i, j int) bool {
        return intervals[i][0] < intervals[j][0]
    })

    merged := [][]int{intervals[0]}

    for i := 1; i < len(intervals); i++ {
        last := merged[len(merged)-1]
        current := intervals[i]

        if current[0] <= last[1] {
            // Overlapping
            if current[1] > last[1] {
                last[1] = current[1]
            }
        } else {
            merged = append(merged, current)
        }
    }

    return merged
}

func insertInterval(intervals [][]int, newInterval []int) [][]int {
    // Insert new interval and merge if necessary
    result := [][]int{}
    i := 0
    n := len(intervals)

    // Add all intervals before new
    for i < n && intervals[i][1] < newInterval[0] {
        result = append(result, intervals[i])
        i++
    }

    // Merge overlapping intervals
    for i < n && intervals[i][0] <= newInterval[1] {
        if intervals[i][0] < newInterval[0] {
            newInterval[0] = intervals[i][0]
        }
        if intervals[i][1] > newInterval[1] {
            newInterval[1] = intervals[i][1]
        }
        i++
    }
    result = append(result, newInterval)

    // Add remaining intervals
    for i < n {
        result = append(result, intervals[i])
        i++
    }

    return result
}

// Usage:
// merged := mergeIntervals([][]int{{1,3}, {2,6}, {8,10}}) // [[1,6], [8,10]]
// result := insertInterval([][]int{{1,3}, {6,9}}, []int{2,5}) // [[1,5], [6,9]]`,
      rust: `fn merge_intervals(intervals: &mut Vec<(i32, i32)>) -> Vec<(i32, i32)> {
    // Merge all overlapping intervals
    if intervals.is_empty() {
        return vec![];
    }

    // Sort by start time
    intervals.sort_by_key(|x| x.0);

    let mut merged: Vec<(i32, i32)> = vec![intervals[0]];

    for i in 1..intervals.len() {
        let current = intervals[i];
        let last = merged.last_mut().unwrap();

        if current.0 <= last.1 {
            // Overlapping
            last.1 = last.1.max(current.1);
        } else {
            merged.push(current);
        }
    }

    merged
}

fn insert_interval(intervals: &[(i32, i32)], new_interval: (i32, i32)) -> Vec<(i32, i32)> {
    // Insert new interval and merge if necessary
    let mut result: Vec<(i32, i32)> = vec![];
    let mut new_interval = new_interval;
    let mut i = 0;
    let n = intervals.len();

    // Add all intervals before new
    while i < n && intervals[i].1 < new_interval.0 {
        result.push(intervals[i]);
        i += 1;
    }

    // Merge overlapping intervals
    while i < n && intervals[i].0 <= new_interval.1 {
        new_interval.0 = new_interval.0.min(intervals[i].0);
        new_interval.1 = new_interval.1.max(intervals[i].1);
        i += 1;
    }
    result.push(new_interval);

    // Add remaining intervals
    while i < n {
        result.push(intervals[i]);
        i += 1;
    }

    result
}

// Usage:
// let mut intervals = vec![(1, 3), (2, 6), (8, 10)];
// let merged = merge_intervals(&mut intervals); // [(1, 6), (8, 10)]
// let result = insert_interval(&[(1, 3), (6, 9)], (2, 5)); // [(1, 5), (6, 9)]`,
    },
  },

  // Bit Manipulation
  {
    id: 'bit-manipulation-basics',
    topic: 'bit-manipulation',
    name: 'Bit Manipulation Basics',
    description: 'Common bit manipulation operations',
    defaultLanguage: 'python',
    codeByLanguage: {
      python: `def get_bit(n, i):
    """Get ith bit of n (0-indexed from right)."""
    return (n >> i) & 1

def set_bit(n, i):
    """Set ith bit of n to 1."""
    return n | (1 << i)

def clear_bit(n, i):
    """Clear ith bit of n (set to 0)."""
    return n & ~(1 << i)

def count_ones(n):
    """Count number of 1 bits (Brian Kernighan)."""
    count = 0
    while n:
        n &= n - 1  # Clear rightmost 1 bit
        count += 1
    return count

def is_power_of_two(n):
    """Check if n is a power of 2."""
    return n > 0 and (n & (n - 1)) == 0

def single_number(nums):
    """Find element appearing once (others appear twice)."""
    result = 0
    for num in nums:
        result ^= num
    return result

# Usage:
# get_bit(5, 0)    # 1 (5 = 101)
# set_bit(5, 1)    # 7 (111)
# count_ones(7)    # 3
# single_number([4, 1, 2, 1, 2])  # 4`,
      javascript: `function getBit(n, i) {
  // Get ith bit of n (0-indexed from right)
  return (n >> i) & 1;
}

function setBit(n, i) {
  // Set ith bit of n to 1
  return n | (1 << i);
}

function clearBit(n, i) {
  // Clear ith bit of n (set to 0)
  return n & ~(1 << i);
}

function countOnes(n) {
  // Count number of 1 bits (Brian Kernighan)
  let count = 0;
  while (n) {
    n &= n - 1; // Clear rightmost 1 bit
    count++;
  }
  return count;
}

function isPowerOfTwo(n) {
  // Check if n is a power of 2
  return n > 0 && (n & (n - 1)) === 0;
}

function singleNumber(nums) {
  // Find element appearing once (others appear twice)
  return nums.reduce((result, num) => result ^ num, 0);
}

// Usage:
// getBit(5, 0);    // 1 (5 = 101)
// setBit(5, 1);    // 7 (111)
// countOnes(7);    // 3
// singleNumber([4, 1, 2, 1, 2]); // 4`,
      typescript: `function getBit(n: number, i: number): number {
  // Get ith bit of n (0-indexed from right)
  return (n >> i) & 1;
}

function setBit(n: number, i: number): number {
  // Set ith bit of n to 1
  return n | (1 << i);
}

function clearBit(n: number, i: number): number {
  // Clear ith bit of n (set to 0)
  return n & ~(1 << i);
}

function countOnes(n: number): number {
  // Count number of 1 bits (Brian Kernighan)
  let count = 0;
  while (n) {
    n &= n - 1; // Clear rightmost 1 bit
    count++;
  }
  return count;
}

function isPowerOfTwo(n: number): boolean {
  // Check if n is a power of 2
  return n > 0 && (n & (n - 1)) === 0;
}

function singleNumber(nums: number[]): number {
  // Find element appearing once (others appear twice)
  return nums.reduce((result, num) => result ^ num, 0);
}

// Usage:
// getBit(5, 0);    // 1 (5 = 101)
// setBit(5, 1);    // 7 (111)
// countOnes(7);    // 3
// singleNumber([4, 1, 2, 1, 2]); // 4`,
      java: `public class BitManipulation {
    public static int getBit(int n, int i) {
        // Get ith bit of n (0-indexed from right)
        return (n >> i) & 1;
    }

    public static int setBit(int n, int i) {
        // Set ith bit of n to 1
        return n | (1 << i);
    }

    public static int clearBit(int n, int i) {
        // Clear ith bit of n (set to 0)
        return n & ~(1 << i);
    }

    public static int countOnes(int n) {
        // Count number of 1 bits (Brian Kernighan)
        int count = 0;
        while (n != 0) {
            n &= n - 1; // Clear rightmost 1 bit
            count++;
        }
        return count;
    }

    public static boolean isPowerOfTwo(int n) {
        // Check if n is a power of 2
        return n > 0 && (n & (n - 1)) == 0;
    }

    public static int singleNumber(int[] nums) {
        // Find element appearing once (others appear twice)
        int result = 0;
        for (int num : nums) {
            result ^= num;
        }
        return result;
    }

    // Usage:
    // getBit(5, 0);    // 1 (5 = 101)
    // setBit(5, 1);    // 7 (111)
    // countOnes(7);    // 3
    // singleNumber(new int[]{4, 1, 2, 1, 2}); // 4
}`,
      cpp: `#include <vector>
using namespace std;

int getBit(int n, int i) {
    // Get ith bit of n (0-indexed from right)
    return (n >> i) & 1;
}

int setBit(int n, int i) {
    // Set ith bit of n to 1
    return n | (1 << i);
}

int clearBit(int n, int i) {
    // Clear ith bit of n (set to 0)
    return n & ~(1 << i);
}

int countOnes(int n) {
    // Count number of 1 bits (Brian Kernighan)
    int count = 0;
    while (n) {
        n &= n - 1; // Clear rightmost 1 bit
        count++;
    }
    return count;
}

bool isPowerOfTwo(int n) {
    // Check if n is a power of 2
    return n > 0 && (n & (n - 1)) == 0;
}

int singleNumber(vector<int>& nums) {
    // Find element appearing once (others appear twice)
    int result = 0;
    for (int num : nums) {
        result ^= num;
    }
    return result;
}

// Usage:
// getBit(5, 0);    // 1 (5 = 101)
// setBit(5, 1);    // 7 (111)
// countOnes(7);    // 3
// vector<int> nums = {4, 1, 2, 1, 2};
// singleNumber(nums); // 4`,
      go: `package main

func getBit(n, i int) int {
    // Get ith bit of n (0-indexed from right)
    return (n >> i) & 1
}

func setBit(n, i int) int {
    // Set ith bit of n to 1
    return n | (1 << i)
}

func clearBit(n, i int) int {
    // Clear ith bit of n (set to 0)
    return n & ^(1 << i)
}

func countOnes(n int) int {
    // Count number of 1 bits (Brian Kernighan)
    count := 0
    for n != 0 {
        n &= n - 1 // Clear rightmost 1 bit
        count++
    }
    return count
}

func isPowerOfTwo(n int) bool {
    // Check if n is a power of 2
    return n > 0 && (n&(n-1)) == 0
}

func singleNumber(nums []int) int {
    // Find element appearing once (others appear twice)
    result := 0
    for _, num := range nums {
        result ^= num
    }
    return result
}

// Usage:
// getBit(5, 0)    // 1 (5 = 101)
// setBit(5, 1)    // 7 (111)
// countOnes(7)    // 3
// singleNumber([]int{4, 1, 2, 1, 2}) // 4`,
      rust: `fn get_bit(n: i32, i: u32) -> i32 {
    // Get ith bit of n (0-indexed from right)
    (n >> i) & 1
}

fn set_bit(n: i32, i: u32) -> i32 {
    // Set ith bit of n to 1
    n | (1 << i)
}

fn clear_bit(n: i32, i: u32) -> i32 {
    // Clear ith bit of n (set to 0)
    n & !(1 << i)
}

fn count_ones(mut n: i32) -> i32 {
    // Count number of 1 bits (Brian Kernighan)
    let mut count = 0;
    while n != 0 {
        n &= n - 1; // Clear rightmost 1 bit
        count += 1;
    }
    count
}

fn is_power_of_two(n: i32) -> bool {
    // Check if n is a power of 2
    n > 0 && (n & (n - 1)) == 0
}

fn single_number(nums: &[i32]) -> i32 {
    // Find element appearing once (others appear twice)
    nums.iter().fold(0, |acc, &num| acc ^ num)
}

// Usage:
// get_bit(5, 0);    // 1 (5 = 101)
// set_bit(5, 1);    // 7 (111)
// count_ones(7);    // 3
// single_number(&[4, 1, 2, 1, 2]); // 4`,
    },
  },
] as const;

/**
 * Get templates for a specific topic
 */
export function getTemplatesForTopic(topic: TopicSlug): Template[] {
  return TEMPLATES.filter((t) => t.topic === topic);
}

/**
 * Get a template by ID
 */
export function getTemplateById(id: string): Template | undefined {
  return TEMPLATES.find((t) => t.id === id);
}

/**
 * Get all template topics that have templates
 */
export function getTemplateTopics(): TopicSlug[] {
  return [...new Set(TEMPLATES.map((t) => t.topic))];
}

/**
 * Get the code for a template in a specific language
 * Falls back to default language if not available
 */
export function getTemplateCode(template: Template, language: string): string {
  const lang = language as keyof typeof template.codeByLanguage;
  return template.codeByLanguage[lang] ?? template.codeByLanguage[template.defaultLanguage] ?? '';
}
