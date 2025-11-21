import { useState, useEffect } from 'react'
import Editor from '@monaco-editor/react'
import type { OnMount } from '@monaco-editor/react'
import { encode } from '@toon-format/toon'
import { FaTrash, FaCopy, FaCheck, FaExclamationCircle } from 'react-icons/fa'
import './App.css'

function App() {
  const [jsonInput, setJsonInput] = useState('')
  const [toonOutput, setToonOutput] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  // Auto-convert whenever input changes
  useEffect(() => {
    if (!jsonInput.trim()) {
      setToonOutput('')
      setError(null)
      return
    }

    try {
      // Monaco validation runs separately, but we need to parse for conversion
      const parsed = JSON.parse(jsonInput)
      const encoded = encode(parsed)
      setToonOutput(encoded)
      setError(null)
    } catch (err) {
      // Don't clear output immediately on error to prevent flashing,
      // or maybe do clear it? Let's keep previous output if possible or clear if invalid.
      // Actually, if JSON is invalid, we can't convert.
      setError(err instanceof Error ? err.message : 'Invalid JSON')
    }
  }, [jsonInput])

  const handleEditorChange = (value: string | undefined) => {
    setJsonInput(value || '')
  }

  const handleCopy = async () => {
    if (!toonOutput) return
    try {
      await navigator.clipboard.writeText(toonOutput)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const handleClear = () => {
    setJsonInput('')
    setToonOutput('')
    setError(null)
  }

  const handleEditorDidMount: OnMount = (editor) => {
    // Optional: Focus editor on mount
    editor.focus()
  }

  return (
    <>
      <div className="header">
        <h1>JSON to TOON Converter</h1>
        <p>Transform your JSON data into Token-Oriented Object Notation</p>
      </div>

      <div className="converter-container">
        <div className="editors-wrapper">
          {/* Input Pane */}
          <div className="editor-pane">
            <div className="pane-header">
              <span className="pane-title">JSON Input</span>
              <div className="pane-actions">
                <button
                  className="icon-btn danger"
                  onClick={handleClear}
                  title="Clear Input"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
            <div className="editor-container">
              <Editor
                height="100%"
                defaultLanguage="json"
                theme="vs-dark"
                value={jsonInput}
                onChange={handleEditorChange}
                onMount={handleEditorDidMount}
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  wordWrap: 'on',
                  formatOnPaste: true,
                  formatOnType: true,
                  scrollBeyondLastLine: false,
                }}
              />
            </div>
            <div className="status-bar">
              {error ? (
                <span className="status-error">
                  <FaExclamationCircle /> {error}
                </span>
              ) : (
                <span className="status-success">Ready</span>
              )}
            </div>
          </div>

          {/* Output Pane */}
          <div className="editor-pane">
            <div className="pane-header">
              <span className="pane-title">TOON Output</span>
              <div className="pane-actions">
                <button
                  className="icon-btn"
                  onClick={handleCopy}
                  title="Copy to Clipboard"
                  disabled={!toonOutput}
                >
                  {copied ? <FaCheck color="#4ade80" /> : <FaCopy />}
                </button>
              </div>
            </div>
            <div className="editor-container">
              <Editor
                height="100%"
                defaultLanguage="yaml" // TOON is similar to YAML/CSV
                theme="vs-dark"
                value={toonOutput}
                options={{
                  readOnly: true,
                  minimap: { enabled: false },
                  fontSize: 14,
                  wordWrap: 'on',
                  scrollBeyondLastLine: false,
                  domReadOnly: true,
                }}
              />
            </div>
            <div className="status-bar">
              <span>{toonOutput ? `${toonOutput.length} characters` : 'Waiting for input...'}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="footer">
        <p>Powered by @toon-format/toon</p>
      </div>
    </>
  )
}

export default App
