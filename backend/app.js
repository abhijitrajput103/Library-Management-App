import express from 'express';
import dotenv from 'dotenv';
import colors from 'colors';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import userRoutes from './routes/userRoutes.js';
import bookRoutes from './routes/bookRoutes.js';
import { connectDB } from "./lib/db.js";
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Routes
app.use("/api/users", userRoutes);
app.use("/api/books", bookRoutes);

// Serve frontend static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(join(__dirname, "../frontend/dist")));
  
  app.get('*', (req, res) => {
    res.sendFile(join(__dirname, '../frontend/dist/index.html'));
  });
}

// Public folder static middleware
app.use(express.static(join(__dirname, 'public')));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`.bgMagenta.bold);
  connectDB();
});