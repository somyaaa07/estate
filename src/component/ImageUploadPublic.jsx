'use client';
import { useState } from 'react';

export default function ImageUploadPublic({ value = [], onChange }) {
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    setUploading(true);
    const newUrls = [];

    for (const file of files) {
      if (file.size > 5 * 1024 * 1024) {
        alert(`${file.name} too large — max 5MB`);
        continue;
      }

      const formData = new FormData();
      formData.append('file', file);

      try {
        const res = await fetch('/api/upload-public', { method: 'POST', body: formData });
        const data = await res.json();
        if (data.url) {
          newUrls.push(data.url);
        } else {
          alert('Upload failed: ' + (data.error || 'Unknown error'));
        }
      } catch (err) {
        console.error('Upload error:', err);
        alert('Upload failed. Try again.');
      }
    }

    if (newUrls.length) onChange([...value, ...newUrls]);

    setUploading(false);
    e.target.value = '';
  };

  const removeImage = (index) => onChange(value.filter((_, i) => i !== index));

  const moveImage = (from, to) => {
    const updated = [...value];
    const [moved] = updated.splice(from, 1);
    updated.splice(to, 0, moved);
    onChange(updated);
  };

  return (
    <div>
      {value.length > 0 && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
            gap: '10px',
            marginBottom: '14px',
          }}
        >
          {value.map((url, index) => (
            <div
              key={url + index}
              style={{
                position: 'relative',
                borderRadius: '12px',
                overflow: 'hidden',
                border: index === 0 ? '2px solid #D4AF37' : '1px solid rgba(95,95,95,0.25)',
                aspectRatio: '4/3',
                background: '#F1EDE3',
              }}
            >
              <img
                src={url}
                alt={`Property image ${index + 1}`}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />

              {index === 0 && (
                <span
                  style={{
                    position: 'absolute', top: '6px', left: '6px',
                    background: '#000', color: '#F5D77A',
                    fontSize: '10px', fontWeight: 600, letterSpacing: '0.05em',
                    padding: '2px 8px', borderRadius: '999px',
                  }}
                >
                  COVER
                </span>
              )}

              <div style={{ position: 'absolute', top: '6px', right: '6px', display: 'flex', gap: '4px' }}>
                {index > 0 && (
                  <button type="button" onClick={() => moveImage(index, index - 1)} title="Move left" style={iconBtn}>◀</button>
                )}
                {index < value.length - 1 && (
                  <button type="button" onClick={() => moveImage(index, index + 1)} title="Move right" style={iconBtn}>▶</button>
                )}
                <button type="button" onClick={() => removeImage(index)} title="Remove" style={{ ...iconBtn, background: '#B3261E' }}>✕</button>
              </div>
            </div>
          ))}
        </div>
      )}

      <label
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          padding: '16px',
          border: `2px dashed ${uploading ? '#D4AF37' : 'rgba(95,95,95,0.35)'}`,
          borderRadius: '14px',
          cursor: uploading ? 'not-allowed' : 'pointer',
          color: '#5F5F5F',
          fontSize: '14px',
          background: uploading ? '#FAF6E8' : '#FFFFFF',
          transition: 'all 0.2s',
        }}
      >
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          onChange={handleFileChange}
          style={{ display: 'none' }}
          disabled={uploading}
        />
        {uploading ? (
          <span style={{ color: '#B8921F' }}>Uploading…</span>
        ) : (
          <>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            {value.length > 0 ? 'Add more photos' : 'Upload photos'}
          </>
        )}
      </label>

      <p style={{ fontSize: '12px', color: '#5F5F5F', marginTop: '8px' }}>
        JPG, PNG, WEBP — max 5MB each. First photo is the cover image.
      </p>
    </div>
  );
}

const iconBtn = {
  width: '22px', height: '22px',
  background: 'rgba(0,0,0,0.6)',
  color: '#fff',
  border: 'none',
  borderRadius: '4px',
  fontSize: '10px',
  cursor: 'pointer',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  lineHeight: 1,
};