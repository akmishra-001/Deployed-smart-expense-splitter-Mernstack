const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db.js');
const authRoutes = require('./routes/authRoutes.js');
const groupRoutes = require('./routes/groupRoutes.js');
const expenseRoutes = require('./routes/expenseRoutes.js');
const balanceRoutes = require('./routes/balanceRoutes.js'); // 1. Import balanceRoutes

dotenv.config();
connectDB();

const app = express();

app.use(express.json());
app.use(cors());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/balances', balanceRoutes); // 2. Connect balanceRoutes

app.get('/', (req, res) => {
  res.send('Expense Splitter API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in production mode on port ${PORT}`);
});