import React, { useMemo } from 'react';
import { FileText, Trash2, Eye } from 'lucide-react';
import { safeRender, getFileName, getFileAccess } from '../utils/helpers';
import FileViewer from '../components/FileViewer';

const Files = ({ 
  user, 
  files, 
  usersList, 
  searchQuery, 
  canViewAllFiles,
  onFileDelete,
  onDownload,
  logAudit,
  addNotification
}) => {
  const [selectedFile, setSelectedFile] = React.useState(null);

  const filteredFiles = useMemo(() => {
    return (files || []).filter(f => {
      if (!f || typeof f !== 'object') return false;
      const isAdmin = canViewAllFiles;
      const isManager = user?.role === 'Manager';
      const isOwner = f.ownerId === user?.id;
      const isShared = Array.isArray(f.sharedWith) && f.sharedWith.includes(user?.email);
      const isPublic = f.access === 'Public';
      const isInternal = f.access === 'Internal';

      if (isAdmin || isOwner || isShared || isPublic || (isManager && isInternal)) {
        return getFileName(f).toLowerCase().includes(safeRender(searchQuery).toLowerCase());
      }
      return false;
    });
  }, [files, user, searchQuery, canViewAllFiles]);

  const handleFileDelete = (file) => {
    onFileDelete(file.id);
    logAudit('Delete File', file.id);
    addNotification('File deleted.', 'info');
  };

  return (
    <div className="files-container fade-in-up">
      <header className="page-header">
        <h2 className="page-title">Digital Asset Vault</h2>
        <p className="page-subtitle">
          Securely managing {filteredFiles.length} encrypted documents.
        </p>
      </header>
      
      <div className="grid-layout card-container">
        {filteredFiles.length === 0 ? (
          <div className="card empty-state layer-3d">
            <div className="empty-icon-box">
              <FileText size={48} />
            </div>
            <p className="empty-text">No encrypted assets found matching your clearance level.</p>
          </div>
        ) : filteredFiles.map((file, i) => {
          const fName = getFileName(file);
          const fAccess = getFileAccess(file);
          const ownerName = safeRender((usersList || []).find(u => u?.id === file.ownerId)?.name, 'System');
          
          return (
            <div 
              key={file.id} 
              className="card file-asset layer-3d"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <div className="file-asset-header">
                <div className="file-type-icon">
                  <FileText size={24} />
                </div>
                <span className={`access-badge ${fAccess.toLowerCase()}`}>
                  {fAccess}
                </span>
              </div>
              
              <div className="file-asset-info">
                <h4 className="file-asset-name">{fName}</h4>
                <div className="file-asset-meta">
                  <span>{safeRender(file.size, '0 KB')}</span>
                  <span className="meta-divider">•</span>
                  <span>{ownerName}</span>
                </div>
              </div>

              <div className="file-asset-actions">
                 <button 
                   onClick={() => setSelectedFile(file)} 
                   className="submit-btn secondary-btn"
                 >
                   <Eye size={16} />
                   <span>Inspect</span>
                 </button>
                 {(canViewAllFiles || file.ownerId === user?.id) && (
                   <button 
                     onClick={() => handleFileDelete(file)} 
                     className="action-btn delete-trigger"
                     aria-label="Delete Asset"
                   >
                     <Trash2 size={16}/>
                   </button>
                 )}
              </div>
            </div>
          )
        })}
      </div>

      {selectedFile && (
        <FileViewer 
          file={selectedFile} 
          onClose={() => setSelectedFile(null)} 
          onDownload={(name) => {
            onDownload(name);
            logAudit('Download', name);
            addNotification('Download started', 'success');
          }} 
          usersList={usersList} 
        />
      )}
    </div>
  );
};

export default Files;
