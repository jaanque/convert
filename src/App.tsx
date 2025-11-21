import { useState } from 'react'
import './App.css'
import { encode } from '@toon-format/toon'

function App() {
  const [jsonInput, setJsonInput] = useState('')
  const [toonOutput, setToonOutput] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleConvert = () => {
    setError(null)
    try {
      if (!jsonInput.trim()) {
        setToonOutput('')
        return
      }
      const parsed = JSON.parse(jsonInput)
      const encoded = encode(parsed)
      setToonOutput(encoded)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid JSON input')
      setToonOutput('')
    }
  }

  return (
    <>
      <h1>JSON to TOON Converter</h1>
      <div className="card">
        <div className="converter-container">
          <div className="textarea-container">
            <textarea
              placeholder="Paste your JSON here..."
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
            />
            <textarea
              readOnly
              placeholder="TOON output will appear here..."
              value={toonOutput}
            />
          </div>
          <button className="convert-btn" onClick={handleConvert}>
            Convert to TOON
          </button>
          {error && <p className="error">{error}</p>}
        </div>
      </div>
    </>
  )
}

export default App
