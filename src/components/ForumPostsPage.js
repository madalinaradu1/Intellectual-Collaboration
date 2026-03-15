import React, { useState, useEffect } from 'react';
import { generateClient } from 'aws-amplify/api';
import { listPosts } from '../graphql/queries';
import { createPost, updatePost, deletePost } from '../graphql/mutations';
import ConfirmModal from './ConfirmModal';

const client = generateClient();

/**
 * Forum posts page component for viewing and managing posts within a forum
 * Allows users to create, edit, delete, and view posts in a specific forum
 */
export default function ForumPostsPage({ forum, user, onBack }) {
  // Data and UI states
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  
  // Form states
  const [newPostBody, setNewPostBody] = useState('');
  const [editingPost, setEditingPost] = useState(null);
  const [editPostBody, setEditPostBody] = useState('');
  
  // Modal states
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);

  // Load posts when forum changes
  useEffect(() => {
    if (forum) {
      fetchPosts();
    }
  }, [forum]);

  // === API FUNCTIONS ===
  
  /** Fetch all posts for the current forum */
  const fetchPosts = async () => {
    setLoading(true);
    try {
      const result = await client.graphql({
        query: listPosts,
        variables: {
          filter: { forumID: { eq: forum.id } }
        }
      });
      
      // Sort posts chronologically (oldest first)
      const sortedPosts = result.data.listPosts.items.sort(
        (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
      );
      setPosts(sortedPosts);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
    setLoading(false);
  };

  /** Get current user's display name */
  const getCurrentUserName = () => {
    return user?.attributes?.name || user?.name || user?.username || user?.email || 'Anonymous';
  };

  /** Create a new post in the forum */
  const handleCreatePost = async () => {
    if (!newPostBody.trim()) {
      alert('Post content cannot be empty');
      return;
    }

    const authorName = getCurrentUserName();
    setCreating(true);
    
    try {
      await client.graphql({
        query: createPost,
        variables: {
          input: {
            body: newPostBody.trim(),
            author: authorName,
            createdBy: authorName,
            forumID: forum.id
          }
        }
      });
      
      setNewPostBody('');
      fetchPosts();
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Failed to create post');
    } finally {
      setCreating(false);
    }
  };

  /** Initiate post deletion with confirmation */
  const handleDeletePost = (post) => {
    setPostToDelete(post);
    setShowDeleteConfirm(true);
  };

  /** Confirm and execute post deletion */
  const confirmDelete = async () => {
    try {
      await client.graphql({
        query: deletePost,
        variables: { input: { id: postToDelete.id } }
      });
      fetchPosts();
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Failed to delete post');
    }
    
    // Reset delete state
    setShowDeleteConfirm(false);
    setPostToDelete(null);
  };

  /** Cancel post deletion */
  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setPostToDelete(null);
  };

  /** Start editing a post */
  const handleEditPost = (post) => {
    setEditingPost(post.id);
    setEditPostBody(post.body);
  };

  /** Update post with new content */
  const handleUpdatePost = async () => {
    if (!editPostBody.trim()) {
      alert('Post content cannot be empty');
      return;
    }

    try {
      await client.graphql({
        query: updatePost,
        variables: {
          input: {
            id: editingPost,
            body: editPostBody.trim()
          }
        }
      });
      
      // Reset edit state
      setEditingPost(null);
      setEditPostBody('');
      fetchPosts();
    } catch (error) {
      console.error('Error updating post:', error);
      alert('Failed to update post');
    }
  };

  /** Cancel post editing */
  const cancelEditPost = () => {
    setEditingPost(null);
    setEditPostBody('');
  };

  // === PERMISSION CHECKS ===
  
  /** Check if user can edit post (author only) */
  const canEditPost = (post) => {
    if (!user) return false;
    const currentUserName = getCurrentUserName();
    return currentUserName === post.createdBy || currentUserName === post.author;
  };

  /** Check if user can delete post (author or admin) */
  const canDeletePost = (post) => {
    if (!user) return false;
    const currentUserName = getCurrentUserName();
    const isAuthor = currentUserName === post.createdBy || currentUserName === post.author;
    const isAdmin = user.isAdmin || user?.attributes?.['custom:role'] === 'admin';
    return isAuthor || isAdmin;
  };

  // === UTILITY FUNCTIONS ===
  
  /** Format timestamp to readable date and time */
  const formatTime = (timestamp) => {
    if (!timestamp) return 'Unknown';
    const date = new Date(timestamp);
    return `${date.toLocaleDateString()} – ${date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    })}`;
  };

  /** Generate user initials for avatar */
  const getInitials = (name) => {
    if (!name) return 'A';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div>
      {/* Header with back button */}
      <div style={{ marginBottom: '1rem' }}>
        <button 
          className="btn-outline" 
          onClick={onBack}
          style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem', marginBottom: '0.5rem' }}
        >
          ← Back to Forums
        </button>
        <h2 style={{ fontSize: '1.1rem', color: '#552B9A', margin: 0 }}>{forum.title}</h2>
        <p style={{ fontSize: '0.8rem', color: '#666', margin: '0.25rem 0 0 0' }}>
          {forum.groupName} • {posts.length} posts
        </p>
      </div>

      {/* Posts list */}
      {loading ? (
        <div>Loading posts...</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1rem' }}>
          {posts.length === 0 ? (
            <div className="ic-card" style={{ textAlign: 'center', color: '#666' }}>
              No posts yet. Be the first to start the conversation!
            </div>
          ) : (
            posts.map((post) => (
              <div key={post.id} className="ic-card">
                {editingPost === post.id ? (
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
                      <div style={{ 
                        width: 34, 
                        height: 34, 
                        borderRadius: '50%', 
                        background: '#552B9A', 
                        color: '#fff', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        fontSize: '0.72rem', 
                        fontWeight: 700, 
                        flexShrink: 0 
                      }}>
                        {getInitials(post.author)}
                      </div>
                      <div>
                        <span style={{ fontWeight: 600, fontSize: '0.85rem', color: '#222' }}>
                          {post.author}
                        </span>
                        <span style={{ fontSize: '0.72rem', color: '#999', marginLeft: '0.5rem' }}>
                          {formatTime(post.createdAt)}
                          {post.updatedAt && post.updatedAt !== post.createdAt && (
                            <span style={{ fontStyle: 'italic', marginLeft: '0.5rem' }}>
                              (edited)
                            </span>
                          )}
                        </span>
                      </div>
                    </div>
                    <textarea
                      value={editPostBody}
                      onChange={(e) => setEditPostBody(e.target.value)}
                      rows={4}
                      style={{ 
                        width: '100%', 
                        padding: '0.65rem 0.85rem', 
                        borderRadius: '6px', 
                        border: '1px solid #ccc', 
                        fontSize: '0.87rem', 
                        resize: 'vertical', 
                        outline: 'none', 
                        fontFamily: 'inherit',
                        marginBottom: '0.75rem',
                        marginLeft: '2.6rem'
                      }}
                      onFocus={(e) => (e.target.style.borderColor = '#552B9A')}
                      onBlur={(e) => (e.target.style.borderColor = '#ccc')}
                    />
                    <div style={{ display: 'flex', gap: '0.5rem', paddingLeft: '2.6rem' }}>
                      <button 
                        className="btn-purple" 
                        onClick={handleUpdatePost}
                        style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
                      >
                        Save
                      </button>
                      <button 
                        className="btn-outline" 
                        onClick={cancelEditPost}
                        style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <div style={{ 
                          width: 34, 
                          height: 34, 
                          borderRadius: '50%', 
                          background: '#552B9A', 
                          color: '#fff', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center', 
                          fontSize: '0.72rem', 
                          fontWeight: 700, 
                          flexShrink: 0 
                        }}>
                          {getInitials(post.author)}
                        </div>
                        <div>
                          <span style={{ fontWeight: 600, fontSize: '0.85rem', color: '#222' }}>
                            {post.author}
                          </span>
                          <span style={{ fontSize: '0.72rem', color: '#999', marginLeft: '0.5rem' }}>
                            {formatTime(post.createdAt)}
                            {post.updatedAt && post.updatedAt !== post.createdAt && (
                              <span style={{ fontStyle: 'italic', marginLeft: '0.5rem' }}>
                                (edited)
                              </span>
                            )}
                          </span>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '0.25rem' }}>
                        {canEditPost(post) && (
                          <button 
                            onClick={() => handleEditPost(post)}
                            style={{ 
                              background: 'none', 
                              border: 'none', 
                              cursor: 'pointer', 
                              fontSize: '0.75rem',
                              color: '#552B9A',
                              padding: '0.25rem'
                            }}
                            title="Edit post"
                          >
                            ✏️
                          </button>
                        )}
                        {canDeletePost(post) && (
                          <button 
                            onClick={() => handleDeletePost(post)}
                            style={{ 
                              background: 'none', 
                              border: 'none', 
                              cursor: 'pointer', 
                              fontSize: '0.75rem',
                              color: '#dc3545',
                              padding: '0.25rem'
                            }}
                            title="Delete post"
                          >
                            🗑️
                          </button>
                        )}
                      </div>
                    </div>
                    <p style={{ 
                      fontSize: '0.87rem', 
                      color: '#444', 
                      lineHeight: 1.6, 
                      paddingLeft: '2.6rem',
                      margin: 0,
                      whiteSpace: 'pre-wrap'
                    }}>
                      {post.body}
                    </p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* New post form */}
      <div className="ic-card">
        <h3 style={{ margin: '0 0 0.75rem 0', fontSize: '0.9rem' }}>Add a Post</h3>
        <textarea
          placeholder="Share your thoughts, ask questions, or contribute to the discussion..."
          value={newPostBody}
          onChange={(e) => setNewPostBody(e.target.value)}
          rows={4}
          style={{ 
            width: '100%', 
            padding: '0.65rem 0.85rem', 
            borderRadius: '6px', 
            border: '1px solid #ccc', 
            fontSize: '0.87rem', 
            resize: 'vertical', 
            outline: 'none', 
            fontFamily: 'inherit',
            marginBottom: '0.75rem'
          }}
          onFocus={(e) => (e.target.style.borderColor = '#552B9A')}
          onBlur={(e) => (e.target.style.borderColor = '#ccc')}
        />
        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
          <button 
            className="btn-outline" 
            onClick={() => setNewPostBody('')}
            disabled={creating || !newPostBody.trim()}
          >
            Clear
          </button>
          <button 
            className="btn-purple" 
            onClick={handleCreatePost}
            disabled={creating || !newPostBody.trim()}
          >
            {creating ? 'Posting...' : 'Post'}
          </button>
        </div>
      </div>

      {/* Delete confirmation modal */}
      <ConfirmModal
        isOpen={showDeleteConfirm}
        title="Delete Post"
        message="Are you sure you want to delete this post? This action cannot be undone."
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </div>
  );
}