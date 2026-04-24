import React from 'react';

export function initials(name = '') {
  const safeName = typeof name === 'string' ? name.trim() : '';
  return safeName
    .split(' ')
    .filter(Boolean)
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export default function Avatar({
  avatarUrl,
  name,
  className = '',
  fallbackClassName = '',
  style,
  alt,
  children,
}) {
  if (avatarUrl) {
    return <img className={className || 'avatar-image'} src={avatarUrl} alt={alt || name || 'Avatar'} style={style} />;
  }

  if (children) return children;

  return <>{fallbackClassName ? <div className={fallbackClassName} style={style}>{initials(name)}</div> : initials(name)}</>;
}