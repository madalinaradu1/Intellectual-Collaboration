import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  FiEdit2, FiTrash2, FiCornerDownRight,
  FiChevronUp, FiChevronDown, FiArrowUp, FiPenTool,
} from 'react-icons/fi';
import { generateClient } from 'aws-amplify/api';
import { listPosts } from '../graphql/queries';
import { createPost, updatePost, deletePost } from '../graphql/mutations';
import ConfirmModal from './ConfirmModal';
import RichTextEditor from './RichTextEditor';

const client    = generateClient();
const PAGE_SIZE = 10;

// ── Avatar styles ─────────────────────────────────────────────────────────────

const baseAvatarStyle = {
  borderRadius: '50%', background: '#552B9A', color: '#fff',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  fontWeight: 700, flexShrink: 0,
};

// Slightly smaller / lighter avatar for reply posts.
function PostAvatar({ name, reply }) {
  const initials = name
    ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'A';
  const style = reply
    ? { ...baseAvatarStyle, width: 28, height: 28, fontSize: '0.65rem', background: '#7c4dbd' }
    : { ...baseAvatarStyle, width: 34, height: 34, fontSize: '0.72rem' };
  return <div style={style}>{initials}</div>;
}

// Author name, "You" badge, timestamp, and "(edited)" indicator.
function PostMeta({ author, createdAt, updatedAt, isOwn }) {
  const fmt = (ts) => {
    if (!ts) return 'Unknown';
    const d = new Date(ts);
    return `${d.toLocaleDateString()} – ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  };
  return (
    <div>
      <span style={{ fontWeight: 600, fontSize: '0.85rem', color: '#222' }}>{author}</span>
      {isOwn && (
        <span style={{ marginLeft: '0.4rem', fontSize: '0.68rem', fontWeight: 600, background: '#552B9A', color: '#fff', borderRadius: '10px', padding: '0.1rem 0.45rem', verticalAlign: 'middle' }}>
          You
        </span>
      )}
      <span style={{ fontSize: '0.72rem', color: '#999', marginLeft: '0.5rem' }}>
        {fmt(createdAt)}
        {updatedAt && updatedAt !== createdAt && (
          <span style={{ fontStyle: 'italic', marginLeft: '0.5rem' }}>(edited)</span>
        )}
      </span>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function ForumPostsPage({ forum, user, onBack }) {
  const [posts, setPosts]           = useState([]);
  const [loading, setLoading]       = useState(false);
  const [creating, setCreating]     = useState(false);
  const [newPostBody, setNewPostBody] = useState('');

  // Inline edit state.
  const [editingPost, setEditingPost]   = useState(null); // post id
  const [editPostBody, setEditPostBody] = useState('');

  // Reply composer state.
  const [replyingTo, setReplyingTo]         = useState(null); // parent post id
  const [replyBody, setReplyBody]           = useState('');
  const [submittingReply, setSubmittingReply] = useState(false);

  // Delete confirmation.
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [postToDelete, setPostToDelete]           = useState(null);

  // Collapsed replies: { [postId]: true } means replies are hidden.
  const [collapsedReplies, setCollapsedReplies] = useState({});

  // Pagination.
  const [page, setPage] = useState(1);

  // Scroll-to-top FAB visibility.
  const [showScrollTop, setShowScrollTop] = useState(false);

  const composeRef = useRef(null);
  const topRef     = useRef(null);

  // Show scroll-to-top button after scrolling 400 px.
  useEffect(() => {
    const onScroll = () => setShowScrollTop(window.scrollY > 400);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // ── Data fetching ───────────────────────────────────────────────────────────

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const result = await client.graphql({
        query: listPosts,
        variables: { filter: { forumID: { eq: forum.id } } },
      });
      // Sort chronologically so threads read top-to-bottom.
      setPosts(
        result.data.listPosts.items.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
      );
    } catch (err) {
      console.error('Error fetching posts:', err);
    } finally {
      setLoading(false);
    }
  }, [forum]);

  useEffect(() => { if (forum) fetchPosts(); }, [forum, fetchPosts]);

  // ── Helpers ─────────────────────────────────────────────────────────────────

  const currentUserName = () =>
    user?.attributes?.name || user?.name || user?.username || user?.email || 'Anonymous';

  const isAdmin = () => user?.isAdmin || user?.attributes?.['custom:role'] === 'admin';

  // Returns true if the HTML body is effectively empty.
  const isBodyEmpty = (html) => !html || html.replace(/<[^>]*>/g, '').trim() === '';

  const topLevelPosts = posts.filter(p => !p.parentPostID);
  const repliesFor    = (postId) =>
    posts
      .filter(p => p.parentPostID === postId)
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

  const totalPages = Math.max(1, Math.ceil(topLevelPosts.length / PAGE_SIZE));
  const pagedPosts = topLevelPosts.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const goToPage = (p) => {
    setPage(p);
    topRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // ── CRUD ────────────────────────────────────────────────────────────────────

  const handleCreatePost = async () => {
    if (isBodyEmpty(newPostBody)) { alert('Post content cannot be empty'); return; }
    const author = currentUserName();
    setCreating(true);
    try {
      await client.graphql({
        query: createPost,
        variables: { input: { body: newPostBody.trim(), author, createdBy: author, forumID: forum.id } },
      });
      setNewPostBody('');
      await fetchPosts();
      // Jump to the last page so the new post is visible.
      setPage(Math.ceil((topLevelPosts.length + 1) / PAGE_SIZE));
    } catch (err) {
      console.error('Error creating post:', err);
      alert('Failed to create post');
    } finally {
      setCreating(false);
    }
  };

  const handleSubmitReply = async (parentPostID) => {
    if (isBodyEmpty(replyBody)) return;
    const author = currentUserName();
    setSubmittingReply(true);
    try {
      await client.graphql({
        query: createPost,
        variables: { input: { body: replyBody.trim(), author, createdBy: author, forumID: forum.id, parentPostID } },
      });
      setReplyingTo(null);
      setReplyBody('');
      // Expand replies so the new reply is immediately visible.
      setCollapsedReplies(prev => ({ ...prev, [parentPostID]: false }));
      fetchPosts();
    } catch (err) {
      console.error('Error creating reply:', err);
      alert('Failed to submit reply');
    } finally {
      setSubmittingReply(false);
    }
  };

  const handleUpdatePost = async () => {
    if (isBodyEmpty(editPostBody)) { alert('Post content cannot be empty'); return; }
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

  const confirmDelete = async () => {
    try {
      // Delete the post and all its replies in parallel.
      const replies = repliesFor(postToDelete.id);
      await Promise.all([
        client.graphql({ query: deletePost, variables: { input: { id: postToDelete.id } } }),
        ...replies.map(r => client.graphql({ query: deletePost, variables: { input: { id: r.id } } })),
      ]);
      fetchPosts();
    } catch (err) {
      console.error('Error deleting post:', err);
      alert('Failed to delete post');
    }
    setShowDeleteConfirm(false);
    setPostToDelete(null);
  };

  // Permission checks.
  const canEdit   = (post) => {
    const me = currentUserName();
    return me === post.createdBy || me === post.author;
  };
  const canDelete = (post) => canEdit(post) || isAdmin();

  // ── Recursive post renderer ─────────────────────────────────────────────────

  const renderPost = (post, isReply = false) => {
    const replies         = isReply ? [] : repliesFor(post.id);
    const isEditing       = editingPost === post.id;
    const isReplying      = replyingTo  === post.id;
    const isOwn           = canEdit(post);
    // Default: replies are visible (collapsed === false means "show").
    const repliesVisible  = collapsedReplies[post.id] !== true;

    return (
      <div key={post.id}>
        <div
          className="ic-card"
          style={isReply
            ? { marginLeft: '2rem', marginTop: '0.5rem', background: isOwn ? '#f0ebfa' : undefined }
            : isOwn ? { background: '#f0ebfa' } : {}}
        >
          {isEditing ? (
            // ── Edit mode ──
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
                <PostAvatar name={post.author} reply={isReply} />
                <PostMeta author={post.author} createdAt={post.createdAt} updatedAt={post.updatedAt} isOwn={isOwn} />
              </div>
              <RichTextEditor value={editPostBody} onChange={setEditPostBody} placeholder="Edit your post…" minHeight={100} />
              <div style={{ display: 'flex', gap: '0.5rem', paddingLeft: '2.6rem' }}>
                <button className="btn-purple" onClick={handleUpdatePost} style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}>Save</button>
                <button className="btn-outline" onClick={() => { setEditingPost(null); setEditPostBody(''); }} style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}>Cancel</button>
              </div>
            </div>
          ) : (
            // ── Read mode ──
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <PostAvatar name={post.author} reply={isReply} />
                  <PostMeta author={post.author} createdAt={post.createdAt} updatedAt={post.updatedAt} isOwn={isOwn} />
                </div>
                <div style={{ display: 'flex', gap: '0.25rem', alignItems: 'center' }}>
                  {!isReply && (
                    <button
                      onClick={() => { setReplyingTo(isReplying ? null : post.id); setReplyBody(''); }}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.25rem', color: '#552B9A', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem' }}
                      title="Reply"
                    >
                      <FiCornerDownRight size={14} /> Reply
                    </button>
                  )}
                  {canEdit(post) && (
                    <button
                      onClick={() => { setEditingPost(post.id); setEditPostBody(post.body); }}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#552B9A', padding: '0.25rem' }}
                      title="Edit post"
                    >
                      <FiEdit2 size={15} />
                    </button>
                  )}
                  {canDelete(post) && (
                    <button
                      onClick={() => { setPostToDelete(post); setShowDeleteConfirm(true); }}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#dc3545', padding: '0.25rem' }}
                      title="Delete post"
                    >
                      <FiTrash2 size={15} />
                    </button>
                  )}
                </div>
              </div>

              {/* Post body rendered as HTML from the rich-text editor */}
              <div
                dangerouslySetInnerHTML={{ __html: post.body }}
                style={{ fontSize: '0.87rem', color: '#444', lineHeight: 1.6, paddingLeft: '2.6rem' }}
              />

              {/* Toggle to show/hide replies */}
              {!isReply && replies.length > 0 && (
                <button
                  onClick={() => setCollapsedReplies(prev => ({ ...prev, [post.id]: !prev[post.id] }))}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#888', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.5rem', paddingLeft: '2.6rem' }}
                >
                  {repliesVisible ? <FiChevronUp size={13} /> : <FiChevronDown size={13} />}
                  {repliesVisible
                    ? `Hide repl${replies.length !== 1 ? 'ies' : 'y'}`
                    : `Show ${replies.length} repl${replies.length !== 1 ? 'ies' : 'y'}`}
                </button>
              )}
            </div>
          )}
        </div>

        {/* Inline reply composer */}
        {isReplying && (
          <div style={{ marginLeft: '2rem', marginTop: '0.5rem' }}>
            <div className="ic-card" style={{ background: '#faf8ff' }}>
              <RichTextEditor
                value={replyBody}
                onChange={setReplyBody}
                placeholder={`Replying to ${post.author}…`}
                minHeight={80}
              />
              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                <button className="btn-outline" onClick={() => { setReplyingTo(null); setReplyBody(''); }} style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}>Cancel</button>
                <button
                  className="btn-purple"
                  onClick={() => handleSubmitReply(post.id)}
                  disabled={submittingReply || isBodyEmpty(replyBody)}
                  style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
                >
                  {submittingReply ? 'Posting…' : 'Reply'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Nested replies */}
        {!isReply && repliesVisible && replies.length > 0 && (
          <div>{replies.map(reply => renderPost(reply, true))}</div>
        )}
      </div>
    );
  };

  // ── Page render ─────────────────────────────────────────────────────────────

  return (
    <div ref={topRef}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div>
          <button className="btn-outline" onClick={onBack} style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem', marginBottom: '0.5rem' }}>
            ← Back to Forums
          </button>
          <br /><br />
          <h2 style={{ fontSize: '1.1rem', color: '#552B9A', margin: 0 }}>{forum.title}</h2>
          <p style={{ fontSize: '0.8rem', color: '#666', margin: '0.25rem 0 0 0' }}>
            {forum.groupName} • {topLevelPosts.length} post{topLevelPosts.length !== 1 ? 's' : ''}
            {totalPages > 1 && ` • Page ${page} of ${totalPages}`}
          </p>
        </div>
        {/* Scroll to compose area */}
        <button
          className="btn-purple"
          onClick={() => composeRef.current?.scrollIntoView({ behavior: 'smooth' })}
          style={{ fontSize: '0.78rem', padding: '0.35rem 0.75rem', display: 'flex', alignItems: 'center', gap: '0.35rem', whiteSpace: 'nowrap' }}
        >
          <FiPenTool size={13} /> New Post
        </button>
      </div>

      {loading ? (
        <div>Loading posts...</div>
      ) : (
        <>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', marginBottom: '1rem' }}>
            {pagedPosts.length === 0 ? (
              <div className="ic-card" style={{ textAlign: 'center', color: '#666' }}>
                No posts yet. Be the first to start the conversation!
              </div>
            ) : (
              pagedPosts.map(post => renderPost(post))
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem', marginBottom: '1.25rem' }}>
              <button className="btn-outline" onClick={() => goToPage(1)}          disabled={page === 1}          style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}>«</button>
              <button className="btn-outline" onClick={() => goToPage(page - 1)}   disabled={page === 1}          style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}>‹</button>
              {/* Build page number list with ellipsis for large ranges */}
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                .reduce((acc, p, idx, arr) => {
                  if (idx > 0 && p - arr[idx - 1] > 1) acc.push('...');
                  acc.push(p);
                  return acc;
                }, [])
                .map((p, i) => p === '...'
                  ? <span key={`ellipsis-${i}`} style={{ fontSize: '0.75rem', color: '#aaa', padding: '0 0.25rem' }}>…</span>
                  : <button key={p} onClick={() => goToPage(p)} className={page === p ? 'btn-purple' : 'btn-outline'} style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem', minWidth: 32 }}>{p}</button>
                )}
              <button className="btn-outline" onClick={() => goToPage(page + 1)}   disabled={page === totalPages} style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}>›</button>
              <button className="btn-outline" onClick={() => goToPage(totalPages)} disabled={page === totalPages} style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}>»</button>
            </div>
          )}
        </>
      )}

      {/* Compose new post */}
      <div className="ic-card" ref={composeRef}>
        <h3 style={{ margin: '0 0 0.75rem 0', fontSize: '0.9rem' }}>Add a Post</h3>
        <RichTextEditor
          value={newPostBody}
          onChange={setNewPostBody}
          placeholder="Share your thoughts, ask questions, or contribute to the discussion..."
        />
        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
          <button className="btn-outline" onClick={() => setNewPostBody('')} disabled={creating || isBodyEmpty(newPostBody)}>Clear</button>
          <button className="btn-purple" onClick={handleCreatePost} disabled={creating || isBodyEmpty(newPostBody)}>
            {creating ? 'Posting...' : 'Post'}
          </button>
        </div>
      </div>

      {/* Scroll to top button */}
      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          style={{ position: 'fixed', bottom: '1.5rem', right: '1.5rem', background: '#552B9A', color: '#fff', border: 'none', borderRadius: '50%', width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.2)', zIndex: 100 }}
          title="Scroll to top"
        >
          <FiArrowUp size={18} />
        </button>
      )}

      <ConfirmModal
        isOpen={showDeleteConfirm}
        title="Delete Post"
        message="Are you sure you want to delete this post? Any replies will also be deleted. This action cannot be undone."
        onConfirm={confirmDelete}
        onCancel={() => { setShowDeleteConfirm(false); setPostToDelete(null); }}
      />
    </div>
  );
}
