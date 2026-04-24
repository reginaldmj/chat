import React from 'react';
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import LoadingSpinner from './components/LoadingSpinner.jsx';
import { useAuth } from './contexts/AuthContext.jsx';
import useConversations from './hooks/useConversations.jsx';
import useMembers from './hooks/useMembers.jsx';
import useStatusUpdates from './hooks/useStatusUpdates.jsx';
import ActivityPage from './pages/ActivityPage.jsx';
import AuthPage from './pages/AuthPage.jsx';
import MembersPage from './pages/MembersPage.jsx';
import MessagesPage from './pages/MessagesPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import StatusesPage from './pages/StatusesPage.jsx';

function AppRoutes() {
  const { authLoading, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [showModal, setShowModal] = React.useState(false);
  const [modalSearch, setModalSearch] = React.useState('');
  const [modalSelected, setModalSelected] = React.useState([]);
  const [modalGroupName, setModalGroupName] = React.useState('');
  const [messageText, setMessageText] = React.useState('');
  const [pendingAttachment, setPendingAttachment] = React.useState(null);
  const [statusText, setStatusText] = React.useState('');
  const [profileMessage, setProfileMessage] = React.useState('');
  const [profileError, setProfileError] = React.useState('');
  const [profileSaving, setProfileSaving] = React.useState(false);
  const [profileDeleting, setProfileDeleting] = React.useState(false);
  const [profileForm, setProfileForm] = React.useState({
    displayName: '',
    username: '',
    email: '',
    role: '',
    avatarUrl: '',
  });

  const conversations = useConversations(user, navigate);
  const members = useMembers(user);
  const statuses = useStatusUpdates(user);

  React.useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  React.useEffect(() => {
    if (!user) return;
    setProfileForm({
      displayName: user.displayName || '',
      username: user.username || '',
      email: user.email || '',
      role: user.role || '',
      avatarUrl: user.avatarUrl || '',
    });
  }, [user]);

  React.useEffect(() => {
    setSearchQuery('');
  }, [location.pathname]);

  const sharedPageProps = {
    user,
    searchQuery,
    setSearchQuery,
    menuOpen,
    setMenuOpen,
    conversations,
    members,
    statuses,
    showModal,
    setShowModal,
    modalSearch,
    setModalSearch,
    modalSelected,
    setModalSelected,
    modalGroupName,
    setModalGroupName,
    messageText,
    setMessageText,
    pendingAttachment,
    setPendingAttachment,
    statusText,
    setStatusText,
    profileForm,
    setProfileForm,
    profileMessage,
    setProfileMessage,
    profileError,
    setProfileError,
    profileSaving,
    setProfileSaving,
    profileDeleting,
    setProfileDeleting,
    unreadTotal: conversations.unreadTotal,
  };

  if (authLoading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <AuthPage />;
  }

  return (
    <Routes>
      <Route
        path="/"
        element={(
          <Layout {...sharedPageProps}>
            <ActivityPage {...sharedPageProps} />
          </Layout>
        )}
      />
      <Route
        path="/members"
        element={(
          <Layout {...sharedPageProps}>
            <MembersPage {...sharedPageProps} />
          </Layout>
        )}
      />
      <Route
        path="/statuses"
        element={(
          <Layout {...sharedPageProps}>
            <StatusesPage {...sharedPageProps} />
          </Layout>
        )}
      />
      <Route
        path="/messages"
        element={(
          <Layout {...sharedPageProps}>
            <MessagesPage {...sharedPageProps} />
          </Layout>
        )}
      />
      <Route
        path="/profile"
        element={(
          <Layout {...sharedPageProps}>
            <ProfilePage {...sharedPageProps} />
          </Layout>
        )}
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return <AppRoutes />;
}