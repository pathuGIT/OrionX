import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import userRouter from './routes/userRouter.js';
import mailRouter from './routes/mailRouter.js';
import { eventRoute, weddingRoutes,cusBookingRoutes ,dispayEventsRoutes ,serviceVendorRoutes, EventServiceRoutes, saveSelectedServiceRoutes } from './routes/eventRoutes.js';
import menuListTypeRoutes from './routes/menuListTypeRoutes.js';
import menuTypeRoutes from "./routes/menuTypeRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import categoryMenuTypeRoutes from "./routes/categoryMenuTypeRoutes.js";
import itemRoutes from "./routes/itemRoutes.js";
import ItemCategoryMenuTypeRoutes from "./routes/ItemCategoryMenuTypeRoutes.js";
import customerSelectionRoutes from "./routes/CustomerMenuSelectionRoutes.js";
import bookingRoutes from './routes/bookingRoutes.js';
import advanceMenuViewRoute from './routes/advanceMenuViewRoute.js'
import menuViewRoutes from './routes/menuViewRoutes.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRouter);
app.use('/api/mail', mailRouter);

// Menu routes
app.use('/api/menuListType', menuListTypeRoutes); //same
app.use('/api/menutypes', menuTypeRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/categoryMenuTypes', categoryMenuTypeRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/ItemCategoryMenuType', ItemCategoryMenuTypeRoutes);
app.use('/api/customerMenuSelection', customerSelectionRoutes);
// Menu Overview routes
app.use('/api/advanceMenu', advanceMenuViewRoute);
app.use('/api/advanceMenuView', menuViewRoutes); //meka tmi werdi ei

//booking routes
app.use('/api/booking', bookingRoutes);



//event routes
app.use('/api/event', eventRoute);
app.use('/api/wedding', weddingRoutes);
app.use('/api/customer', cusBookingRoutes);
app.use('/api/displayEvents', dispayEventsRoutes);
app.use('/api/VendorServices', serviceVendorRoutes);
app.use('/api/Evenapi/tService', EventServiceRoutes);
app.use('/api/CustomerService', saveSelectedServiceRoutes);



// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

export default app;