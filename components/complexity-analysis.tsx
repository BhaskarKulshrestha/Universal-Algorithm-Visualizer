"use client"

import { useState, useEffect } from "react"

interface ComplexityAnalysisProps {
  code: string
  language: string
  theme: string
}

export const ComplexityAnalysis = ({ code, language, theme }: ComplexityAnalysisProps) => {
  const [timeComplexity, setTimeComplexity] = useState<string>("O(1)")
  const [spaceComplexity, setSpaceComplexity] = useState<string>("O(1)")
  const [explanation, setExplanation] = useState<string>("")

  useEffect(() => {
    if (!code) return

    // Analyze code to determine complexity
    const { time, space, explanation } = analyzeComplexity(code, language)
    setTimeComplexity(time)
    setSpaceComplexity(space)
    setExplanation(explanation)
  }, [code, language])

  const analyzeComplexity = (code: string, language: string) => {
    const lowerCode = code.toLowerCase()
    let time = "O(1)" // Default
    let space = "O(1)" // Default
    let explanation = "Simple operations with constant time and space complexity."

    // Check for common sorting algorithms
    if (lowerCode.includes("quicksort") || lowerCode.includes("quick sort")) {
      time = "O(n log n) average, O(n²) worst case"
      space = "O(log n)"
      explanation =
        "QuickSort has average case time complexity of O(n log n) but can degrade to O(n²) in worst case. Space complexity is O(log n) due to the recursion stack."
    } else if (lowerCode.includes("mergesort") || lowerCode.includes("merge sort")) {
      time = "O(n log n)"
      space = "O(n)"
      explanation =
        "MergeSort consistently performs at O(n log n) time complexity. Space complexity is O(n) as it requires additional space proportional to the input size."
    } else if (lowerCode.includes("bubblesort") || lowerCode.includes("bubble sort")) {
      time = "O(n²)"
      space = "O(1)"
      explanation =
        "BubbleSort has O(n²) time complexity due to nested iterations. Space complexity is O(1) as it sorts in-place."
    } else if (lowerCode.includes("insertionsort") || lowerCode.includes("insertion sort")) {
      time = "O(n²)"
      space = "O(1)"
      explanation =
        "InsertionSort has O(n²) time complexity due to nested iterations. Space complexity is O(1) as it sorts in-place."
    } else if (lowerCode.includes("heapsort") || lowerCode.includes("heap sort")) {
      time = "O(n log n)"
      space = "O(1)"
      explanation = "HeapSort has O(n log n) time complexity. Space complexity is O(1) as it sorts in-place."
    }

    // Check for search algorithms
    else if (lowerCode.includes("binarysearch") || lowerCode.includes("binary search")) {
      time = "O(log n)"
      space = "O(1)"
      explanation =
        "Binary search has O(log n) time complexity as it divides the search space in half each time. Space complexity is O(1) for iterative implementation."
    } else if (lowerCode.includes("linearsearch") || lowerCode.includes("linear search")) {
      time = "O(n)"
      space = "O(1)"
      explanation =
        "Linear search has O(n) time complexity as it may need to check every element. Space complexity is O(1)."
    }

    // Check for graph algorithms
    else if (lowerCode.includes("bfs") || (lowerCode.includes("breadth") && lowerCode.includes("search"))) {
      time = "O(V + E)"
      space = "O(V)"
      explanation =
        "Breadth-First Search has O(V + E) time complexity where V is the number of vertices and E is the number of edges. Space complexity is O(V) for the queue and visited set."
    } else if (lowerCode.includes("dfs") || (lowerCode.includes("depth") && lowerCode.includes("search"))) {
      time = "O(V + E)"
      space = "O(V)"
      explanation =
        "Depth-First Search has O(V + E) time complexity where V is the number of vertices and E is the number of edges. Space complexity is O(V) for the recursion stack and visited set."
    } else if (lowerCode.includes("dijkstra")) {
      time = "O((V + E) log V)"
      space = "O(V)"
      explanation =
        "Dijkstra's algorithm has O((V + E) log V) time complexity with a priority queue implementation, where V is the number of vertices and E is the number of edges. Space complexity is O(V)."
    }

    // Check for data structures
    else if (lowerCode.includes("class stack") || (lowerCode.includes("push") && lowerCode.includes("pop"))) {
      time = "O(1) for push/pop"
      space = "O(n)"
      explanation =
        "Stack operations (push, pop, peek) have O(1) time complexity. Space complexity is O(n) where n is the number of elements in the stack."
    } else if (lowerCode.includes("class queue") || (lowerCode.includes("enqueue") && lowerCode.includes("dequeue"))) {
      time = "O(1) for enqueue/dequeue"
      space = "O(n)"
      explanation =
        "Queue operations (enqueue, dequeue) have O(1) time complexity. Space complexity is O(n) where n is the number of elements in the queue."
    } else if (lowerCode.includes("binary search tree") || lowerCode.includes("binarysearchtree")) {
      time = "O(log n) average, O(n) worst case"
      space = "O(n)"
      explanation =
        "Binary Search Tree operations have O(log n) time complexity on average, but can degrade to O(n) in worst case (unbalanced tree). Space complexity is O(n) for storing n nodes."
    }

    // Check for loops and nested loops
    else if (
      lowerCode.match(/for.*for/s) ||
      lowerCode.match(/while.*while/s) ||
      lowerCode.match(/for.*while/s) ||
      lowerCode.match(/while.*for/s)
    ) {
      time = "O(n²)"
      space = "O(1)"
      explanation =
        "The code contains nested loops, resulting in quadratic time complexity O(n²). Space complexity is O(1) assuming no additional data structures grow with input size."
    } else if (lowerCode.includes("for") || lowerCode.includes("while")) {
      time = "O(n)"
      space = "O(1)"
      explanation =
        "The code contains a loop, resulting in linear time complexity O(n). Space complexity is O(1) assuming no additional data structures grow with input size."
    }

    // Check for recursion
    else if (
      lowerCode.includes("function") &&
      lowerCode.includes("return") &&
      lowerCode.match(/\w+\s*$$[^)]*$$/g)?.some((call) => lowerCode.includes(call.trim()))
    ) {
      time = "Depends on recursion depth"
      space = "O(recursion depth)"
      explanation =
        "The code contains recursion. Time and space complexity depend on the recursion depth and the operations performed in each recursive call."
    }

    return { time, space, explanation }
  }

  return (
    <div className={`p-4 rounded ${theme === "dark" ? "bg-gray-900" : "bg-gray-200"} mt-4`}>
      <h3 className="text-lg font-semibold mb-2">Complexity Analysis</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p className="font-medium">Time Complexity:</p>
          <p className="font-mono">{timeComplexity}</p>
        </div>
        <div>
          <p className="font-medium">Space Complexity:</p>
          <p className="font-mono">{spaceComplexity}</p>
        </div>
      </div>
      <div className="mt-2">
        <p className="font-medium">Explanation:</p>
        <p className="text-sm">{explanation}</p>
      </div>
    </div>
  )
}
