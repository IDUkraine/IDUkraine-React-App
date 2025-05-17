import pool from './database.js';

async function initializeDatabase() {
  const connection = await pool.getConnection();
  try {
    // Create news table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS news (
        id VARCHAR(36) PRIMARY KEY,
        titleEn VARCHAR(255) NOT NULL,
        titleUk VARCHAR(255) NOT NULL,
        textEn TEXT NOT NULL,
        textUk TEXT NOT NULL,
        date DATETIME NOT NULL,
        categoryEn VARCHAR(100) NOT NULL,
        categoryUk VARCHAR(100) NOT NULL,
        image VARCHAR(255),
        isPublished BOOLEAN DEFAULT false,
        isTopNews BOOLEAN DEFAULT false,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create workers table with new schema
    await connection.query(`
      CREATE TABLE IF NOT EXISTS workers (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nameEn VARCHAR(255) NOT NULL,
        nameUk VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        positionEn VARCHAR(255) NOT NULL,
        positionUk VARCHAR(255) NOT NULL,
        specialtyEn VARCHAR(255) NOT NULL,
        specialtyUk VARCHAR(255) NOT NULL,
        years INT NOT NULL,
        descriptionEn TEXT,
        descriptionUk TEXT,
        photo VARCHAR(255),
        iconPhotoOffsetY VARCHAR(50),
        facebook VARCHAR(255),
        isDisplayedInCircle BOOLEAN DEFAULT false,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create admin_credentials table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS admin_credentials (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) NOT NULL UNIQUE,
        passwordHash VARCHAR(255) NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('Database tables created successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  } finally {
    connection.release();
  }
}

export default initializeDatabase;
