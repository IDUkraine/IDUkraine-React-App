import express from 'express';
import multer from 'multer';
import cors from 'cors';
import { fileURLToPath } from 'url';
import path from 'path';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import pool from './config/database.js';
import initializeDatabase from './config/init-db.js';
import { promises as fs } from 'fs';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Log the current directory and important paths
console.log('Current directory:', __dirname);
console.log('Source directory:', path.join(__dirname, '../src'));
console.log('Data directory:', path.join(__dirname, '../src/data'));

const app = express();
const PORT = process.env.PORT || 3001;

// Configure multer for handling file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const type = req.query.type || 'workers';
    const uploadDir = path.join(__dirname, `../public/${type}`);
    console.log('Upload directory:', uploadDir);
    fs.mkdir(uploadDir, { recursive: true })
      .then(() => cb(null, uploadDir))
      .catch((err) => cb(err));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname);
    cb(null, `${uniqueSuffix}${ext}`);
  },
});

const upload = multer({ storage });

// Middleware
app.use(cors()); // Enable CORS for development
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public'))); // Serve static files from public
app.use(express.static(path.join(__dirname, '../dist'))); // Serve the built React app

// Initialize admin credentials
async function initializeAdmin() {
  try {
    const [rows] = await pool.query('SELECT * FROM admin_credentials LIMIT 1');
    if (rows.length === 0) {
      const defaultPassword = await bcrypt.hash(
        process.env.DEFAULT_ADMIN_PASSWORD || 'admin123',
        10
      );
      await pool.query(
        'INSERT INTO admin_credentials (username, passwordHash) VALUES (?, ?)',
        ['admin', defaultPassword]
      );
    }
  } catch (error) {
    console.error('Error initializing admin:', error);
  }
}

// Workers API Routes
app.get('/api/workers', async (req, res) => {
  try {
    const [workers] = await pool.query(
      'SELECT * FROM workers ORDER BY id DESC'
    );
    // Transform the workers to include the links object
    const transformedWorkers = workers.map((worker) => {
      // Remove facebook from the spread to avoid duplication
      const { facebook, ...workerData } = worker;
      return {
        ...workerData,
        links: {
          facebook: facebook || null,
        },
      };
    });
    res.json({ employees: transformedWorkers });
  } catch (error) {
    console.error('Error reading workers:', error);
    res.status(500).json({ error: 'Failed to read workers data' });
  }
});

app.post('/api/workers', async (req, res) => {
  try {
    const { employees } = req.body;
    await pool.query('DELETE FROM workers');

    if (employees && employees.length > 0) {
      const values = employees.map((worker) => [
        worker.nameEn,
        worker.nameUk,
        worker.email,
        worker.positionEn,
        worker.positionUk,
        worker.specialtyEn,
        worker.specialtyUk,
        worker.years,
        worker.descriptionEn,
        worker.descriptionUk,
        worker.photo,
        worker.iconPhotoOffsetY,
        worker.links?.facebook || null,
        worker.isDisplayedInCircle || false,
      ]);

      await pool.query(
        `INSERT INTO workers 
        (nameEn, nameUk, email, positionEn, positionUk, specialtyEn, specialtyUk, 
         years, descriptionEn, descriptionUk, photo, iconPhotoOffsetY, facebook, isDisplayedInCircle)
        VALUES ?`,
        [values]
      );
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Error saving workers:', error);
    res.status(500).json({ error: 'Failed to save workers data' });
  }
});

// News API Routes
app.get('/api/news', async (req, res) => {
  try {
    const [news] = await pool.query('SELECT * FROM news ORDER BY date DESC');
    res.json(
      news.map((item) => ({
        ...item,
        date: new Date(item.date),
      }))
    );
  } catch (error) {
    console.error('Error reading news:', error);
    res.status(500).json({ error: 'Failed to read news data' });
  }
});

app.post('/api/news', async (req, res) => {
  try {
    await pool.query('DELETE FROM news');

    if (req.body && req.body.length > 0) {
      const values = req.body.map((news) => [
        news.id || uuidv4(),
        news.titleEn,
        news.titleUk,
        news.textEn,
        news.textUk,
        new Date(news.date),
        news.categoryEn,
        news.categoryUk,
        news.image,
        news.isPublished,
        news.isTopNews,
      ]);

      await pool.query(
        `INSERT INTO news 
        (id, titleEn, titleUk, textEn, textUk, date, categoryEn, categoryUk, image, isPublished, isTopNews)
        VALUES ?`,
        [values]
      );
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Error saving news:', error);
    res.status(500).json({ error: 'Failed to save news data' });
  }
});

// File Upload Routes
app.post('/api/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      throw new Error('No file uploaded');
    }
    const type = req.query.type || 'workers';
    const filePath = `/${type}/${req.file.filename}`;
    res.json({ filePath });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({ error: 'Failed to upload file' });
  }
});

app.delete('/api/file', async (req, res) => {
  try {
    const filePath = req.query.path;
    if (!filePath) {
      throw new Error('No file path provided');
    }

    const fullPath = path.join(__dirname, '../public', filePath);
    console.log('Deleting file at:', fullPath);
    await fs.unlink(fullPath);
    console.log('Successfully deleted file');
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting file:', error);
    res.status(500).json({ error: 'Failed to delete file' });
  }
});

// Auth Routes
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const [rows] = await pool.query(
      'SELECT * FROM admin_credentials WHERE username = ?',
      [username]
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isValid = await bcrypt.compare(password, rows[0].passwordHash);
    if (!isValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/auth/change-password', async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const [rows] = await pool.query('SELECT * FROM admin_credentials LIMIT 1');

    if (rows.length === 0) {
      return res.status(401).json({ message: 'No admin account found' });
    }

    const isValid = await bcrypt.compare(currentPassword, rows[0].passwordHash);
    if (!isValid) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    const newPasswordHash = await bcrypt.hash(newPassword, 10);
    await pool.query(
      'UPDATE admin_credentials SET passwordHash = ? WHERE id = ?',
      [newPasswordHash, rows[0].id]
    );

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Serve React app for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

// Initialize database and start server
Promise.all([initializeDatabase(), initializeAdmin()])
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Failed to initialize application:', error);
    process.exit(1);
  });
