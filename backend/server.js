import 'dotenv/config';
import app from './app.js';
import cors from 'cors';

const PORT = process.env.PORT || 8005;

app.use(cors());

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}).on('error', (err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});