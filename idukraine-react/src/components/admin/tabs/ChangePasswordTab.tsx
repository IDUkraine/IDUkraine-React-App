import React, { useState } from 'react';
import { authService } from '../../../services/authService';
import { useLanguage } from '../../../context/LanguageContext';

const ChangePasswordTab: React.FC = () => {
  const { t } = useLanguage();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    const isChanged = await authService.changePassword(
      currentPassword,
      newPassword
    );
    if (isChanged) {
      setSuccess(t('admin.settings.success'));
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } else {
      setError('Failed to change password');
    }
  };

  return (
    <div className="settingsSection">
      <div className="loginBox">
        <div className="loginHeader">
          <h2 className="loginTitle">{t('admin.settings.changePassword')}</h2>
        </div>
        <form onSubmit={handleSubmit} className="form">
          {error && <div className="error">{error}</div>}
          {success && <div className="success">{success}</div>}
          <div className="inputGroup">
            <label className="label" htmlFor="currentPassword">
              {t('admin.settings.oldPassword')}
            </label>
            <input
              id="currentPassword"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="input"
              required
            />
          </div>
          <div className="inputGroup">
            <label className="label" htmlFor="newPassword">
              {t('admin.settings.newPassword')}
            </label>
            <input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="input"
              required
            />
          </div>
          <div className="inputGroup">
            <label className="label" htmlFor="confirmPassword">
              {t('admin.settings.confirmPassword')}
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="input"
              required
            />
          </div>
          <button type="submit" className="button">
            {t('admin.settings.changePassword')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordTab;
