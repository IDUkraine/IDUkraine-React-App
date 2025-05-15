import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import WorkersTab from './tabs/WorkersTab';
import NewsTab from './tabs/NewsTab';
import ChangePasswordTab from './tabs/ChangePasswordTab';
import '../../assets/styles/admin-page.css';

const AdminPage: React.FC = () => {
  const { isAdmin, login, logout } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState('workers');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const isSuccessful = await login(username, password);
    if (isSuccessful) {
      setError('');
      setUsername('');
      setPassword('');
    } else {
      setError('Invalid credentials');
    }
  };

  if (!isAdmin) {
    return (
      <div className="loginContainer">
        <div className="loginBox">
          <div className="loginHeader">
            <h1 className="loginTitle">Admin Login</h1>
            <p className="loginSubtitle">Please sign in to continue</p>
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
                Username
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
                Password
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
              Sign In
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
          <h1 className="dashboardTitle">Admin Dashboard</h1>
          <button onClick={logout} className="logoutButton">
            Logout
          </button>
        </div>
      </nav>

      <main className="mainContent">
        <div className="contentCard">
          <div className="tabs">
            <button
              className={`tab ${activeTab === 'workers' ? 'tabActive' : ''}`}
              onClick={() => setActiveTab('workers')}
            >
              Workers Management
            </button>
            <button
              className={`tab ${activeTab === 'news' ? 'tabActive' : ''}`}
              onClick={() => setActiveTab('news')}
            >
              News Management
            </button>
            <button
              className={`tab ${activeTab === 'settings' ? 'tabActive' : ''}`}
              onClick={() => setActiveTab('settings')}
            >
              Settings
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
