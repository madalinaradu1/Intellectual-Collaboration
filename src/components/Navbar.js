import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import logo from '../logo.png';

// Navigation configuration - centralized for easy maintenance
const navItems = [
  {
    label: 'Doctoral Communities',
    children: [
      { label: 'EDD Community', path: '/groups' },
      { label: 'DBA Community', path: '/groups' },
      { label: 'DHA Community', path: '/groups' },
      { label: 'PHD Community', path: '/groups' },
      { label: 'DNP Community', path: '/groups' },
    ],
  },
  {
    label: 'Dissertation Resources',
    children: [
      { label: 'Dissertation Home', path: '/ldp' },
      { label: 'Dissertation Templates', path: '/content' },
      { label: 'Program of Study', path: '/ldp' },
    ],
  },
  {
    label: 'Research Training',
    children: [
      { label: 'Peer Review Training', path: '/help' },
      { label: 'Dissertation Ready Training', path: '/help' },
      { label: 'Research Ready Training', path: '/help' },
    ],
  },
  {
    label: 'Software',
    children: [
      { label: 'Quantitative (SPSS)', path: '/content' },
      { label: 'Qualitative (MaxQDA)', path: '/content' },
      { label: 'Laerd Statistics', path: '/content' },
      { label: 'Intellektus Statistics', path: '/content' },
    ],
  },
  {
    label: 'Knowledge Base',
    children: [
      { label: 'Quantitative', path: '/content' },
      { label: 'Qualitative', path: '/content' },
    ],
  },
  { label: 'Residency', path: '/content' },
  {
    label: 'Webinars & Videos',
    children: [
      { label: 'Media Library', path: '/media' },
      { label: 'Alumni Videos', path: '/media' },
    ],
  },
  { label: 'Commencement', path: '/content' },
  {
    label: 'Quick Links',
    children: [
      { label: 'Forums', path: '/forums' },
      { label: 'Calendar', path: '/calendar' },
      { label: 'Groups', path: '/groups' },
      { label: 'Review Portal', path: '/review' },
      { label: 'My Profile', path: '/profile' },
    ],
  },
  {
    label: 'WordPress',
    path: 'https://sites.gcu.edu/ic/',
    external: true
  },
];

/**
 * DropdownMenu component renders navigation dropdown menus
 * @param {Object} item - Navigation item with children
 * @param {Function} closeAll - Function to close all dropdowns
 */
function DropdownMenu({ item, closeAll }) {
  return (
    <div className="dropdown">
      {item.children.map((child) => (
        <Link 
          key={child.label} 
          to={child.path} 
          className="dropdown-link" 
          onClick={closeAll}
        >
          {child.label}
        </Link>
      ))}
    </div>
  );
}

/**
 * Main Navbar component providing site navigation
 * Features responsive design, dropdown menus, and mobile-friendly interface
 * @param {Object} user - Current authenticated user
 * @param {Function} signOut - Function to handle user sign out
 */
export default function Navbar({ user, signOut }) {
  const [openDesktop, setOpenDesktop] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState(null);
  const navRef = useRef(null);

  /**
   * Closes all open dropdowns and mobile menus
   */
  const closeAll = useCallback(() => {
    setOpenDesktop(null);
    setMobileOpen(false);
    setMobileExpanded(null);
  }, []);

  /**
   * Handles clicks outside the navigation to close dropdowns
   */
  const handleOutsideClick = useCallback((e) => {
    if (navRef.current && !navRef.current.contains(e.target)) {
      setOpenDesktop(null);
    }
  }, []);

  // Set up outside click listener for desktop dropdowns
  useEffect(() => {
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [handleOutsideClick]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileOpen]);

  // Memoize user display name for performance
  const userDisplayName = useMemo(() => {
    if (!user?.attributes?.name) return 'User';
    return user.attributes.name.split('@')[0];
  }, [user?.attributes?.name]);

  return (
    <header className="ic-header">
      {/* GCU branding bar */}
      <div className="gcu-topbar">
        <span className="gcu-logo">
          <a href="https://www.gcu.edu/" target="_blank" rel="noopener noreferrer">
            <img src={logo} alt="Grand Canyon University" />
          </a>
        </span>
        <span className="user-welcome">Welcome, {userDisplayName}</span>
      </div>

      {/* Main navigation */}
      <nav className="ic-navbar" ref={navRef}>
        <Link to="/" className="ic-brand" onClick={closeAll}>
          Intellectual Collaboration
        </Link>

        {/* Desktop navigation items */}
        <div className="ic-nav-items">
          {navItems.map((item, i) => (
            <div
              key={item.label}
              className="nav-item-wrapper"
              onMouseEnter={() => item.children && setOpenDesktop(i)}
              onMouseLeave={() => setOpenDesktop(null)}
            >
              {item.children ? (
                <>
                  <button
                    className={`nav-link has-dropdown ${openDesktop === i ? 'active' : ''}`}
                    onClick={() => setOpenDesktop(openDesktop === i ? null : i)}
                    aria-expanded={openDesktop === i}
                    aria-haspopup="true"
                  >
                    {item.label}
                    <span className="dropdown-arrow" aria-hidden="true">▾</span>
                  </button>
                  {openDesktop === i && <DropdownMenu item={item} closeAll={closeAll} />}
                </>
              ) : (
                item.external ? (
                  <a 
                    href={item.path} 
                    className="nav-link" 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    {item.label}
                  </a>
                ) : (
                  <Link to={item.path} className="nav-link" onClick={closeAll}>
                    {item.label}
                  </Link>
                )
              )}
            </div>
          ))}
        </div>

        {/* Desktop right side controls */}
        <div className="ic-nav-right">
          <button className="icon-btn" aria-label="Search" title="Search">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
          </button>
          <button 
            className="hamburger-btn" 
            aria-label="Open menu" 
            onClick={() => setMobileOpen(true)}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="3" y1="6" x2="21" y2="6"/>
              <line x1="3" y1="12" x2="21" y2="12"/>
              <line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile slide-out menu */}
      {mobileOpen && (
        <div className="mobile-overlay" onClick={closeAll}>
          <div className="mobile-menu" onClick={(e) => e.stopPropagation()}>
            <div className="mobile-header">
              <h3>Navigation</h3>
              <button 
                className="mobile-close" 
                onClick={closeAll} 
                aria-label="Close menu"
              >
                ✕
              </button>
            </div>
            
            <div className="mobile-content">
              {navItems.map((item) => (
                <div key={item.label} className="mobile-item">
                  {item.children ? (
                    <>
                      <button
                        className="mobile-link has-children"
                        onClick={() => setMobileExpanded(
                          mobileExpanded === item.label ? null : item.label
                        )}
                        aria-expanded={mobileExpanded === item.label}
                      >
                        <span>{item.label}</span>
                        <span 
                          className={`mobile-toggle ${mobileExpanded === item.label ? 'open' : ''}`}
                          aria-hidden="true"
                        >
                          ▼
                        </span>
                      </button>
                      {mobileExpanded === item.label && (
                        <div className="mobile-children">
                          {item.children.map((child) => (
                            <Link 
                              key={child.label} 
                              to={child.path} 
                              className="mobile-child-link" 
                              onClick={closeAll}
                            >
                              {child.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    item.external ? (
                      <a 
                        href={item.path} 
                        className="mobile-link" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        onClick={closeAll}
                      >
                        {item.label}
                      </a>
                    ) : (
                      <Link to={item.path} className="mobile-link" onClick={closeAll}>
                        {item.label}
                      </Link>
                    )
                  )}
                </div>
              ))}
              
              <div className="mobile-divider" />
              
              {/* Quick access links */}
              <Link to="/forums" className="mobile-link" onClick={closeAll}>Forums</Link>
              <Link to="/calendar" className="mobile-link" onClick={closeAll}>Calendar</Link>
              <Link to="/profile" className="mobile-link" onClick={closeAll}>My Profile</Link>
              <Link to="/admin" className="mobile-link" onClick={closeAll}>Admin</Link>
              <Link to="/help" className="mobile-link" onClick={closeAll}>Help & Training</Link>
              
              <button className="mobile-signout" onClick={signOut}>
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}