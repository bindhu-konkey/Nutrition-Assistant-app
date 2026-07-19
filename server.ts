import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';

// Load environment variables
dotenv.config();

// Import Routes
import authRoutes from './server/routes/authRoutes';
import mealRoutes from './server/routes/mealRoutes';
import waterRoutes from './server/routes/waterRoutes';
import profileRoutes from './server/routes/profileRoutes';
import goalRoutes from './server/routes/goalRoutes';
import recipeRoutes from './server/routes/recipeRoutes';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middlewares for parsing request body
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // API Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/meals', mealRoutes);
  app.use('/api/water', waterRoutes);
  app.use('/api/profile', profileRoutes);
  app.use('/api/goals', goalRoutes);
  app.use('/api/recipes', recipeRoutes);

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({ success: true, status: 'ok', timestamp: new Date().toISOString() });
  });

  // Serve static assets / Integrate Vite dev server
  if (process.env.NODE_ENV !== 'production') {
    console.log('Starting server in DEVELOPMENT mode with Vite middleware...');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    console.log('Starting server in PRODUCTION mode...');
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
});
