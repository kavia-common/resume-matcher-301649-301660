import React from 'react';

/**
 * JobDescriptionInput renders a textarea for job description.
 * Props:
 * - value: string
 * - onChange: (string) => void
 * - disabled: boolean
 */
export default function JobDescriptionInput({ value, onChange, disabled }) {
  return (
    <div className="card">
      <div className="card-header">Job Description</div>
      <div className="card-body">
        <label className="label" htmlFor="job-description">
          Paste Job Description
        </label>
        <textarea
          id="job-description"
          placeholder="Paste the job description here..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          rows={10}
          className="textarea"
        />
        <div className="help-text">
          Include responsibilities, required skills, and qualifications for best results.
        </div>
      </div>
    </div>
  );
}
