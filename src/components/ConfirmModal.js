import React from 'react';

export default function ConfirmModal({ isOpen, title, message, onConfirm, onCancel }) {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed', inset: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 1000,
    }}>
      <div className="ic-card" style={{ maxWidth: 400, width: '90%', margin: '1rem' }}>
        <h3 style={{ margin: '0 0 1rem 0', color: '#552B9A' }}>{title}</h3>
        <p style={{ margin: '0 0 1.5rem 0', color: '#666' }}>{message}</p>
        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
          <button className="btn-outline" onClick={onCancel}>Cancel</button>
          <button className="btn-purple" onClick={onConfirm} style={{ backgroundColor: '#dc3545', borderColor: '#dc3545' }}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
