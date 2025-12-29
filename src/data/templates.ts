// data/templates.ts - Pre-built algorithm pattern templates

import type { Template, TopicSlug } from '../types';

/**
 * Pattern templates organized by topic
 * Each template provides a starting point for common algorithm patterns
 */
export const TEMPLATES: readonly Template[] = [
  // Arrays & Hashing
  {
    id: 'hash-map-frequency',
    topic: 'arrays-hashing',
    name: 'Hash Map Frequency Counter',
    description: 'Count occurrences of elements using a hash map',
    defaultLanguage: 'python',
    code: `def frequency_counter(arr):
    """Count occurrences of each element in array."""
    freq = {}
    for item in arr:
        freq[item] = freq.get(item, 0) + 1
    return freq

# Usage:
# counts = frequency_counter([1, 2, 2, 3, 3, 3])
# counts = {1: 1, 2: 2, 3: 3}`,
  },

  // Two Pointers
  {
    id: 'two-pointers-opposite',
    topic: 'two-pointers',
    name: 'Two Pointers (Opposite Ends)',
    description: 'Pointers starting at both ends, moving towards center',
    defaultLanguage: 'python',
    code: `def two_pointers_opposite(arr, target):
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
  },

  // Sliding Window
  {
    id: 'sliding-window-fixed',
    topic: 'sliding-window',
    name: 'Fixed Size Sliding Window',
    description: 'Window of fixed size k sliding through array',
    defaultLanguage: 'python',
    code: `def max_sum_subarray(arr, k):
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
  },
  {
    id: 'sliding-window-variable',
    topic: 'sliding-window',
    name: 'Variable Size Sliding Window',
    description: 'Dynamic window size based on condition',
    defaultLanguage: 'python',
    code: `def min_subarray_sum(arr, target):
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
  },

  // Stack
  {
    id: 'monotonic-stack',
    topic: 'stack',
    name: 'Monotonic Stack',
    description: 'Stack maintaining monotonic order for next greater/smaller element',
    defaultLanguage: 'python',
    code: `def next_greater_element(arr):
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
  },

  // Binary Search
  {
    id: 'binary-search-template',
    topic: 'binary-search',
    name: 'Binary Search Template',
    description: 'Standard binary search with left/right boundary variations',
    defaultLanguage: 'python',
    code: `def binary_search(arr, target):
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
  },

  // Linked List
  {
    id: 'fast-slow-pointers',
    topic: 'linked-list',
    name: 'Fast & Slow Pointers',
    description: 'Detect cycles or find middle of linked list',
    defaultLanguage: 'python',
    code: `def has_cycle(head):
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
  },

  // Trees
  {
    id: 'dfs-tree-traversal',
    topic: 'trees',
    name: 'DFS Tree Traversal',
    description: 'Recursive and iterative DFS for binary trees',
    defaultLanguage: 'python',
    code: `def inorder_recursive(root, result=None):
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
  },
  {
    id: 'bfs-level-order',
    topic: 'trees',
    name: 'BFS Level Order Traversal',
    description: 'Traverse tree level by level using queue',
    defaultLanguage: 'python',
    code: `from collections import deque

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
  },

  // Backtracking
  {
    id: 'backtracking-template',
    topic: 'backtracking',
    name: 'Backtracking Template',
    description: 'General backtracking pattern for combinations/permutations',
    defaultLanguage: 'python',
    code: `def backtrack(candidates, target):
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
  },

  // Heap / Priority Queue
  {
    id: 'heap-top-k',
    topic: 'heap',
    name: 'Top K Elements',
    description: 'Find k largest/smallest elements using heap',
    defaultLanguage: 'python',
    code: `import heapq

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
  },

  // Graphs
  {
    id: 'graph-bfs',
    topic: 'graphs',
    name: 'Graph BFS',
    description: 'Breadth-first search for shortest path in unweighted graph',
    defaultLanguage: 'python',
    code: `from collections import deque

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
  },
  {
    id: 'graph-dfs',
    topic: 'graphs',
    name: 'Graph DFS',
    description: 'Depth-first search for path finding and cycle detection',
    defaultLanguage: 'python',
    code: `def dfs_path(graph, start, end, visited=None):
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
  },

  // Dynamic Programming
  {
    id: 'dp-memoization',
    topic: 'dynamic-programming',
    name: 'DP with Memoization',
    description: 'Top-down dynamic programming with caching',
    defaultLanguage: 'python',
    code: `from functools import lru_cache

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
  },
  {
    id: 'dp-tabulation',
    topic: 'dynamic-programming',
    name: 'DP with Tabulation',
    description: 'Bottom-up dynamic programming with table',
    defaultLanguage: 'python',
    code: `def coin_change(coins, amount):
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
  },

  // Greedy
  {
    id: 'greedy-interval',
    topic: 'greedy',
    name: 'Greedy Interval Scheduling',
    description: 'Select maximum non-overlapping intervals',
    defaultLanguage: 'python',
    code: `def max_non_overlapping(intervals):
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
  },

  // Intervals
  {
    id: 'merge-intervals',
    topic: 'intervals',
    name: 'Merge Overlapping Intervals',
    description: 'Combine overlapping intervals into one',
    defaultLanguage: 'python',
    code: `def merge_intervals(intervals):
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
  },

  // Bit Manipulation
  {
    id: 'bit-manipulation-basics',
    topic: 'bit-manipulation',
    name: 'Bit Manipulation Basics',
    description: 'Common bit manipulation operations',
    defaultLanguage: 'python',
    code: `def get_bit(n, i):
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
