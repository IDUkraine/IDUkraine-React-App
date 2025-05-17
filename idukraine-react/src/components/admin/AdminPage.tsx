import React, { useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import WorkersTab from './tabs/WorkersTab';
import NewsTab from './tabs/NewsTab';
import ChangePasswordTab from './tabs/ChangePasswordTab';
import LanguageToggle from '../common/LanguageToggle';
import '../../assets/styles/admin-page.css';

const AdminPage: React.FC = () => {
  const { isAdmin, login, logout } = useAuth();
  const { t } = useLanguage();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState('workers');
  const [error, setError] = useState('');

  const memoizedLanguageToggle = useMemo(() => <LanguageToggle />, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const isSuccessful = await login(username, password);
    if (isSuccessful) {
      setError('');
      setUsername('');
      setPassword('');
    } else {
      setError(t('admin.invalidCredentials'));
    }
  };

  if (!isAdmin) {
    return (
      <div className="loginContainer">
        <div className="loginBox">
          <div className="loginHeader">
            <h1 className="loginTitle">{t('admin.login')}</h1>
            <p className="loginSubtitle">{t('admin.signIn')}</p>
          </div>
          <form
            onSubmit={handleLogin}
            className="form"
            autoComplete="off"
            method="post"
            data-no-autofill="true"
          >
            <input
              type="password"
              style={{ display: 'none' }}
              aria-hidden="true"
              autoComplete="new-password"
            />
            {error && <div className="error">{error}</div>}
            <div className="inputGroup">
              <label className="label" htmlFor="username">
                {t('admin.username')}
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="input"
                required
                autoComplete="username"
                name="username"
              />
            </div>
            <div className="inputGroup">
              <label className="label" htmlFor="password">
                {t('admin.password')}
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input"
                required
                autoComplete="current-password"
                name="password"
              />
            </div>
            <button type="submit" className="button">
              {t('admin.signIn')}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboardContainer">
      <nav className="navbar">
        <div className="navbarContent">
          <h1 className="dashboardTitle">{t('admin.dashboard')}</h1>
          <div className="navbarControls">
            {memoizedLanguageToggle}
            <button onClick={logout} className="logoutButton">
              {t('admin.logout')}
            </button>
          </div>
        </div>
      </nav>

      <main className="mainContent">
        <div className="contentCard">
          <div className="tabs">
            <button
              className={`tab ${activeTab === 'workers' ? 'tabActive' : ''}`}
              onClick={() => setActiveTab('workers')}
            >
              {t('admin.workers')}
            </button>
            <button
              className={`tab ${activeTab === 'news' ? 'tabActive' : ''}`}
              onClick={() => setActiveTab('news')}
            >
              {t('admin.news')}
            </button>
            <button
              className={`tab ${activeTab === 'settings' ? 'tabActive' : ''}`}
              onClick={() => setActiveTab('settings')}
            >
              {t('admin.settings')}
            </button>
          </div>

          <div>
            {activeTab === 'workers' && <WorkersTab />}
            {activeTab === 'news' && <NewsTab />}
            {activeTab === 'settings' && <ChangePasswordTab />}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminPage;
