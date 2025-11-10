'use client'

import Editor from '@monaco-editor/react'
import { useRef, useState } from 'react'
import { PlayIcon, CheckIcon } from '@heroicons/react/24/solid'

interface CodeEditorProps {
  initialCode?: string
  language?: string
  onCodeChange?: (code: string) => void
  onRun?: (code: string) => void
  onSubmit?: (code: string) => void
  readOnly?: boolean
}

export function CodeEditor({
  initialCode = '',
  language = 'javascript',
  onCodeChange,
  onRun,
  onSubmit,
  readOnly = false,
}: CodeEditorProps) {
  const editorRef = useRef<any>(null)
  const [code, setCode] = useState(initialCode)

  const handleEditorDidMount = (editor: any, monaco: any) => {
    editorRef.current = editor
    
    // Custom theme
    monaco.editor.defineTheme('arena-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [],
      colors: {
        'editor.background': '#1a1a1a',
        'editor.foreground': '#e4e4e7',
        'editor.lineHighlightBackground': '#2a2a2a',
        'editor.selectionBackground': '#6366f160',
        'editorCursor.foreground': '#6366f1',
      },
    })
    monaco.editor.setTheme('arena-dark')

    // Configure options
    editor.updateOptions({
      minimap: { enabled: false },
      fontSize: 14,
      lineNumbers: 'on',
      roundedSelection: false,
      scrollBeyondLastLine: false,
      readOnly,
      automaticLayout: true,
    })
  }

  const handleCodeChange = (value: string | undefined) => {
    const newCode = value || ''
    setCode(newCode)
    onCodeChange?.(newCode)
  }

  return (
    <div className="relative h-full bg-dark-card border border-gray-800 rounded-lg overflow-hidden">
      <Editor
        height="100%"
        language={language}
        value={code}
        onChange={handleCodeChange}
        onMount={handleEditorDidMount}
        theme="arena-dark"
        options={{
          wordWrap: 'on',
          lineNumbers: 'on',
          folding: true,
          bracketPairColorization: { enabled: true },
        }}
      />
      
      {!readOnly && (
        <div className="absolute bottom-4 right-4 flex gap-2">
          <button
            onClick={() => onRun?.(code)}
            className="p-2 bg-arena-primary hover:bg-arena-primary/80 rounded-lg transition-colors"
          >
            <PlayIcon className="w-5 h-5 text-white" />
          </button>
          <button
            onClick={() => onSubmit?.(code)}
            className="p-2 bg-arena-success hover:bg-arena-success/80 rounded-lg transition-colors"
          >
            <CheckIcon className="w-5 h-5 text-white" />
          </button>
        </div>
      )}
    </div>
  )
}

