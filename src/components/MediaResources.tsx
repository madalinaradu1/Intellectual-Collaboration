import React, { useState } from 'react';
import './MediaResources.css';

const MediaResources: React.FC = () => {
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  const featuredVideos = [
    {
      id: 'proposal-submission',
      title: 'How to Submit Dissertation Proposal',
      description: 'Step-by-step guide for submitting your dissertation proposal through the IGLOO platform.',
      thumbnail: '📄',
      duration: '12:45',
      category: 'Proposal'
    },
    {
      id: 'review-portal',
      title: 'Using the Review Portal',
      description: 'Learn how to navigate and use the committee review portal for feedback and approvals.',
      thumbnail: '👁️',
      duration: '8:30',
      category: 'Review'
    },
    {
      id: 'irb-process',
      title: 'IRB Application Process',
      description: 'Complete walkthrough of the Institutional Review Board application and approval process.',
      thumbnail: '✅',
      duration: '15:20',
      category: 'IRB'
    },
    {
      id: 'committee-communication',
      title: 'Committee Communication Best Practices',
      description: 'Tips and guidelines for effective communication with your dissertation committee.',
      thumbnail: '💬',
      duration: '10:15',
      category: 'Communication'
    },
    {
      id: 'defense-preparation',
      title: 'Preparing for Your Defense',
      description: 'Essential steps and strategies for preparing and conducting your dissertation defense.',
      thumbnail: '🎓',
      duration: '18:45',
      category: 'Defense'
    },
    {
      id: 'document-management',
      title: 'Document Version Control',
      description: 'Managing document versions and tracking changes throughout your dissertation process.',
      thumbnail: '📋',
      duration: '9:30',
      category: 'Documents'
    }
  ];

  const categories = ['All', 'Proposal', 'Review', 'IRB', 'Communication', 'Defense', 'Documents'];
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredVideos = selectedCategory === 'All' 
    ? featuredVideos 
    : featuredVideos.filter(video => video.category === selectedCategory);

  return (
    <div className="media-resources">
      <div className="media-container">
        {/* Header */}
        <div className="media-header">
          <h1>📺 Media Resources</h1>
          <p>Video tutorials and guides for the IGLOO platform</p>
          <div className="search-bar">
            <input type="text" placeholder="Search videos..." />
            <button>🔍</button>
          </div>
        </div>

        {/* Category Filter */}
        <div className="category-filter">
          {categories.map(category => (
            <button
              key={category}
              className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="media-content">
          {/* Main Video Player */}
          <div className="video-player-section">
            {selectedVideo ? (
              <div className="video-player">
                <div className="video-placeholder">
                  <div className="play-button">▶️</div>
                  <h3>{featuredVideos.find(v => v.id === selectedVideo)?.title}</h3>
                </div>
                <div className="video-controls">
                  <button>⏮️</button>
                  <button>⏯️</button>
                  <button>⏭️</button>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{width: '35%'}}></div>
                  </div>
                  <span>5:20 / 12:45</span>
                  <button>🔊</button>
                  <button>⛶</button>
                </div>
                <div className="video-description">
                  <h4>Description</h4>
                  <p>{featuredVideos.find(v => v.id === selectedVideo)?.description}</p>
                  <div className="video-timestamps">
                    <h5>Key Timestamps:</h5>
                    <ul>
                      <li><a href="#0:30">0:30 - Introduction</a></li>
                      <li><a href="#2:15">2:15 - Getting Started</a></li>
                      <li><a href="#5:45">5:45 - Step-by-Step Process</a></li>
                      <li><a href="#9:20">9:20 - Common Issues</a></li>
                      <li><a href="#11:30">11:30 - Summary</a></li>
                    </ul>
                  </div>
                </div>
              </div>
            ) : (
              <div className="video-placeholder-empty">
                <div className="placeholder-icon">📺</div>
                <h3>Select a video to start watching</h3>
                <p>Choose from the featured tutorials below</p>
              </div>
            )}
          </div>

          {/* Video Grid */}
          <div className="video-grid">
            <h2>Featured Tutorials</h2>
            <div className="videos-container">
              {filteredVideos.map(video => (
                <div 
                  key={video.id}
                  className={`video-card ${selectedVideo === video.id ? 'selected' : ''}`}
                  onClick={() => setSelectedVideo(video.id)}
                >
                  <div className="video-thumbnail">
                    <div className="thumbnail-icon">{video.thumbnail}</div>
                    <div className="video-duration">{video.duration}</div>
                  </div>
                  <div className="video-info">
                    <h4>{video.title}</h4>
                    <p>{video.description}</p>
                    <div className="video-meta">
                      <span className="category-tag">{video.category}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="media-sidebar">
          <div className="quick-links">
            <h3>🔗 Quick Links</h3>
            <ul>
              <li><a href="#help">Help & Support</a></li>
              <li><a href="#faq">Frequently Asked Questions</a></li>
              <li><a href="#contact">Contact Committee</a></li>
              <li><a href="#resources">Additional Resources</a></li>
            </ul>
          </div>

          <div className="recent-activity">
            <h3>📋 Recent Activity</h3>
            <div className="activity-item">
              <span className="activity-time">2 hours ago</span>
              <span className="activity-text">Watched "IRB Process"</span>
            </div>
            <div className="activity-item">
              <span className="activity-time">1 day ago</span>
              <span className="activity-text">Completed "Proposal Submission"</span>
            </div>
            <div className="activity-item">
              <span className="activity-time">3 days ago</span>
              <span className="activity-text">Started "Committee Communication"</span>
            </div>
          </div>

          <div className="recommended-videos">
            <h3>💡 Recommended</h3>
            <div className="recommended-item">
              <div className="rec-thumbnail">📊</div>
              <div className="rec-info">
                <h5>Data Analysis Basics</h5>
                <span>8:45</span>
              </div>
            </div>
            <div className="recommended-item">
              <div className="rec-thumbnail">📖</div>
              <div className="rec-info">
                <h5>Literature Review Tips</h5>
                <span>12:30</span>
              </div>
            </div>
            <div className="recommended-item">
              <div className="rec-thumbnail">✍️</div>
              <div className="rec-info">
                <h5>Academic Writing Style</h5>
                <span>15:20</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MediaResources;