import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config(); // VERY IMPORTANT

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql',
    logging: false,
  }
);

async function connectDB() {
  try {
    await sequelize.authenticate();
    console.log('DB connection established successfully');
  } catch (error) {
    console.error('Unable to create db connection:', error.message);
  }
}

connectDB();

export default sequelize;
