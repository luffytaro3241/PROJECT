import React, { useState, useEffect } from 'react';
import { FileText, Loader2, Download, ShieldCheck, CheckCircle2, X } from 'lucide-react';
import { safeRender, getFileName, getFileAccess } from '../utils/helpers';

const FileViewer = ({ file, onClose, onDownload, usersList }) => {
  const [booting, setBooting] = useState(true);
  
  useEffect(() => { 
    const t = setTimeout(() => setBooting(false), 800); 
    return () => clearTimeout(t); 
  }, []);

  if (!file) return null;
  
  const fName = getFileName(file);
  const fAccess = getFileAccess(file);
  const ownerName = safeRender((usersList || []).find(u => u?.id === file.ownerId)?.name, 'System User');

  return (
    <div className="modal-overlay">
      <div className="file-viewer">
        {/* Sidebar */}
        <div className="file-sidebar">
          <div className="file-header">
            <div className="file-icon">
              {booting ? <Loader2 className="animate-spin" size={24} /> : <FileText size={24} />}
            </div>
            <h2 className="file-title">{fName}</h2>
            <span className={`file-access ${fAccess === 'Restricted' ? 'restricted' : 'private'}`}>
              {fAccess} Access
            </span>
          </div>
          
          <div className="file-details">
            <div className="detail-item">
              <p className="detail-label">Owner</p>
              <p className="detail-value">{ownerName}</p>
            </div>
            <div className="detail-item">
              <p className="detail-label">File Size</p>
              <p className="detail-value">{safeRender(file.size)}</p>
            </div>
            <div className="detail-item">
              <p className="detail-label">Encryption</p>
              <p className="detail-value encryption">
                <ShieldCheck size={14}/>
                AES-256 Validated
              </p>
            </div>
          </div>
          <button onClick={onClose} className="btn-secondary">Close Preview</button>
        </div>

        {/* Content Area */}
        <div className="file-content">
          {booting ? (
             <div className="file-loading">
                <Loader2 size={32} className="animate-spin" />
                <p>Decrypting document...</p>
             </div>
          ) : (
            <div className="file-preview">
               <div className="preview-header">
                 <p className="preview-status">
                   <CheckCircle2 size={16} />
                   Preview Ready
                 </p>
                 <button onClick={() => onDownload(fName)} className="btn-download">
                   <Download size={16}/>
                   Download
                 </button>
               </div>
               <div className="preview-content">
                  {safeRender(file.content, 'No content available.')}
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FileViewer;
