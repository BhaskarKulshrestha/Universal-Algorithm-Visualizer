"use client"

import { useRef, useEffect } from "react"

interface VisualizationAreaProps {
  data: any
  currentStep: number
  theme: string
}

export const VisualizationArea = ({ data, currentStep, theme }: VisualizationAreaProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!data || !canvasRef.current || !containerRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size to match container
    canvas.width = containerRef.current.clientWidth
    canvas.height = containerRef.current.clientHeight

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Set colors based on theme
    const nodeColor = theme === "dark" ? "#4ade80" : "#16a34a"
    const edgeColor = theme === "dark" ? "#94a3b8" : "#64748b"
    const visitedColor = theme === "dark" ? "#f97316" : "#ea580c"
    const currentColor = theme === "dark" ? "#ec4899" : "#db2777"
    const textColor = theme === "dark" ? "#f8fafc" : "#0f172a"
    const bgColor = theme === "dark" ? "#1e293b" : "#e2e8f0"
    const highlightColor = theme === "dark" ? "#fcd34d" : "#fbbf24"

    // Get current step data
    const stepData = data.steps[currentStep]
    if (!stepData) return

    // Render based on visualization type
    if (data.type === "bfs" || data.type === "dfs") {
      renderGraph(ctx, stepData, canvas.width, canvas.height, {
        nodeColor,
        edgeColor,
        visitedColor,
        currentColor,
        textColor,
        highlightColor,
        type: data.type,
      })
    } else if (data.type === "weighted-graph") {
      renderGraph(ctx, stepData, canvas.width, canvas.height, {
        nodeColor,
        edgeColor,
        visitedColor,
        currentColor,
        textColor,
        highlightColor,
        isWeighted: true,
      })
    } else if (data.type === "array") {
      renderArray(ctx, stepData, canvas.width, canvas.height, {
        nodeColor,
        visitedColor,
        currentColor,
        textColor,
        highlightColor,
      })
    } else if (data.type === "mergesort") {
      renderMergeSort(ctx, stepData, canvas.width, canvas.height, {
        nodeColor,
        visitedColor,
        currentColor,
        textColor,
        highlightColor,
      })
    } else if (data.type === "stack") {
      renderStack(ctx, stepData, canvas.width, canvas.height, {
        nodeColor,
        visitedColor,
        currentColor,
        textColor,
        bgColor,
        highlightColor,
      })
    } else if (data.type === "queue") {
      renderQueue(ctx, stepData, canvas.width, canvas.height, {
        nodeColor,
        visitedColor,
        currentColor,
        textColor,
        bgColor,
        highlightColor,
      })
    } else if (data.type === "binarytree") {
      renderBinaryTree(ctx, stepData, canvas.width, canvas.height, {
        nodeColor,
        visitedColor,
        currentColor,
        textColor,
        edgeColor,
        highlightColor,
      })
    } else {
      renderGeneric(ctx, stepData, canvas.width, canvas.height, {
        textColor,
        bgColor,
        highlightColor,
      })
    }

    // Render operation description
    if (stepData.operation) {
      renderOperationDescription(ctx, stepData.operation, canvas.width, canvas.height, {
        textColor,
        bgColor,
      })
    }
  }, [data, currentStep, theme])

  // Function to render graph visualization (BFS, DFS, Dijkstra)
  const renderGraph = (ctx, stepData, width, height, colors) => {
    const { nodes, edges, visited, current, queue, stack } = stepData

    // Calculate node positions (in a circle)
    const nodePositions = {}
    const centerX = width / 2
    const centerY = height / 2 - 30 // Adjust for operation description
    const radius = Math.min(width, height) * 0.35

    nodes.forEach((node, index) => {
      const angle = (index / nodes.length) * 2 * Math.PI
      nodePositions[node] = {
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
      }
    })

    // Draw edges
    ctx.strokeStyle = colors.edgeColor
    ctx.lineWidth = 2

    edges.forEach((edge) => {
      let from, to, weight

      if (colors.isWeighted) {
        from = edge.from
        to = edge.to
        weight = edge.weight
      } else {
        ;[from, to] = edge
      }

      const fromPos = nodePositions[from]
      const toPos = nodePositions[to]

      ctx.beginPath()
      ctx.moveTo(fromPos.x, fromPos.y)
      ctx.lineTo(toPos.x, toPos.y)
      ctx.stroke()

      // Draw weight if it's a weighted graph
      if (colors.isWeighted && weight !== undefined) {
        const midX = (fromPos.x + toPos.x) / 2
        const midY = (fromPos.y + toPos.y) / 2

        // Draw background for better readability
        ctx.fillStyle = colors.bgColor || "#1e293b"
        ctx.beginPath()
        ctx.arc(midX, midY, 12, 0, 2 * Math.PI)
        ctx.fill()

        ctx.fillStyle = colors.textColor
        ctx.font = "12px Arial"
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"
        ctx.fillText(weight.toString(), midX, midY)
      }
    })

    // Draw nodes
    const nodeRadius = 20

    nodes.forEach((node) => {
      const pos = nodePositions[node]

      // Determine node color based on state
      if (node === current) {
        ctx.fillStyle = colors.currentColor
      } else if (visited && visited.includes(node)) {
        ctx.fillStyle = colors.visitedColor
      } else {
        ctx.fillStyle = colors.nodeColor
      }

      // Draw node circle
      ctx.beginPath()
      ctx.arc(pos.x, pos.y, nodeRadius, 0, 2 * Math.PI)
      ctx.fill()

      // Draw node label
      ctx.fillStyle = colors.textColor
      ctx.font = "bold 14px Arial"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.fillText(node, pos.x, pos.y)
    })

    // Draw variables state
    if (stepData.variables) {
      renderVariablesState(ctx, stepData.variables, width, height, colors)
    }

    // Draw queue for BFS
    if (queue && colors.type === "bfs") {
      const queueY = height - 80
      const queueHeight = 40
      const itemWidth = 40
      const startX = (width - queue.length * itemWidth) / 2

      ctx.fillStyle = colors.textColor
      ctx.font = "14px Arial"
      ctx.textAlign = "center"
      ctx.fillText("Queue:", startX - 50, queueY + queueHeight / 2)

      // Draw queue items
      queue.forEach((item, index) => {
        const x = startX + index * itemWidth

        // Draw box
        ctx.fillStyle = index === 0 ? colors.highlightColor : colors.nodeColor
        ctx.fillRect(x, queueY, itemWidth - 4, queueHeight)

        // Draw text
        ctx.fillStyle = colors.textColor
        ctx.font = "bold 14px Arial"
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"
        ctx.fillText(item, x + (itemWidth - 4) / 2, queueY + queueHeight / 2)
      })

      // Draw dequeue/enqueue arrows if there's an operation
      if (stepData.operation) {
        const op = stepData.operation

        if (op.type === "dequeue") {
          // Draw dequeue arrow
          ctx.strokeStyle = colors.currentColor
          ctx.lineWidth = 2
          ctx.beginPath()
          ctx.moveTo(startX + itemWidth / 2, queueY - 15)
          ctx.lineTo(startX + itemWidth / 2, queueY - 5)
          ctx.stroke()

          // Draw arrowhead
          ctx.beginPath()
          ctx.moveTo(startX + itemWidth / 2, queueY - 15)
          ctx.lineTo(startX + itemWidth / 2 - 5, queueY - 10)
          ctx.lineTo(startX + itemWidth / 2 + 5, queueY - 10)
          ctx.closePath()
          ctx.fill()
        } else if (op.type === "enqueue") {
          const lastX = startX + (queue.length - 1) * itemWidth + itemWidth / 2

          // Draw enqueue arrow
          ctx.strokeStyle = colors.currentColor
          ctx.lineWidth = 2
          ctx.beginPath()
          ctx.moveTo(lastX, queueY - 15)
          ctx.lineTo(lastX, queueY - 5)
          ctx.stroke()

          // Draw arrowhead
          ctx.beginPath()
          ctx.moveTo(lastX, queueY - 5)
          ctx.lineTo(lastX - 5, queueY - 10)
          ctx.lineTo(lastX + 5, queueY - 10)
          ctx.closePath()
          ctx.fill()
        }
      }
    }

    // Draw stack for DFS
    if (stack && colors.type === "dfs") {
      const stackX = width - 80
      const stackWidth = 40
      const itemHeight = 30
      const startY = (height - stack.length * itemHeight) / 2

      ctx.fillStyle = colors.textColor
      ctx.font = "14px Arial"
      ctx.textAlign = "center"
      ctx.fillText("Stack:", stackX + stackWidth / 2, startY - 20)

      // Draw stack items from bottom to top
      stack.forEach((item, index) => {
        const y = startY + (stack.length - 1 - index) * itemHeight

        // Draw box
        ctx.fillStyle = index === stack.length - 1 ? colors.highlightColor : colors.nodeColor
        ctx.fillRect(stackX, y, stackWidth, itemHeight - 4)

        // Draw text
        ctx.fillStyle = colors.textColor
        ctx.font = "bold 14px Arial"
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"
        ctx.fillText(item, stackX + stackWidth / 2, y + (itemHeight - 4) / 2)
      })

      // Draw push/pop arrows if there's an operation
      if (stepData.operation) {
        const op = stepData.operation

        if (op.type === "push") {
          // Draw push arrow
          const topY = startY + (stack.length - 1) * itemHeight

          ctx.strokeStyle = colors.currentColor
          ctx.lineWidth = 2
          ctx.beginPath()
          ctx.moveTo(stackX - 15, topY + itemHeight / 2)
          ctx.lineTo(stackX - 5, topY + itemHeight / 2)
          ctx.stroke()

          // Draw arrowhead
          ctx.beginPath()
          ctx.moveTo(stackX - 5, topY + itemHeight / 2)
          ctx.lineTo(stackX - 10, topY + itemHeight / 2 - 5)
          ctx.lineTo(stackX - 10, topY + itemHeight / 2 + 5)
          ctx.closePath()
          ctx.fill()
        } else if (op.type === "pop") {
          // Draw pop arrow
          const topY = startY

          ctx.strokeStyle = colors.currentColor
          ctx.lineWidth = 2
          ctx.beginPath()
          ctx.moveTo(stackX - 5, topY + itemHeight / 2)
          ctx.lineTo(stackX - 15, topY + itemHeight / 2)
          ctx.stroke()

          // Draw arrowhead
          ctx.beginPath()
          ctx.moveTo(stackX - 15, topY + itemHeight / 2)
          ctx.lineTo(stackX - 10, topY + itemHeight / 2 - 5)
          ctx.lineTo(stackX - 10, topY + itemHeight / 2 + 5)
          ctx.closePath()
          ctx.fill()
        }
      }
    }

    // Draw distances for Dijkstra
    if (stepData.distances) {
      ctx.fillStyle = colors.textColor
      ctx.font = "14px Arial"
      ctx.textAlign = "left"

      let y = 20
      ctx.fillText("Distances:", 20, y)
      y += 20

      Object.entries(stepData.distances).forEach(([node, distance]) => {
        ctx.fillText(`${node}: ${distance === Number.POSITIVE_INFINITY ? "∞" : distance}`, 30, y)
        y += 20
      })
    }
  }

  // Function to render array visualization (QuickSort)
  const renderArray = (ctx, stepData, width, height, colors) => {
    const { array, pivot, low, high, swapping, operation } = stepData

    const boxSize = Math.min(width / (array.length + 2), 60)
    const startX = (width - array.length * boxSize) / 2
    const startY = height / 2 - boxSize - 30 // Adjust for operation description

    // Draw array boxes
    array.forEach((value, index) => {
      // Determine box color based on state
      let boxColor = colors.nodeColor

      if (operation && operation.type === "compare" && operation.value && operation.value.includes(index)) {
        boxColor = colors.highlightColor
      } else if (swapping && (index === swapping[0] || index === swapping[1])) {
        boxColor = colors.currentColor
      } else if (index === pivot) {
        boxColor = colors.visitedColor
      } else if (low !== undefined && high !== undefined && index >= low && index <= high) {
        boxColor = colors.nodeColor
      } else {
        boxColor = colors.nodeColor + "80" // Semi-transparent
      }

      // Draw box
      const x = startX + index * boxSize
      const y = startY

      ctx.fillStyle = boxColor
      ctx.fillRect(x, y, boxSize, boxSize)
      ctx.strokeStyle = colors.textColor
      ctx.lineWidth = 1
      ctx.strokeRect(x, y, boxSize, boxSize)

      // Draw value
      ctx.fillStyle = colors.textColor
      ctx.font = "bold 16px Arial"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.fillText(value.toString(), x + boxSize / 2, y + boxSize / 2)

      // Draw index
      ctx.font = "12px Arial"
      ctx.fillText(index.toString(), x + boxSize / 2, y + boxSize + 15)
    })

    // Draw pivot indicator
    if (pivot !== undefined) {
      ctx.fillStyle = colors.textColor
      ctx.font = "14px Arial"
      ctx.textAlign = "center"
      ctx.fillText("Pivot", startX + pivot * boxSize + boxSize / 2, startY - 20)
    }

    // Draw low/high indicators
    if (low !== undefined && high !== undefined) {
      ctx.fillStyle = colors.textColor
      ctx.font = "14px Arial"
      ctx.textAlign = "center"
      ctx.fillText("low", startX + low * boxSize + boxSize / 2, startY - 40)
      ctx.fillText("high", startX + high * boxSize + boxSize / 2, startY - 40)
    }

    // Draw swap indicator
    if (swapping) {
      const [i, j] = swapping
      const x1 = startX + i * boxSize + boxSize / 2
      const x2 = startX + j * boxSize + boxSize / 2
      const y = startY + boxSize + 30

      ctx.strokeStyle = colors.currentColor
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(x1, y)
      ctx.lineTo(x2, y)
      ctx.stroke()

      // Draw arrowheads
      const arrowSize = 8

      // Arrow from i to j
      ctx.beginPath()
      ctx.moveTo(x2, y)
      ctx.lineTo(x2 - arrowSize, y - arrowSize)
      ctx.lineTo(x2 - arrowSize, y + arrowSize)
      ctx.closePath()
      ctx.fill()

      // Arrow from j to i
      ctx.beginPath()
      ctx.moveTo(x1, y)
      ctx.lineTo(x1 + arrowSize, y - arrowSize)
      ctx.lineTo(x1 + arrowSize, y + arrowSize)
      ctx.closePath()
      ctx.fill()

      ctx.fillText("Swap", (x1 + x2) / 2, y - 15)
    }
  }

  // Function to render merge sort visualization
  const renderMergeSort = (ctx, stepData, width, height, colors) => {
    const { arrays, operation } = stepData

    const boxSize = 40
    const verticalSpacing = 60
    const startY = 50

    // Draw each array level
    arrays.forEach((array, level) => {
      const totalWidth = array.length * boxSize
      const startX = (width - totalWidth) / 2
      const y = startY + level * verticalSpacing

      // Draw array boxes
      array.forEach((value, index) => {
        const x = startX + index * boxSize

        // Determine if this array is being operated on
        let isHighlighted = false
        if (operation && operation.type === "merge" && operation.value) {
          const mergeArrays = operation.value
          if (mergeArrays.some((arr) => arr.length === array.length && arr.every((val, i) => val === array[i]))) {
            isHighlighted = true
          }
        } else if (operation && operation.type === "split") {
          // Highlight the array being split
          if (level === 0) {
            isHighlighted = true
          }
        }

        // Draw box
        ctx.fillStyle = isHighlighted ? colors.highlightColor : colors.nodeColor
        ctx.fillRect(x, y, boxSize, boxSize)
        ctx.strokeStyle = colors.textColor
        ctx.lineWidth = 1
        ctx.strokeRect(x, y, boxSize, boxSize)

        // Draw value
        ctx.fillStyle = colors.textColor
        ctx.font = "bold 14px Arial"
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"
        ctx.fillText(value.toString(), x + boxSize / 2, y + boxSize / 2)
      })

      // Draw arrows for merge or split operations
      if (level < arrays.length - 1 && arrays[level + 1]) {
        const nextArray = arrays[level + 1]
        const nextTotalWidth = nextArray.length * boxSize
        const nextStartX = (width - nextTotalWidth) / 2

        // Draw arrow from this array to the next
        ctx.strokeStyle = colors.visitedColor
        ctx.lineWidth = 2

        const fromX = startX + totalWidth / 2
        const fromY = y + boxSize
        const toX = nextStartX + nextTotalWidth / 2
        const toY = startY + (level + 1) * verticalSpacing

        ctx.beginPath()
        ctx.moveTo(fromX, fromY)
        ctx.lineTo(toX, toY)
        ctx.stroke()

        // Draw arrowhead
        const arrowSize = 8
        const angle = Math.atan2(toY - fromY, toX - fromX)

        ctx.beginPath()
        ctx.moveTo(toX, toY)
        ctx.lineTo(toX - arrowSize * Math.cos(angle - Math.PI / 6), toY - arrowSize * Math.sin(angle - Math.PI / 6))
        ctx.lineTo(toX - arrowSize * Math.cos(angle + Math.PI / 6), toY - arrowSize * Math.sin(angle + Math.PI / 6))
        ctx.closePath()
        ctx.fill()
      }
    })
  }

  // Function to render stack visualization
  const renderStack = (ctx, stepData, width, height, colors) => {
    const { stack, operation } = stepData

    const stackWidth = 120
    const itemHeight = 40
    const startX = (width - stackWidth) / 2
    const maxItems = 6 // Maximum number of items to show

    // Draw stack title
    ctx.fillStyle = colors.textColor
    ctx.font = "bold 16px Arial"
    ctx.textAlign = "center"
    ctx.fillText("Stack", width / 2, 30)

    // Draw stack container
    const containerHeight = Math.min(stack.length, maxItems) * itemHeight + 20
    const startY = 50

    ctx.strokeStyle = colors.textColor
    ctx.lineWidth = 2
    ctx.strokeRect(startX, startY, stackWidth, containerHeight)

    // Draw "top" label
    ctx.fillStyle = colors.textColor
    ctx.font = "14px Arial"
    ctx.textAlign = "left"
    ctx.fillText("top →", startX - 50, startY + itemHeight / 2)

    // Draw stack items from top to bottom
    const visibleStack = stack.slice(-maxItems) // Show only the last maxItems elements

    visibleStack.forEach((item, index) => {
      const y = startY + index * itemHeight + 10

      // Determine if this item is being operated on
      let isHighlighted = false
      if (operation) {
        if (operation.type === "push" && index === 0 && operation.value === item) {
          isHighlighted = true
        } else if (operation.type === "pop" && index === 0) {
          isHighlighted = true
        } else if (operation.type === "peek" && index === 0) {
          isHighlighted = true
        }
      }

      // Draw item background
      ctx.fillStyle = isHighlighted ? colors.highlightColor : colors.bgColor
      ctx.fillRect(startX + 5, y, stackWidth - 10, itemHeight - 10)

      // Draw item border
      ctx.strokeStyle = colors.textColor
      ctx.lineWidth = 1
      ctx.strokeRect(startX + 5, y, stackWidth - 10, itemHeight - 10)

      // Draw item value
      ctx.fillStyle = colors.textColor
      ctx.font = "bold 14px Arial"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.fillText(item.toString(), startX + stackWidth / 2, y + (itemHeight - 10) / 2)
    })

    // Draw operation animation
    if (operation) {
      if (operation.type === "push") {
        // Draw push animation
        const arrowY = startY + itemHeight / 2

        ctx.strokeStyle = colors.currentColor
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.moveTo(startX - 80, arrowY)
        ctx.lineTo(startX - 20, arrowY)
        ctx.stroke()

        // Draw arrowhead
        ctx.beginPath()
        ctx.moveTo(startX - 20, arrowY)
        ctx.lineTo(startX - 30, arrowY - 5)
        ctx.lineTo(startX - 30, arrowY + 5)
        ctx.closePath()
        ctx.fill()

        // Draw value being pushed
        ctx.fillStyle = colors.textColor
        ctx.font = "14px Arial"
        ctx.textAlign = "center"
        ctx.fillText(`Push: ${operation.value}`, startX - 100, arrowY - 20)
      } else if (operation.type === "pop") {
        // Draw pop animation
        const arrowY = startY + itemHeight / 2

        ctx.strokeStyle = colors.currentColor
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.moveTo(startX - 20, arrowY)
        ctx.lineTo(startX - 80, arrowY)
        ctx.stroke()

        // Draw arrowhead
        ctx.beginPath()
        ctx.moveTo(startX - 80, arrowY)
        ctx.lineTo(startX - 70, arrowY - 5)
        ctx.lineTo(startX - 70, arrowY + 5)
        ctx.closePath()
        ctx.fill()

        // Draw value being popped
        ctx.fillStyle = colors.textColor
        ctx.font = "14px Arial"
        ctx.textAlign = "center"
        ctx.fillText(`Pop: ${operation.value}`, startX - 100, arrowY - 20)
      }
    }
  }

  // Function to render queue visualization
  const renderQueue = (ctx, stepData, width, height, colors) => {
    const { queue, operation } = stepData

    const queueHeight = 60
    const itemWidth = 50
    const startY = (height - queueHeight) / 2
    const maxItems = 8 // Maximum number of items to show

    // Draw queue title
    ctx.fillStyle = colors.textColor
    ctx.font = "bold 16px Arial"
    ctx.textAlign = "center"
    ctx.fillText("Queue", width / 2, startY - 20)

    // Draw queue container
    const containerWidth = Math.min(queue.length, maxItems) * itemWidth + 20
    const startX = (width - containerWidth) / 2

    ctx.strokeStyle = colors.textColor
    ctx.lineWidth = 2
    ctx.strokeRect(startX, startY, containerWidth, queueHeight)

    // Draw "front" and "rear" labels
    ctx.fillStyle = colors.textColor
    ctx.font = "14px Arial"
    ctx.textAlign = "center"
    ctx.fillText("front", startX + itemWidth / 2, startY - 5)
    ctx.fillText("rear", startX + containerWidth - itemWidth / 2, startY - 5)

    // Draw queue items from front to rear
    const visibleQueue = queue.slice(0, maxItems) // Show only the first maxItems elements

    visibleQueue.forEach((item, index) => {
      const x = startX + index * itemWidth + 10

      // Determine if this item is being operated on
      let isHighlighted = false
      if (operation) {
        if (operation.type === "enqueue" && index === visibleQueue.length - 1 && operation.value === item) {
          isHighlighted = true
        } else if (operation.type === "dequeue" && index === 0) {
          isHighlighted = true
        } else if (operation.type === "front" && index === 0) {
          isHighlighted = true
        }
      }

      // Draw item background
      ctx.fillStyle = isHighlighted ? colors.highlightColor : colors.bgColor
      ctx.fillRect(x, startY + 10, itemWidth - 20, queueHeight - 20)

      // Draw item border
      ctx.strokeStyle = colors.textColor
      ctx.lineWidth = 1
      ctx.strokeRect(x, startY + 10, itemWidth - 20, queueHeight - 20)

      // Draw item value
      ctx.fillStyle = colors.textColor
      ctx.font = "bold 14px Arial"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.fillText(item.toString(), x + (itemWidth - 20) / 2, startY + queueHeight / 2)
    })

    // Draw operation animation
    if (operation) {
      if (operation.type === "enqueue") {
        // Draw enqueue animation
        const arrowX = startX + containerWidth - itemWidth / 2

        ctx.strokeStyle = colors.currentColor
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.moveTo(arrowX, startY - 40)
        ctx.lineTo(arrowX, startY - 10)
        ctx.stroke()

        // Draw arrowhead
        ctx.beginPath()
        ctx.moveTo(arrowX, startY - 10)
        ctx.lineTo(arrowX - 5, startY - 20)
        ctx.lineTo(arrowX + 5, startY - 20)
        ctx.closePath()
        ctx.fill()

        // Draw value being enqueued
        ctx.fillStyle = colors.textColor
        ctx.font = "14px Arial"
        ctx.textAlign = "center"
        ctx.fillText(`Enqueue: ${operation.value}`, arrowX, startY - 50)
      } else if (operation.type === "dequeue") {
        // Draw dequeue animation
        const arrowX = startX + itemWidth / 2

        ctx.strokeStyle = colors.currentColor
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.moveTo(arrowX, startY - 10)
        ctx.lineTo(arrowX, startY - 40)
        ctx.stroke()

        // Draw arrowhead
        ctx.beginPath()
        ctx.moveTo(arrowX, startY - 40)
        ctx.lineTo(arrowX - 5, startY - 30)
        ctx.lineTo(arrowX + 5, startY - 30)
        ctx.closePath()
        ctx.fill()

        // Draw value being dequeued
        ctx.fillStyle = colors.textColor
        ctx.font = "14px Arial"
        ctx.textAlign = "center"
        ctx.fillText(`Dequeue: ${operation.value}`, arrowX, startY - 50)
      }
    }
  }

  // Function to render binary tree visualization
  const renderBinaryTree = (ctx, stepData, width, height, colors) => {
    const { tree, current, traversal, operation } = stepData

    // Calculate tree layout
    const nodeRadius = 20
    const levelHeight = 70
    const startY = 50

    // Function to recursively draw the tree
    const drawNode = (node, x, y, level) => {
      if (!node) return

      // Calculate child positions
      const xOffset = width / Math.pow(2, level + 2)
      const leftX = x - xOffset
      const rightX = x + xOffset
      const childY = y + levelHeight

      // Draw edges to children
      ctx.strokeStyle = colors.edgeColor
      ctx.lineWidth = 2

      if (node.left) {
        ctx.beginPath()
        ctx.moveTo(x, y)
        ctx.lineTo(leftX, childY)
        ctx.stroke()
      }

      if (node.right) {
        ctx.beginPath()
        ctx.moveTo(x, y)
        ctx.lineTo(rightX, childY)
        ctx.stroke()
      }

      // Determine node color
      let nodeColor = colors.nodeColor
      if (current === node.value) {
        nodeColor = colors.currentColor
      } else if (operation && operation.type === "search" && operation.value === node.value) {
        nodeColor = colors.highlightColor
      } else if (operation && operation.type === "insert" && operation.value === node.value) {
        nodeColor = colors.highlightColor
      }

      // Draw node
      ctx.fillStyle = nodeColor
      ctx.beginPath()
      ctx.arc(x, y, nodeRadius, 0, 2 * Math.PI)
      ctx.fill()

      // Draw node value
      ctx.fillStyle = colors.textColor
      ctx.font = "bold 14px Arial"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.fillText(node.value.toString(), x, y)

      // Recursively draw children
      if (node.left) {
        drawNode(node.left, leftX, childY, level + 1)
      }

      if (node.right) {
        drawNode(node.right, rightX, childY, level + 1)
      }
    }

    // Draw the tree
    drawNode(tree, width / 2, startY, 0)

    // Draw traversal if available
    if (traversal) {
      const traversalY = height - 50

      ctx.fillStyle = colors.textColor
      ctx.font = "14px Arial"
      ctx.textAlign = "center"
      ctx.fillText(`${operation.value} Traversal: [${traversal.join(", ")}]`, width / 2, traversalY)
    }
  }

  // Function to render generic visualization (variables, call stack, etc.)
  const renderGeneric = (ctx, stepData, width, height, colors) => {
    const { variables, callStack, lineHighlight } = stepData

    // Draw variables state
    if (variables) {
      renderVariablesState(ctx, variables, width, height, colors)
    }

    // Draw call stack
    if (callStack) {
      const stackWidth = 200
      const stackX = width - stackWidth - 20
      let stackY = 20

      ctx.fillStyle = colors.textColor
      ctx.font = "bold 16px Arial"
      ctx.textAlign = "left"
      ctx.fillText("Call Stack:", stackX, stackY)
      stackY += 30

      // Draw stack frames
      callStack.forEach((frame, index) => {
        const frameHeight = 40

        ctx.fillStyle = colors.bgColor
        ctx.fillRect(stackX, stackY, stackWidth, frameHeight)
        ctx.strokeStyle = colors.textColor
        ctx.lineWidth = 1
        ctx.strokeRect(stackX, stackY, stackWidth, frameHeight)

        ctx.fillStyle = colors.textColor
        ctx.font = "14px Arial"
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"
        ctx.fillText(frame, stackX + stackWidth / 2, stackY + frameHeight / 2)

        stackY += frameHeight + 5
      })
    }

    // Draw line highlight indicator
    if (lineHighlight) {
      ctx.fillStyle = colors.textColor
      ctx.font = "14px Arial"
      ctx.textAlign = "left"
      ctx.fillText(`Current Line: ${lineHighlight}`, 20, height - 20)
    }
  }

  // Function to render variables state
  const renderVariablesState = (ctx, variables, width, height, colors) => {
    ctx.fillStyle = colors.textColor
    ctx.font = "bold 16px Arial"
    ctx.textAlign = "left"
    ctx.fillText("Variables:", 20, 20)

    ctx.font = "14px Arial"
    let y = 50

    Object.entries(variables).forEach(([name, value]) => {
      let displayValue = value

      // Format arrays nicely
      if (Array.isArray(value)) {
        displayValue = `[${value.join(", ")}]`
      }

      ctx.fillText(`${name}: ${displayValue}`, 30, y)
      y += 25
    })
  }

  // Function to render operation description
  const renderOperationDescription = (ctx, operation, width, height, colors) => {
    const description = operation.description

    // Draw description box at the bottom
    const boxHeight = 30
    const boxY = height - boxHeight - 10

    ctx.fillStyle = colors.bgColor
    ctx.fillRect(10, boxY, width - 20, boxHeight)
    ctx.strokeStyle = colors.textColor
    ctx.lineWidth = 1
    ctx.strokeRect(10, boxY, width - 20, boxHeight)

    // Draw description text
    ctx.fillStyle = colors.textColor
    ctx.font = "14px Arial"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillText(description, width / 2, boxY + boxHeight / 2)
  }

  if (!data) {
    return (
      <div
        ref={containerRef}
        className={`flex-1 flex items-center justify-center border border-gray-700 rounded ${theme === "dark" ? "bg-gray-900" : "bg-gray-200"}`}
      >
        <div className="text-center p-8">
          <h3 className="text-xl font-semibold mb-2">Algorithm Visualization</h3>
          <p className="text-gray-400">Write or load an algorithm and click "Run Visualization" to see it in action.</p>
        </div>
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className={`flex-1 relative border border-gray-700 rounded overflow-hidden ${theme === "dark" ? "bg-gray-900" : "bg-gray-200"}`}
    >
      <canvas ref={canvasRef} className="w-full h-full" />

      {data && data.steps && (
        <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
          <div className={`px-3 py-1 rounded ${theme === "dark" ? "bg-gray-800" : "bg-gray-300"}`}>
            Step {currentStep + 1} of {data.steps.length}
          </div>
        </div>
      )}
    </div>
  )
}
