import React from 'react';

const AlertMessage = ({ type = 'info', message, onClose }) => {
  if (!message) return null;

  const styles = {
    success: {
      bg: 'bg-success-50',
      border: 'border-success-500',
      text: 'text-success-600',
      icon: '✓',
    },
    error: {
      bg: 'bg-danger-50',
      border: 'border-danger-500',
      text: 'text-danger-600',
      icon: '✕',
    },
    warning: {
      bg: 'bg-warning-50',
      border: 'border-warning-500',
      text: 'text-warning-600',
      icon: '⚠',
    },
    info: {
      bg: 'bg-primary-50',
      border: 'border-primary-500',
      text: 'text-primary-600',
      icon: 'ℹ',
    },
  };

  const style = styles[type] || styles.info;

  return (
    <div
      className={`${style.bg} border-l-4 ${style.border} p-4 rounded-r-lg mb-4 flex items-start justify-between animate-fade-in`}
      role="alert"
    >
      <div className="flex items-start">
        <span className={`${style.text} font-bold mr-3 text-lg`}>{style.icon}</span>
        <p className={`${style.text} text-sm font-medium`}>{message}</p>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className={`${style.text} hover:opacity-75 transition-opacity ml-4`}
          aria-label="Close"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      )}
    </div>
  );
};

export default AlertMessage;