import express from 'express';
import { promises as fs } from 'fs';
import path from 'path';
import multer from 'multer';
import cors from 'cors';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Log the current directory and important paths
console.log('Current directory:', __dirname);
console.log('Source directory:', path.join(__dirname, '../src'));
console.log('Data directory:', path.join(__dirname, '../src/data'));

const app = express();
const PORT = process.env.PORT || 3001;

const CREDENTIALS_FILE = path.join(__dirname, 'credentials.json');

// Initialize credentials file if it doesn't exist
async function initializeCredentials() {
  try {
    await fs.access(CREDENTIALS_FILE);
  } catch {
    const defaultPassword = await bcrypt.hash('admin123', 10);
    await fs.writeFile(
      CREDENTIALS_FILE,
      JSON.stringify({
        username: 'admin',
        passwordHash: defaultPassword,
      })
    );
  }
}

// Configure multer for handling file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const type = req.query.type || 'workers';
    const uploadDir = path.join(__dirname, `../public/${type}`);
    console.log('Upload directory:', uploadDir);
    // Create directory if it doesn't exist
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

// Workers API Routes
app.get('/api/workers', async (req, res) => {
  try {
    const filePath = path.join(__dirname, '../src/data/employees.json');
    console.log('Reading workers from:', filePath);
    const data = await fs.readFile(filePath, 'utf8');
    console.log('Successfully read workers data');
    res.json(JSON.parse(data));
  } catch (error) {
    console.error('Error reading workers:', error);
    res.status(500).json({ error: 'Failed to read workers data' });
  }
});

app.post('/api/workers', async (req, res) => {
  try {
    const filePath = path.join(__dirname, '../src/data/employees.json');
    console.log('Saving workers to:', filePath);
    console.log('Data to save:', JSON.stringify(req.body, null, 2));
    await fs.writeFile(filePath, JSON.stringify(req.body, null, 2));
    console.log('Successfully saved workers data');
    res.json({ success: true });
  } catch (error) {
    console.error('Error saving workers:', error);
    console.error('Error details:', error.message);
    res.status(500).json({ error: 'Failed to save workers data' });
  }
});

// News API Routes
app.get('/api/news', async (req, res) => {
  try {
    const filePath = path.join(__dirname, '../src/data/news.json');
    console.log('Reading news from:', filePath);
    const data = await fs.readFile(filePath, 'utf8');
    console.log('Successfully read news data');
    res.json(JSON.parse(data));
  } catch (error) {
    console.error('Error reading news:', error);
    res.status(500).json({ error: 'Failed to read news data' });
  }
});

app.post('/api/news', async (req, res) => {
  try {
    const filePath = path.join(__dirname, '../src/data/news.json');
    console.log('Saving news to:', filePath);
    console.log('Data to save:', JSON.stringify(req.body, null, 2));
    await fs.writeFile(filePath, JSON.stringify(req.body, null, 2));
    console.log('Successfully saved news data');
    res.json({ success: true });
  } catch (error) {
    console.error('Error saving news:', error);
    console.error('Error details:', error.message);
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
    console.log('File saved at:', filePath);
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
    const credentials = JSON.parse(await fs.readFile(CREDENTIALS_FILE, 'utf8'));

    if (username !== credentials.username) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isValid = await bcrypt.compare(password, credentials.passwordHash);
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
    const credentials = JSON.parse(await fs.readFile(CREDENTIALS_FILE, 'utf8'));

    const isValid = await bcrypt.compare(
      currentPassword,
      credentials.passwordHash
    );
    if (!isValid) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    const newPasswordHash = await bcrypt.hash(newPassword, 10);
    credentials.passwordHash = newPasswordHash;

    await fs.writeFile(CREDENTIALS_FILE, JSON.stringify(credentials));
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Serve React app for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

initializeCredentials().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
