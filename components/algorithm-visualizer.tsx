"use client"

import { useState, useEffect } from "react"
import { CodeEditor } from "@/components/code-editor"
import { VisualizationArea } from "@/components/visualization-area"
import { Header } from "@/components/header"
import { useTheme } from "@/hooks/use-theme"
import { useMobile } from "@/hooks/use-mobile"
import { ComplexityAnalysis } from "@/components/complexity-analysis"
import { DataStructureVisualizer } from "@/components/data-structure-visualizer"
import { RefreshCw, Play, Pause, SkipBack, SkipForward, RotateCcw, Code, Eye } from "lucide-react"

export const AlgorithmVisualizer = () => {
  const [code, setCode] = useState("")
  const [language, setLanguage] = useState("javascript")
  const [isRunning, setIsRunning] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [speed, setSpeed] = useState(1)
  const [visualizationData, setVisualizationData] = useState<any>(null)
  const [currentStep, setCurrentStep] = useState(0)
  const [totalSteps, setTotalSteps] = useState(0)
  const [showConsole, setShowConsole] = useState(false)
  const [consoleOutput, setConsoleOutput] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState<"code" | "visualization">("code")
  const [dataStructureType, setDataStructureType] = useState<string>("array")
  const isMobile = useMobile()
  const { theme } = useTheme()

  // Sample code templates
  const codeTemplates = {
    javascript: {
      bfs: `// Breadth-First Search Algorithm
function bfs(graph, start) {
  const queue = [start];
  const visited = new Set([start]);
  const result = [];
  
  while (queue.length > 0) {
    const vertex = queue.shift();
    result.push(vertex);
    
    for (const neighbor of graph[vertex]) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
      }
    }
  }
  
  return result;
}

// Example graph
const graph = {
  A: ['B', 'C'],
  B: ['A', 'D', 'E'],
  C: ['A', 'F'],
  D: ['B'],
  E: ['B', 'F'],
  F: ['C', 'E']
};

// Run BFS starting from vertex 'A'
const traversalOrder = bfs(graph, 'A');
console.log(traversalOrder);`,
      dfs: `// Depth-First Search Algorithm
function dfs(graph, start) {
  const visited = new Set();
  const result = [];
  
  function dfsHelper(vertex) {
    visited.add(vertex);
    result.push(vertex);
    
    for (const neighbor of graph[vertex]) {
      if (!visited.has(neighbor)) {
        dfsHelper(neighbor);
      }
    }
  }
  
  dfsHelper(start);
  return result;
}

// Example graph
const graph = {
  A: ['B', 'C'],
  B: ['A', 'D', 'E'],
  C: ['A', 'F'],
  D: ['B'],
  E: ['B', 'F'],
  F: ['C', 'E']
};

// Run DFS starting from vertex 'A'
const traversalOrder = dfs(graph, 'A');
console.log(traversalOrder);`,
      dijkstra: `// Dijkstra's Algorithm
function dijkstra(graph, start) {
  const distances = {};
  const visited = new Set();
  const previous = {};
  const nodes = Object.keys(graph);
  
  // Initialize distances
  for (const node of nodes) {
    distances[node] = Infinity;
  }
  distances[start] = 0;
  
  while (nodes.length > visited.size) {
    // Find the node with the smallest distance
    let minNode = null;
    let minDistance = Infinity;
    
    for (const node of nodes) {
      if (!visited.has(node) && distances[node] < minDistance) {
        minNode = node;
        minDistance = distances[node];
      }
    }
    
    if (minNode === null) break;
    visited.add(minNode);
    
    // Update distances to neighbors
    for (const [neighbor, weight] of Object.entries(graph[minNode])) {
      const distance = distances[minNode] + weight;
      if (distance < distances[neighbor]) {
        distances[neighbor] = distance;
        previous[neighbor] = minNode;
      }
    }
  }
  
  return { distances, previous };
}

// Example weighted graph
const graph = {
  A: { B: 4, C: 2 },
  B: { A: 4, C: 1, D: 5 },
  C: { A: 2, B: 1, D: 8, E: 10 },
  D: { B: 5, C: 8, E: 2 },
  E: { C: 10, D: 2 }
};

const result = dijkstra(graph, 'A');
console.log(result.distances);`,
      quicksort: `// QuickSort Algorithm
function quickSort(arr, low = 0, high = arr.length - 1) {
  if (low < high) {
    const pivotIndex = partition(arr, low, high);
    quickSort(arr, low, pivotIndex - 1);
    quickSort(arr, pivotIndex + 1, high);
  }
  return arr;
}

function partition(arr, low, high) {
  const pivot = arr[high];
  let i = low - 1;
  
  for (let j = low; j < high; j++) {
    if (arr[j] <= pivot) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }
  
  [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
  return i + 1;
}

// Example array
const array = [10, 7, 8, 9, 1, 5];
console.log(quickSort([...array]));`,
      mergesort: `// MergeSort Algorithm
function mergeSort(arr) {
  if (arr.length <= 1) {
    return arr;
  }
  
  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));
  
  return merge(left, right);
}

function merge(left, right) {
  const result = [];
  let leftIndex = 0;
  let rightIndex = 0;
  
  while (leftIndex < left.length && rightIndex < right.length) {
    if (left[leftIndex] < right[rightIndex]) {
      result.push(left[leftIndex]);
      leftIndex++;
    } else {
      result.push(right[rightIndex]);
      rightIndex++;
    }
  }
  
  return result.concat(left.slice(leftIndex)).concat(right.slice(rightIndex));
}

// Example array
const array = [10, 7, 8, 9, 1, 5];
console.log(mergeSort(array));`,
      stack: `// Stack Implementation and Operations
class Stack {
  constructor() {
    this.items = [];
  }
  
  push(element) {
    this.items.push(element);
    console.log(\`Pushed: \${element}\`);
  }
  
  pop() {
    if (this.isEmpty()) {
      return "Stack is empty";
    }
    const popped = this.items.pop();
    console.log(\`Popped: \${popped}\`);
    return popped;
  }
  
  peek() {
    if (this.isEmpty()) {
      return "Stack is empty";
    }
    return this.items[this.items.length - 1];
  }
  
  isEmpty() {
    return this.items.length === 0;
  }
  
  size() {
    return this.items.length;
  }
  
  print() {
    console.log(this.items);
  }
}

// Example usage
const stack = new Stack();
stack.push(10);
stack.push(20);
stack.push(30);
stack.print();
stack.pop();
stack.print();
stack.push(40);
stack.print();
console.log("Top element:", stack.peek());
console.log("Stack size:", stack.size());`,
      queue: `// Queue Implementation and Operations
class Queue {
  constructor() {
    this.items = [];
  }
  
  enqueue(element) {
    this.items.push(element);
    console.log(\`Enqueued: \${element}\`);
  }
  
  dequeue() {
    if (this.isEmpty()) {
      return "Queue is empty";
    }
    const dequeued = this.items.shift();
    console.log(\`Dequeued: \${dequeued}\`);
    return dequeued;
  }
  
  front() {
    if (this.isEmpty()) {
      return "Queue is empty";
    }
    return this.items[0];
  }
  
  isEmpty() {
    return this.items.length === 0;
  }
  
  size() {
    return this.items.length;
  }
  
  print() {
    console.log(this.items);
  }
}

// Example usage
const queue = new Queue();
queue.enqueue(10);
queue.enqueue(20);
queue.enqueue(30);
queue.print();
queue.dequeue();
queue.print();
queue.enqueue(40);
queue.print();
console.log("Front element:", queue.front());
console.log("Queue size:", queue.size());`,
      binarytree: `// Binary Search Tree Implementation
class Node {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
  }
}

class BinarySearchTree {
  constructor() {
    this.root = null;
  }
  
  insert(value) {
    const newNode = new Node(value);
    
    if (this.root === null) {
      this.root = newNode;
      console.log(\`Inserted \${value} as root\`);
      return;
    }
    
    const insertHelper = (node, newNode) => {
      if (newNode.value < node.value) {
        if (node.left === null) {
          node.left = newNode;
          console.log(\`Inserted \${value} to the left of \${node.value}\`);
        } else {
          insertHelper(node.left, newNode);
        }
      } else {
        if (node.right === null) {
          node.right = newNode;
          console.log(\`Inserted \${value} to the right of \${node.value}\`);
        } else {
          insertHelper(node.right, newNode);
        }
      }
    };
    
    insertHelper(this.root, newNode);
  }
  
  search(value) {
    const searchHelper = (node, value) => {
      if (node === null) {
        console.log(\`\${value} not found\`);
        return false;
      }
      
      if (node.value === value) {
        console.log(\`Found \${value}\`);
        return true;
      }
      
      if (value < node.value) {
        console.log(\`Searching left of \${node.value}\`);
        return searchHelper(node.left, value);
      } else {
        console.log(\`Searching right of \${node.value}\`);
        return searchHelper(node.right, value);
      }
    };
    
    return searchHelper(this.root, value);
  }
  
  inOrderTraversal() {
    const result = [];
    
    const traverse = (node) => {
      if (node !== null) {
        traverse(node.left);
        result.push(node.value);
        traverse(node.right);
      }
    };
    
    traverse(this.root);
    console.log("In-order traversal:", result);
    return result;
  }
}

// Example usage
const bst = new BinarySearchTree();
bst.insert(10);
bst.insert(5);
bst.insert(15);
bst.insert(3);
bst.insert(7);
bst.insert(12);
bst.insert(18);

bst.search(7);
bst.search(11);
bst.inOrderTraversal();`,
    },
    python: {
      bfs: `# Breadth-First Search Algorithm
from collections import deque

def bfs(graph, start):
    queue = deque([start])
    visited = {start}
    result = []
    
    while queue:
        vertex = queue.popleft()
        result.append(vertex)
        
        for neighbor in graph[vertex]:
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)
    
    return result

# Example graph
graph = {
    'A': ['B', 'C'],
    'B': ['A', 'D', 'E'],
    'C': ['A', 'F'],
    'D': ['B'],
    'E': ['B', 'F'],
    'F': ['C', 'E']
}

# Run BFS starting from vertex 'A'
traversal_order = bfs(graph, 'A')
print(traversal_order)`,
      dfs: `# Depth-First Search Algorithm
def dfs(graph, start):
    visited = set()
    result = []
    
    def dfs_helper(vertex):
        visited.add(vertex)
        result.append(vertex)
        
        for neighbor in graph[vertex]:
            if neighbor not in visited:
                dfs_helper(neighbor)
    
    dfs_helper(start)
    return result

# Example graph
graph = {
    'A': ['B', 'C'],
    'B': ['A', 'D', 'E'],
    'C': ['A', 'F'],
    'D': ['B'],
    'E': ['B', 'F'],
    'F': ['C', 'E']
}

# Run DFS starting from vertex 'A'
traversal_order = dfs(graph, 'A')
print(traversal_order)`,
      dijkstra: `# Dijkstra's Algorithm
import heapq

def dijkstra(graph, start):
    distances = {node: float('infinity') for node in graph}
    distances[start] = 0
    priority_queue = [(0, start)]
    previous = {}
    
    while priority_queue:
        current_distance, current_node = heapq.heappop(priority_queue)
        
        if current_distance > distances[current_node]:
            continue
        
        for neighbor, weight in graph[current_node].items():
            distance = current_distance + weight
            
            if distance < distances[neighbor]:
                distances[neighbor] = distance
                previous[neighbor] = current_node
                heapq.heappush(priority_queue, (distance, neighbor))
    
    return distances, previous

# Example weighted graph
graph = {
    'A': {'B': 4, 'C': 2},
    'B': {'A': 4, 'C': 1, 'D': 5},
    'C': {'A': 2, 'B': 1, 'D': 8, 'E': 10},
    'D': {'B': 5, 'C': 8, 'E': 2},
    'E': {'C': 10, 'D': 2}
}

distances, previous = dijkstra(graph, 'A')
print(distances)`,
      quicksort: `# QuickSort Algorithm
def quick_sort(arr, low=0, high=None):
    if high is None:
        high = len(arr) - 1
    
    if low < high:
        pivot_index = partition(arr, low, high)
        quick_sort(arr, low, pivot_index - 1)
        quick_sort(arr, pivot_index + 1, high)
    
    return arr

def partition(arr, low, high):
    pivot = arr[high]
    i = low - 1
    
    for j in range(low, high):
        if arr[j] <= pivot:
            i += 1
            arr[i], arr[j] = arr[j], arr[i]
    
    arr[i + 1], arr[high] = arr[high], arr[i + 1]
    return i + 1

# Example array
array = [10, 7, 8, 9, 1, 5]
print(quick_sort(array.copy()))`,
      mergesort: `# MergeSort Algorithm
def merge_sort(arr):
    if len(arr) <= 1:
        return arr
    
    mid = len(arr) // 2
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])
    
    return merge(left, right)

def merge(left, right):
    result = []
    left_index = 0
    right_index = 0
    
    while left_index < len(left) and right_index < len(right):
        if left[left_index] < right[right_index]:
            result.append(left[left_index])
            left_index += 1
        else:
            result.append(right[right_index])
            right_index += 1
    
    result.extend(left[left_index:])
    result.extend(right[right_index:])
    return result

# Example array
array = [10, 7, 8, 9, 1, 5]
print(merge_sort(array))`,
      stack: `# Stack Implementation and Operations
class Stack:
    def __init__(self):
        self.items = []
    
    def push(self, item):
        self.items.append(item)
        print(f"Pushed: {item}")
    
    def pop(self):
        if self.is_empty():
            return "Stack is empty"
        popped = self.items.pop()
        print(f"Popped: {popped}")
        return popped
    
    def peek(self):
        if self.is_empty():
            return "Stack is empty"
        return self.items[-1]
    
    def is_empty(self):
        return len(self.items) == 0
    
    def size(self):
        return len(self.items)
    
    def print_stack(self):
        print(self.items)

# Example usage
stack = Stack()
stack.push(10)
stack.push(20)
stack.push(30)
stack.print_stack()
stack.pop()
stack.print_stack()
stack.push(40)
stack.print_stack()
print("Top element:", stack.peek())
print("Stack size:", stack.size())`,
      queue: `# Queue Implementation and Operations
class Queue:
    def __init__(self):
        self.items = []
    
    def enqueue(self, item):
        self.items.append(item)
        print(f"Enqueued: {item}")
    
    def dequeue(self):
        if self.is_empty():
            return "Queue is empty"
        dequeued = self.items.pop(0)
        print(f"Dequeued: {dequeued}")
        return dequeued
    
    def front(self):
        if self.is_empty():
            return "Queue is empty"
        return self.items[0]
    
    def is_empty(self):
        return len(self.items) == 0
    
    def size(self):
        return len(self.items)
    
    def print_queue(self):
        print(self.items)

# Example usage
queue = Queue()
queue.enqueue(10)
queue.enqueue(20)
queue.enqueue(30)
queue.print_queue()
queue.dequeue()
queue.print_queue()
queue.enqueue(40)
queue.print_queue()
print("Front element:", queue.front())
print("Queue size:", queue.size())`,
      binarytree: `# Binary Search Tree Implementation
class Node:
    def __init__(self, value):
        self.value = value
        self.left = None
        self.right = None

class BinarySearchTree:
    def __init__(self):
        self.root = None
    
    def insert(self, value):
        new_node = Node(value)
        
        if self.root is None:
            self.root = new_node
            print(f"Inserted {value} as root")
            return
        
        def insert_helper(node, new_node):
            if new_node.value < node.value:
                if node.left is None:
                    node.left = new_node
                    print(f"Inserted {value} to the left of {node.value}")
                else:
                    insert_helper(node.left, new_node)
            else:
                if node.right is None:
                    node.right = new_node
                    print(f"Inserted {value} to the right of {node.value}")
                else:
                    insert_helper(node.right, new_node)
        
        insert_helper(self.root, new_node)
    
    def search(self, value):
        def search_helper(node, value):
            if node is None:
                print(f"{value} not found")
                return False
            
            if node.value == value:
                print(f"Found {value}")
                return True
            
            if value < node.value:
                print(f"Searching left of {node.value}")
                return search_helper(node.left, value)
            else:
                print(f"Searching right of {node.value}")
                return search_helper(node.right, value)
        
        return search_helper(self.root, value)
    
    def in_order_traversal(self):
        result = []
        
        def traverse(node):
            if node is not None:
                traverse(node.left)
                result.append(node.value)
                traverse(node.right)
        
        traverse(self.root)
        print("In-order traversal:", result)
        return result

# Example usage
bst = BinarySearchTree()
bst.insert(10)
bst.insert(5)
bst.insert(15)
bst.insert(3)
bst.insert(7)
bst.insert(12)
bst.insert(18)

bst.search(7)
bst.search(11)
bst.in_order_traversal()`,
    },
  }

  const handleRunVisualization = () => {
    setIsRunning(true)
    setIsPaused(false)
    setCurrentStep(0)

    // Generate visualization data based on the code
    const visualizationData = generateVisualizationData(code, language)
    setVisualizationData(visualizationData)
    setTotalSteps(visualizationData.steps.length)
    setConsoleOutput(visualizationData.consoleOutput || [])

    // Determine data structure type
    setDataStructureType(determineDataStructureType(code))

    // Switch to visualization tab on mobile
    if (isMobile) {
      setActiveTab("visualization")
    }
  }

  const handlePause = () => {
    setIsPaused(true)
  }

  const handlePlay = () => {
    setIsPaused(false)
  }

  const handleReset = () => {
    setCurrentStep(0)
    setIsPaused(true)
  }

  const handleStepForward = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleStepBackward = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleLoadTemplate = (templateName: string) => {
    if (codeTemplates[language] && codeTemplates[language][templateName]) {
      setCode(codeTemplates[language][templateName])
    }
  }

  const handleRefresh = () => {
    setCode("")
    setIsRunning(false)
    setIsPaused(false)
    setCurrentStep(0)
    setTotalSteps(0)
    setVisualizationData(null)
    setConsoleOutput([])
    setActiveTab("code")
  }

  // Function to determine data structure type from code
  const determineDataStructureType = (code: string): string => {
    const lowerCode = code.toLowerCase()

    if (
      lowerCode.includes("class stack") ||
      (lowerCode.includes("push") && lowerCode.includes("pop") && !lowerCode.includes("queue"))
    ) {
      return "stack"
    } else if (lowerCode.includes("class queue") || (lowerCode.includes("enqueue") && lowerCode.includes("dequeue"))) {
      return "queue"
    } else if (
      lowerCode.includes("binarysearchtree") ||
      lowerCode.includes("binary search tree") ||
      lowerCode.includes("binary tree") ||
      (lowerCode.includes("class node") &&
        ((lowerCode.includes("left") && lowerCode.includes("right")) ||
          (lowerCode.includes("insert") && lowerCode.includes("value")))) ||
      (lowerCode.includes("tree") && !lowerCode.includes("graph"))
    ) {
      return "tree"
    } else if (
      (lowerCode.includes("graph") && (lowerCode.includes("vertex") || lowerCode.includes("edge"))) ||
      lowerCode.includes("bfs") ||
      lowerCode.includes("dfs") ||
      lowerCode.includes("dijkstra")
    ) {
      return "graph"
    } else if (lowerCode.includes("sort") || lowerCode.includes("array")) {
      return "array"
    }

    return "generic"
  }

  // Function to generate visualization data based on code analysis
  const generateVisualizationData = (code: string, language: string) => {
    // Determine algorithm type based on code content
    const algorithmType = determineAlgorithmType(code)

    // Generate visualization data based on algorithm type
    switch (algorithmType) {
      case "bfs":
        return generateBFSVisualization()
      case "dfs":
        return generateDFSVisualization()
      case "dijkstra":
        return generateDijkstraVisualization()
      case "quicksort":
        return generateQuickSortVisualization()
      case "mergesort":
        return generateMergeSortVisualization()
      case "stack":
        return generateStackVisualization()
      case "queue":
        return generateQueueVisualization()
      case "binarytree":
        return generateBinaryTreeVisualization()
      default:
        return generateGenericVisualization()
    }
  }

  // Function to determine algorithm type from code
  const determineAlgorithmType = (code: string): string => {
    const lowerCode = code.toLowerCase()

    if (lowerCode.includes("bfs") || (lowerCode.includes("breadth") && lowerCode.includes("search"))) {
      return "bfs"
    } else if (lowerCode.includes("dfs") || (lowerCode.includes("depth") && lowerCode.includes("search"))) {
      return "dfs"
    } else if (lowerCode.includes("dijkstra")) {
      return "dijkstra"
    } else if (lowerCode.includes("quicksort") || (lowerCode.includes("quick") && lowerCode.includes("sort"))) {
      return "quicksort"
    } else if (lowerCode.includes("mergesort") || (lowerCode.includes("merge") && lowerCode.includes("sort"))) {
      return "mergesort"
    } else if (
      lowerCode.includes("class stack") ||
      (lowerCode.includes("push") && lowerCode.includes("pop") && !lowerCode.includes("queue"))
    ) {
      return "stack"
    } else if (lowerCode.includes("class queue") || (lowerCode.includes("enqueue") && lowerCode.includes("dequeue"))) {
      return "queue"
    } else if (lowerCode.includes("binarysearchtree") || lowerCode.includes("binary search tree")) {
      return "binarytree"
    } else if (lowerCode.includes("sort")) {
      return "quicksort" // Default to quicksort for generic sorting algorithms
    } else if (lowerCode.includes("graph")) {
      return "bfs" // Default to BFS for generic graph algorithms
    }

    return "generic"
  }

  // Generate BFS visualization data
  const generateBFSVisualization = () => {
    const nodes = ["A", "B", "C", "D", "E", "F"]
    const edges = [
      ["A", "B"],
      ["A", "C"],
      ["B", "D"],
      ["B", "E"],
      ["C", "F"],
      ["E", "F"],
    ]

    return {
      type: "bfs",
      steps: [
        {
          nodes,
          edges,
          visited: ["A"],
          queue: ["B", "C"],
          current: "A",
          variables: { result: ["A"] },
          operation: { type: "dequeue", value: "A", description: "Dequeue A from the queue" },
        },
        {
          nodes,
          edges,
          visited: ["A"],
          queue: ["B", "C"],
          current: "A",
          variables: { result: ["A"] },
          operation: { type: "process", value: "A", description: "Process node A" },
        },
        {
          nodes,
          edges,
          visited: ["A", "B"],
          queue: ["C", "D", "E"],
          current: "B",
          variables: { result: ["A", "B"] },
          operation: { type: "enqueue", value: ["D", "E"], description: "Enqueue neighbors of B: D, E" },
        },
        {
          nodes,
          edges,
          visited: ["A", "B"],
          queue: ["C", "D", "E"],
          current: "B",
          variables: { result: ["A", "B"] },
          operation: { type: "dequeue", value: "B", description: "Dequeue B from the queue" },
        },
        {
          nodes,
          edges,
          visited: ["A", "B", "C"],
          queue: ["D", "E", "F"],
          current: "C",
          variables: { result: ["A", "B", "C"] },
          operation: { type: "enqueue", value: ["F"], description: "Enqueue neighbor of C: F" },
        },
        {
          nodes,
          edges,
          visited: ["A", "B", "C"],
          queue: ["D", "E", "F"],
          current: "C",
          variables: { result: ["A", "B", "C"] },
          operation: { type: "dequeue", value: "C", description: "Dequeue C from the queue" },
        },
        {
          nodes,
          edges,
          visited: ["A", "B", "C", "D"],
          queue: ["E", "F"],
          current: "D",
          variables: { result: ["A", "B", "C", "D"] },
          operation: { type: "dequeue", value: "D", description: "Dequeue D from the queue" },
        },
        {
          nodes,
          edges,
          visited: ["A", "B", "C", "D", "E"],
          queue: ["F"],
          current: "E",
          variables: { result: ["A", "B", "C", "D", "E"] },
          operation: { type: "dequeue", value: "E", description: "Dequeue E from the queue" },
        },
        {
          nodes,
          edges,
          visited: ["A", "B", "C", "D", "E", "F"],
          queue: [],
          current: "F",
          variables: { result: ["A", "B", "C", "D", "E", "F"] },
          operation: { type: "dequeue", value: "F", description: "Dequeue F from the queue" },
        },
      ],
      consoleOutput: ['["A", "B", "C", "D", "E", "F"]'],
    }
  }

  // Generate DFS visualization data
  const generateDFSVisualization = () => {
    const nodes = ["A", "B", "C", "D", "E", "F"]
    const edges = [
      ["A", "B"],
      ["A", "C"],
      ["B", "D"],
      ["B", "E"],
      ["C", "F"],
      ["E", "F"],
    ]

    return {
      type: "dfs",
      steps: [
        {
          nodes,
          edges,
          visited: ["A"],
          stack: ["A"],
          current: "A",
          variables: { result: ["A"] },
          operation: { type: "push", value: "A", description: "Push A onto the stack" },
        },
        {
          nodes,
          edges,
          visited: ["A", "B"],
          stack: ["A", "B"],
          current: "B",
          variables: { result: ["A", "B"] },
          operation: { type: "push", value: "B", description: "Push B onto the stack" },
        },
        {
          nodes,
          edges,
          visited: ["A", "B", "D"],
          stack: ["A", "B", "D"],
          current: "D",
          variables: { result: ["A", "B", "D"] },
          operation: { type: "push", value: "D", description: "Push D onto the stack" },
        },
        {
          nodes,
          edges,
          visited: ["A", "B", "D"],
          stack: ["A", "B"],
          current: "D",
          variables: { result: ["A", "B", "D"] },
          operation: { type: "pop", value: "D", description: "Pop D from the stack (no unvisited neighbors)" },
        },
        {
          nodes,
          edges,
          visited: ["A", "B", "D", "E"],
          stack: ["A", "B", "E"],
          current: "E",
          variables: { result: ["A", "B", "D", "E"] },
          operation: { type: "push", value: "E", description: "Push E onto the stack" },
        },
        {
          nodes,
          edges,
          visited: ["A", "B", "D", "E", "F"],
          stack: ["A", "B", "E", "F"],
          current: "F",
          variables: { result: ["A", "B", "D", "E", "F"] },
          operation: { type: "push", value: "F", description: "Push F onto the stack" },
        },
        {
          nodes,
          edges,
          visited: ["A", "B", "D", "E", "F"],
          stack: ["A", "B", "E"],
          current: "F",
          variables: { result: ["A", "B", "D", "E", "F"] },
          operation: { type: "pop", value: "F", description: "Pop F from the stack (no unvisited neighbors)" },
        },
        {
          nodes,
          edges,
          visited: ["A", "B", "D", "E", "F"],
          stack: ["A", "B"],
          current: "E",
          variables: { result: ["A", "B", "D", "E", "F"] },
          operation: { type: "pop", value: "E", description: "Pop E from the stack (no unvisited neighbors)" },
        },
        {
          nodes,
          edges,
          visited: ["A", "B", "D", "E", "F"],
          stack: ["A"],
          current: "B",
          variables: { result: ["A", "B", "D", "E", "F"] },
          operation: { type: "pop", value: "B", description: "Pop B from the stack (no unvisited neighbors)" },
        },
        {
          nodes,
          edges,
          visited: ["A", "B", "D", "E", "F", "C"],
          stack: ["A", "C"],
          current: "C",
          variables: { result: ["A", "B", "D", "E", "F", "C"] },
          operation: { type: "push", value: "C", description: "Push C onto the stack" },
        },
        {
          nodes,
          edges,
          visited: ["A", "B", "D", "E", "F", "C"],
          stack: ["A"],
          current: "C",
          variables: { result: ["A", "B", "D", "E", "F", "C"] },
          operation: { type: "pop", value: "C", description: "Pop C from the stack (no unvisited neighbors)" },
        },
        {
          nodes,
          edges,
          visited: ["A", "B", "D", "E", "F", "C"],
          stack: [],
          current: "A",
          variables: { result: ["A", "B", "D", "E", "F", "C"] },
          operation: { type: "pop", value: "A", description: "Pop A from the stack (no unvisited neighbors)" },
        },
      ],
      consoleOutput: ['["A", "B", "D", "E", "F", "C"]'],
    }
  }

  // Generate Dijkstra visualization data
  const generateDijkstraVisualization = () => {
    const nodes = ["A", "B", "C", "D", "E"]
    const edges = [
      { from: "A", to: "B", weight: 4 },
      { from: "A", to: "C", weight: 2 },
      { from: "B", to: "C", weight: 1 },
      { from: "B", to: "D", weight: 5 },
      { from: "C", to: "D", weight: 8 },
      { from: "C", to: "E", weight: 10 },
      { from: "D", to: "E", weight: 2 },
    ]

    return {
      type: "weighted-graph",
      steps: [
        {
          nodes,
          edges,
          distances: {
            A: 0,
            B: Number.POSITIVE_INFINITY,
            C: Number.POSITIVE_INFINITY,
            D: Number.POSITIVE_INFINITY,
            E: Number.POSITIVE_INFINITY,
          },
          visited: [],
          current: null,
          operation: { type: "initialize", description: "Initialize distances: A=0, all others=∞" },
        },
        {
          nodes,
          edges,
          distances: {
            A: 0,
            B: Number.POSITIVE_INFINITY,
            C: Number.POSITIVE_INFINITY,
            D: Number.POSITIVE_INFINITY,
            E: Number.POSITIVE_INFINITY,
          },
          visited: ["A"],
          current: "A",
          operation: { type: "select", value: "A", description: "Select node A (smallest distance = 0)" },
        },
        {
          nodes,
          edges,
          distances: { A: 0, B: 4, C: 2, D: Number.POSITIVE_INFINITY, E: Number.POSITIVE_INFINITY },
          visited: ["A"],
          current: "A",
          operation: { type: "update", value: ["B", "C"], description: "Update neighbors: B=4, C=2" },
        },
        {
          nodes,
          edges,
          distances: { A: 0, B: 4, C: 2, D: Number.POSITIVE_INFINITY, E: Number.POSITIVE_INFINITY },
          visited: ["A", "C"],
          current: "C",
          operation: { type: "select", value: "C", description: "Select node C (smallest distance = 2)" },
        },
        {
          nodes,
          edges,
          distances: { A: 0, B: 3, C: 2, D: 10, E: 12 },
          visited: ["A", "C"],
          current: "C",
          operation: { type: "update", value: ["B", "D", "E"], description: "Update neighbors: B=3, D=10, E=12" },
        },
        {
          nodes,
          edges,
          distances: { A: 0, B: 3, C: 2, D: 10, E: 12 },
          visited: ["A", "C", "B"],
          current: "B",
          operation: { type: "select", value: "B", description: "Select node B (smallest distance = 3)" },
        },
        {
          nodes,
          edges,
          distances: { A: 0, B: 3, C: 2, D: 8, E: 12 },
          visited: ["A", "C", "B"],
          current: "B",
          operation: { type: "update", value: ["D"], description: "Update neighbor: D=8" },
        },
        {
          nodes,
          edges,
          distances: { A: 0, B: 3, C: 2, D: 8, E: 12 },
          visited: ["A", "C", "B", "D"],
          current: "D",
          operation: { type: "select", value: "D", description: "Select node D (smallest distance = 8)" },
        },
        {
          nodes,
          edges,
          distances: { A: 0, B: 3, C: 2, D: 8, E: 10 },
          visited: ["A", "C", "B", "D"],
          current: "D",
          operation: { type: "update", value: ["E"], description: "Update neighbor: E=10" },
        },
        {
          nodes,
          edges,
          distances: { A: 0, B: 3, C: 2, D: 8, E: 10 },
          visited: ["A", "C", "B", "D", "E"],
          current: "E",
          operation: { type: "select", value: "E", description: "Select node E (smallest distance = 10)" },
        },
        {
          nodes,
          edges,
          distances: { A: 0, B: 3, C: 2, D: 8, E: 10 },
          visited: ["A", "C", "B", "D", "E"],
          current: null,
          operation: { type: "complete", description: "Algorithm complete. Shortest paths found." },
        },
      ],
      consoleOutput: ["{ A: 0, B: 3, C: 2, D: 8, E: 10 }"],
    }
  }

  // Generate QuickSort visualization data
  const generateQuickSortVisualization = () => {
    const initialArray = [10, 7, 8, 9, 1, 5]

    return {
      type: "array",
      steps: [
        {
          array: [...initialArray],
          pivot: 5,
          low: 0,
          high: 5,
          swapping: null,
          operation: { type: "partition", description: "Partition array with pivot = 5" },
        },
        {
          array: [...initialArray],
          pivot: 5,
          low: 0,
          high: 5,
          swapping: null,
          operation: { type: "compare", value: [0, 5], description: "Compare 10 with pivot 5" },
        },
        {
          array: [...initialArray],
          pivot: 5,
          low: 0,
          high: 5,
          swapping: null,
          operation: { type: "compare", value: [1, 5], description: "Compare 7 with pivot 5" },
        },
        {
          array: [...initialArray],
          pivot: 5,
          low: 0,
          high: 5,
          swapping: null,
          operation: { type: "compare", value: [2, 5], description: "Compare 8 with pivot 5" },
        },
        {
          array: [...initialArray],
          pivot: 5,
          low: 0,
          high: 5,
          swapping: null,
          operation: { type: "compare", value: [3, 5], description: "Compare 9 with pivot 5" },
        },
        {
          array: [...initialArray],
          pivot: 5,
          low: 0,
          high: 5,
          swapping: null,
          operation: { type: "compare", value: [4, 5], description: "Compare 1 with pivot 5" },
        },
        {
          array: [...initialArray],
          pivot: 5,
          low: 0,
          high: 5,
          swapping: [0, 4],
          operation: { type: "swap", value: [0, 4], description: "Swap 10 and 1" },
        },
        {
          array: [1, 7, 8, 9, 10, 5],
          pivot: 5,
          low: 0,
          high: 5,
          swapping: [5, 1],
          operation: { type: "swap", value: [5, 1], description: "Swap pivot 5 with 7" },
        },
        {
          array: [1, 5, 8, 9, 10, 7],
          pivot: 5,
          low: 0,
          high: 1,
          swapping: null,
          operation: { type: "recursive", value: "left", description: "Recursively sort left partition [1]" },
        },
        {
          array: [1, 5, 8, 9, 10, 7],
          pivot: 7,
          low: 2,
          high: 5,
          swapping: null,
          operation: {
            type: "recursive",
            value: "right",
            description: "Recursively sort right partition [8, 9, 10, 7]",
          },
        },
        {
          array: [1, 5, 8, 9, 10, 7],
          pivot: 7,
          low: 2,
          high: 5,
          swapping: null,
          operation: { type: "compare", value: [2, 5], description: "Compare 8 with pivot 7" },
        },
        {
          array: [1, 5, 8, 9, 10, 7],
          pivot: 7,
          low: 2,
          high: 5,
          swapping: null,
          operation: { type: "compare", value: [3, 5], description: "Compare 9 with pivot 7" },
        },
        {
          array: [1, 5, 8, 9, 10, 7],
          pivot: 7,
          low: 2,
          high: 5,
          swapping: null,
          operation: { type: "compare", value: [4, 5], description: "Compare 10 with pivot 7" },
        },
        {
          array: [1, 5, 7, 9, 10, 8],
          pivot: 7,
          low: 2,
          high: 5,
          swapping: [5, 2],
          operation: { type: "swap", value: [5, 2], description: "Swap pivot 7 with 8" },
        },
        {
          array: [1, 5, 7, 8, 10, 9],
          pivot: 8,
          low: 3,
          high: 5,
          swapping: null,
          operation: { type: "recursive", value: "right", description: "Recursively sort right partition [9, 10, 8]" },
        },
        {
          array: [1, 5, 7, 8, 10, 9],
          pivot: 8,
          low: 3,
          high: 5,
          swapping: [5, 3],
          operation: { type: "swap", value: [5, 3], description: "Swap pivot 8 with 9" },
        },
        {
          array: [1, 5, 7, 8, 9, 10],
          pivot: 10,
          low: 4,
          high: 5,
          swapping: null,
          operation: { type: "recursive", value: "right", description: "Recursively sort right partition [9, 10]" },
        },
        {
          array: [1, 5, 7, 8, 9, 10],
          pivot: null,
          low: null,
          high: null,
          swapping: null,
          operation: { type: "complete", description: "QuickSort complete" },
        },
      ],
      consoleOutput: ["[1, 5, 7, 8, 9, 10]"],
    }
  }

  // Generate MergeSort visualization data
  const generateMergeSortVisualization = () => {
    return {
      type: "mergesort",
      steps: [
        {
          arrays: [[10, 7, 8, 9, 1, 5]],
          operation: { type: "split", description: "Split array into halves" },
        },
        {
          arrays: [
            [10, 7, 8],
            [9, 1, 5],
          ],
          operation: { type: "split", description: "Split left half [10, 7, 8]" },
        },
        {
          arrays: [[10], [7, 8]],
          operation: { type: "split", description: "Split [7, 8]" },
        },
        {
          arrays: [[10], [7], [8]],
          operation: { type: "merge", value: [[7], [8]], description: "Merge [7] and [8]" },
        },
        {
          arrays: [[10], [7, 8]],
          operation: { type: "merge", value: [[10], [7, 8]], description: "Merge [10] and [7, 8]" },
        },
        {
          arrays: [
            [7, 8, 10],
            [9, 1, 5],
          ],
          operation: { type: "split", description: "Split right half [9, 1, 5]" },
        },
        {
          arrays: [[7, 8, 10], [9], [1, 5]],
          operation: { type: "split", description: "Split [1, 5]" },
        },
        {
          arrays: [[7, 8, 10], [9], [1], [5]],
          operation: { type: "merge", value: [[1], [5]], description: "Merge [1] and [5]" },
        },
        {
          arrays: [[7, 8, 10], [9], [1, 5]],
          operation: { type: "merge", value: [[9], [1, 5]], description: "Merge [9] and [1, 5]" },
        },
        {
          arrays: [
            [7, 8, 10],
            [1, 5, 9],
          ],
          operation: {
            type: "merge",
            value: [
              [7, 8, 10],
              [1, 5, 9],
            ],
            description: "Merge [7, 8, 10] and [1, 5, 9]",
          },
        },
        {
          arrays: [[1, 5, 7, 8, 9, 10]],
          operation: { type: "complete", description: "MergeSort complete" },
        },
      ],
      consoleOutput: ["[1, 5, 7, 8, 9, 10]"],
    }
  }

  // Generate Stack visualization data
  const generateStackVisualization = () => {
    return {
      type: "stack",
      steps: [
        {
          stack: [],
          operation: { type: "initialize", description: "Initialize empty stack" },
        },
        {
          stack: [10],
          operation: { type: "push", value: 10, description: "Push 10 onto stack" },
        },
        {
          stack: [10, 20],
          operation: { type: "push", value: 20, description: "Push 20 onto stack" },
        },
        {
          stack: [10, 20, 30],
          operation: { type: "push", value: 30, description: "Push 30 onto stack" },
        },
        {
          stack: [10, 20, 30],
          operation: { type: "peek", value: 30, description: "Peek: Top element is 30" },
        },
        {
          stack: [10, 20],
          operation: { type: "pop", value: 30, description: "Pop 30 from stack" },
        },
        {
          stack: [10, 20, 40],
          operation: { type: "push", value: 40, description: "Push 40 onto stack" },
        },
        {
          stack: [10, 20, 40],
          operation: { type: "size", value: 3, description: "Stack size: 3" },
        },
      ],
      consoleOutput: [
        "Pushed: 10",
        "Pushed: 20",
        "Pushed: 30",
        "[10, 20, 30]",
        "Popped: 30",
        "[10, 20]",
        "Pushed: 40",
        "[10, 20, 40]",
        "Top element: 40",
        "Stack size: 3",
      ],
    }
  }

  // Generate Queue visualization data
  const generateQueueVisualization = () => {
    return {
      type: "queue",
      steps: [
        {
          queue: [],
          operation: { type: "initialize", description: "Initialize empty queue" },
        },
        {
          queue: [10],
          operation: { type: "enqueue", value: 10, description: "Enqueue 10" },
        },
        {
          queue: [10, 20],
          operation: { type: "enqueue", value: 20, description: "Enqueue 20" },
        },
        {
          queue: [10, 20, 30],
          operation: { type: "enqueue", value: 30, description: "Enqueue 30" },
        },
        {
          queue: [10, 20, 30],
          operation: { type: "front", value: 10, description: "Front: First element is 10" },
        },
        {
          queue: [20, 30],
          operation: { type: "dequeue", value: 10, description: "Dequeue 10 from queue" },
        },
        {
          queue: [20, 30, 40],
          operation: { type: "enqueue", value: 40, description: "Enqueue 40" },
        },
        {
          queue: [20, 30, 40],
          operation: { type: "size", value: 3, description: "Queue size: 3" },
        },
      ],
      consoleOutput: [
        "Enqueued: 10",
        "Enqueued: 20",
        "Enqueued: 30",
        "[10, 20, 30]",
        "Dequeued: 10",
        "[20, 30]",
        "Enqueued: 40",
        "[20, 30, 40]",
        "Front element: 20",
        "Queue size: 3",
      ],
    }
  }

  // Generate Binary Tree visualization data
  const generateBinaryTreeVisualization = () => {
    return {
      type: "binarytree",
      steps: [
        {
          tree: { value: 10, left: null, right: null },
          operation: { type: "insert", value: 10, description: "Insert 10 as root" },
        },
        {
          tree: {
            value: 10,
            left: { value: 5, left: null, right: null },
            right: null,
          },
          operation: { type: "insert", value: 5, description: "Insert 5 to the left of 10" },
        },
        {
          tree: {
            value: 10,
            left: { value: 5, left: null, right: null },
            right: { value: 15, left: null, right: null },
          },
          operation: { type: "insert", value: 15, description: "Insert 15 to the right of 10" },
        },
        {
          tree: {
            value: 10,
            left: {
              value: 5,
              left: { value: 3, left: null, right: null },
              right: null,
            },
            right: { value: 15, left: null, right: null },
          },
          operation: { type: "insert", value: 3, description: "Insert 3 to the left of 5" },
        },
        {
          tree: {
            value: 10,
            left: {
              value: 5,
              left: { value: 3, left: null, right: null },
              right: { value: 7, left: null, right: null },
            },
            right: { value: 15, left: null, right: null },
          },
          operation: { type: "insert", value: 7, description: "Insert 7 to the right of 5" },
        },
        {
          tree: {
            value: 10,
            left: {
              value: 5,
              left: { value: 3, left: null, right: null },
              right: { value: 7, left: null, right: null },
            },
            right: {
              value: 15,
              left: { value: 12, left: null, right: null },
              right: null,
            },
          },
          operation: { type: "insert", value: 12, description: "Insert 12 to the left of 15" },
        },
        {
          tree: {
            value: 10,
            left: {
              value: 5,
              left: { value: 3, left: null, right: null },
              right: { value: 7, left: null, right: null },
            },
            right: {
              value: 15,
              left: { value: 12, left: null, right: null },
              right: { value: 18, left: null, right: null },
            },
          },
          operation: { type: "insert", value: 18, description: "Insert 18 to the right of 15" },
        },
        {
          tree: {
            value: 10,
            left: {
              value: 5,
              left: { value: 3, left: null, right: null },
              right: { value: 7, left: null, right: null },
            },
            right: {
              value: 15,
              left: { value: 12, left: null, right: null },
              right: { value: 18, left: null, right: null },
            },
          },
          current: 10,
          operation: { type: "search", value: 7, description: "Search for 7: Start at root 10" },
        },
        {
          tree: {
            value: 10,
            left: {
              value: 5,
              left: { value: 3, left: null, right: null },
              right: { value: 7, left: null, right: null },
            },
            right: {
              value: 15,
              left: { value: 12, left: null, right: null },
              right: { value: 18, left: null, right: null },
            },
          },
          current: 5,
          operation: { type: "search", value: 7, description: "Search for 7: Go to left child 5" },
        },
        {
          tree: {
            value: 10,
            left: {
              value: 5,
              left: { value: 3, left: null, right: null },
              right: { value: 7, left: null, right: null },
            },
            right: {
              value: 15,
              left: { value: 12, left: null, right: null },
              right: { value: 18, left: null, right: null },
            },
          },
          current: 7,
          operation: { type: "search", value: 7, description: "Search for 7: Go to right child 7" },
        },
        {
          tree: {
            value: 10,
            left: {
              value: 5,
              left: { value: 3, left: null, right: null },
              right: { value: 7, left: null, right: null },
            },
            right: {
              value: 15,
              left: { value: 12, left: null, right: null },
              right: { value: 18, left: null, right: null },
            },
          },
          current: 7,
          operation: { type: "found", value: 7, description: "Found 7!" },
        },
        {
          tree: {
            value: 10,
            left: {
              value: 5,
              left: { value: 3, left: null, right: null },
              right: { value: 7, left: null, right: null },
            },
            right: {
              value: 15,
              left: { value: 12, left: null, right: null },
              right: { value: 18, left: null, right: null },
            },
          },
          traversal: [3, 5, 7, 10, 12, 15, 18],
          operation: {
            type: "traversal",
            value: "inorder",
            description: "In-order traversal: [3, 5, 7, 10, 12, 15, 18]",
          },
        },
      ],
      consoleOutput: [
        "Inserted 10 as root",
        "Inserted 5 to the left of 10",
        "Inserted 15 to the right of 10",
        "Inserted 3 to the left of 5",
        "Inserted 7 to the right of 5",
        "Inserted 12 to the left of 15",
        "Inserted 18 to the right of 15",
        "Searching left of 10",
        "Searching right of 5",
        "Found 7",
        "11 not found",
        "In-order traversal: [3, 5, 7, 10, 12, 15, 18]",
      ],
    }
  }

  // Generate generic visualization data
  const generateGenericVisualization = () => {
    return {
      type: "generic",
      steps: [
        {
          variables: { i: 0, j: 0, sum: 0 },
          lineHighlight: 3,
          callStack: ["main()"],
          operation: { type: "initialize", description: "Initialize variables: i=0, j=0, sum=0" },
        },
        {
          variables: { i: 1, j: 0, sum: 1 },
          lineHighlight: 4,
          callStack: ["main()"],
          operation: { type: "update", value: "i", description: "Update i=1, sum=1" },
        },
        {
          variables: { i: 1, j: 1, sum: 2 },
          lineHighlight: 5,
          callStack: ["main()"],
          operation: { type: "update", value: "j", description: "Update j=1, sum=2" },
        },
        {
          variables: { i: 2, j: 1, sum: 4 },
          lineHighlight: 3,
          callStack: ["main()"],
          operation: { type: "update", value: "i", description: "Update i=2, sum=4" },
        },
        {
          variables: { i: 2, j: 2, sum: 6 },
          lineHighlight: 6,
          callStack: ["main()"],
          operation: { type: "update", value: "j", description: "Update j=2, sum=6" },
        },
        {
          variables: { i: 2, j: 2, sum: 6 },
          lineHighlight: 7,
          callStack: ["main()"],
          operation: { type: "complete", description: "Algorithm complete. Final sum=6" },
        },
      ],
      consoleOutput: ["6"],
    }
  }

  // Auto-advance steps when running and not paused
  useEffect(() => {
    let timer: NodeJS.Timeout

    if (isRunning && !isPaused && currentStep < totalSteps - 1) {
      timer = setTimeout(() => {
        setCurrentStep(currentStep + 1)
      }, 1000 / speed)
    }

    return () => {
      if (timer) clearTimeout(timer)
    }
  }, [isRunning, isPaused, currentStep, totalSteps, speed])

  return (
    <div
      className={`min-h-screen flex flex-col ${theme === "dark" ? "bg-gray-950 text-gray-100" : "bg-gray-100 text-gray-900"}`}
    >
      <Header />

      <div className="flex items-center justify-between p-4 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab("code")}
            className={`px-4 py-2 rounded-t-lg flex items-center gap-2 ${
              activeTab === "code"
                ? theme === "dark"
                  ? "bg-gray-800 text-white"
                  : "bg-white text-gray-900"
                : theme === "dark"
                  ? "bg-gray-900 text-gray-400"
                  : "bg-gray-200 text-gray-700"
            }`}
          >
            <Code size={18} /> <span className={isMobile ? "hidden" : ""}>Code Editor</span>
          </button>
          <button
            onClick={() => setActiveTab("visualization")}
            className={`px-4 py-2 rounded-t-lg flex items-center gap-2 ${
              activeTab === "visualization"
                ? theme === "dark"
                  ? "bg-gray-800 text-white"
                  : "bg-white text-gray-900"
                : theme === "dark"
                  ? "bg-gray-900 text-gray-400"
                  : "bg-gray-200 text-gray-700"
            }`}
          >
            <Eye size={18} /> <span className={isMobile ? "hidden" : ""}>Visualization</span>
          </button>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            className="flex items-center gap-1 px-3 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white"
            title="Refresh"
          >
            <RefreshCw size={16} />
            <span className={isMobile ? "hidden" : ""}>Refresh</span>
          </button>
        </div>
      </div>

      <div className={`flex flex-1 ${isMobile ? "flex-col" : "flex-row"} p-4 gap-4`}>
        {/* Left Pane - Code Editor */}
        {(!isMobile || activeTab === "code") && (
          <div className={`${isMobile ? "h-full" : "w-1/2"} flex flex-col gap-4`}>
            <div className="flex items-center gap-2 mb-2">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-gray-800 text-white px-3 py-1 rounded border border-gray-700"
              >
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
                <option value="cpp">C++</option>
                <option value="java">Java</option>
              </select>

              <select
                onChange={(e) => handleLoadTemplate(e.target.value)}
                className="bg-gray-800 text-white px-3 py-1 rounded border border-gray-700"
                defaultValue=""
              >
                <option value="" disabled>
                  Load Template
                </option>
                <option value="bfs">BFS</option>
                <option value="dfs">DFS</option>
                <option value="dijkstra">Dijkstra</option>
                <option value="quicksort">QuickSort</option>
                <option value="mergesort">MergeSort</option>
                <option value="stack">Stack</option>
                <option value="queue">Queue</option>
                <option value="binarytree">Binary Tree</option>
              </select>

              <button
                onClick={handleRunVisualization}
                className="ml-auto bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-1 rounded font-medium flex items-center gap-1"
              >
                <Play size={16} /> Run
              </button>
            </div>

            <CodeEditor
              value={code}
              onChange={setCode}
              language={language}
              theme={theme === "dark" ? "vs-dark" : "vs"}
            />

            {/* Complexity Analysis */}
            <ComplexityAnalysis code={code} language={language} theme={theme} />

            {showConsole && (
              <div
                className={`mt-2 p-3 rounded ${theme === "dark" ? "bg-gray-900" : "bg-gray-200"} h-32 overflow-y-auto font-mono text-sm`}
              >
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold">Console Output</h3>
                  <button onClick={() => setShowConsole(false)} className="text-gray-400 hover:text-gray-200">
                    ✕
                  </button>
                </div>
                {consoleOutput.map((line, i) => (
                  <div key={i} className="py-1">
                    {`> ${line}`}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Right Pane - Visualization Area */}
        {(!isMobile || activeTab === "visualization") && (
          <div className={`${isMobile ? "h-full" : "w-1/2"} flex flex-col gap-4`}>
            <div className="flex items-center gap-2 mb-2">
              <button
                onClick={isPaused ? handlePlay : handlePause}
                className={`${theme === "dark" ? "bg-gray-800 hover:bg-gray-700" : "bg-gray-300 hover:bg-gray-400"} px-3 py-1 rounded flex items-center gap-1`}
              >
                {isPaused ? <Play size={16} /> : <Pause size={16} />}
                <span className={isMobile ? "hidden" : ""}>{isPaused ? "Play" : "Pause"}</span>
              </button>

              <button
                onClick={handleStepBackward}
                className={`${theme === "dark" ? "bg-gray-800 hover:bg-gray-700" : "bg-gray-300 hover:bg-gray-400"} px-3 py-1 rounded flex items-center gap-1`}
                disabled={currentStep === 0}
              >
                <SkipBack size={16} />
                <span className={isMobile ? "hidden" : ""}>Back</span>
              </button>

              <button
                onClick={handleStepForward}
                className={`${theme === "dark" ? "bg-gray-800 hover:bg-gray-700" : "bg-gray-300 hover:bg-gray-400"} px-3 py-1 rounded flex items-center gap-1`}
                disabled={currentStep === totalSteps - 1}
              >
                <SkipForward size={16} />
                <span className={isMobile ? "hidden" : ""}>Next</span>
              </button>

              <button
                onClick={handleReset}
                className={`${theme === "dark" ? "bg-gray-800 hover:bg-gray-700" : "bg-gray-300 hover:bg-gray-400"} px-3 py-1 rounded flex items-center gap-1`}
              >
                <RotateCcw size={16} />
                <span className={isMobile ? "hidden" : ""}>Reset</span>
              </button>

              <div className="ml-auto flex items-center gap-2">
                <span className="text-sm">Speed:</span>
                <input
                  type="range"
                  min="0.5"
                  max="3"
                  step="0.5"
                  value={speed}
                  onChange={(e) => setSpeed(Number.parseFloat(e.target.value))}
                  className="w-24"
                />
              </div>
            </div>

            <div className="flex-1 flex flex-col gap-4">
              <VisualizationArea data={visualizationData} currentStep={currentStep} theme={theme} />

              {/* Data Structure Visualization */}
              <DataStructureVisualizer type={dataStructureType} code={code} language={language} theme={theme} />
            </div>

            <button
              onClick={() => setShowConsole(!showConsole)}
              className={`mt-auto ${theme === "dark" ? "bg-gray-800 hover:bg-gray-700" : "bg-gray-300 hover:bg-gray-400"} px-3 py-1 rounded text-sm self-start`}
            >
              {showConsole ? "Hide Console" : "Show Console"}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
