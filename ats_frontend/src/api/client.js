 /**
  * API client for communicating with the ATS backend.
  * Uses REACT_APP_BACKEND_URL env var if provided; falls back to http://localhost:3001.
  */
const BASE_URL =
  (typeof process !== 'undefined' &&
    process.env &&
    process.env.REACT_APP_BACKEND_URL) ||
  'http://localhost:3001';

// PUBLIC_INTERFACE
export async function postMatch({ file, jobDescription, signal }) {
  /** Sends resume file and job description to backend /match and returns parsed JSON.
   * Expects:
   * - file: File (.pdf or .docx)
   * - jobDescription: string
   * Returns JSON with:
   * { score: number, matched_keywords: string[], missing_keywords: string[], feedback: string[] }
   */
  const formData = new FormData();
  formData.append('file', file);
  formData.append('job_description', jobDescription);

  const res = await fetch(`${BASE_URL}/match`, {
    method: 'POST',
    body: formData,
    signal,
  });

  const contentType = res.headers.get('content-type') || '';
  if (!res.ok) {
    let message = `Request failed with status ${res.status}`;
    if (contentType.includes('application/json')) {
      try {
        const err = await res.json();
        if (err && (err.detail || err.message)) {
          message = err.detail || err.message;
        }
      } catch {
        // ignore parse errors
      }
    } else {
      try {
        message = await res.text();
      } catch {
        // ignore
      }
    }
    const error = new Error(message);
    error.status = res.status;
    throw error;
  }

  if (!contentType.includes('application/json')) {
    throw new Error('Unexpected response format from server');
  }

  return res.json();
}

export { BASE_URL };
