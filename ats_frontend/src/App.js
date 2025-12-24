import React, { useEffect, useMemo, useRef, useState } from 'react';
import './App.css';
import './index.css';
import UploadForm from './components/UploadForm';
import JobDescriptionInput from './components/JobDescriptionInput';
import ResultsCard from './components/ResultsCard';
import SubmitButton from './components/SubmitButton';
import { postMatch, BASE_URL } from './api/client';

// PUBLIC_INTERFACE
function App() {
  /** ATS Resume Matcher Frontend
   * Renders upload (pdf/docx), job description textarea, submit action, and results panel.
   * Handles loading state, API errors, and displays match results.
   */

  const [theme, setTheme] = useState('light');
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const abortControllerRef = useRef(null);

  // Apply theme to document root
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const backendInfo = useMemo(() => {
    return {
      baseUrl: BASE_URL,
      fromEnv:
        (typeof process !== 'undefined' &&
          process.env &&
          process.env.REACT_APP_BACKEND_URL) ?
          'env' : 'default',
    };
  }, []);

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const canSubmit = !!file && jobDescription.trim().length > 0 && !loading;

  // Converts any error-like input to a friendly string; includes serialized details if available
  const formatErrorForDisplay = (err) => {
    try {
      if (!err) return 'An unexpected error occurred.';
      if (err instanceof Error) {
        // If error has a details object, append a concise JSON snippet
        const hasDetails = err.details && typeof err.details === 'object' && Object.keys(err.details).length > 0;
        return hasDetails
          ? `${err.message}\nDetails: ${JSON.stringify(err.details)}`
          : err.message;
      }
      if (typeof err === 'string') return err;
      if (typeof err === 'object') {
        const msg = typeof err.message === 'string'
          ? err.message
          : typeof err.detail === 'string'
            ? err.detail
            : 'An error occurred.';
        const { message: _m, detail: _d, ...rest } = err;
        const hasRest = Object.keys(rest || {}).length > 0;
        return hasRest ? `${msg}\nDetails: ${JSON.stringify(rest)}` : msg;
      }
      return String(err);
    } catch {
      return 'An unexpected error occurred.';
    }
  };

  const onSubmit = async () => {
    if (!canSubmit) return;
    setError(null);
    setData(null);
    setLoading(true);

    // cancel existing request if any
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const ac = new AbortController();
    abortControllerRef.current = ac;

    try {
      const result = await postMatch({
        file,
        jobDescription,
        signal: ac.signal,
      });
      setData({
        score: typeof result.score === 'number' ? result.score : 0,
        matched_keywords: result.matched_keywords || [],
        missing_keywords: result.missing_keywords || [],
        feedback: result.feedback || [],
      });
    } catch (e) {
      const base = formatErrorForDisplay(e) || 'An unexpected error occurred while contacting the server.';
      const guidance = ' If this persists, confirm the backend is running at the API URL above and that CORS is enabled.';
      setError(`${base}${guidance}`);
    } finally {
      setLoading(false);
      abortControllerRef.current = null;
    }
  };

  return (
    <div className="App">
      <header className="app-header">
        <div className="header-inner">
          <div className="brand">
            <div className="brand-dot" aria-hidden="true" />
            <span className="brand-name">ATS Resume Matcher</span>
          </div>
          <div className="header-actions">
            <span className="backend-note" title="Backend URL">
              API: {backendInfo.baseUrl}
              {backendInfo.fromEnv === 'env' ? '' : ' (default)'}
            </span>
            <button
              className="theme-toggle"
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
            </button>
          </div>
        </div>
      </header>

      <main className="container">
        <div className="grid responsive">
          <section aria-label="Inputs">
            <UploadForm file={file} onFileChange={setFile} disabled={loading} />
            <JobDescriptionInput
              value={jobDescription}
              onChange={setJobDescription}
              disabled={loading}
            />
            <div className="actions">
              <SubmitButton onClick={onSubmit} disabled={!canSubmit} loading={loading} label="Submit" />
            </div>
            <div className="note">
              Accepted file types: .pdf and .docx. No data is stored; all processing is in-memory.
            </div>
          </section>

          <aside aria-label="Results">
            <ResultsCard loading={loading} error={error} data={data} />
          </aside>
        </div>
      </main>

      <footer className="footer">
        <div className="container footer-inner">
          <span>© {new Date().getFullYear()} ATS Resume Matcher</span>
          <span className="muted">Frontend on 3000 · Backend on 3001</span>
        </div>
      </footer>
    </div>
  );
}

export default App;
