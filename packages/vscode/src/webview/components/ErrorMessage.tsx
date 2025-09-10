import React from 'react';

interface ErrorMessageProps {
  message: string;
  onDismiss: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ 
  message, 
  onDismiss 
}) => {
  return (
    <div className="error-container">
      <div className="error-card">
        <div className="error-header">
          <h2>Error</h2>
          <button 
            className="btn btn-small" 
            onClick={onDismiss}
          >
            ×
          </button>
        </div>
        <div className="error-body">
          <p>{message}</p>
        </div>
        <div className="error-actions">
          <button 
            className="btn btn-primary" 
            onClick={onDismiss}
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
};