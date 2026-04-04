import React, { useState, useEffect, useCallback } from 'react';
import { generateClient } from 'aws-amplify/api';
import { listPosts } from '../graphql/queries';
import { createPost, updatePost, deletePost } from '../graphql/mutations';
import ConfirmModal from './ConfirmModal';

const client = generateClient();

const avatarStyle = {
  width: 34, height: 34, borderRadius: '50%',
  background: '#552B9A', color: '#fff',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  fontSize: '0.72rem', fontWeight: 700, flexShrink: 0,
};

function PostAvatar({ name }) {
  const initials = name
    ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'A';
  return <div style={avatarStyle}>{initials}</div>;
}

function PostMeta({ author, createdAt, updatedAt }) {
  const formatTime = (ts) => {
    if (!ts) return 'Unknown';
    const d = new Date(ts);
    return `${d.toLocaleDateString()} – ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  };
  return (
    <div>
      <span style={{ fontWeight: 600, fontSize: '0.85rem', color: '#222' }}>{author}</span>
      <span style={{ fontSize: '0.72rem', color: '#999', marginLeft: '0.5rem' }}>
        {formatTime(createdAt)}
        {updatedAt && updatedAt !== createdAt && (
          <span style={{ fontStyle: 'italic', marginLeft: '0.5rem' }}>(edited)</span>
        )}
      </span>
    </div>
  );
}

export default function ForumPostsPage({ forum, user, onBack }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newPostBody, setNewPostBody] = useState('');
  const [editingPost, setEditingPost] = useState(null);
  const [editPostBody, setEditPostBody] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const result = await client.graphql({
        query: listPosts,
        variables: { filter: { forumID: { eq: forum.id } } },
      });
      setPosts(result.data.listPosts.items.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)));
    } catch (err) {
      console.error('Error fetching posts:', err);
    } finally {
      setLoading(false);
    }
  }, [forum]);

  useEffect(() => {
    if (forum) fetchPosts();
  }, [forum, fetchPosts]);

  const getCurrentUserName = () =>
    user?.attributes?.name || user?.name || user?.username || user?.email || 'Anonymous';

  const isAdmin = () => user?.isAdmin || user?.attributes?.['custom:role'] === 'admin';

  const handleCreatePost = async () => {
    if (!newPostBody.trim()) { alert('Post content cannot be empty'); return; }
    const author = getCurrentUserName();
    setCreating(true);
    try {
      await client.graphql({
        query: createPost,
        variables: { input: { body: newPostBody.trim(), author, createdBy: author, forumID: forum.id } },
      });
      setNewPostBody('');
      fetchPosts();
    } catch (err) {
      console.error('Error creating post:', err);
      alert('Failed to create post');
    } finally {
      setCreating(false);
    }
  };

  const confirmDelete = async () => {
    try {
      await client.graphql({ query: deletePost, variables: { input: { id: postToDelete.id } } });
      fetchPosts();
    } catch (err) {
      console.error('Error deleting post:', err);
      alert('Failed to delete post');
    }
    setShowDeleteConfirm(false);
    setPostToDelete(null);
  };

  const handleUpdatePost = async () => {
    if (!editPostBody.trim()) { alert('Post content cannot be empty'); return; }
    try {
      await client.graphql({
        query: updatePost,
        variables: { input: { id: editingPost, body: editPostBody.trim() } },
      });
      setEditingPost(null);
      setEditPostBody('');
      fetchPosts();
    } catch (err) {
      console.error('Error updating post:', err);
      alert('Failed to update post');
    }
  };

  const canEdit = (post) => {
    if (!user) return false;
    const me = getCurrentUserName();
    return me === post.createdBy || me === post.author;
  };

  const canDelete = (post) => canEdit(post) || isAdmin();

  const textareaStyle = {
    width: '100%', padding: '0.65rem 0.85rem', borderRadius: '6px',
    border: '1px solid #ccc', fontSize: '0.87rem', resize: 'vertical',
    outline: 'none', fontFamily: 'inherit',
  };

  return (
    <div>
      <div style={{ marginBottom: '1rem' }}>
        <button className="btn-outline" onClick={onBack} style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem', marginBottom: '0.5rem' }}>
          ← Back to Forums
        </button>
        <h2 style={{ fontSize: '1.1rem', color: '#552B9A', margin: 0 }}>{forum.title}</h2>
        <p style={{ fontSize: '0.8rem', color: '#666', margin: '0.25rem 0 0 0' }}>
          {forum.groupName} • {posts.length} posts
        </p>
      </div>

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
                      <PostAvatar name={post.author} />
                      <PostMeta author={post.author} createdAt={post.createdAt} updatedAt={post.updatedAt} />
                    </div>
                    <textarea
                      value={editPostBody}
                      onChange={(e) => setEditPostBody(e.target.value)}
                      rows={4}
                      style={{ ...textareaStyle, marginBottom: '0.75rem', marginLeft: '2.6rem' }}
                      onFocus={(e) => (e.target.style.borderColor = '#552B9A')}
                      onBlur={(e) => (e.target.style.borderColor = '#ccc')}
                    />
                    <div style={{ display: 'flex', gap: '0.5rem', paddingLeft: '2.6rem' }}>
                      <button className="btn-purple" onClick={handleUpdatePost} style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}>Save</button>
                      <button className="btn-outline" onClick={() => { setEditingPost(null); setEditPostBody(''); }} style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}>Cancel</button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <PostAvatar name={post.author} />
                        <PostMeta author={post.author} createdAt={post.createdAt} updatedAt={post.updatedAt} />
                      </div>
                      <div style={{ display: 'flex', gap: '0.25rem' }}>
                        {canEdit(post) && (
                          <button onClick={() => { setEditingPost(post.id); setEditPostBody(post.body); }} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.75rem', color: '#552B9A', padding: '0.25rem' }} title="Edit post">✏️</button>
                        )}
                        {canDelete(post) && (
                          <button onClick={() => { setPostToDelete(post); setShowDeleteConfirm(true); }} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.75rem', color: '#dc3545', padding: '0.25rem' }} title="Delete post">🗑️</button>
                        )}
                      </div>
                    </div>
                    <p style={{ fontSize: '0.87rem', color: '#444', lineHeight: 1.6, paddingLeft: '2.6rem', margin: 0, whiteSpace: 'pre-wrap' }}>
                      {post.body}
                    </p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      <div className="ic-card">
        <h3 style={{ margin: '0 0 0.75rem 0', fontSize: '0.9rem' }}>Add a Post</h3>
        <textarea
          placeholder="Share your thoughts, ask questions, or contribute to the discussion..."
          value={newPostBody}
          onChange={(e) => setNewPostBody(e.target.value)}
          rows={4}
          style={{ ...textareaStyle, marginBottom: '0.75rem' }}
          onFocus={(e) => (e.target.style.borderColor = '#552B9A')}
          onBlur={(e) => (e.target.style.borderColor = '#ccc')}
        />
        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
          <button className="btn-outline" onClick={() => setNewPostBody('')} disabled={creating || !newPostBody.trim()}>Clear</button>
          <button className="btn-purple" onClick={handleCreatePost} disabled={creating || !newPostBody.trim()}>
            {creating ? 'Posting...' : 'Post'}
          </button>
        </div>
      </div>

      <ConfirmModal
        isOpen={showDeleteConfirm}
        title="Delete Post"
        message="Are you sure you want to delete this post? This action cannot be undone."
        onConfirm={confirmDelete}
        onCancel={() => { setShowDeleteConfirm(false); setPostToDelete(null); }}
      />
    </div>
  );
}
