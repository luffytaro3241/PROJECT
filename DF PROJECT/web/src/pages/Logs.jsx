import React from 'react';
import { safeRender } from '../utils/helpers';

const Logs = ({ auditLogs, onClearLogs }) => {
  return (
    <div className="logs-container fade-in-up">
      <header className="page-header logs-header">
        <div>
          <h2 className="page-title">Security Audit Logs</h2>
          <p className="page-subtitle">Immutable record of all vault transactions and system events.</p>
        </div>
        <button onClick={onClearLogs} className="action-btn delete-trigger">
          Purge Logs
        </button>
      </header>
      
      <div className="card personnel-table-card layer-3d">
        <div className="table-responsive">
          <table className="personnel-table logs-table">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Security Event</th>
                <th>Operator</th>
                <th>Telemetry Data</th>
              </tr>
            </thead>
            <tbody>
              {!auditLogs || auditLogs.length === 0 ? (
                <tr>
                  <td colSpan="4" className="empty-text text-center">
                    No security telemetry recorded in the current session.
                  </td>
                </tr>
              ) : auditLogs.map(log => (
                <tr key={log.id}>
                  <td className="logs-time">
                    {safeRender(log.timestamp)}
                  </td>
                  <td>
                    <span className="event-badge">
                      {safeRender(log.action)}
                    </span>
                  </td>
                  <td className="logs-user">
                    {safeRender(log.user)}
                  </td>
                  <td className="logs-detail">
                    <code>{safeRender(log.detail)}</code>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Logs;
