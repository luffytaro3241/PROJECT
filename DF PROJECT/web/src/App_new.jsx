import React, { useState } from 'react';
import { 
  Search, LogOut, Sun, Moon, LayoutDashboard, Archive, Users, History,
  CheckCircle2, AlertTriangle, Upload, Loader2
} from 'lucide-react';

import ErrorBoundary from './components/ErrorBoundary';
import Authenticator from './pages/Authenticator';
import Dashboard from './pages/Dashboard';
import Files from './pages/Files';
import UsersPage from './pages/Users';
import Logs from './pages/Logs';

import { useAuth } from './hooks/useAuth';
import { usePermissions } from './hooks/usePermissions';
import { useAudit } from './hooks/useAudit';
import { useNotifications } from './hooks/useNotifications';
import { safeRender, generateId } from './utils/helpers';

import './styles/guardvault.css';

const App = () => {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  
  const {
    user,
    usersList,
    files,
    setFiles,
    theme,
    setTheme,
    handleLogin,
    handleLogout
  } = useAuth();

  const {
    canViewAllFiles,
    canManageUsers,
    canViewLogs,
    canUploadFiles
  } = usePermissions(user);

  const { auditLogs, logAudit, clearLogs } = useAudit(user);
  const { notifications, addNotification } = useNotifications();

  // --- Core Handlers ---
  const handleFileUpload = () => {
    setIsUploading(true);
    setTimeout(() => {
      const newFile = {
        id: generateId('f-'),
        name: `Uploaded_Document_${Math.floor(Math.random()*1000)}.pdf`,
        size: `${(Math.random()*2 + 0.1).toFixed(2)} MB`,
        ownerId: user?.id,
        access: user?.role === 'Admin' ? 'Restricted' : 'Private',
        content: 'This document was successfully uploaded to the secure vault.',
        sharedWith: []
      };
      setFiles(prev => [newFile, ...prev]);
      logAudit('Upload File', `Created file ${newFile.id}`);
      setIsUploading(false);
      addNotification('File uploaded successfully.', 'success');
    }, 1500);
  };

  const handleFileDelete = (fileId) => {
    setFiles(prev => prev.filter(f => f?.id !== fileId));
  };

  const handleDownload = (fileName) => {
    // Simulate download
    console.log('Downloading:', fileName);
  };

  const handleNavigate = (tab) => {
    setActiveTab(tab);
  };

  // --- View Router ---
  const renderContent = () => {
    switch (activeTab) {
      case 'Dashboard':
        return (
          <Dashboard
            user={user}
            files={files}
            usersList={usersList}
            onFileUpload={handleFileUpload}
            isUploading={isUploading}
            canUploadFiles={canUploadFiles}
            canManageUsers={canManageUsers}
            onNavigate={handleNavigate}
          />
        );

      case 'Files':
        return (
          <Files
            user={user}
            files={files}
            usersList={usersList}
            searchQuery={searchQuery}
            canViewAllFiles={canViewAllFiles}
            onFileDelete={handleFileDelete}
            onDownload={handleDownload}
            logAudit={logAudit}
            addNotification={addNotification}
          />
        );

      case 'Users':
        return <UsersPage usersList={usersList} />;

      case 'Logs':
        return (
          <Logs
            auditLogs={auditLogs}
            onClearLogs={clearLogs}
          />
        );
      
      default: 
        return null;
    }
  };

  if (!user) {
    return (
      <ErrorBoundary>
        <div className={`${theme} min-h-screen font-sans`}>
          <Authenticator 
            onLogin={(userObj, isSignup) => {
              handleLogin(userObj, isSignup);
              logAudit('Sign In', `Authenticated as ${safeRender(userObj.role, 'User')}`);
              addNotification('Successfully signed in.', 'success');
            }} 
            usersList={usersList} 
          />
        </div>
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <div className={`${theme} app-layout`}>
        {/* Background Accent */}
        <div className="app-bg-accent"></div>

        {/* Notifications */}
        <div className="notifications-container">
          {notifications.map(n => (
            <div key={n.id} className="notification">
              {n.type === 'error' ? <AlertTriangle size={18} className="text-red-500"/> : <CheckCircle2 size={18} className="text-green-500"/>}
              <p className="text-sm font-semibold">{safeRender(n.message)}</p>
            </div>
          ))}
        </div>

        {/* Navigation */}
        <nav className="app-nav">
          <div className="nav-brand" onClick={() => setActiveTab('Dashboard')}>
            <div className="nav-logo">
              <LayoutDashboard size={20}/>
            </div>
            <span className="nav-title">GuardVault</span>
          </div>
          
          <div className="nav-search">
            <Search className="nav-search-icon" size={16} />
            <input 
              type="text" 
              placeholder="Search files..." 
              className="nav-search-input"
              value={searchQuery} 
              onChange={e => setSearchQuery(e.target.value)} 
            />
          </div>

          <div className="nav-actions">
             <button 
               onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')} 
               className="nav-theme-toggle"
             >
                {theme === 'dark' ? <Sun size={18}/> : <Moon size={18}/>}
             </button>
             <div className="nav-user">
                <div className="nav-user-avatar">
                  {safeRender(user?.name, '?').charAt(0)}
                </div>
                <div className="nav-user-info">
                  <p className="nav-user-name">{safeRender(user?.name)}</p>
                  <p className="nav-user-role">{safeRender(user?.role)}</p>
                </div>
             </div>
             <button 
               onClick={() => {
                 logAudit('Sign Out', 'User ended session');
                 handleLogout();
                 addNotification('You have been signed out.', 'info');
               }} 
               className="nav-logout"
             >
               <LogOut size={18} />
             </button>
          </div>
        </nav>

        {/* Main Layout */}
        <div className="app-main">
          <aside className="app-sidebar">
            <p className="sidebar-menu-label">Menu</p>
            {[
              { id: 'Dashboard', icon: LayoutDashboard, label: 'Dashboard' },
              { id: 'Files', icon: Archive, label: 'My Files' },
              ...(canManageUsers ? [{ id: 'Users', icon: Users, label: 'Users' }] : []),
              ...(canViewLogs ? [{ id: 'Logs', icon: History, label: 'Activity Logs' }] : [])
            ].map(item => (
              <button 
                key={item.id} 
                onClick={() => setActiveTab(item.id)} 
                className={`sidebar-menu-item ${activeTab === item.id ? 'active' : ''}`}
              >
                <item.icon size={18} /> {item.label}
              </button>
            ))}
          </aside>

          <main className="app-content">
             <div className="app-content-inner">
               {renderContent()}
             </div>
          </main>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default App;
