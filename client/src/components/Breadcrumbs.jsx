import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export const pageMetaMap = {
  '/': {
    title: 'Home',
    description: 'Post a status update and keep up with your personal home feed.',
  },
  '/members': {
    title: 'Members',
    description: 'Browse all registered members and find the right person to message.',
  },
  '/statuses': {
    title: 'Statuses',
    description: 'A complete list of all statuses posted from Activity.',
  },
  '/messages': {
    title: 'Messages',
    description: 'Your dedicated messages page with focused chat search and attachments.',
  },
  '/profile': {
    title: 'Profile',
    description: 'Update your account, avatar, and personal details.',
  },
};

export default function Breadcrumbs() {
  const location = useLocation();
  const navigate = useNavigate();
  const pageMeta = pageMetaMap[location.pathname] || pageMetaMap['/'];
  const isHome = location.pathname === '/';

  return (
    <div className="workspace-breadcrumbs">
      {!isHome ? (
        <>
          <button className="workspace-crumb" type="button" onClick={() => navigate('/')}>Home</button>
          <span>/</span>
        </>
      ) : null}
      <button className="workspace-crumb active" type="button" onClick={() => navigate(location.pathname)}>
        {pageMeta.title}
      </button>
    </div>
  );
}