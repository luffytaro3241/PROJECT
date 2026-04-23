import React, { useMemo } from 'react';
import { HardDrive, Users, ShieldCheck, Upload, Loader2 } from 'lucide-react';
import { safeRender, calculateStorageStats } from '../utils/helpers';
import StorageModal from '../components/StorageModal';

const Dashboard = ({ 
  user, 
  files, 
  usersList, 
  onFileUpload, 
  isUploading, 
  canUploadFiles,
  canManageUsers,
  onNavigate 
}) => {
  const [showCapacityModal, setShowCapacityModal] = React.useState(false);
  
  const storageStats = useMemo(() => calculateStorageStats(files), [files]);

  const stats = [
    { 
      label: 'Storage Used', 
      val: `${storageStats.percent}%`, 
      icon: HardDrive, 
      action: () => setShowCapacityModal(true), 
      color: 'blue' 
    },
    { 
      label: 'Total Users', 
      val: (usersList || []).length, 
      icon: Users, 
      action: () => canManageUsers ? onNavigate('Users') : null, 
      color: 'indigo' 
    },
    { 
      label: 'System Status', 
      val: 'Online', 
      icon: ShieldCheck, 
      action: null, 
      color: 'emerald' 
    }
  ];

  return (
    <div className="dashboard-container fade-in-up">
      <header className="page-header">
        <h2 className="page-title">
          Secure Dashboard: {safeRender(user?.name).split(' ')[0]}
        </h2>
        <p className="page-subtitle">
          Real-time analytics and security status for your encrypted vault.
        </p>
      </header>

      <div className="grid-layout card-container">
        {stats.map((item, i) => (
          <div 
            key={i} 
            onClick={item.action} 
            className={`card layer-3d ${item.action ? 'clickable' : ''}`}
            style={{ animationDelay: `${i * 100}ms` }}
          >
             <div className={`stat-icon-wrapper color-${item.color}`}>
               <item.icon size={24} className="stat-icon" />
             </div>
             <div className="stat-content">
               <span className="stat-value">{item.val}</span>
               <span className="stat-label">{item.label}</span>
             </div>
          </div>
        ))}
      </div>

      {canUploadFiles && (
        <div className="card upload-banner gpu-accelerated">
          <div className="upload-info">
            <div className="upload-icon-box">
              <Upload size={32} />
            </div>
            <div className="upload-text">
              <h3 className="upload-heading">Secure File Upload</h3>
              <p className="upload-desc">
                Deploy encrypted assets to your organizational vault. 
                GuardVault ensures zero-trust validation for every transaction.
              </p>
            </div>
          </div>
          <button 
            onClick={onFileUpload} 
            disabled={isUploading} 
            className="submit-btn upload-action"
          >
            {isUploading ? <Loader2 size={18} className="animate-spin" /> : <Upload size={18}/>}
            <span>{isUploading ? 'Encrypting & Uploading...' : 'Upload Asset'}</span>
          </button>
        </div>
      )}

      {showCapacityModal && (
        <StorageModal 
          onClose={() => setShowCapacityModal(false)} 
          storageStats={storageStats} 
        />
      )}
    </div>
  );
};

export default Dashboard;
