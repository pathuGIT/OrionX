import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import userRouter from './routes/userRouter.js';
import mailRouter from './routes/mailRouter.js';
import menuListTypeRoutes from './routes/menuListTypeRoutes.js';
import menuTypeRoutes from "./routes/menuTypeRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import categoryMenuTypeRoutes from "./routes/categoryMenuTypeRoutes.js";
import itemRoutes from "./routes/itemRoutes.js";
import ItemCategoryMenuTypeRoutes from "./routes/ItemCategoryMenuTypeRoutes.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRouter);
app.use('/api/mail', mailRouter);
app.use('/api/menus', menuListTypeRoutes);
app.use('/api/menutypes', menuTypeRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/categoryMenuTypes', categoryMenuTypeRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/ItemCategoryMenuType', ItemCategoryMenuTypeRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

export default app;