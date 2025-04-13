"use client"

import { useRef } from "react"
import Editor from "@monaco-editor/react"

interface CodeEditorProps {
  value: string
  onChange: (value: string) => void
  language: string
  theme: string
}

export const CodeEditor = ({ value, onChange, language, theme }: CodeEditorProps) => {
  const editorRef = useRef(null)

  const handleEditorDidMount = (editor) => {
    editorRef.current = editor
  }

  return (
    <div className="flex-1 overflow-hidden border border-gray-700 rounded">
      <Editor
        height="100%"
        language={language}
        value={value}
        theme={theme === "dark" ? "vs-dark" : "vs"}
        onChange={(value) => onChange(value || "")}
        onMount={handleEditorDidMount}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          scrollBeyondLastLine: false,
          automaticLayout: true,
          tabSize: 2,
          wordWrap: "on",
          lineNumbers: "on",
          glyphMargin: true,
        }}
      />
    </div>
  )
}
