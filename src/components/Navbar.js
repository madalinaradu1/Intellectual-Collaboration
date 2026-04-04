import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import logo from '../logo.png';

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
];

const mobileQuickLinks = [
  { label: 'Forums', path: '/forums' },
  { label: 'Calendar', path: '/calendar' },
  { label: 'Groups', path: '/groups' },
  { label: 'Review Portal', path: '/review' },
  { label: 'My Profile', path: '/profile' },
  { label: 'Admin', path: '/admin' },
  { label: 'Help & Training', path: '/help' },
];

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

  const closeAll = useCallback(() => {
    setOpenDesktop(null);
    setMobileOpen(false);
    setMobileExpanded(null);
  }, []);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) setOpenDesktop(null);
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [mobileOpen]);

  const userDisplayName = user?.attributes?.name?.split('@')[0] || 'User';

  return (
    <header className="ic-header">
      <div className="gcu-topbar">
        <span className="gcu-logo">
          <a href="https://www.gcu.edu/" target="_blank" rel="noopener noreferrer">
            <img src={logo} alt="Grand Canyon University" />
          </a>
        </span>
        <span className="user-welcome">Welcome, {userDisplayName}</span>
      </div>

      <nav className="ic-navbar" ref={navRef}>
        <Link to="/" className="ic-brand" onClick={closeAll}>
          Intellectual Collaboration
        </Link>

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
              ) : item.external ? (
                <a href={item.path} className="nav-link" target="_blank" rel="noopener noreferrer">
                  {item.label}
                </a>
              ) : (
                <Link to={item.path} className="nav-link" onClick={closeAll}>
                  {item.label}
                </Link>
              )}
            </div>
          ))}
        </div>

        <div className="ic-nav-right">
          <button className="hamburger-btn" aria-label="Open menu" onClick={() => setMobileOpen(true)}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="3" y1="6" x2="21" y2="6"/>
              <line x1="3" y1="12" x2="21" y2="12"/>
              <line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          </button>
        </div>
      </nav>

      {mobileOpen && (
        <div className="mobile-overlay" onClick={closeAll}>
          <div className="mobile-menu" onClick={(e) => e.stopPropagation()}>
            <div className="mobile-header">
              <h3>Navigation</h3>
              <button className="mobile-close" onClick={closeAll} aria-label="Close menu">✕</button>
            </div>

            <div className="mobile-content">
              {navItems.map((item) => (
                <div key={item.label} className="mobile-item">
                  {item.children ? (
                    <>
                      <button
                        className="mobile-link has-children"
                        onClick={() => setMobileExpanded(mobileExpanded === item.label ? null : item.label)}
                        aria-expanded={mobileExpanded === item.label}
                      >
                        <span>{item.label}</span>
                        <span className={`mobile-toggle ${mobileExpanded === item.label ? 'open' : ''}`} aria-hidden="true">▼</span>
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
                  ) : item.external ? (
                    <a href={item.path} className="mobile-link" target="_blank" rel="noopener noreferrer" onClick={closeAll}>
                      {item.label}
                    </a>
                  ) : (
                    <Link to={item.path} className="mobile-link" onClick={closeAll}>
                      {item.label}
                    </Link>
                  )}
                </div>
              ))}

              <div className="mobile-divider" />

              {mobileQuickLinks.map(({ label, path }) => (
                <Link key={label} to={path} className="mobile-link" onClick={closeAll}>{label}</Link>
              ))}
              <a href="https://sites.gcu.edu/ic/" className="mobile-link" target="_blank" rel="noopener noreferrer" onClick={closeAll}>WordPress</a>

              <button className="mobile-signout" onClick={signOut}>Sign Out</button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
