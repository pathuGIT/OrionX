import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import userRouter from './routes/userRouter.js';
import mailRouter from './routes/mailRouter.js';
import menuRoutes from './routes/menuRoutes.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRouter);
app.use('/api/mail', mailRouter);
app.use('/api/menus', menuRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

export default app;