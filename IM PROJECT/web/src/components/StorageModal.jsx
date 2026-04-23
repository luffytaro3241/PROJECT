import React from 'react';
import { Database, X } from 'lucide-react';
import { safeRender } from '../utils/helpers';

const StorageModal = ({ onClose, storageStats }) => (
  <div className="modal-overlay">
    <div className="modal-content storage-modal">
      <div className="modal-header">
        <h3 className="modal-title">
          <Database size={18} className="modal-icon" />
          Storage Metrics
        </h3>
        <button onClick={onClose} className="modal-close">
          <X size={18} />
        </button>
      </div>
      <div className="modal-body">
        <div className="storage-chart">
          <svg className="storage-circle">
            <circle cx="50%" cy="50%" r="45%" className="storage-bg" />
            <circle 
              cx="50%" 
              cy="50%" 
              r="45%" 
              className="storage-progress"
              strokeDasharray="283"
              strokeDashoffset={283 - (283 * (parseFloat(storageStats.percent) / 100))}
            />
          </svg>
          <div className="storage-text">
            <span className="storage-percent">{safeRender(storageStats.percent)}%</span>
            <span className="storage-label">Used</span>
          </div>
        </div>
        <div className="storage-info">
          <p className="storage-total">{safeRender(storageStats.totalMB)} MB Total Allocated</p>
          <p className="storage-desc">Your organization's storage scales dynamically.</p>
        </div>
      </div>
      <div className="modal-footer">
        <button onClick={onClose} className="btn-secondary">Close</button>
      </div>
    </div>
  </div>
);

export default StorageModal;
