import React, { useState, useEffect, useCallback, useRef } from 'react';
import { uploadData, downloadData, getUrl, remove, list } from 'aws-amplify/storage';
import { getCurrentUser } from 'aws-amplify/auth';
import ConfirmModal from './ConfirmModal';

const MAX_FILE_SIZE = 50 * 1024 * 1024;

// All storage uses level: 'private' so each user only sees their own files.
// The key is relative to the user's private prefix.
const manifestKey  = () => `dissertation/manifest.json`;
const folderPrefix = (fid) => `dissertation/${fid}/`;
const fileKey      = (fid, name) => `dissertation/${fid}/${name}`;

const STORAGE_OPTS = { level: 'private' };

function formatBytes(b) {
  if (b < 1024) return `${b} B`;
  if (b < 1048576) return `${(b / 1024).toFixed(1)} KB`;
  return `${(b / 1048576).toFixed(1)} MB`;
}

function formatDate(ts) {
  if (!ts) return '';
  return new Date(ts).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

function fileIcon(name) {
  const ext = name.split('.').pop().toLowerCase();
  if (['jpg','jpeg','png','gif','webp','svg'].includes(ext)) return '🖼️';
  if (ext === 'pdf') return '📄';
  if (['doc','docx'].includes(ext)) return '📝';
  if (['xls','xlsx'].includes(ext)) return '📊';
  if (['ppt','pptx'].includes(ext)) return '📋';
  if (['zip','rar','7z'].includes(ext)) return '🗜️';
  return '📎';
}

export default function DissertationFoldersTab() {
  const [ready, setReady]                 = useState(false);
  const [folders, setFolders]             = useState([]);
  const [loadingFolders, setLoadingFolders] = useState(true);
  const [openFolderId, setOpenFolderId]   = useState(null);
  const [folderFiles, setFolderFiles]     = useState({});
  const [loadingFiles, setLoadingFiles]   = useState(false);
  const [showNewFolder, setShowNewFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [editingFolderId, setEditingFolderId] = useState(null);
  const [editFolderName, setEditFolderName]   = useState('');
  const [savingFolder, setSavingFolder]   = useState(false);
  const [folderError, setFolderError]     = useState('');
  const [uploadingFolderId, setUploadingFolderId] = useState(null);
  const [uploadProgress, setUploadProgress]       = useState({});
  const [fileError, setFileError]         = useState('');
  const [confirmDelete, setConfirmDelete] = useState(null);
  const fileInputRef = useRef();

  // ── Auth check ────────────────────────────────────────────────────────────

  useEffect(() => {
    getCurrentUser()
      .then(() => setReady(true))
      .catch(() => { setReady(false); setLoadingFolders(false); });
  }, []);

  // ── Manifest ──────────────────────────────────────────────────────────────

  const loadManifest = useCallback(async () => {
    setLoadingFolders(true);
    try {
      const result = await downloadData({
        key: manifestKey(),
        options: STORAGE_OPTS,
      }).result;
      const text = await result.body.text();
      setFolders(JSON.parse(text).folders || []);
    } catch {
      setFolders([]);
    } finally {
      setLoadingFolders(false);
    }
  }, []);

  useEffect(() => {
    if (ready) loadManifest();
  }, [ready, loadManifest]);

  const saveManifest = async (updated) => {
    const blob = new Blob([JSON.stringify({ folders: updated })], { type: 'application/json' });
    await uploadData({
      key: manifestKey(),
      data: blob,
      options: { ...STORAGE_OPTS, contentType: 'application/json' },
    }).result;
    setFolders(updated);
  };

  // ── Folder CRUD ───────────────────────────────────────────────────────────

  const handleCreateFolder = async () => {
    const name = newFolderName.trim();
    if (!name) return;
    setFolderError('');
    setSavingFolder(true);
    try {
      const folder = { id: String(Date.now()), name, createdAt: new Date().toISOString() };
      await saveManifest([...folders, folder]);
      setNewFolderName('');
      setShowNewFolder(false);
    } catch (err) {
      console.error('Error creating folder:', err);
      setFolderError('Failed to create folder. Please try again.');
    } finally {
      setSavingFolder(false);
    }
  };

  const handleRenameFolder = async (folderId) => {
    const name = editFolderName.trim();
    if (!name) return;
    setSavingFolder(true);
    try {
      await saveManifest(folders.map(f => f.id === folderId ? { ...f, name } : f));
      setEditingFolderId(null);
    } catch (err) {
      console.error('Error renaming folder:', err);
    } finally {
      setSavingFolder(false);
    }
  };

  const handleDeleteFolder = async () => {
    const { folderId } = confirmDelete;
    setConfirmDelete(null);
    try {
      const files = folderFiles[folderId] || [];
      await Promise.all(files.map(f => remove({ key: f.key, options: STORAGE_OPTS })));
      await saveManifest(folders.filter(f => f.id !== folderId));
      if (openFolderId === folderId) setOpenFolderId(null);
      setFolderFiles(prev => { const n = { ...prev }; delete n[folderId]; return n; });
    } catch (err) {
      console.error('Error deleting folder:', err);
    }
  };

  // ── Files ─────────────────────────────────────────────────────────────────

  const loadFiles = useCallback(async (folderId) => {
    setLoadingFiles(true);
    try {
      const prefix = folderPrefix(folderId);
      const result = await list({ prefix, options: STORAGE_OPTS });
      setFolderFiles(prev => ({
        ...prev,
        [folderId]: result.items.map(i => ({
          key: i.key,
          name: i.key.replace(prefix, ''),
          size: i.size,
          lastModified: i.lastModified,
        })),
      }));
    } catch (err) {
      console.error('Error listing files:', err);
      setFolderFiles(prev => ({ ...prev, [folderId]: [] }));
    } finally {
      setLoadingFiles(false);
    }
  }, []);

  const openFolder = (folderId) => {
    if (openFolderId === folderId) { setOpenFolderId(null); return; }
    setOpenFolderId(folderId);
    if (!folderFiles[folderId]) loadFiles(folderId);
  };

  const handleFileSelect = async (e, folderId) => {
    const files = Array.from(e.target.files);
    e.target.value = '';
    if (!files.length) return;
    const big = files.find(f => f.size > MAX_FILE_SIZE);
    if (big) { setFileError(`"${big.name}" exceeds the 50 MB limit.`); return; }
    setFileError('');
    setUploadingFolderId(folderId);
    try {
      await Promise.all(files.map(async (file) => {
        await uploadData({
          key: fileKey(folderId, file.name),
          data: file,
          options: {
            ...STORAGE_OPTS,
            contentType: file.type || 'application/octet-stream',
            onProgress: ({ transferredBytes, totalBytes }) => {
              if (totalBytes) setUploadProgress(p => ({ ...p, [file.name]: Math.round(transferredBytes / totalBytes * 100) }));
            },
          },
        }).result;
      }));
      await loadFiles(folderId);
    } catch (err) {
      console.error('Error uploading:', err);
      setFileError('Upload failed. Please try again.');
    } finally {
      setUploadingFolderId(null);
      setUploadProgress({});
    }
  };

  const handleDownload = async (key) => {
    try {
      const { url } = await getUrl({ key, options: { ...STORAGE_OPTS, expiresIn: 300 } });
      window.open(url.toString(), '_blank', 'noreferrer');
    } catch (err) {
      console.error('Download error:', err);
    }
  };

  const handleDeleteFile = async () => {
    const { folderId, fileKey: key } = confirmDelete;
    setConfirmDelete(null);
    try {
      await remove({ key, options: STORAGE_OPTS });
      setFolderFiles(prev => ({ ...prev, [folderId]: prev[folderId].filter(f => f.key !== key) }));
    } catch (err) {
      console.error('Error deleting file:', err);
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────

  if (loadingFolders) {
    return <div style={{ padding: '2rem', textAlign: 'center', color: '#888' }}>Loading folders…</div>;
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <span style={{ fontSize: '0.82rem', color: '#888' }}>{folders.length} folder{folders.length !== 1 ? 's' : ''}</span>
        <button className="btn-purple" onClick={() => { setShowNewFolder(true); setNewFolderName(''); setFolderError(''); }}
          style={{ fontSize: '0.82rem', padding: '0.4rem 0.9rem' }}>+ New Folder</button>
      </div>

      {showNewFolder && (
        <div style={{ background: '#f7f3fa', border: '1px solid #e0d4eb', borderRadius: '8px', padding: '0.85rem 1rem', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <span style={{ fontSize: '1.2rem' }}>📁</span>
            <input
              autoFocus type="text" placeholder="Folder name…"
              value={newFolderName}
              onChange={e => setNewFolderName(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleCreateFolder(); if (e.key === 'Escape') setShowNewFolder(false); }}
              style={{ flex: 1, padding: '0.4rem 0.6rem', border: '1px solid #ccc', borderRadius: '5px', fontSize: '0.88rem', outline: 'none' }}
            />
            <button className="btn-purple" onClick={handleCreateFolder} disabled={savingFolder || !newFolderName.trim()}
              style={{ fontSize: '0.8rem', padding: '0.35rem 0.8rem' }}>
              {savingFolder ? 'Creating…' : 'Create'}
            </button>
            <button className="btn-outline" onClick={() => setShowNewFolder(false)}
              style={{ fontSize: '0.8rem', padding: '0.35rem 0.8rem' }}>Cancel</button>
          </div>
          {folderError && <div style={{ color: '#dc3545', fontSize: '0.75rem', marginTop: '0.4rem' }}>{folderError}</div>}
        </div>
      )}

      {folders.length === 0 && !showNewFolder ? (
        <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#aaa', background: '#fafafa', borderRadius: '8px', border: '1px dashed #ddd' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>📁</div>
          <div style={{ fontSize: '0.9rem' }}>No folders yet. Create one to get started.</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {folders.map(folder => {
            const isOpen      = openFolderId === folder.id;
            const files       = folderFiles[folder.id] || [];
            const isEditing   = editingFolderId === folder.id;
            const isUploading = uploadingFolderId === folder.id;

            return (
              <div key={folder.id} style={{ border: '1px solid #e4e4e4', borderRadius: '8px', overflow: 'hidden', background: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', background: isOpen ? '#f7f3fa' : '#fff', cursor: 'pointer', borderBottom: isOpen ? '1px solid #e4e4e4' : 'none' }}
                  onClick={() => !isEditing && openFolder(folder.id)}>
                  <span style={{ fontSize: '1.25rem', flexShrink: 0 }}>{isOpen ? '📂' : '📁'}</span>

                  {isEditing ? (
                    <input autoFocus type="text" value={editFolderName}
                      onChange={e => setEditFolderName(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') handleRenameFolder(folder.id); if (e.key === 'Escape') setEditingFolderId(null); }}
                      onClick={e => e.stopPropagation()}
                      style={{ flex: 1, padding: '0.3rem 0.5rem', border: '1px solid #552B9A', borderRadius: '4px', fontSize: '0.88rem', outline: 'none' }}
                    />
                  ) : (
                    <span style={{ flex: 1, fontWeight: 600, fontSize: '0.9rem', color: '#222' }}>{folder.name}</span>
                  )}

                  <span style={{ fontSize: '0.72rem', color: '#aaa', flexShrink: 0 }}>
                    {isOpen && files.length > 0 ? `${files.length} file${files.length !== 1 ? 's' : ''}` : formatDate(folder.createdAt)}
                  </span>

                  <div style={{ display: 'flex', gap: '0.15rem', flexShrink: 0 }} onClick={e => e.stopPropagation()}>
                    {isEditing ? (
                      <>
                        <button className="btn-purple" onClick={() => handleRenameFolder(folder.id)} disabled={savingFolder}
                          style={{ fontSize: '0.72rem', padding: '0.2rem 0.5rem' }}>Save</button>
                        <button className="btn-outline" onClick={() => setEditingFolderId(null)}
                          style={{ fontSize: '0.72rem', padding: '0.2rem 0.5rem' }}>Cancel</button>
                      </>
                    ) : (
                      <>
                        <button title="Rename" onClick={() => { setEditingFolderId(folder.id); setEditFolderName(folder.name); }}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.8rem', padding: '0.2rem 0.3rem', color: '#888' }}>✏️</button>
                        <button title="Delete folder" onClick={() => setConfirmDelete({ type: 'folder', folderId: folder.id, name: folder.name })}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.8rem', padding: '0.2rem 0.3rem', color: '#dc3545' }}>🗑️</button>
                      </>
                    )}
                  </div>
                  <span style={{ color: '#aaa', fontSize: '0.75rem', flexShrink: 0 }}>{isOpen ? '▲' : '▼'}</span>
                </div>

                {isOpen && (
                  <div style={{ padding: '0.75rem 1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
                      <input ref={fileInputRef} type="file" multiple style={{ display: 'none' }}
                        onChange={e => handleFileSelect(e, folder.id)} />
                      <button className="btn-outline" onClick={() => { setFileError(''); fileInputRef.current.click(); }}
                        disabled={isUploading} style={{ fontSize: '0.78rem', padding: '0.3rem 0.75rem' }}>
                        {isUploading ? '⏳ Uploading…' : '⬆️ Upload Files'}
                      </button>
                      {fileError && <span style={{ fontSize: '0.75rem', color: '#dc3545' }}>{fileError}</span>}
                      {isUploading && Object.entries(uploadProgress).map(([name, pct]) => (
                        <span key={name} style={{ fontSize: '0.72rem', color: '#552B9A' }}>{name}: {pct}%</span>
                      ))}
                    </div>

                    {loadingFiles && !folderFiles[folder.id] ? (
                      <div style={{ fontSize: '0.82rem', color: '#aaa', padding: '0.5rem 0' }}>Loading files…</div>
                    ) : files.length === 0 ? (
                      <div style={{ fontSize: '0.82rem', color: '#bbb', padding: '0.75rem 0', textAlign: 'center' }}>
                        No files yet — upload some above.
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                        {files.map(file => (
                          <div key={file.key} style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.4rem 0.6rem', padding: '0.5rem 0.75rem', background: '#fafafa', borderRadius: '6px', border: '1px solid #f0f0f0' }}>
                            {/* Row 1: icon + name (takes full width, pushes meta to next line on mobile) */}
                            <span style={{ fontSize: '1rem', flexShrink: 0 }}>{fileIcon(file.name)}</span>
                            <span style={{ flex: '1 1 120px', fontSize: '0.85rem', color: '#333', overflowWrap: 'anywhere', minWidth: 0 }}>{file.name}</span>
                            {/* Row 2 on mobile: meta + actions pushed to their own line */}
                            <span style={{ fontSize: '0.72rem', color: '#aaa', whiteSpace: 'nowrap', marginLeft: 'auto' }}>
                              {file.size ? formatBytes(file.size) : ''}{file.lastModified ? ` · ${formatDate(file.lastModified)}` : ''}
                            </span>
                            <button title="Download" onClick={() => handleDownload(file.key)}
                              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.85rem', padding: '0.2rem 0.3rem', color: '#552B9A', flexShrink: 0 }}>⬇️</button>
                            <button title="Delete file" onClick={() => setConfirmDelete({ type: 'file', folderId: folder.id, fileKey: file.key, name: file.name })}
                              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.8rem', padding: '0.2rem 0.3rem', color: '#dc3545', flexShrink: 0 }}>🗑️</button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <ConfirmModal
        isOpen={confirmDelete?.type === 'folder'}
        title="Delete Folder"
        message={`Delete "${confirmDelete?.name}" and all its files? This cannot be undone.`}
        onConfirm={handleDeleteFolder}
        onCancel={() => setConfirmDelete(null)}
      />
      <ConfirmModal
        isOpen={confirmDelete?.type === 'file'}
        title="Delete File"
        message={`Delete "${confirmDelete?.name}"? This cannot be undone.`}
        onConfirm={handleDeleteFile}
        onCancel={() => setConfirmDelete(null)}
      />
    </div>
  );
}
