# ATS Resume Matcher Frontend (React)

This is a lightweight React frontend for uploading a resume (PDF/DOCX), pasting a job description, and viewing a match score with keyword insights and actionable feedback. It communicates with a FastAPI backend via REST.

## Features
- Responsive, modern UI with light theme and primary accents (#3b82f6, #06b6d4)
- Sections: Resume Upload, Job Description input, Submit action, Results panel
- Loading indicator, error surface, and clear results presentation
- No persistence; all state is local and processing is in-memory

## Running
- Dev server: `npm start` (http://localhost:3000)
- Tests: `npm test`
- Build: `npm run build`

## Backend URL configuration
The frontend calls `POST /match` on the backend. URL resolution order:
1. `REACT_APP_BACKEND_URL` environment variable (explicit override)
2. Auto-detect preview: same protocol/host as the frontend with port `3001`
3. Fallback to `http://localhost:3001`

The resolved URL is shown in the header as "API: ...".

To explicitly set a URL, create a `.env` file in this folder (see `.env.example`) or export the variable in your shell:
```
REACT_APP_BACKEND_URL=http://localhost:3001
```

## API Contract
`POST /match` (multipart/form-data):
- file: binary (.pdf or .docx)
- job_description: text

Expected response (application/json):
```json
{
  "score": 0-100,
  "matched_keywords": ["..."],
  "missing_keywords": ["..."],
  "feedback": ["..."]
}
```

## Troubleshooting
- CORS/Network errors: Ensure the backend is running on port 3001 and CORS is enabled on the FastAPI app. The client uses `mode: "cors"`.
- Timeouts: Requests time out after 60 seconds. For large files or long parsing, try again or simplify the document.
- Verify the API URL in the header matches your backend.

## Notes
- Accepted upload types: .pdf and .docx
- The UI shows progress during the request and surfaces any API errors
- No third-party UI frameworks; styling lives in `src/App.css`
