# 💸 MoneyMind

A full-stack personal expense tracking application with AI-powered financial insights.

---

## ✨ Features

- **Expense Tracking** — Log and manage your day-to-day expenses
- **Financial Dashboard** — View total income, total expenses, and current balance at a glance
- **AI Financial Advisor** — Ask questions about your spending and get personalized, actionable advice powered by Gemini AI

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React |
| Backend | Node.js, Express.js |
| Database | Microsoft SQL Server |
| AI | Google Gemini API (`gemini-2.5-flash`) |
| Auth | JWT Middleware |

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

### Prerequisites
- Node.js (v18+)
- Microsoft SQL Server
- Google Gemini API key

### Installation

```bash
# Clone the repository
git clone https://github.com/Shreya1201/MoneyMind.git
cd MoneyMind

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd frontend
npm install
```

### Environment Variables

Create a `.env` file in the `backend/` directory:

```env
GEMINI_API_KEY=your_gemini_api_key_here
DB_SERVER=your_sql_server
DB_DATABASE=your_database_name
DB_USER=your_db_user
DB_PASS=your_db_password
PORT=5000
```

Create a `.env` file in the `backend/` directory:

```env
API_URL=backend_url
```

### Running Locally

```bash
# Start the backend (from /backend)
npm run dev

# Start the frontend (from /frontend)
npm run dev
```

Open `http://127.0.0.1:5173` in your browser.

---

## 🤖 How the AI Works

The `/ai/insights` endpoint fetches the authenticated user's financial data (income, expenses, balance) from SQL Server via a stored procedure, then sends it as context to Gemini AI along with the user's question. Gemini responds with concise, data-driven financial advice tailored to the user's actual numbers.

---

## 👩‍💻 Author

**Shreya** — [GitHub](https://github.com/Shreya1201)
