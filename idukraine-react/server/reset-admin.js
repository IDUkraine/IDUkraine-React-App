import bcrypt from 'bcryptjs';
import pool from './config/database.js';

async function resetAdmin() {
  try {
    // Delete existing admin credentials
    await pool.query('DELETE FROM admin_credentials');

    // Create new admin credentials
    const defaultPassword = await bcrypt.hash('admin123', 10);
    await pool.query(
      'INSERT INTO admin_credentials (username, passwordHash) VALUES (?, ?)',
      ['admin', defaultPassword]
    );

    console.log('Admin credentials reset successfully');
    console.log('Username: admin');
    console.log('Password: admin123');

    process.exit(0);
  } catch (error) {
    console.error('Error resetting admin credentials:', error);
    process.exit(1);
  }
}

resetAdmin();
