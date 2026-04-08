// RichTextEditor — Quill-based rich text input used for forum posts and replies.
// Registers custom font and size formats once at module load time.
// The toolbar config is defined outside the component and memoized to prevent
// Quill from re-initialising on every render.

import React, { useMemo } from 'react';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';

// Register custom fonts.
const Font = Quill.import('formats/font');
Font.whitelist = ['arial', 'times-new-roman', 'georgia', 'verdana', 'monospace'];
Quill.register(Font, true);

// Register custom sizes.
const Size = Quill.import('attributors/style/size');
Size.whitelist = ['14px', '16px', '18px', '24px'];
Quill.register(Size, true);

const TOOLBAR = [
  [{ font: Font.whitelist }, { size: Size.whitelist }],
  ['bold', 'italic', 'underline', 'strike'],
  [{ color: [] }, { background: [] }],
  [{ align: [] }],
  [{ list: 'ordered' }, { list: 'bullet' }],
  [{ indent: '-1' }, { indent: '+1' }],
  ['blockquote', 'code-block'],
  ['link'],
  ['clean'],
];

export default function RichTextEditor({ value, onChange, placeholder, minHeight = 120 }) {
  // Memoize modules so the toolbar reference is stable across renders.
  const modules = useMemo(() => ({ toolbar: TOOLBAR }), []);

  return (
    <div style={{ marginBottom: '0.75rem' }}>
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        placeholder={placeholder}
        style={{ borderRadius: '6px' }}
      />
      {/* Scoped styles for Quill */}
      <style>{`
        .ql-container { min-height: ${minHeight}px; font-family: inherit; font-size: 0.87rem; border-bottom-left-radius: 6px; border-bottom-right-radius: 6px; }
        .ql-toolbar  { border-top-left-radius: 6px; border-top-right-radius: 6px; background: #fafafa; }
        .ql-editor   { min-height: ${minHeight}px; }
        .ql-toolbar.ql-snow, .ql-container.ql-snow { border-color: #ccc; }
        .ql-editor.ql-blank::before { color: #aaa; font-style: normal; }
        .ql-font-arial            { font-family: Arial, sans-serif; }
        .ql-font-times-new-roman  { font-family: 'Times New Roman', serif; }
        .ql-font-georgia          { font-family: Georgia, serif; }
        .ql-font-verdana          { font-family: Verdana, sans-serif; }
        .ql-font-monospace        { font-family: monospace; }
        .ql-picker.ql-size .ql-picker-item[data-value='14px']::before,
        .ql-picker.ql-size .ql-picker-label[data-value='14px']::before { content: 'Small';  font-size: 14px; }
        .ql-picker.ql-size .ql-picker-item[data-value='16px']::before,
        .ql-picker.ql-size .ql-picker-label[data-value='16px']::before { content: 'Normal'; font-size: 16px; }
        .ql-picker.ql-size .ql-picker-item[data-value='18px']::before,
        .ql-picker.ql-size .ql-picker-label[data-value='18px']::before { content: 'Large';  font-size: 18px; }
        .ql-picker.ql-size .ql-picker-item[data-value='24px']::before,
        .ql-picker.ql-size .ql-picker-label[data-value='24px']::before { content: 'Huge';   font-size: 24px; }
        .ql-picker.ql-font .ql-picker-item[data-value='arial']::before,
        .ql-picker.ql-font .ql-picker-label[data-value='arial']::before { content: 'Arial'; font-family: Arial, sans-serif; }
        .ql-picker.ql-font .ql-picker-item[data-value='times-new-roman']::before,
        .ql-picker.ql-font .ql-picker-label[data-value='times-new-roman']::before { content: 'Times New Roman'; font-family: 'Times New Roman', serif; }
        .ql-picker.ql-font .ql-picker-item[data-value='georgia']::before,
        .ql-picker.ql-font .ql-picker-label[data-value='georgia']::before { content: 'Georgia'; font-family: Georgia, serif; }
        .ql-picker.ql-font .ql-picker-item[data-value='verdana']::before,
        .ql-picker.ql-font .ql-picker-label[data-value='verdana']::before { content: 'Verdana'; font-family: Verdana, sans-serif; }
        .ql-picker.ql-font .ql-picker-item[data-value='monospace']::before,
        .ql-picker.ql-font .ql-picker-label[data-value='monospace']::before { content: 'Monospace'; font-family: monospace; }
      `}</style>
    </div>
  );
}
