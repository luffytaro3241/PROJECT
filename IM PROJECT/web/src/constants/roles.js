export const ROLE_PERMISSIONS = {
  'Admin': ['all'],
  'Manager': ['users_view', 'files_upload', 'files_view', 'logs_view'],
  'Employee': ['files_upload', 'files_view']
};

export const INITIAL_USERS = [
  { id: 'usr-1', name: 'Sarah Connor', email: 'admin@guardvault.com', role: 'Admin' },
  { id: 'usr-2', name: 'James Wilson', email: 'manager@guardvault.com', role: 'Manager' },
  { id: 'usr-3', name: 'Emily Chen', email: 'employee@guardvault.com', role: 'Employee' }
];

export const INITIAL_FILES = [
  { 
    id: 'f1', 
    name: 'Q3_Financial_Report_Final.pdf', 
    size: '2.4 MB', 
    ownerId: 'usr-1', 
    access: 'Restricted', 
    content: 'CONFIDENTIAL: Q3 Financial earnings and board meeting minutes.', 
    sharedWith: [] 
  },
  { 
    id: 'f2', 
    name: 'Employee_Onboarding_Handbook.pdf', 
    size: '5.1 MB', 
    ownerId: 'usr-2', 
    access: 'Internal', 
    content: 'Welcome to GuardVault! This handbook covers our policies, benefits, and operational procedures.', 
    sharedWith: ['employee@guardvault.com'] 
  },
  { 
    id: 'f3', 
    name: 'Marketing_Assets_2025.zip', 
    size: '14.2 MB', 
    ownerId: 'usr-1', 
    access: 'Public', 
    content: 'Publicly cleared marketing assets, logos, and brand guidelines.', 
    sharedWith: [] 
  }
];

export const STORAGE_KEYS = {
  GUARDVAULT: 'guardvault_enterprise_v5',
  AUTH: 'guardvault_session_v5',
  THEME: 'guardvault_theme_v5'
};
