import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="ic-footer">
      <div className="ic-footer-inner">
        <div>
          <div className="ic-footer-brand">Intellectual Collaboration</div>
          <p className="ic-footer-desc">
            A modern collaboration platform for doctoral students, faculty, and staff at Grand Canyon University.
            Powered by AWS.
          </p>
        </div>

        {/* Resources */}
        <div>
          <h3>Resources</h3>
          <ul>
            <li><Link to="/content">Documents & Templates</Link></li>
            <li><Link to="/media">Media Library</Link></li>
            <li><Link to="/help">Help & Training</Link></li>
            <li><a href="https://sites.gcu.edu/ic/" target="_blank" rel="noreferrer">CampusPress Site</a></li>
          </ul>
        </div>

        {/* Communities */}
        <div>
          <h3>Communities</h3>
          <ul>
            <li><Link to="/groups">Group Directory</Link></li>
            <li><Link to="/forums">Forums</Link></li>
            <li><Link to="/calendar">Calendar</Link></li>
            <li><Link to="/ldp">LDP Portal</Link></li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h3>Support</h3>
          <ul>
            <li><a href="mailto:ic-support@gcu.edu">ic-support@gcu.edu</a></li>
            <li><Link to="/help">Help Center</Link></li>
            <li><Link to="/profile">My Profile</Link></li>
            <li><a href="https://www.gcu.edu" target="_blank" rel="noreferrer">GCU Main Site</a></li>
          </ul>
        </div>
      </div>

      <div className="ic-footer-bottom">
        <span>© 2025 Grand Canyon University. All rights reserved.</span>
        <span>FERPA &nbsp;|&nbsp; Privacy Policy &nbsp;|&nbsp; Terms of Use</span>
      </div>
    </footer>
  );
}