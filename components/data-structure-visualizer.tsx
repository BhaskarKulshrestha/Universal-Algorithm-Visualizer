"use client"

import { useRef, useEffect, useState, useCallback } from "react"

interface DataStructureVisualizerProps {
  type: string
  code: string
  language: string
  theme: string
}

export const DataStructureVisualizer = ({ type, code, language, theme }: DataStructureVisualizerProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [dataStructure, setDataStructure] = useState<any>(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 300 })

  useEffect(() => {
    if (!code) return

    // Extract data structure from code
    const extractedData = extractDataStructure(code, type)
    setDataStructure(extractedData)
  }, [code, type])

  // Replace the resize handling useEffect with this debounced version
  useEffect(() => {
    if (!containerRef.current) return

    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: 300, // Fixed height
        })
      }
    }

    // Initial size
    updateDimensions()

    // Debounce resize handler to prevent too many updates
    let resizeTimer: NodeJS.Timeout | null = null
    const handleResize = () => {
      if (resizeTimer) {
        clearTimeout(resizeTimer)
      }
      resizeTimer = setTimeout(() => {
        updateDimensions()
      }, 100) // 100ms debounce
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
      if (resizeTimer) {
        clearTimeout(resizeTimer)
      }
    }
  }, [])

  // Modify the renderDataStructure function to be more resilient
  const renderDataStructure = useCallback(() => {
    if (!canvasRef.current || !dataStructure || !dimensions.width) return

    try {
      const canvas = canvasRef.current
      const ctx = canvas.getContext("2d")
      if (!ctx) return

      // Set canvas size to match container dimensions
      canvas.width = dimensions.width
      canvas.height = dimensions.height

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Set colors based on theme
      const primaryColor = theme === "dark" ? "#4ade80" : "#16a34a"
      const secondaryColor = theme === "dark" ? "#94a3b8" : "#64748b"
      const textColor = theme === "dark" ? "#f8fafc" : "#0f172a"
      const bgColor = theme === "dark" ? "#1e293b" : "#e2e8f0"

      // Render based on data structure type
      switch (type) {
        case "array":
          renderArray(ctx, dataStructure, canvas.width, canvas.height, { primaryColor, textColor })
          break
        case "stack":
          renderStack(ctx, dataStructure, canvas.width, canvas.height, { primaryColor, textColor, bgColor })
          break
        case "queue":
          renderQueue(ctx, dataStructure, canvas.width, canvas.height, { primaryColor, textColor, bgColor })
          break
        case "tree":
          renderTree(ctx, dataStructure, canvas.width, canvas.height, { primaryColor, secondaryColor, textColor })
          break
        case "graph":
          renderGraph(ctx, dataStructure, canvas.width, canvas.height, { primaryColor, secondaryColor, textColor })
          break
        default:
          renderPlaceholder(ctx, canvas.width, canvas.height, textColor)
      }
    } catch (error) {
      console.error("Error rendering data structure:", error)
    }
  }, [dataStructure, dimensions, theme, type])

  // Re-render when data, dimensions or theme changes
  useEffect(() => {
    renderDataStructure()
  }, [dataStructure, dimensions, theme, renderDataStructure])

  const extractDataStructure = (code: string, type: string) => {
    switch (type) {
      case "array":
        return extractArray(code)
      case "stack":
        return extractStack(code)
      case "queue":
        return extractQueue(code)
      case "tree":
        return extractTree(code)
      case "graph":
        return extractGraph(code)
      default:
        return null
    }
  }

  const extractArray = (code: string) => {
    // Try to find array declarations
    const arrayMatch = code.match(/(?:const|let|var)\s+(\w+)\s*=\s*\[(.*?)\]/s)
    if (arrayMatch && arrayMatch[2]) {
      try {
        // Try to parse the array values
        const arrayStr = arrayMatch[2].replace(/\s/g, "")
        const values = arrayStr.split(",").map((val) => {
          const num = Number(val.trim())
          return isNaN(num) ? val.trim().replace(/['"]/g, "") : num
        })
        return values
      } catch (e) {
        return [1, 2, 3, 4, 5] // Default array
      }
    }
    return [1, 2, 3, 4, 5] // Default array
  }

  const extractStack = (code: string) => {
    // Look for push operations to determine stack content
    const pushMatches = code.match(/push\s*$$\s*([^)]+)\s*$$/g)
    if (pushMatches) {
      try {
        const values = pushMatches
          .map((match) => {
            const valueMatch = match.match(/push\s*$$\s*([^)]+)\s*$$/)
            if (valueMatch && valueMatch[1]) {
              const val = valueMatch[1].trim()
              const num = Number(val.replace(/['"]/g, ""))
              return isNaN(num) ? val.replace(/['"]/g, "") : num
            }
            return null
          })
          .filter((val) => val !== null)
        return values
      } catch (e) {
        return [10, 20, 30] // Default stack
      }
    }
    return [10, 20, 30] // Default stack
  }

  const extractQueue = (code: string) => {
    // Look for enqueue operations to determine queue content
    const enqueueMatches = code.match(/enqueue\s*$$\s*([^)]+)\s*$$/g)
    if (enqueueMatches) {
      try {
        const values = enqueueMatches
          .map((match) => {
            const valueMatch = match.match(/enqueue\s*$$\s*([^)]+)\s*$$/)
            if (valueMatch && valueMatch[1]) {
              const val = valueMatch[1].trim()
              const num = Number(val.replace(/['"]/g, ""))
              return isNaN(num) ? val.replace(/['"]/g, "") : num
            }
            return null
          })
          .filter((val) => val !== null)
        return values
      } catch (e) {
        return [10, 20, 30] // Default queue
      }
    }
    return [10, 20, 30] // Default queue
  }

  const extractTree = (code: string) => {
    // Look for tree insert operations
    const insertMatches = code.match(/insert\s*$$\s*([^)]+)\s*$$/g)
    if (insertMatches) {
      try {
        const values = insertMatches
          .map((match) => {
            const valueMatch = match.match(/insert\s*$$\s*([^)]+)\s*$$/)
            if (valueMatch && valueMatch[1]) {
              const val = valueMatch[1].trim()
              const num = Number(val.replace(/['"]/g, ""))
              return isNaN(num) ? null : num
            }
            return null
          })
          .filter((val) => val !== null && val !== undefined)

        // Build a simple tree structure
        if (values.length > 0) {
          return buildTree(values)
        }
      } catch (e) {
        // Return default tree
        return {
          value: 10,
          left: { value: 5, left: { value: 3 }, right: { value: 7 } },
          right: { value: 15, left: { value: 12 }, right: { value: 18 } },
        }
      }
    }

    // Default tree
    return {
      value: 10,
      left: { value: 5, left: { value: 3 }, right: { value: 7 } },
      right: { value: 15, left: { value: 12 }, right: { value: 18 } },
    }
  }

  const buildTree = (values: number[]) => {
    if (!values.length) {
      // Return a default node if no values
      return { value: 0, left: null, right: null }
    }

    const root = { value: values[0], left: null, right: null }

    for (let i = 1; i < values.length; i++) {
      if (values[i] !== undefined && values[i] !== null) {
        insertNode(root, values[i])
      }
    }

    return root
  }

  const insertNode = (node: any, value: number) => {
    if (value < node.value) {
      if (node.left === null) {
        node.left = { value, left: null, right: null }
      } else {
        insertNode(node.left, value)
      }
    } else {
      if (node.right === null) {
        node.right = { value, left: null, right: null }
      } else {
        insertNode(node.right, value)
      }
    }
  }

  const extractGraph = (code: string) => {
    // Try to find graph declarations
    const graphMatch = code.match(/(?:const|let|var)\s+(\w+)\s*=\s*\{([^}]*)\}/s)

    if (graphMatch && graphMatch[2]) {
      try {
        // Create a simple graph representation
        const nodes = ["A", "B", "C", "D", "E"]
        const edges = [
          ["A", "B"],
          ["A", "C"],
          ["B", "D"],
          ["B", "E"],
          ["C", "E"],
        ]

        return { nodes, edges }
      } catch (e) {
        // Return default graph
        return {
          nodes: ["A", "B", "C", "D", "E"],
          edges: [
            ["A", "B"],
            ["A", "C"],
            ["B", "D"],
            ["C", "E"],
            ["D", "E"],
          ],
        }
      }
    }

    // Default graph
    return {
      nodes: ["A", "B", "C", "D", "E"],
      edges: [
        ["A", "B"],
        ["A", "C"],
        ["B", "D"],
        ["C", "E"],
        ["D", "E"],
      ],
    }
  }

  const renderArray = (ctx: CanvasRenderingContext2D, array: any[], width: number, height: number, colors: any) => {
    if (!array || array.length === 0) return

    const boxSize = Math.min(width / (array.length + 2), 60)
    const startX = (width - array.length * boxSize) / 2
    const startY = height / 2 - boxSize / 2

    // Draw title
    ctx.fillStyle = colors.textColor
    ctx.font = "bold 16px Arial"
    ctx.textAlign = "center"
    ctx.fillText("Array Visualization", width / 2, 30)

    // Draw array boxes
    array.forEach((value, index) => {
      const x = startX + index * boxSize
      const y = startY

      // Draw box
      ctx.fillStyle = colors.primaryColor
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

      // Draw index
      ctx.font = "12px Arial"
      ctx.fillText(index.toString(), x + boxSize / 2, y + boxSize + 15)
    })
  }

  const renderStack = (ctx: CanvasRenderingContext2D, stack: any[], width: number, height: number, colors: any) => {
    if (!stack || stack.length === 0) return

    const stackWidth = 120
    const itemHeight = 40
    const startX = (width - stackWidth) / 2
    const maxItems = Math.min(stack.length, 6) // Show at most 6 items
    const containerHeight = maxItems * itemHeight + 20
    const startY = (height - containerHeight) / 2

    // Draw title
    ctx.fillStyle = colors.textColor
    ctx.font = "bold 16px Arial"
    ctx.textAlign = "center"
    ctx.fillText("Stack Visualization", width / 2, 30)

    // Draw stack container
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

      // Draw item background
      ctx.fillStyle = index === 0 ? colors.primaryColor : colors.bgColor
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
  }

  const renderQueue = (ctx: CanvasRenderingContext2D, queue: any[], width: number, height: number, colors: any) => {
    if (!queue || queue.length === 0) return

    const queueHeight = 60
    const itemWidth = 50
    const maxItems = Math.min(queue.length, 8) // Show at most 8 items
    const containerWidth = maxItems * itemWidth + 20
    const startX = (width - containerWidth) / 2
    const startY = (height - queueHeight) / 2

    // Draw title
    ctx.fillStyle = colors.textColor
    ctx.font = "bold 16px Arial"
    ctx.textAlign = "center"
    ctx.fillText("Queue Visualization", width / 2, 30)

    // Draw queue container
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

      // Draw item background
      ctx.fillStyle = index === 0 ? colors.primaryColor : colors.bgColor
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
  }

  const renderTree = (ctx: CanvasRenderingContext2D, tree: any, width: number, height: number, colors: any) => {
    if (!tree) return

    // Draw title
    ctx.fillStyle = colors.textColor
    ctx.font = "bold 16px Arial"
    ctx.textAlign = "center"
    ctx.fillText("Binary Tree Visualization", width / 2, 30)

    // Calculate tree dimensions
    const nodeRadius = 20
    const verticalSpacing = 60
    const startY = 70

    // Get tree height
    const treeHeight = getTreeHeight(tree)

    // Calculate horizontal spacing based on tree height
    const levelWidth = width / Math.pow(2, treeHeight - 1)
    const horizontalSpacing = Math.max(levelWidth / 2, nodeRadius * 3)

    // Draw the tree recursively
    drawTreeNode(ctx, tree, width / 2, startY, horizontalSpacing, verticalSpacing, nodeRadius, colors)
  }

  const getTreeHeight = (node: any): number => {
    if (!node) return 0
    const leftHeight = getTreeHeight(node.left)
    const rightHeight = getTreeHeight(node.right)
    return Math.max(leftHeight, rightHeight) + 1
  }

  const drawTreeNode = (
    ctx: CanvasRenderingContext2D,
    node: any,
    x: number,
    y: number,
    horizontalSpacing: number,
    verticalSpacing: number,
    radius: number,
    colors: any,
  ) => {
    if (!node) return

    // Draw node circle
    ctx.beginPath()
    ctx.arc(x, y, radius, 0, Math.PI * 2)
    ctx.fillStyle = colors.primaryColor
    ctx.fill()
    ctx.strokeStyle = "#000000"
    ctx.lineWidth = 2
    ctx.stroke()

    // Draw node value with null check
    ctx.fillStyle = "#FFFFFF"
    ctx.font = "bold 14px Arial"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    // Add null check before calling toString()
    ctx.fillText(node.value !== undefined && node.value !== null ? node.value.toString() : "?", x, y)

    // Calculate child positions
    const leftX = x - horizontalSpacing
    const rightX = x + horizontalSpacing
    const childY = y + verticalSpacing

    // Draw edges to children
    if (node.left) {
      ctx.beginPath()
      ctx.moveTo(x - radius / 2, y + radius / 2)
      ctx.lineTo(leftX + radius / 2, childY - radius / 2)
      ctx.strokeStyle = colors.secondaryColor
      ctx.lineWidth = 1.5
      ctx.stroke()

      // Draw left child
      drawTreeNode(ctx, node.left, leftX, childY, horizontalSpacing / 2, verticalSpacing, radius, colors)
    }

    if (node.right) {
      ctx.beginPath()
      ctx.moveTo(x + radius / 2, y + radius / 2)
      ctx.lineTo(rightX - radius / 2, childY - radius / 2)
      ctx.strokeStyle = colors.secondaryColor
      ctx.lineWidth = 1.5
      ctx.stroke()

      // Draw right child
      drawTreeNode(ctx, node.right, rightX, childY, horizontalSpacing / 2, verticalSpacing, radius, colors)
    }
  }

  const renderGraph = (ctx: CanvasRenderingContext2D, graph: any, width: number, height: number, colors: any) => {
    if (!graph || !graph.nodes || !graph.edges) return

    // Draw title
    ctx.fillStyle = colors.textColor
    ctx.font = "bold 16px Arial"
    ctx.textAlign = "center"
    ctx.fillText("Graph Visualization", width / 2, 30)

    const nodeRadius = 25
    const centerX = width / 2
    const centerY = height / 2
    const graphRadius = Math.min(width, height) / 3 - nodeRadius

    // Calculate node positions in a circle
    const nodePositions: { [key: string]: { x: number; y: number } } = {}

    // For small graphs, use specific layouts
    if (graph.nodes.length <= 5) {
      // Position nodes in a pentagon/square/triangle
      graph.nodes.forEach((node: string, index: number) => {
        const angle = (index / graph.nodes.length) * 2 * Math.PI - Math.PI / 2
        const x = centerX + graphRadius * Math.cos(angle)
        const y = centerY + graphRadius * Math.sin(angle)
        nodePositions[node] = { x, y }
      })
    } else {
      // For larger graphs, use a circular layout
      graph.nodes.forEach((node: string, index: number) => {
        const angle = (index / graph.nodes.length) * 2 * Math.PI
        const x = centerX + graphRadius * Math.cos(angle)
        const y = centerY + graphRadius * Math.sin(angle)
        nodePositions[node] = { x, y }
      })
    }

    // Draw edges
    ctx.strokeStyle = colors.secondaryColor
    ctx.lineWidth = 2

    graph.edges.forEach((edge: string[]) => {
      const [from, to] = edge
      const fromPos = nodePositions[from]
      const toPos = nodePositions[to]

      if (fromPos && toPos) {
        ctx.beginPath()
        ctx.moveTo(fromPos.x, fromPos.y)
        ctx.lineTo(toPos.x, toPos.y)
        ctx.stroke()
      }
    })

    // Draw nodes
    graph.nodes.forEach((node: string) => {
      const pos = nodePositions[node]
      if (!pos) return

      // Draw node circle
      ctx.beginPath()
      ctx.arc(pos.x, pos.y, nodeRadius, 0, Math.PI * 2)
      ctx.fillStyle = colors.primaryColor
      ctx.fill()
      ctx.strokeStyle = "#000000"
      ctx.lineWidth = 3
      ctx.stroke()

      // Draw node value
      ctx.fillStyle = "#FFFFFF"
      ctx.font = "bold 16px Arial"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.fillText(node.toString(), pos.x, pos.y)
    })
  }

  const renderPlaceholder = (ctx: CanvasRenderingContext2D, width: number, height: number, textColor: string) => {
    ctx.fillStyle = textColor
    ctx.font = "16px Arial"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillText("No data structure detected", width / 2, height / 2)
  }

  return (
    <div className="mt-4">
      <h3 className={`text-lg font-semibold mb-2 ${theme === "dark" ? "text-gray-100" : "text-gray-900"}`}>
        Data Structure Visualization
      </h3>
      <div
        ref={containerRef}
        className={`border rounded ${theme === "dark" ? "border-gray-700" : "border-gray-300"} h-[300px] relative overflow-hidden`}
        style={{ width: "100%" }}
      >
        <canvas
          ref={canvasRef}
          className="w-full h-full"
          width={dimensions.width || 300}
          height={dimensions.height || 300}
        />
      </div>
    </div>
  )
}
