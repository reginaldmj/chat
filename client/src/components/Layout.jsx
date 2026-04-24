import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import IconRail from './IconRail.jsx';
import Sidebar from './Sidebar.jsx';
import TopBar from './TopBar.jsx';
import Breadcrumbs, { pageMetaMap } from './Breadcrumbs.jsx';
import ConversationModal from './ConversationModal.jsx';
import { useAuth } from '../contexts/AuthContext.jsx';

export default function Layout({
  children,
  user,
  searchQuery,
  setSearchQuery,
  menuOpen,
  setMenuOpen,
  conversations,
  showModal,
  setShowModal,
  modalSearch,
  setModalSearch,
  modalSelected,
  setModalSelected,
  modalGroupName,
  setModalGroupName,
  ...rest
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const {
    conversationsLoading,
    activeConvId,
    openConversationModal,
    createConversation,
    modalUsers,
    modalLoading,
  } = conversations;
  const pageMeta = pageMetaMap[location.pathname] || pageMetaMap['/'];

  const handleLogout = React.useCallback(async () => {
    await logout();
    navigate('/');
  }, [logout, navigate]);

  const handleOpenModal = React.useCallback(async () => {
    setShowModal(true);
    setModalSearch('');
    setModalSelected([]);
    setModalGroupName('');
    await openConversationModal();
  }, [openConversationModal, setModalGroupName, setModalSearch, setModalSelected, setShowModal]);

  const handleCloseModal = React.useCallback(() => {
    setShowModal(false);
    setModalSearch('');
    setModalSelected([]);
    setModalGroupName('');
  }, [setModalGroupName, setModalSearch, setModalSelected, setShowModal]);

  const handleCreateConversation = React.useCallback(async () => {
    if (modalSelected.length === 0) return;
    const isGroup = modalSelected.length > 1;
    await createConversation({
      participantIds: modalSelected,
      name: isGroup ? (modalGroupName.trim() || 'New Group') : undefined,
      isGroup,
    });
    handleCloseModal();
  }, [createConversation, handleCloseModal, modalGroupName, modalSelected]);

  return (
    <div className="app">
      <div className="main">
        <IconRail user={user} onLogout={handleLogout} />
        <Sidebar
          user={user}
          conversations={conversations.conversations}
          conversationsLoading={conversationsLoading}
          activeConvId={activeConvId}
          unreadTotal={conversations.unreadTotal}
          onSelectConversation={conversations.selectConversation}
          onOpenModal={handleOpenModal}
        />
        <section className="workspace-shell">
          <TopBar
            user={user}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            menuOpen={menuOpen}
            setMenuOpen={setMenuOpen}
            unreadTotal={conversations.unreadTotal}
            onLogout={handleLogout}
          />
          <div className="workspace-content">
            <section className="workspace-page">
              <div className="workspace-page-header">
                <div>
                  <h1>{pageMeta.title}</h1>
                  <Breadcrumbs />
                  <p className="workspace-page-description">{pageMeta.description}</p>
                </div>
              </div>
              {children}
            </section>
          </div>
        </section>
      </div>
      <ConversationModal
        open={showModal}
        modalUsers={modalUsers}
        modalLoading={modalLoading}
        modalSearch={modalSearch}
        setModalSearch={setModalSearch}
        modalSelected={modalSelected}
        setModalSelected={setModalSelected}
        modalGroupName={modalGroupName}
        setModalGroupName={setModalGroupName}
        onClose={handleCloseModal}
        onCreate={handleCreateConversation}
      />
    </div>
  );
}