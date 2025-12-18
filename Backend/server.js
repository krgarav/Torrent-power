import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import bodyParser from 'body-parser';
import sequelize from './utils/db.js';
import userRoutes from './routes/userRoutes.js'; // Import user routes
import fileDataRoutes from './routes/fileDataRoutes.js';
import warehouseRoutes from './routes/warehouseRoutes.js'; // Import warehouse routes
import taggingRoutes from './routes/taggingRoutes.js';
import analysisRoutes from './routes/analysisRoutes.js';
import maintainanceRoutes from './routes/maintainanceRoutes.js';
import warehouseSettingRoutes from './routes/warehouseSettingRoutes.js';
import bwipjs from 'bwip-js';
import FileData from './models/FileData.js';
import Warehouse from './models/warehouse.js';
import User from './models/user.js';
import Tagging from './models/tagging.js';

const app = express();
// create __dirname
import path from 'path';
import { fileURLToPath } from 'url';
import { hashPassword } from './helpers/authHelper.js';

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

const builtPath = path.join(__dirname, '../', './Frontend', 'build');
// Middleware setup
app.use(
  cors({
    origin: ['http://localhost:3000', 'http://10.144.6.12:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

// handle preflight explicitly
app.options('*', cors());
app.use(express.json());
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(builtPath));
app.use('/images', express.static(__dirname + '/images'));
// Routes setup
app.use('/', userRoutes);
app.use('/', warehouseSettingRoutes); // Mount user routes at /api/users
app.use('/', fileDataRoutes);
app.use('/', warehouseRoutes);
app.use('/', taggingRoutes);
app.use('/', analysisRoutes);
app.use('/', maintainanceRoutes);

app.post('/login', (req, res) => {
  res.json({ success: true, message: 'Login route hit' });
});

// Handle all other routes and serve React's index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(builtPath, 'index.html'));
});

Warehouse.belongsTo(FileData, { foreignKey: 'fileDataId' });
Tagging.belongsTo(FileData, { foreignKey: 'fileDataId' });

const PORT = 5000;

// sequelize.sync({ alter: true }).then(async () => {
sequelize
  .sync({ force: false })
  .then(async () => {
    // Check if the admin user table exists, if not, create it
    const adminUser = await User.findOne({
      where: { email: 'admin@gmail.com' },
    });
    const hashedPassword = await hashPassword('123456');
    if (!adminUser) {
      await User.create({
        userName: 'admin',
        mobile: '1234567890',
        email: 'admin@gmail.com',
        password: hashedPassword, // Ensure you set the hashedPassword here
        permissions: {
          dashboardAccess: true,
          fileEntryAccess: true,
          taggingAccess: true,
          wareHouseAccess: true,
          userManagementAccess: true,
        },
      });
    }
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Unable to sync the database:', error);
  });
