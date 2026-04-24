import React from 'react';
import { formatFileSize } from './format.js';

export default function AttachmentCard({ attachment }) {
  const isImage = attachment?.type?.startsWith('image/');

  return (
    <div className={`attachment-card${isImage ? ' image' : ''}`}>
      {isImage ? <img src={attachment.dataUrl} alt={attachment.name} className="attachment-preview" /> : null}
      <div className="attachment-copy">
        <strong>{attachment.name}</strong>
        <span>{formatFileSize(attachment.size)}</span>
        <a href={attachment.dataUrl} download={attachment.name}>Download</a>
      </div>
    </div>
  );
}