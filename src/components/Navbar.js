import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

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
];

/* Single dropdown used on desktop */
function DropdownMenu({ item, closeAll }) {
  return (
    <div className="dropdown">
      {item.children.map((child) => (
        <Link key={child.label} to={child.path} className="dropdown-link" onClick={closeAll}>
          {child.label}
        </Link>
      ))}
    </div>
  );
}

export default function Navbar({ user, signOut }) {
  const [openDesktop, setOpenDesktop] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState(null);
  const navRef = useRef(null);

  // close desktop dropdown when clicking outside
  useEffect(() => {
    function handler(e) {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setOpenDesktop(null);
      }
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const closeAll = () => {
    setOpenDesktop(null);
    setMobileOpen(false);
    setMobileExpanded(null);
  };

  return (
    <header className="ic-header">
      {/* GCU top bar */}
      <div className="gcu-topbar">
        <span className="gcu-logo">GCU</span>
      </div>

      {/* Main nav */}
      <nav className="ic-navbar" ref={navRef}>
        <Link to="/" className="ic-brand" onClick={closeAll}>
          Intellectual Collaboration
        </Link>

        {/* Desktop nav items */}
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
                  >
                    {item.label}
                    <span className="dropdown-arrow">▾</span>
                  </button>
                  {openDesktop === i && <DropdownMenu item={item} closeAll={closeAll} />}
                </>
              ) : (
                <Link to={item.path} className="nav-link" onClick={closeAll}>
                  {item.label}
                </Link>
              )}
            </div>
          ))}
        </div>

        {/* Desktop right icons */}
        <div className="ic-nav-right">
          <button className="icon-btn" aria-label="Search">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          </button>
          <button className="hamburger-btn" aria-label="Menu" onClick={() => setMobileOpen(true)}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
          </button>
        </div>
      </nav>

      {/* Mobile slide-out menu */}
      {mobileOpen && (
        <div className="mobile-overlay" onClick={closeAll}>
          <div className="mobile-menu" onClick={(e) => e.stopPropagation()}>
            <button className="mobile-close" onClick={closeAll} aria-label="Close">✕</button>
            {navItems.map((item) => (
              <div key={item.label} className="mobile-item">
                {item.children ? (
                  <>
                    <button
                      className="mobile-link has-children"
                      onClick={() => setMobileExpanded(mobileExpanded === item.label ? null : item.label)}
                    >
                      <span>{item.label}</span>
                      <span className={`mobile-toggle ${mobileExpanded === item.label ? 'open' : ''}`}>▼</span>
                    </button>
                    {mobileExpanded === item.label && (
                      <div className="mobile-children">
                        {item.children.map((child) => (
                          <Link key={child.label} to={child.path} className="mobile-child-link" onClick={closeAll}>
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Link to={item.path} className="mobile-link" onClick={closeAll}>
                    {item.label}
                  </Link>
                )}
              </div>
            ))}
            <div className="mobile-divider" />
            <Link to="/forums" className="mobile-link" onClick={closeAll}>Forums</Link>
            <Link to="/calendar" className="mobile-link" onClick={closeAll}>Calendar</Link>
            <Link to="/profile" className="mobile-link" onClick={closeAll}>My Profile</Link>
            <Link to="/admin" className="mobile-link" onClick={closeAll}>Admin</Link>
            <Link to="/help" className="mobile-link" onClick={closeAll}>Help & Training</Link>
            <button className="mobile-signout" onClick={signOut}>Sign Out</button>
          </div>
        </div>
      )}
    </header>
  );
}