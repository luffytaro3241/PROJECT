import React from 'react';
import { safeRender } from '../utils/helpers';

const Users = ({ usersList }) => {
  return (
    <div className="users-container fade-in-up">
      <header className="page-header">
        <h2 className="page-title">Personnel Management</h2>
        <p className="page-subtitle">Manage organizational access and security clearances.</p>
      </header>
      
      <div className="card personnel-table-card layer-3d">
        <div className="table-responsive">
          <table className="personnel-table">
            <thead>
              <tr>
                <th>Personnel</th>
                <th>Security Clearance</th>
                <th className="text-right">Status</th>
              </tr>
            </thead>
            <tbody>
              {(usersList || []).filter(Boolean).map(u => (
                <tr key={u.id}>
                  <td>
                    <div className="user-profile-row">
                      <div className="user-avatar-small">
                        {safeRender(u.name).charAt(0)}
                      </div>
                      <div className="user-details">
                        <p className="user-name-bold">{safeRender(u.name)}</p>
                        <p className="user-email-dim">{safeRender(u.email)}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className={`access-badge ${u.role === 'Admin' ? 'restricted' : (u.role === 'Manager' ? 'private' : 'public')}`}>
                      {safeRender(u.role)}
                    </span>
                  </td>
                  <td className="text-right">
                    <span className="status-indicator active">Active</span>
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

export default Users;
