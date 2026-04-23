import React, { useState, useEffect } from 'react';
import { ShieldCheck, KeyRound, X, CheckCircle2, Eye, EyeOff, User, Mail, Building } from 'lucide-react';

const Authenticator = ({ onLogin, usersList }) => {
  const [step, setStep] = useState('details'); 
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('Employee');
  const [isSignup, setIsSignup] = useState(false);
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsAnimating(true), 0);
    return () => clearTimeout(timer);
  }, [step]);

  useEffect(() => {
    if (isAnimating) {
      const timer = setTimeout(() => setIsAnimating(false), 100);
      return () => clearTimeout(timer);
    }
  }, [isAnimating]);

  const verifyPin = (currentPin) => {
    if (currentPin === '1234' || currentPin === '0000') {
      setError(false);
      setTimeout(() => {
        let activeUser;
        if (isSignup) {
          activeUser = { 
            id: `usr-${Date.now()}`, 
            name: name || email.split('@')[0], 
            email, 
            role,
            avatar: name?.charAt(0)?.toUpperCase() || email.charAt(0)?.toUpperCase()
          };
        } else {
          activeUser = (usersList || []).find(u => u?.email === email) || { 
            id: `usr-${Date.now()}`, 
            name: email.split('@')[0], 
            email, 
            role,
            avatar: email.charAt(0)?.toUpperCase()
          };
          activeUser.role = role; 
        }
        onLogin(activeUser, isSignup);
      }, 600);
    } else {
      setError(true);
      setTimeout(() => { 
        setPin(''); 
        setError(false); 
      }, 800);
    }
  };

  const handleInput = (val) => {
    if (pin.length < 4) {
      const next = pin + val;
      setPin(next);
      if (next.length === 4) {
        verifyPin(next);
      }
    }
  };

  const handleBackspace = () => {
    setPin(p => p.slice(0, -1));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email && email.includes('@')) {
      setIsAnimating(true);
      setTimeout(() => {
        setStep('pin');
        setIsAnimating(false);
      }, 300);
    }
  };

  const getRoleIcon = (roleValue) => {
    switch(roleValue) {
      case 'Admin': return <Building size={16} />;
      case 'Manager': return <ShieldCheck size={16} />;
      default: return <User size={16} />;
    }
  };

  const getRoleColor = (roleValue) => {
    switch(roleValue) {
      case 'Admin': return 'admin';
      case 'Manager': return 'manager';
      default: return 'employee';
    }
  };

  return (
    <div className="auth-container gpu-accelerated fade-in-up">
      <div className="auth-card card-container">
        <div className="card layer-3d">
          <div className="auth-header">
            <div className="auth-icon-wrapper">
              <ShieldCheck className="auth-logo-icon" size={32} />
            </div>
            <h2 className="auth-title">
              {step === 'details' ? (isSignup ? 'Create Secure Account' : 'Security Clearance') : 'Identity Verification'}
            </h2>
            <p className="auth-subtitle">
              {step === 'details' ? 'Enter your credentials to access the encrypted vault.' : 'Enter your 4-digit security PIN.'}
            </p>
          </div>

          <div className="auth-body">
            {step === 'details' ? (
              <form onSubmit={handleSubmit} className="auth-form">
                {isSignup && (
                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <div className="input-wrapper">
                      <User className="input-icon" size={18} />
                      <input 
                        type="text" 
                        className="form-input" 
                        placeholder="John Doe"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                )}
                
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <div className="input-wrapper">
                    <Mail className="input-icon" size={18} />
                    <input 
                      type="email" 
                      className="form-input" 
                      placeholder="name@company.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Access Level</label>
                  <div className="role-grid">
                    {['Employee', 'Manager', 'Admin'].map(r => (
                      <button
                        key={r}
                        type="button"
                        className={`role-btn ${role === r ? 'active' : ''}`}
                        onClick={() => setRole(r)}
                      >
                        {getRoleIcon(r)}
                        <span>{r}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <button type="submit" className="submit-btn">
                  <span>Continue to Verification</span>
                  <KeyRound size={18} />
                </button>

                <p className="auth-toggle">
                  {isSignup ? 'Already have access?' : "Don't have an account?"}
                  <button type="button" onClick={() => setIsSignup(!isSignup)}>
                    {isSignup ? 'Sign In' : 'Request Access'}
                  </button>
                </p>
              </form>
            ) : (
              <div className="pin-verification">
                <div className={`pin-display ${error ? 'error' : ''}`}>
                  {[0, 1, 2, 3].map(i => (
                    <div key={i} className={`pin-digit ${pin.length > i ? 'filled' : ''}`} />
                  ))}
                </div>
                
                <div className="pin-grid">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 'C', 0, '←'].map(val => (
                    <button
                      key={val}
                      className="pin-btn"
                      onClick={() => {
                        if (val === 'C') setPin('');
                        else if (val === '←') handleBackspace();
                        else handleInput(val.toString());
                      }}
                    >
                      {val}
                    </button>
                  ))}
                </div>

                <button className="back-btn" onClick={() => setStep('details')}>
                  Back to Credentials
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Authenticator;
