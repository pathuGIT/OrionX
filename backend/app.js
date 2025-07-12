import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/authRoutes.js';
import userRouter from './routes/userRouter.js';
import mailRouter from './routes/mailRouter.js';
import {
  eventRoute, weddingRoutes, cusBookingRoutes,
  dispayEventsRoutes, serviceVendorRoutes,
  EventServiceRoutes, saveSelectedServiceRoutes,
  tableArrangementRoutes, reservationRoutes,
  planBarRoutes, planBiteRoutes,
  BarArrangeRoutes,AdminRoutes,AdminEventRoutes
} from './routes/eventRoutes.js';
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
import summaryRoutes from './routes/summaryRoutes.js';
import overviewRout from './routes/overviewRoutes.js';
import settingRoute from './routes/settingRoutes.js';
import AdminCorrectMenusRoute from './routes/AdminCorrectMenusRoute.js';


const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
app.use('/api/advanceMenuView', menuViewRoutes);
app.use('/api/AdminCorrectMenus', AdminCorrectMenusRoute); // Admin Correct Menus Route

app.use('/api/summary', summaryRoutes); // to get the menu summary customer selected



//booking routes
app.use('/api/booking', bookingRoutes);


app.use('/api/overview', overviewRout);
app.use('/api/setting', settingRoute);

//event routes
app.use('/api/event', eventRoute);
app.use('/api/wedding', weddingRoutes);
app.use('/api/customer', cusBookingRoutes);
app.use('/api/displayEvents', dispayEventsRoutes);
app.use('/api/VendorServices', serviceVendorRoutes);
app.use('/api/EventService', EventServiceRoutes);
app.use('/api/CustomerService', saveSelectedServiceRoutes);
app.use('/api/tableArrangement', tableArrangementRoutes);
app.use('/api/reservation', reservationRoutes);
app.use('/api/Bar', planBarRoutes);
app.use('/api/Bite', planBiteRoutes);
app.use('/api/BarArrange', BarArrangeRoutes);
app.use('/api/assignedEmployee', AdminRoutes);
app.use('/api/AdminEvents', AdminEventRoutes);
app.use('/images', express.static(path.join(__dirname, 'public/images')));


// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

export default app;