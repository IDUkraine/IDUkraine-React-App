import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 12;
const API_URL = 'http://localhost:3001/api';

interface StoredCredentials {
  username: string;
  passwordHash: string;
}

const storedCredentials: StoredCredentials = {
  username: 'a3hOVgmdo4CO7l7',
  passwordHash: '$2b$12$cgM1QQxrJ9nHJpTHEGTEeOSBaP2Z2HRGLzK.dHqFoersr0DxsE7A6',
};

export const authService = {
  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, SALT_ROUNDS);
  },

  async verifyCredentials(
    username: string,
    password: string
  ): Promise<boolean> {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      return data.success || false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  },

  async generateNewCredentials(
    username: string,
    password: string
  ): Promise<StoredCredentials> {
    const passwordHash = await this.hashPassword(password);
    return {
      username,
      passwordHash,
    };
  },

  async changePassword(
    currentPassword: string,
    newPassword: string
  ): Promise<boolean> {
    try {
      const response = await fetch(`${API_URL}/auth/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await response.json();
      return data.success || false;
    } catch (error) {
      console.error('Change password error:', error);
      return false;
    }
  },
};
