 /** 
  * API client for communicating with the ATS backend.
  * Resolution order for BASE_URL:
  * 1) REACT_APP_BACKEND_URL (explicit)
  * 2) Auto-detect preview backend if app is served via same host: use same protocol/host with port 3001
  * 3) Fallback to http://localhost:3001
  */

// Determine base URL with environment override and auto-detection
function detectBaseUrl() {
  // 1) Explicit environment override
  const envUrl =
    typeof process !== 'undefined' &&
    process?.env?.REACT_APP_BACKEND_URL;
  if (envUrl) {
    return envUrl;
  }

  // 2) Auto-detect: if running on a preview domain or localhost, prefer same host with port 3001
  try {
    if (typeof window !== 'undefined' && window.location) {
      const loc = window.location;
      const backend = `${loc.protocol}//${loc.hostname}:3001`;
      return backend;
    }
  } catch {
    // ignore detection errors
  }

  // 3) Default local
  return 'http://localhost:3001';
}

const BASE_URL = detectBaseUrl();

// PUBLIC_INTERFACE
export async function postMatch({ file, jobDescription, signal, timeoutMs = 60000 }) {
  /** Sends resume file and job description to backend /match and returns parsed JSON.
   * Expects:
   * - file: File (.pdf or .docx)
   * - jobDescription: string
   * - signal?: AbortSignal
   * - timeoutMs?: number (default 60s)
   * Returns JSON with:
   * { score: number, matched_keywords: string[], missing_keywords: string[], feedback: string[] }
   */
  if (!file) {
    throw new Error('Please select a resume file (.pdf or .docx).');
  }
  if (!jobDescription || !jobDescription.trim()) {
    throw new Error('Please enter a job description.');
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('job_description', jobDescription);

  // Compose abort controller to support external signal + timeout
  const controller = new AbortController();

  let timeoutId;
  if (timeoutMs && Number.isFinite(timeoutMs)) {
    timeoutId = setTimeout(() => {
      controller.abort();
    }, timeoutMs);
  }

  // Wire external signal abort to local controller
  if (signal) {
    const onAbort = () => controller.abort();
    if (signal.aborted) {
      controller.abort();
    } else {
      signal.addEventListener('abort', onAbort, { once: true });
    }
  }

  let res;
  try {
    res = await fetch(`${BASE_URL}/match`, {
      method: 'POST',
      mode: 'cors',
      body: formData,
      signal: controller.signal,
    });
  } catch (e) {
    if (e?.name === 'AbortError') {
      throw new Error('Request timed out. Please try again or simplify the document.');
    }
    // Common CORS/DNS/network error hint
    throw new Error(
      'Failed to reach the server. Ensure the backend is running on port 3001 and CORS is enabled.'
    );
  } finally {
    if (timeoutId) clearTimeout(timeoutId);
  }

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
