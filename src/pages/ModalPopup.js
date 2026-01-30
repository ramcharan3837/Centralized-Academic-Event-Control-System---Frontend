import React, { useEffect } from 'react';
import './ModalPopup.css';


const ModalPopup = ({ 
  showPopup = false,
  type = 'info', 
  message, 
  buttons = []
}) => {
  
  // Prevent keyboard events and scrolling
  useEffect(() => {
    if (!showPopup) return;

    const handleKeyDown = (e) => {
      e.preventDefault();
      e.stopPropagation();
    };

    const handleKeyUp = (e) => {
      e.preventDefault();
      e.stopPropagation();
    };

    const handleKeyPress = (e) => {
      e.preventDefault();
      e.stopPropagation();
    };

    // Add event listeners with capture phase
    document.addEventListener('keydown', handleKeyDown, true);
    document.addEventListener('keyup', handleKeyUp, true);
    document.addEventListener('keypress', handleKeyPress, true);
    
    // Prevent scrolling
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown, true);
      document.removeEventListener('keyup', handleKeyUp, true);
      document.removeEventListener('keypress', handleKeyPress, true);
      document.body.style.overflow = 'unset';
    };
  }, [showPopup]);

  if (!showPopup) return null;

  const getModalConfig = () => {
    switch (type) {
      case 'success':
        return {
          icon: '✓',
          iconBg: '#10b981',
          primaryColor: '#10b981'
        };
      case 'error':
      case 'failure':
        return {
          icon: '✕',
          iconBg: '#ef4444',
          primaryColor: '#ef4444'
        };
      case 'warning':
        return {
          icon: '⚠',
          iconBg: '#f59e0b',
          primaryColor: '#f59e0b'
        };
      case 'info':
        return {
          icon: 'ℹ',
          iconBg: '#3b82f6',
          primaryColor: '#3b82f6'
        };
      default:
        return {
          icon: 'ℹ',
          iconBg: '#3b82f6',
          primaryColor: '#3b82f6'
        };
    }
  };

  const config = getModalConfig();

  // Prevent backdrop click from closing modal
  const handleBackdropClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  // Prevent clicks inside modal from propagating
  const handleModalClick = (e) => {
    e.stopPropagation();
  };

  // Handle button click
//   const handleButtonClick = (button) => (e) => {
//     e.preventDefault();
//     e.stopPropagation();
//     if (button.onClick) {
//       button.onClick();
//     }
//   };

  return (
    <div className="modalpopup-overlay" onClick={handleBackdropClick} onMouseDown={handleBackdropClick}>
      <div className="modalpopup-container" onClick={handleModalClick} onMouseDown={handleModalClick}>
        <div className="modalpopup-icon-wrapper">
          <div 
            className="modalpopup-icon" 
            style={{ 
              backgroundColor: config.iconBg,
              color: '#ffffff'
            }}
          >
            {config.icon}
          </div>
        </div>
        
        <p className="modalpopup-message">{message}</p>
        
        {buttons && buttons.length > 0 && (
          <div className="modalpopup-buttons">
            {buttons.map((button, index) => (
              <button
                key={index}
                className={`modalpopup-button ${button.variant === 'primary' ? 'modalpopup-button-primary' : 'modalpopup-button-secondary'}`}
                style={
                  button.variant === 'primary' 
                    ? { backgroundColor: config.primaryColor } 
                    : {}
                }
                onClick={button.action}
              >
                {button.text}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ModalPopup;