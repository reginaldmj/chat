import React from 'react';
import { useNavigate } from 'react-router-dom';
import Avatar, { initials } from '../components/Avatar.jsx';
import { useAuth } from '../contexts/AuthContext.jsx';
import { userApi } from '../utils/api';
import { clearTokens } from '../utils/api';

function hasProfileChanges(profileForm, user) {
  if (!user) return false;
  return profileForm.displayName !== (user.displayName || '')
    || profileForm.username !== (user.username || '')
    || profileForm.email !== (user.email || '')
    || profileForm.role !== (user.role || '')
    || profileForm.avatarUrl !== (user.avatarUrl || '');
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function ProfilePage({
  user,
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
}) {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const fileInputRef = React.useRef(null);
  const displayName = profileForm.displayName || profileForm.username;

  const handleSave = async (event) => {
    event.preventDefault();
    if (!user || profileSaving || !hasProfileChanges(profileForm, user)) return;

    setProfileSaving(true);
    setProfileMessage('');
    setProfileError('');

    try {
      const updatedUser = await userApi.updateMe(profileForm);
      setUser(updatedUser);
      setProfileMessage('Profile updated successfully.');
    } catch (error) {
      setProfileError(error.message || 'Unable to update profile.');
    } finally {
      setProfileSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!user || profileDeleting) return;
    const confirmed = window.confirm('Delete your account? This will remove your profile and conversations.');
    if (!confirmed) return;

    setProfileDeleting(true);
    setProfileMessage('');
    setProfileError('');

    try {
      await userApi.deleteMe();
      clearTokens();
      setUser(null);
      navigate('/');
    } catch (error) {
      setProfileError(error.message || 'Unable to delete profile.');
    } finally {
      setProfileDeleting(false);
    }
  };

  return (
    <section className="profile-page">
      <div className="profile-page-header">
        <button className="profile-back-btn" type="button" onClick={() => navigate('/')}>
          <svg viewBox="0 0 20 20" width="16" height="16" fill="currentColor">
            <path d="M10.78 4.22a.75.75 0 010 1.06L7.06 9H16a.75.75 0 010 1.5H7.06l3.72 3.72a.75.75 0 11-1.06 1.06l-5-5a.75.75 0 010-1.06l5-5a.75.75 0 011.06 0z"></path>
          </svg>
          <span>Back to home</span>
        </button>
      </div>

      <div className="profile-card">
        <div className="profile-hero">
          <div className="profile-avatar">
            {profileForm.avatarUrl ? (
              <Avatar avatarUrl={profileForm.avatarUrl} name={displayName} className="profile-avatar-image" alt={`${displayName} profile`} />
            ) : (
              <div className="profile-avatar-fallback" style={{ background: user.color || '#42b562' }}>{initials(displayName)}</div>
            )}
          </div>
          <div className="profile-copy">
            <p className="profile-eyebrow">Member profile</p>
            <h1>{displayName}</h1>
            <p className="profile-subtitle">Edit your profile, upload an image, or remove your account here.</p>
          </div>
        </div>

        <form id="profile-form" className="profile-form" onSubmit={handleSave}>
          <div className="profile-field profile-field-wide">
            <span>Profile image</span>
            <div className="profile-upload-row">
              <button className="profile-upload-btn" type="button" onClick={() => fileInputRef.current?.click()}>Upload image</button>
              <p className="profile-upload-copy">Choose a JPG, PNG, GIF, or WebP image for your member profile.</p>
            </div>
            <input
              id="profile-avatar-upload"
              ref={fileInputRef}
              className="profile-file-input"
              type="file"
              accept="image/*"
              onChange={async (event) => {
                const file = event.target.files?.[0];
                if (!file) return;
                if (!file.type.startsWith('image/')) {
                  setProfileError('Please choose an image file.');
                  setProfileMessage('');
                  event.target.value = '';
                  return;
                }
                try {
                  const avatarUrl = await readFileAsDataUrl(file);
                  setProfileForm((current) => ({ ...current, avatarUrl }));
                  setProfileMessage('Profile image ready to save.');
                  setProfileError('');
                } catch {
                  setProfileError('Unable to read that image.');
                  setProfileMessage('');
                } finally {
                  event.target.value = '';
                }
              }}
            />
          </div>
          <label className="profile-field">
            <span>Display name</span>
            <input id="profile-display-name" value={profileForm.displayName} placeholder="Your display name" onChange={(event) => {
              setProfileForm((current) => ({ ...current, displayName: event.target.value }));
              setProfileMessage('');
              setProfileError('');
            }} />
          </label>
          <label className="profile-field">
            <span>Username</span>
            <input id="profile-username" value={profileForm.username} placeholder="Your username" onChange={(event) => {
              setProfileForm((current) => ({ ...current, username: event.target.value }));
              setProfileMessage('');
              setProfileError('');
            }} />
          </label>
          <label className="profile-field">
            <span>Email</span>
            <input id="profile-email" type="email" value={profileForm.email} placeholder="you@example.com" onChange={(event) => {
              setProfileForm((current) => ({ ...current, email: event.target.value }));
              setProfileMessage('');
              setProfileError('');
            }} />
          </label>
          <label className="profile-field">
            <span>Role</span>
            <input id="profile-role" value={profileForm.role} placeholder="Member" onChange={(event) => {
              setProfileForm((current) => ({ ...current, role: event.target.value }));
              setProfileMessage('');
              setProfileError('');
            }} />
          </label>

          {profileMessage ? <div className="profile-message success">{profileMessage}</div> : null}
          {profileError ? <div className="profile-message error">{profileError}</div> : null}

          <div className="profile-actions">
            <button className="profile-save-btn" type="submit" disabled={!hasProfileChanges(profileForm, user) || profileSaving || profileDeleting}>
              {profileSaving ? 'Saving...' : 'Save profile'}
            </button>
            <button className="profile-delete-btn" type="button" onClick={handleDelete} disabled={profileSaving || profileDeleting}>
              {profileDeleting ? 'Deleting...' : 'Delete user'}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}