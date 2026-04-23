import React, { useState, useEffect, Suspense, lazy } from 'react';
import { 
  Search, LogOut, Sun, Moon, LayoutDashboard, Archive, Users, History,
  CheckCircle2, AlertTriangle, Upload, Loader2, Shield
} from 'lucide-react';

import ErrorBoundary from './components/ErrorBoundary';
const Authenticator = lazy(() => import('./pages/Authenticator'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Files = lazy(() => import('./pages/Files'));
const UsersPage = lazy(() => import('./pages/Users'));
const Logs = lazy(() => import('./pages/Logs'));

import { useAuth } from './hooks/useAuth';
import { useTheme } from './hooks/useTheme';
import { usePermissions } from './hooks/usePermissions';
import { useAudit } from './hooks/useAudit';
import { useNotifications } from './hooks/useNotifications';
import { useMagnetic, useRipple } from './hooks/useMicroInteractions';
import { safeRender, generateId } from './utils/helpers';

import './styles/design-system.css';
import ThreeBackground from './components/ThreeBackground';
import ParallaxLayer from './components/ParallaxLayer';

const App = () => {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  
  const {
    user,
    usersList,
    files,
    setFiles,
    handleLogin,
    handleLogout
  } = useAuth();

  const { theme, toggleTheme } = useTheme();
  const { ripples, createRipple } = useRipple();
  const magneticSearch = useMagnetic(0.2);

  const {
    canViewAllFiles,
    canManageUsers,
    canViewLogs,
    canUploadFiles
  } = usePermissions(user);

  const { auditLogs, logAudit, clearLogs } = useAudit(user);
  const { notifications, addNotification } = useNotifications();

  // --- Core Handlers ---
  const handleFileUpload = (e) => {
    createRipple(e);
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

  if (!user) {
    return (
      <Suspense fallback={<div className="loading-screen">Loading Security Systems...</div>}>
        <ThreeBackground />
        <Authenticator onLogin={handleLogin} logAudit={logAudit} />
      </Suspense>
    );
  }

  return (
    <div className={`app-container ${theme}`} onClick={createRipple}>
      <ThreeBackground />
      
      <header className="app-header gpu-accelerated">
        <div className="header-logo">
          <Shield className="logo-icon" />
          <h1 className="logo-text">GuardVault</h1>
        </div>

        <div 
          ref={magneticSearch.ref} 
          style={magneticSearch.style} 
          className="search-container"
        >
          <Search className="search-icon" size={18} />
          <input 
            type="text" 
            placeholder="Search vault..." 
            className="search-input"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="header-actions">
          <button onClick={toggleTheme} className="action-btn" aria-label="Toggle Theme">
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          
          <div className="user-profile">
            <div className="avatar">{safeRender(user?.name, '?').charAt(0)}</div>
            <div className="user-info">
              <span className="user-name">{safeRender(user?.name)}</span>
              <span className="user-role">{safeRender(user?.role)}</span>
            </div>
          </div>

          <button 
            className="logout-btn" 
            onClick={() => {
              logAudit('Sign Out', 'User ended session');
              handleLogout();
              addNotification('You have been signed out.', 'info');
            }}
          >
            <LogOut size={18} />
          </button>
        </div>
      </header>

      <main className="app-main">
        <aside className="app-sidebar gpu-accelerated">
          <nav className="sidebar-nav">
            <p className="nav-label">Main Menu</p>
            <button 
              className={`nav-item ${activeTab === 'Dashboard' ? 'active' : ''}`}
              onClick={() => setActiveTab('Dashboard')}
            >
              <LayoutDashboard size={18} />
              <span>Dashboard</span>
            </button>
            <button 
              className={`nav-item ${activeTab === 'Files' ? 'active' : ''}`}
              onClick={() => setActiveTab('Files')}
            >
              <Archive size={18} />
              <span>Vault</span>
            </button>
            {canManageUsers && (
              <button 
                className={`nav-item ${activeTab === 'Users' ? 'active' : ''}`}
                onClick={() => setActiveTab('Users')}
              >
                <Users size={18} />
                <span>Personnel</span>
              </button>
            )}
            {canViewLogs && (
              <button 
                className={`nav-item ${activeTab === 'Logs' ? 'active' : ''}`}
                onClick={() => setActiveTab('Logs')}
              >
                <History size={18} />
                <span>Security Logs</span>
              </button>
            )}
          </nav>
        </aside>

        <section className="app-content">
          <Suspense fallback={<div className="loading-spinner"><Loader2 className="animate-spin" /></div>}>
            <ParallaxLayer speed={0.1}>
              {activeTab === 'Dashboard' && <Dashboard files={files} user={user} logs={auditLogs} />}
              {activeTab === 'Files' && (
                <Files 
                  files={files} 
                  user={user} 
                  onUpload={handleFileUpload} 
                  isUploading={isUploading} 
                  canUpload={canUploadFiles}
                />
              )}
              {activeTab === 'Users' && <UsersPage usersList={usersList} />}
              {activeTab === 'Logs' && <Logs logs={auditLogs} clearLogs={clearLogs} />}
            </ParallaxLayer>
          </Suspense>
        </section>
      </main>

      {ripples.map(ripple => (
        <span 
          key={ripple.id} 
          className="ripple-effect"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: ripple.size,
            height: ripple.size
          }}
        />
      ))}
    </div>
  );
};

export default App;
