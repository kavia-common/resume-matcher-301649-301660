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
The frontend calls `POST /match` on the backend. By default it uses:
- `http://localhost:3001` (shown in the header as "API: ...").

To override, set an environment variable before running:
- Create a `.env` file in this folder with:
  ```
  REACT_APP_BACKEND_URL=http://localhost:3001
  ```
  Or export it in your shell environment.

If `.env` is absent, the app still works with the default `http://localhost:3001`.

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

## Notes
- Accepted upload types: .pdf and .docx
- The UI shows progress during the request and surfaces any API errors
- No third-party UI frameworks; styling lives in `src/App.css`
