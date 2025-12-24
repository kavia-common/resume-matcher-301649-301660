import React from 'react';

/**
 * ResultsCard displays the results from /match API.
 * Props:
 * - loading: boolean
 * - error: string | null
 * - data: {
 *    score: number,
 *    matched_keywords: string[],
 *    missing_keywords: string[],
 *    feedback: string[]
 *   } | null
 */
export default function ResultsCard({ loading, error, data }) {
  const renderError = (err) => {
    if (!err) return null;
    if (typeof err === 'string') return err;
    if (err instanceof Error) {
      const details =
        err.details && typeof err.details === 'object' && Object.keys(err.details).length > 0
          ? `\nDetails: ${JSON.stringify(err.details)}`
          : '';
      return `${err.message}${details}`;
    }
    if (typeof err === 'object') {
      const msg =
        (typeof err.message === 'string' && err.message) ||
        (typeof err.detail === 'string' && err.detail) ||
        'An error occurred.';
      const { message: _m, detail: _d, ...rest } = err;
      const details = Object.keys(rest || {}).length > 0 ? `\nDetails: ${JSON.stringify(rest)}` : '';
      return `${msg}${details}`;
    }
    return String(err);
  };

  return (
    <div className="card">
      <div className="card-header">Results</div>
      <div className="card-body">
        {loading && (
          <div className="status status-loading" role="status" aria-live="polite">
            <span className="spinner" aria-hidden="true" /> Scanning resume and job description...
          </div>
        )}

        {!loading && error && (
          <div className="status status-error" role="alert">
            {renderError(error)}
          </div>
        )}

        {!loading && !error && !data && (
          <div className="status status-info">Submit your resume and job description to see results.</div>
        )}

        {!loading && !error && data && (
          <>
            <div className="score-wrap">
              <div className="score">
                <span className="score-value">{Math.round(data.score ?? 0)}</span>
                <span className="score-label">Match Score</span>
              </div>
              <div className="score-bar">
                <div
                  className="score-bar-fill"
                  style={{ width: `${Math.min(100, Math.max(0, Math.round(data.score ?? 0)))}%` }}
                />
              </div>
            </div>

            <div className="grid two">
              <div>
                <h4 className="section-title">Matched Keywords</h4>
                {Array.isArray(data.matched_keywords) && data.matched_keywords.length > 0 ? (
                  <ul className="chips">
                    {data.matched_keywords.map((k) => (
                      <li key={`mk-${k}`} className="chip chip-success">
                        {k}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="muted">No matched keywords detected.</div>
                )}
              </div>
              <div>
                <h4 className="section-title">Missing Keywords</h4>
                {Array.isArray(data.missing_keywords) && data.missing_keywords.length > 0 ? (
                  <ul className="chips">
                    {data.missing_keywords.map((k) => (
                      <li key={`msk-${k}`} className="chip chip-warning">
                        {k}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="muted">No missing keywords detected.</div>
                )}
              </div>
            </div>

            <div>
              <h4 className="section-title">Actionable Feedback</h4>
              {Array.isArray(data.feedback) && data.feedback.length > 0 ? (
                <ul className="bullets">
                  {data.feedback.map((f, idx) => (
                    <li key={`fb-${idx}`}>{f}</li>
                  ))}
                </ul>
              ) : (
                <div className="muted">No feedback provided.</div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
