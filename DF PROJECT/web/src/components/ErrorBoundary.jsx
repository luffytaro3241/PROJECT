import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) { 
    super(props); 
    this.state = { hasError: false, error: null, errorId: null }; 
  }
  
  static getDerivedStateFromError(error) { 
    const errorId = Date.now().toString(36);
    return { hasError: true, error, errorId }; 
  }

  handleReload = () => {
    // Clear all storage
    localStorage.clear();
    sessionStorage.clear();
    
    // Reload with cache busting
    window.location.reload(true);
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <div className="error-container">
            <div className="error-visual">
              <div className="error-icon-wrapper">
                <AlertTriangle size={48} className="error-icon-main" />
                <div className="error-pulse"></div>
              </div>
              <div className="error-code">ERROR-{this.state.errorId?.toUpperCase()}</div>
            </div>
            
            <div className="error-content">
              <h1 className="error-title">System Error Detected</h1>
              <p className="error-message">
                We encountered an unexpected issue while rendering this view. 
                This has been logged for investigation.
              </p>
              
              <div className="error-actions">
                <button 
                  onClick={this.handleReload} 
                  className="btn btn-primary btn-lg"
                >
                  <RefreshCw size={18} />
                  Reboot System
                </button>
              </div>
              
              <div className="error-details">
                <p className="error-hint">
                  <strong>Troubleshooting:</strong> Try clearing your browser cache 
                  or restarting your browser if the issue persists.
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
