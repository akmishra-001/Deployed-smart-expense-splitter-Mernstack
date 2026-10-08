# 💰 Smart Expense Splitter (MERN Stack)

An intuitive, modern, full-stack web application designed to simplify group expenses and effortlessly calculate individual balances and settlements. Built with the **MERN** stack (MongoDB, Express, React, Node.js) and optimized with Vite.

---

## 🚀 Live Demo

- **Frontend (Vercel):** [https://deployed-smart-expense-splitter-mer.vercel.app/](https://deployed-smart-expense-splitter-mer.vercel.app/)
- **Backend API (Render):** [https://deployed-smart-expense-splitter-mernstack.onrender.com/](https://deployed-smart-expense-splitter-mernstack.onrender.com/)
- **GitHub Repository:** [https://github.com/akmishra-001/Deployed-smart-expense-splitter-Mernstack.git](https://github.com/akmishra-001/Deployed-smart-expense-splitter-Mernstack.git)

---

## ✨ Features

- **🔐 User Authentication:** Secure user signup and login using JSON Web Tokens (JWT) & bcrypt hashing.
- **👥 Group Management:** Create groups for trips, events, or shared living expenses and invite friends.
- **💳 Expense Tracking:** Add shared expenses, specify who paid, and split costs among group members.
- **⚖️ Automated Settlements:** Real-time calculation showing who owes whom and exact settlement amounts.
- **📱 Responsive UI:** Clean, modern interface designed to work seamlessly across desktops, tablets, and mobile devices.

---

## 🛠️ Tech Stack

### **Frontend**
- React.js (Vite)
- React Router DOM
- CSS3 / Tailwind CSS
- Axios (API Requests)

### **Backend**
- Node.js & Express.js
- MongoDB & Mongoose
- JWT (JSON Web Token) & bcryptjs
- CORS Enabled

---

## 📂 Project Structure

```text
Deployed-smart-expense-splitter-Mernstack/
├── frontend/                # React Vite Frontend Application
│   ├── src/
│   │   ├── components/      # Reusable UI Components
│   │   ├── pages/           # Dashboard, Login, Register, Group Pages
│   │   ├── services/        # API service configuration (api.js)
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── vercel.json          # SPA routing configuration for Vercel
│   └── package.json
│
├── server.js                # Express Server Entry Point
├── config/                  # DB Connection (db.js)
├── models/                  # Mongoose Models (User, Group, Expense)
├── routes/                  # Express API Routes
├── controllers/             # Business Logic
└── package.json


**⚙️ Local Installation & Setup
**Prerequisites
Node.js (v16 or higher)

MongoDB (Local or MongoDB Atlas Cluster)


**1. Clone the Repository
**Bash
git clone [https://github.com/akmishra-001/Deployed-smart-expense-splitter-Mernstack.git](https://github.com/akmishra-001/Deployed-smart-expense-splitter-Mernstack.git)
cd Deployed-smart-expense-splitter-Mernstack
**2. Setup Backend
**Bash
# Install backend dependencies
npm install

# Create a .env file in the root directory
touch .env
Add the following environment variables to your .env file:

Code snippet
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
Run the backend server:

**Bash
**npm run dev # or node server.js
**3. Setup Frontend
**Bash
cd frontend

# Install frontend dependencies
npm install

# Start the Vite development server
npm run dev


**📡 API Endpoints Summary**
**Method****Endpoint****Description**
POST/api/auth/registerRegister a new user
POST/api/auth/loginAuthenticate user & get tokenGET /
POST/api/groupsFetch or create expense groupsGET /
POST/api/expensesFetch or log shared expenses
GET/api/balancesFetch calculated group settlements


**Author**
Abhishek Mishra

**⭐️ If you like this project, please give it a star on GitHub! ⭐️**
