import React from 'react';

/**
 * SubmitButton renders primary submit control with loading state.
 * Props:
 * - onClick: () => void
 * - disabled: boolean
 * - loading: boolean
 * - label?: string
 */
export default function SubmitButton({ onClick, disabled, loading, label = 'Submit' }) {
  return (
    <button
      type="button"
      className="btn btn-primary"
      onClick={onClick}
      disabled={disabled || loading}
      aria-busy={loading}
    >
      {loading ? (
        <>
          <span className="spinner spinner-inline" aria-hidden="true" />
          Processing...
        </>
      ) : (
        label
      )}
    </button>
  );
}
