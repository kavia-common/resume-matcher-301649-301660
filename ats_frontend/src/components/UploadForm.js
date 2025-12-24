import React from 'react';

/**
 * UploadForm renders a file input for PDF/DOCX files.
 * Props:
 * - file: File | null
 * - onFileChange: (File | null) => void
 * - disabled: boolean
 */
export default function UploadForm({ file, onFileChange, disabled }) {
  const onChange = (e) => {
    const f = e.target.files && e.target.files[0] ? e.target.files[0] : null;
    if (f && !/(\.pdf|\.docx)$/i.test(f.name)) {
      alert('Please upload a .pdf or .docx file.');
      e.target.value = '';
      onFileChange(null);
      return;
    }
    onFileChange(f);
  };

  return (
    <div className="card">
      <div className="card-header">Resume Upload</div>
      <div className="card-body">
        <label className="label" htmlFor="resume-file">
          Select Resume (.pdf or .docx)
        </label>
        <input
          id="resume-file"
          type="file"
          accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          onChange={onChange}
          disabled={disabled}
          aria-describedby="resume-help"
          className="input-file"
        />
        <div id="resume-help" className="help-text">
          {file ? `Selected: ${file.name}` : 'No file selected'}
        </div>
      </div>
    </div>
  );
}
