# 💸 MoneyMind

A full-stack personal expense tracking application with AI-powered financial insights.

---

## ✨ Features

* **Expense Tracking** — Log and manage your day-to-day expenses
* **Financial Dashboard** — View total income, expenses, current balance, and interactive graphs for better insights
* **AI Financial Advisor** — Ask questions and get personalized advice powered by Gemini AI
* **Secure Authentication** — JWT-based login system
* **Rate Limited APIs** — Prevents abuse and ensures fair usage

---

## 🛠️ Tech Stack

| Layer    | Technology                             |
| -------- | -------------------------------------- |
| Frontend | React                                  |
| Backend  | Node.js, Express.js                    |
| Database | Microsoft SQL Server                   |
| AI       | Google Gemini API (`gemini-2.5-flash`) |
| Auth     | JWT Middleware                         |

---

## 📁 Project Structure

```
MoneyMind/
├── frontend/        # React app
├── backend/         # Express server, routes, DB stored procedures
└── .gitignore
```

---

## ⚙️ Getting Started

### Installation

```bash
# Clone the repository
git clone https://github.com/Shreya1201/MoneyMind.git
cd MoneyMind

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

---

## 🔐 Environment Variables

### Backend (`/backend/.env`)

```env
GEMINI_API_KEY=your_gemini_api_key_here
DB_SERVER=your_sql_server
DB_DATABASE=your_database_name
DB_USER=your_db_user
DB_PASSWORD=your_db_password
JWT_SECRET=your_secret
PORT=5000
```

---

### Frontend (`/frontend/.env`)

```env
VITE_API_URL=http://localhost:5000
```

---

## ▶️ Running Locally

```bash
# Start backend
cd backend
npm run dev

# Start frontend
cd ../frontend
npm run dev
```

Open: http://127.0.0.1:5173

---

## 🔒 Security & Performance

* **Rate Limiting** — Prevents API abuse using `express-rate-limit`
* **JWT Authentication** — Secures protected endpoints
* **CORS Handling** — Enables safe frontend-backend communication
* **Environment Variables** — Keeps secrets secure

---

## 🤖 How the AI Works

The `/ai/insights` endpoint:

1. Fetches user financial data from SQL Server (via stored procedure)
2. Injects the data into a structured prompt
3. Sends it to Gemini AI
4. Returns personalized financial advice

✔ No embeddings used (lightweight and cost-efficient)
✔ Context-aware responses based on real user data

---

## 🏗️ System Design Overview

```
User (React UI)
      ↓
Node.js API (Express)
      ↓
SQL Server (Stored Procedures)
      ↓
Gemini AI (Context-based response)
```

### Key Design Decisions:

* Stateless backend for scalability
* Stored procedures for optimized DB operations
* Middleware-based architecture (auth, rate limiting)

---

## 📈 Future Improvements

* Chat history persistence
* Background job processing (queues)
* Smart financial insights (auto suggestions)
* Graph-based analytics dashboard
* Budgeting and goal tracking

---

## 🎯 Why This Project Stands Out

* Real-world use case (personal finance)
* AI integrated with actual user data
* Clean full-stack architecture
* Production-ready features (auth, rate limiting, error handling)

---

## 👩‍💻 Author

**Shreya**
GitHub: https://github.com/Shreya1201
