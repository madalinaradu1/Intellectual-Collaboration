// Architecture:
//   Each folder is stored as a small JSON file at:
//     dissertation/folders/<id>.json   ← folder metadata (id, name, createdAt)
//   Uploaded files live at:
//     dissertation/files/<folderId>/<filename>
//
//   All keys use accessLevel: 'private', so every user sees only their own data.
//   Folder metadata is stored per-file (not in a shared manifest) to avoid
//   read-after-write race conditions that would cause only one folder to persist.

import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  FiEdit2, FiTrash2, FiDownload, FiUpload,
  FiImage, FiFileText, FiFile, FiFolder, FiFolderMinus,
} from 'react-icons/fi';
import {
  AiOutlineFilePdf, AiOutlineFileExcel,
  AiOutlineFilePpt, AiOutlineFileZip,
} from 'react-icons/ai';
import { uploadData, downloadData, getUrl, remove, list } from 'aws-amplify/storage';
import { getCurrentUser } from 'aws-amplify/auth';
import ConfirmModal from './ConfirmModal';

// ── Constants ────────────────────────────────────────────────────────────────

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50 MB

// File extensions that are blocked for security reasons.
const BLOCKED_EXTENSIONS = new Set([
  'exe','bat','cmd','com','msi','ps1','psm1','psd1','vbs','vbe','js','jse',
  'wsf','wsh','scr','pif','reg','inf','lnk','jar','py','rb','php','pl','sh',
  'bash','zsh','fish','csh','ksh','app','deb','rpm','dmg','pkg','run','bin',
  'dll','so','dylib','sys','drv','ocx','cpl','hta','htm','html','svg','xml',
  'xhtml','swf','class','gadget','msc','scf',
]);

// ── S3 key helpers ────────────────────────────────────────────────────────────

// Metadata JSON for a single folder.
const folderMetaKey  = (fid)        => `dissertation/folders/${fid}.json`;
// Prefix used to list / delete all files inside a folder.
const folderPrefix   = (fid)        => `dissertation/files/${fid}/`;
// Full key for an uploaded file.
const fileKey        = (fid, name)  => `dissertation/files/${fid}/${name}`;
// Prefix used to list all folder metadata files.
const FOLDERS_PREFIX = `dissertation/folders/`;

const STORAGE_OPTS = { accessLevel: 'private' };

// ── Validation helpers ────────────────────────────────────────────────────────

const isBlockedFile = (file) =>
  BLOCKED_EXTENSIONS.has(file.name.split('.').pop().toLowerCase());

const isMaliciousFileName = (name) => {
  if (/\.\./.test(name)) return true;
  if (/[/\\<>:"|?*]/.test(name)) return true;
  if (/[;&`$!{}()~%@'"]/.test(name)) return true;
  return Array.from(name).some(c => c.charCodeAt(0) < 32);
};

// ── Display helpers ───────────────────────────────────────────────────────────

function formatBytes(b) {
  if (b < 1024)    return `${b} B`;
  if (b < 1048576) return `${(b / 1024).toFixed(1)} KB`;
  return `${(b / 1048576).toFixed(1)} MB`;
}

function formatDate(ts) {
  if (!ts) return '';
  return new Date(ts).toLocaleDateString(undefined, {
    month: 'short', day: 'numeric', year: 'numeric',
  });
}

function fileIcon(name) {
  const ext = name.split('.').pop().toLowerCase();
  if (['jpg','jpeg','png','gif','webp','svg'].includes(ext)) return <FiImage size={16} color="#888" />;
  if (ext === 'pdf')                                          return <AiOutlineFilePdf size={16} color="#e74c3c" />;
  if (['doc','docx'].includes(ext))                          return <FiFileText size={16} color="#2980b9" />;
  if (['xls','xlsx'].includes(ext))                          return <AiOutlineFileExcel size={16} color="#27ae60" />;
  if (['ppt','pptx'].includes(ext))                          return <AiOutlineFilePpt size={16} color="#e67e22" />;
  if (['zip','rar','7z'].includes(ext))                      return <AiOutlineFileZip size={16} color="#888" />;
  return <FiFile size={16} color="#888" />;
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function DissertationFoldersTab() {
  // Auth readiness — we wait for Cognito before touching S3.
  const [ready, setReady] = useState(false);

  // Folder list state.
  const [folders, setFolders]           = useState([]);
  const [loadingFolders, setLoadingFolders] = useState(true);

  // Which folder is expanded.
  const [openFolderId, setOpenFolderId] = useState(null);

  // Files keyed by folderId.
  const [folderFiles, setFolderFiles]   = useState({});
  const [loadingFiles, setLoadingFiles] = useState(false);

  // New-folder form.
  const [showNewFolder, setShowNewFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');

  // Rename form.
  const [editingFolderId, setEditingFolderId] = useState(null);
  const [editFolderName, setEditFolderName]   = useState('');

  // Shared saving / error state for folder operations.
  const [savingFolder, setSavingFolder] = useState(false);
  const [folderError, setFolderError]   = useState('');

  // Upload state.
  const [uploadingFolderId, setUploadingFolderId] = useState(null);
  const [uploadProgress, setUploadProgress]       = useState({});
  const [fileError, setFileError]                 = useState('');

  // Confirm-delete modal payload: { type: 'folder'|'file', ... }
  const [confirmDelete, setConfirmDelete] = useState(null);

  const fileInputRef = useRef();

  // ── Auth check ──────────────────────────────────────────────────────────────

  useEffect(() => {
    getCurrentUser()
      .then(() => setReady(true))
      .catch(() => { setReady(false); setLoadingFolders(false); });
  }, []);

  // ── Folder loading ──────────────────────────────────────────────────────────

  // Lists all folder metadata files and downloads them in parallel.
  const loadFolders = useCallback(async () => {
    setLoadingFolders(true);
    try {
      const listed = await list({
        prefix: FOLDERS_PREFIX,
        options: { ...STORAGE_OPTS, listAll: true },
      });
      const metas = await Promise.all(
        listed.items.map(async (item) => {
          try {
            const res = await downloadData({ key: item.key, options: STORAGE_OPTS }).result;
            return JSON.parse(await res.body.text());
          } catch { return null; }
        })
      );
      // Filter out any failed downloads and sort chronologically.
      setFolders(
        metas.filter(Boolean).sort((a, b) => a.createdAt.localeCompare(b.createdAt))
      );
    } catch {
      setFolders([]);
    } finally {
      setLoadingFolders(false);
    }
  }, []);

  useEffect(() => {
    if (ready) loadFolders();
  }, [ready, loadFolders]);

  // ── Folder metadata write ───────────────────────────────────────────────────

  // Writes a single folder's metadata JSON to S3.
  const saveFolderMeta = async (folder) => {
    const blob = new Blob([JSON.stringify(folder)], { type: 'application/json' });
    await uploadData({
      key: folderMetaKey(folder.id),
      data: blob,
      options: { ...STORAGE_OPTS, contentType: 'application/json' },
    }).result;
  };

  // ── Folder CRUD ─────────────────────────────────────────────────────────────

  const handleCreateFolder = async () => {
    const name = newFolderName.trim();
    if (!name) return;
    setFolderError('');
    setSavingFolder(true);
    try {
      const folder = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        name,
        createdAt: new Date().toISOString(),
      };
      await saveFolderMeta(folder);
      // Append to local state.
      setFolders(prev => [...prev, folder]);
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
      const folder = folders.find(f => f.id === folderId);
      await saveFolderMeta({ ...folder, name });
      setFolders(prev => prev.map(f => f.id === folderId ? { ...f, name } : f));
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
      // Delete all uploaded files and the metadata file in parallel.
      const listed = await list({
        prefix: folderPrefix(folderId),
        options: { ...STORAGE_OPTS, listAll: true },
      });
      await Promise.all([
        ...listed.items.map(f => remove({ key: f.key, options: STORAGE_OPTS })),
        remove({ key: folderMetaKey(folderId), options: STORAGE_OPTS }),
      ]);
      setFolders(prev => prev.filter(f => f.id !== folderId));
      if (openFolderId === folderId) setOpenFolderId(null);
      setFolderFiles(prev => { const n = { ...prev }; delete n[folderId]; return n; });
    } catch (err) {
      console.error('Error deleting folder:', err);
    }
  };

  // ── File operations ─────────────────────────────────────────────────────────

  // Lists all files inside a folder and stores them in folderFiles state.
  const loadFiles = useCallback(async (folderId) => {
    setLoadingFiles(true);
    try {
      const prefix = folderPrefix(folderId);
      const result = await list({ prefix, options: { ...STORAGE_OPTS, listAll: true } });
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
    // Only fetch file list if we haven't loaded it yet.
    if (!folderFiles[folderId]) loadFiles(folderId);
  };

  const handleFileSelect = async (e, folderId) => {
    const files = Array.from(e.target.files);
    e.target.value = ''; // Reset input so the same file can be re-selected.
    if (!files.length) return;

    // Validate before uploading.
    const big       = files.find(f => f.size > MAX_FILE_SIZE);
    const blocked   = files.find(isBlockedFile);
    const malicious = files.find(f => isMaliciousFileName(f.name));
    if (big)       { setFileError(`"${big.name}" exceeds the 50 MB limit.`); return; }
    if (blocked)   { setFileError(`"${blocked.name}" is not allowed for security reasons.`); return; }
    if (malicious) { setFileError(`"${malicious.name}" contains invalid characters.`); return; }

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
              if (totalBytes) {
                setUploadProgress(p => ({
                  ...p,
                  [file.name]: Math.round(transferredBytes / totalBytes * 100),
                }));
              }
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

  // Generates a short-lived pre-signed URL and opens it in a new tab.
  const handleDownload = async (key) => {
    try {
      const { url } = await getUrl({
        key,
        options: { ...STORAGE_OPTS, expiresIn: 300, contentDisposition: 'attachment' },
      });
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
      setFolderFiles(prev => ({
        ...prev,
        [folderId]: prev[folderId].filter(f => f.key !== key),
      }));
    } catch (err) {
      console.error('Error deleting file:', err);
    }
  };

  // ── Render ──────────────────────────────────────────────────────────────────

  if (loadingFolders) {
    return <div style={{ padding: '2rem', textAlign: 'center', color: '#888' }}>Loading folders…</div>;
  }

  return (
    <div>
      {/* Toolbar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <span style={{ fontSize: '0.82rem', color: '#888' }}>
          {folders.length} folder{folders.length !== 1 ? 's' : ''}
        </span>
        <button
          className="btn-purple"
          onClick={() => { setShowNewFolder(true); setNewFolderName(''); setFolderError(''); }}
          style={{ fontSize: '0.82rem', padding: '0.4rem 0.9rem' }}
        >
          + New Folder
        </button>
      </div>

      {/* New folder form */}
      {showNewFolder && (
        <div style={{ background: '#f7f3fa', border: '1px solid #e0d4eb', borderRadius: '8px', padding: '0.85rem 1rem', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <FiFolder size={18} color="#552B9A" />
            <input
              autoFocus
              type="text"
              placeholder="Folder name…"
              value={newFolderName}
              onChange={e => setNewFolderName(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter')  handleCreateFolder();
                if (e.key === 'Escape') setShowNewFolder(false);
              }}
              style={{ flex: 1, padding: '0.4rem 0.6rem', border: '1px solid #ccc', borderRadius: '5px', fontSize: '0.88rem', outline: 'none' }}
            />
            <button
              className="btn-purple"
              onClick={handleCreateFolder}
              disabled={savingFolder || !newFolderName.trim()}
              style={{ fontSize: '0.8rem', padding: '0.35rem 0.8rem' }}
            >
              {savingFolder ? 'Creating…' : 'Create'}
            </button>
            <button
              className="btn-outline"
              onClick={() => setShowNewFolder(false)}
              style={{ fontSize: '0.8rem', padding: '0.35rem 0.8rem' }}
            >
              Cancel
            </button>
          </div>
          {folderError && (
            <div style={{ color: '#dc3545', fontSize: '0.75rem', marginTop: '0.4rem' }}>{folderError}</div>
          )}
        </div>
      )}

      {/* Empty state */}
      {folders.length === 0 && !showNewFolder ? (
        <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#aaa', background: '#fafafa', borderRadius: '8px', border: '1px dashed #ddd' }}>
          <div style={{ marginBottom: '0.5rem' }}><FiFolder size={40} color="#ccc" /></div>
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
              <div
                key={folder.id}
                style={{ border: '1px solid #e4e4e4', borderRadius: '8px', overflow: 'hidden', background: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}
              >
                {/* Folder header row */}
                <div
                  style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', background: isOpen ? '#f7f3fa' : '#fff', cursor: 'pointer', borderBottom: isOpen ? '1px solid #e4e4e4' : 'none' }}
                  onClick={() => !isEditing && openFolder(folder.id)}
                >
                  <span style={{ fontSize: '1.25rem', flexShrink: 0 }}>
                    {isOpen
                      ? <FiFolderMinus size={20} color="#552B9A" />
                      : <FiFolder      size={20} color="#552B9A" />}
                  </span>

                  {/* Inline rename input or folder name */}
                  {isEditing ? (
                    <input
                      autoFocus
                      type="text"
                      value={editFolderName}
                      onChange={e => setEditFolderName(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter')  handleRenameFolder(folder.id);
                        if (e.key === 'Escape') setEditingFolderId(null);
                      }}
                      onClick={e => e.stopPropagation()}
                      style={{ flex: 1, padding: '0.3rem 0.5rem', border: '1px solid #552B9A', borderRadius: '4px', fontSize: '0.88rem', outline: 'none' }}
                    />
                  ) : (
                    <span style={{ flex: 1, fontWeight: 600, fontSize: '0.9rem', color: '#222' }}>{folder.name}</span>
                  )}

                  {/* File count or creation date */}
                  <span style={{ fontSize: '0.72rem', color: '#aaa', flexShrink: 0 }}>
                    {isOpen && files.length > 0
                      ? `${files.length} file${files.length !== 1 ? 's' : ''}`
                      : formatDate(folder.createdAt)}
                  </span>

                  {/* Action buttons */}
                  <div style={{ display: 'flex', gap: '0.15rem', flexShrink: 0 }} onClick={e => e.stopPropagation()}>
                    {isEditing ? (
                      <>
                        <button
                          className="btn-purple"
                          onClick={() => handleRenameFolder(folder.id)}
                          disabled={savingFolder}
                          style={{ fontSize: '0.72rem', padding: '0.2rem 0.5rem' }}
                        >
                          Save
                        </button>
                        <button
                          className="btn-outline"
                          onClick={() => setEditingFolderId(null)}
                          style={{ fontSize: '0.72rem', padding: '0.2rem 0.5rem' }}
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          title="Rename"
                          onClick={() => { setEditingFolderId(folder.id); setEditFolderName(folder.name); }}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.2rem 0.3rem', color: '#888' }}
                        >
                          <FiEdit2 size={15} />
                        </button>
                        <button
                          title="Delete folder"
                          onClick={() => setConfirmDelete({ type: 'folder', folderId: folder.id, name: folder.name })}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.2rem 0.3rem', color: '#dc3545' }}
                        >
                          <FiTrash2 size={15} />
                        </button>
                      </>
                    )}
                  </div>

                  <span style={{ color: '#aaa', fontSize: '0.75rem', flexShrink: 0 }}>{isOpen ? '▲' : '▼'}</span>
                </div>

                {/* Expanded file list */}
                {isOpen && (
                  <div style={{ padding: '0.75rem 1rem' }}>
                    {/* Upload bar */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
                      {/* Hidden file input — triggered programmatically */}
                      <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        style={{ display: 'none' }}
                        onChange={e => handleFileSelect(e, folder.id)}
                      />
                      <button
                        className="btn-outline"
                        onClick={() => { setFileError(''); fileInputRef.current.click(); }}
                        disabled={isUploading}
                        style={{ fontSize: '0.78rem', padding: '0.3rem 0.75rem' }}
                      >
                        {isUploading
                          ? '⏳ Uploading…'
                          : <><FiUpload size={13} style={{ marginRight: '0.3rem', verticalAlign: 'middle' }} />Upload Files</>}
                      </button>
                      {fileError && (
                        <span style={{ fontSize: '0.75rem', color: '#dc3545' }}>{fileError}</span>
                      )}
                      {/* Per-file upload progress */}
                      {isUploading && Object.entries(uploadProgress).map(([name, pct]) => (
                        <span key={name} style={{ fontSize: '0.72rem', color: '#552B9A' }}>{name}: {pct}%</span>
                      ))}
                    </div>

                    {/* File list */}
                    {loadingFiles && !folderFiles[folder.id] ? (
                      <div style={{ fontSize: '0.82rem', color: '#aaa', padding: '0.5rem 0' }}>Loading files…</div>
                    ) : files.length === 0 ? (
                      <div style={{ fontSize: '0.82rem', color: '#bbb', padding: '0.75rem 0', textAlign: 'center' }}>
                        No files yet — upload some above.
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                        {files.map(file => (
                          <div
                            key={file.key}
                            style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.4rem 0.6rem', padding: '0.5rem 0.75rem', background: '#fafafa', borderRadius: '6px', border: '1px solid #f0f0f0' }}
                          >
                            {fileIcon(file.name)}
                            <span style={{ flex: '1 1 120px', fontSize: '0.85rem', color: '#333', overflowWrap: 'anywhere', minWidth: 0 }}>
                              {file.name}
                            </span>
                            <span style={{ fontSize: '0.72rem', color: '#aaa', whiteSpace: 'nowrap', marginLeft: 'auto' }}>
                              {file.size ? formatBytes(file.size) : ''}
                              {file.lastModified ? ` · ${formatDate(file.lastModified)}` : ''}
                            </span>
                            <button
                              title="Download"
                              onClick={() => handleDownload(file.key)}
                              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.2rem 0.3rem', color: '#552B9A', flexShrink: 0 }}
                            >
                              <FiDownload size={15} />
                            </button>
                            <button
                              title="Delete file"
                              onClick={() => setConfirmDelete({ type: 'file', folderId: folder.id, fileKey: file.key, name: file.name })}
                              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.2rem 0.3rem', color: '#dc3545', flexShrink: 0 }}
                            >
                              <FiTrash2 size={15} />
                            </button>
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

      {/* Confirm delete modals */}
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
