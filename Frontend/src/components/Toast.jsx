import React from 'react';
import { IconCheck, IconX, IconSparkles } from './Icons';

export default function Toast({ toast, onClose }) {
  if (!toast) return null;

  return (
    <div className={`toast-container animate-fade-in ${toast.type || 'info'}`}>
      <div className="toast-icon">
        {toast.type === 'success' ? <IconCheck size={18} /> : <IconSparkles size={18} />}
      </div>
      <div className="toast-text">
        <strong>{toast.title}</strong>
        {toast.message && <span>{toast.message}</span>}
      </div>
      <button className="toast-close" onClick={onClose} aria-label="Cerrar notificación">
        <IconX size={15} />
      </button>
    </div>
  );
}

