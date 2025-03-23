import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import userRouter from './routes/userRouter.js';
import mailRouter from './routes/mailRouter.js';
import { eventRoute, weddingRoutes } from './routes/eventRoutes.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRouter);
app.use('/api/mail', mailRouter);


//event routes
app.use('/api/events', eventRoute);
//app.use('/api/events1', eventRoutes1);
app.use('/api/weddings', weddingRoutes);
//app.use('/api/customs', customRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

export default app;