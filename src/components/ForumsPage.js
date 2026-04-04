import React, { useState, useEffect } from 'react';
import { generateClient } from 'aws-amplify/api';
import { listForums } from '../graphql/queries';
import { createForum, updateForum, deleteForum } from '../graphql/mutations';
import ForumPostsPage from './ForumPostsPage';
import ConfirmModal from './ConfirmModal';

const client = generateClient();

export default function ForumsPage({ user }) {
  const [showCreateForum, setShowCreateForum] = useState(false);
  const [selectedForum, setSelectedForum] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [forumToDelete, setForumToDelete] = useState(null);
  const [newForumTitle, setNewForumTitle] = useState('');
  const [newForumGroup, setNewForumGroup] = useState('');
  const [newForumDescription, setNewForumDescription] = useState('');
  const [editingForum, setEditingForum] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const [forums, setForums] = useState([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchForums();
  }, []);

  const fetchForums = async () => {
    setLoading(true);
    try {
      const result = await client.graphql({ query: listForums });
      setForums(result.data.listForums.items);
    } catch (err) {
      console.error('Error fetching forums:', err);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!newForumTitle.trim()) errors.title = 'Forum title is required';
    if (!newForumGroup.trim()) errors.group = 'Group name is required';
    return errors;
  };

  const getCurrentUserId = () => {
    return user?.attributes?.name || user?.name || user?.username || user?.email || 'Anonymous';
  };

  const resetForm = () => {
    setNewForumTitle('');
    setNewForumGroup('');
    setNewForumDescription('');
    setFormErrors({});
    setShowCreateForum(false);
  };

  const handleCreateForum = async () => {
    const errors = validateForm();
    setFormErrors(errors);
    
    if (Object.keys(errors).length > 0) return;
    
    setCreating(true);
    try {
      await client.graphql({
        query: createForum,
        variables: {
          input: {
            title: newForumTitle.trim(),
            groupName: newForumGroup.trim(),
            description: newForumDescription.trim() || null,
            createdBy: getCurrentUserId()
          }
        }
      });
      
      resetForm();
      fetchForums();
    } catch (error) {
      console.error('Error creating forum:', error);
      const errorMessage = error.errors?.[0]?.message || error.message || 'Unknown error';
      alert(`Failed to create forum: ${errorMessage}`);
    } finally {
      setCreating(false);
    }
  };

  const handleEditForum = (forum) => {
    setEditingForum(forum.id);
    setEditTitle(forum.title);
    setEditDescription(forum.description || '');
  };

  const handleUpdateForum = async () => {
    if (!editTitle.trim()) {
      alert('Forum title cannot be empty');
      return;
    }
    
    try {
      await client.graphql({
        query: updateForum,
        variables: {
          input: {
            id: editingForum,
            title: editTitle.trim(),
            description: editDescription.trim() || null
          }
        }
      });
      
      setEditingForum(null);
      setEditTitle('');
      setEditDescription('');
      fetchForums();
    } catch (error) {
      console.error('Error updating forum:', error);
      alert('Failed to update forum');
    }
  };

  const handleDeleteForum = (forum) => {
    setForumToDelete(forum);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      await client.graphql({
        query: deleteForum,
        variables: { input: { id: forumToDelete.id } }
      });
      fetchForums();
    } catch (error) {
      console.error('Error deleting forum:', error);
      alert('Failed to delete forum');
    }
    
    setShowDeleteConfirm(false);
    setForumToDelete(null);
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setForumToDelete(null);
  };

  const canManageForum = (forum) => {
    if (!user) return false;
    return getCurrentUserId() === forum.createdBy ||
      user.isAdmin || user?.attributes?.['custom:role'] === 'admin';
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return 'Unknown';
    const diff = Date.now() - new Date(timestamp);
    const mins = Math.floor(diff / 60000);
    const hrs = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins} minute${mins > 1 ? 's' : ''} ago`;
    if (hrs < 24) return `${hrs} hour${hrs > 1 ? 's' : ''} ago`;
    return `${days} day${days > 1 ? 's' : ''} ago`;
  };

  const inputStyle = {
    width: '100%',
    padding: '0.5rem',
    border: '1px solid #ccc',
    borderRadius: '4px',
    marginBottom: '0.5rem'
  };

  const cardStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    transition: 'box-shadow 0.15s'
  };

  if (selectedForum) {
    return (
      <ForumPostsPage 
        forum={selectedForum} 
        user={user} 
        onBack={() => setSelectedForum(null)} 
      />
    );
  }

  return (
    <div>
      <div className="page-header">
        <h1>Forums & Messaging</h1>
        <p>Discuss, collaborate, and connect with your communities</p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <span style={{ fontSize: '0.85rem', color: '#666' }}>{forums.length} forums</span>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="btn-outline" onClick={fetchForums} style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}>Refresh</button>
          <button className="btn-purple" onClick={() => setShowCreateForum(true)}>+ Create Forum</button>
        </div>
      </div>

      {/* Create Forum Form */}
      {showCreateForum && (
        <div className="ic-card" style={{ marginBottom: '1rem' }}>
          <h3 style={{ margin: '0 0 1rem 0' }}>Create New Forum</h3>
          <input
            type="text"
            placeholder="Forum title"
            value={newForumTitle}
            onChange={(e) => {
              setNewForumTitle(e.target.value);
              if (formErrors.title) {
                setFormErrors(prev => ({ ...prev, title: '' }));
              }
            }}
            style={{
              ...inputStyle,
              borderColor: formErrors.title ? '#dc3545' : '#ccc'
            }}
          />
          {formErrors.title && (
            <div style={{ color: '#dc3545', fontSize: '0.75rem', marginBottom: '0.5rem' }}>
              {formErrors.title}
            </div>
          )}
          <input
            type="text"
            placeholder="Group name (e.g., EDD Community)"
            value={newForumGroup}
            onChange={(e) => {
              setNewForumGroup(e.target.value);
              if (formErrors.group) {
                setFormErrors(prev => ({ ...prev, group: '' }));
              }
            }}
            style={{
              ...inputStyle,
              borderColor: formErrors.group ? '#dc3545' : '#ccc'
            }}
          />
          {formErrors.group && (
            <div style={{ color: '#dc3545', fontSize: '0.75rem', marginBottom: '0.5rem' }}>
              {formErrors.group}
            </div>
          )}
          <textarea
            placeholder="Description (optional)"
            value={newForumDescription}
            onChange={(e) => setNewForumDescription(e.target.value)}
            rows={3}
            style={{
              ...inputStyle,
              marginBottom: '1rem',
              resize: 'vertical'
            }}
          />
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button 
              className="btn-purple" 
              onClick={handleCreateForum}
              disabled={creating}
            >
              {creating ? 'Creating...' : 'Create'}
            </button>
            <button 
              className="btn-outline" 
              onClick={resetForm}
              disabled={creating}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Forums List */}
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
          {forums.length === 0 ? (
            <div className="ic-card" style={{ textAlign: 'center', color: '#666' }}>
              No forums yet. Create the first one!
            </div>
          ) : (
            forums.map((forum) => (
              <div key={forum.id} className="ic-card" style={cardStyle}>
                <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#552B9A', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', flexShrink: 0 }}>
                  💬
                </div>
                <div style={{ flex: 1 }}>
                  {editingForum === forum.id ? (
                    <div>
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        style={{ ...inputStyle, marginBottom: '0.5rem' }}
                        placeholder="Forum title"
                      />
                      <textarea
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                        style={{ ...inputStyle, marginBottom: '0.5rem', resize: 'vertical' }}
                        placeholder="Description (optional)"
                        rows={2}
                      />
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button className="btn-purple" onClick={handleUpdateForum} style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}>Save</button>
                        <button className="btn-outline" onClick={() => setEditingForum(null)} style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}>Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div style={{ fontWeight: 600, color: '#222', fontSize: '0.9rem' }}>{forum.title}</div>
                      <div style={{ fontSize: '0.78rem', color: '#888', marginBottom: '0.25rem' }}>
                        {forum.groupName} | Created: {formatTime(forum.createdAt)}
                      </div>
                      {forum.description && (
                        <div style={{ fontSize: '0.8rem', color: '#666', marginBottom: '0.5rem' }}>
                          {forum.description}
                        </div>
                      )}
                      <button 
                        className="btn-outline" 
                        onClick={() => setSelectedForum(forum)}
                        style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
                      >
                        View Posts
                      </button>
                    </div>
                  )}
                </div>
                {editingForum !== forum.id && (
                  <div style={{ display: 'flex', gap: '0.25rem' }}>
                    {canManageForum(forum) && (
                      <button 
                        onClick={() => handleEditForum(forum)} 
                        style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.75rem' }}
                        title="Edit forum"
                      >
                        ✏️
                      </button>
                    )}
                    {canManageForum(forum) && (
                      <button 
                        onClick={() => handleDeleteForum(forum)} 
                        style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.75rem', color: '#dc3545' }}
                        title="Delete forum"
                      >
                        🗑️
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* Confirm Delete Modal */}
      <ConfirmModal
        isOpen={showDeleteConfirm}
        title="Delete Forum"
        message={`Are you sure you want to delete "${forumToDelete?.title}"? This will also delete all posts in this forum. This action cannot be undone.`}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </div>
  );
}