import { useState } from 'react';
import { formatTimestamp, safeRender } from '../utils/helpers';

export const useAudit = (user) => {
  const [auditLogs, setAuditLogs] = useState([]);

  const logAudit = (action, detail, status = 'SUCCESS') => {
    const safeUser = safeRender(user?.name, 'System');
    const entry = { 
      id: Date.now() + Math.random(), 
      timestamp: formatTimestamp(), 
      user: safeUser, 
      action, 
      detail, 
      status 
    };
    setAuditLogs(prev => [entry, ...prev].slice(0, 50));
  };

  const clearLogs = () => {
    setAuditLogs([]);
  };

  return {
    auditLogs,
    logAudit,
    clearLogs
  };
};
