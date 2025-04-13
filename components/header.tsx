"use client"

import { useTheme } from "@/hooks/use-theme"
import { Sun, Moon, Github } from "lucide-react"

export const Header = () => {
  const { theme, setTheme } = useTheme()

  return (
    <header
      className={`p-4 flex items-center justify-between border-b ${theme === "dark" ? "border-gray-800" : "border-gray-300"}`}
    >
      <h1 className="text-2xl font-bold">Universal Algorithm Visualizer</h1>

      <div className="flex items-center gap-4">
        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 hover:text-gray-400 transition-colors"
        >
          <Github size={20} />
          <span className="hidden sm:inline">GitHub</span>
        </a>

        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className={`p-2 rounded-full ${theme === "dark" ? "bg-gray-800 hover:bg-gray-700" : "bg-gray-200 hover:bg-gray-300"}`}
          aria-label="Toggle theme"
        >
          {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>
    </header>
  )
}
