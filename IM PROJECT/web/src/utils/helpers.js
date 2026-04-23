export const safeRender = (val, fallback = '') => {
  if (val === null || val === undefined) return fallback;
  if (typeof val === 'object' || Array.isArray(val)) return fallback;
  return String(val);
};

export const getFileName = (file) => {
  if (!file || typeof file !== 'object') return 'Unknown Document';
  return safeRender(file.name || file.fileName, 'Unknown Document');
};

export const getFileAccess = (file) => {
  if (!file || typeof file !== 'object') return 'Private';
  return safeRender(file.access || file.accessLevel, 'Private');
};

export const formatTimestamp = () => {
  return new Date().toLocaleTimeString();
};

export const generateId = (prefix = '') => {
  return `${prefix}${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export const calculateStorageStats = (files) => {
  const total = (files || []).reduce((acc, f) => acc + (f?.size ? parseFloat(f.size) : 0), 0);
  return { 
    totalMB: total.toFixed(2), 
    percent: Math.min((total / 100) * 100, 100).toFixed(1) 
  };
};
