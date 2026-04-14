import React, { useState, useEffect } from "react";
import {
    BarChart, Bar, LineChart, Line,
    PieChart, Pie, Cell,
    XAxis, YAxis, Tooltip, Legend, ResponsiveContainer
} from "recharts";
import '../styles/ExpenseDashboard.css';
import { useHttp } from "../api/Http";
import { toast } from "react-toastify";
import { decodeEmoji } from "../utils/emojiCodec";
import CustomTooltip from "../components/CustomToolTip"
import Loader from "../components/Loader";
import AIChatWidget from "../components/AIChatWidget";
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const Dashboard = () => {
    const { httpGet } = useHttp();
    const [isLoading, setIsLoading] = useState(false);
    const [totalIncome, setTotalIncome] = useState(0);
    const [totalExpense, setTotalExpense] = useState(0);
    const [balance, setBalance] = useState(0);
    const [incomeExpenseOverTime, setIncomeExpenseOverTime] = useState([]);
    const [balanceTrend, setBalanceTrend] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    useEffect(()=>{
        getData();
    },[])
    const isNegativeBalance = balance < 0;
    const isFirstTimeUser = totalIncome === 0;

    const getData = async () => {
        setIsLoading(true);
        const JsonData = {};
        const headerData = {
        TranName: "GetData",
        JsonData: JSON.stringify(JsonData)
        };
        const res = await httpGet("http://localhost:5000/dashboard", { "HeaderData": JSON.stringify(headerData) });
        if (res.ResponseType === "Success") {
            const data = res.Response || {};
            setTotalIncome(data.TotalIncome || 0);
            setTotalExpense(data.TotalExpense || 0);
            setBalance(data.Balance || 0);
            if (data.IncomeVsExpense) setIncomeExpenseOverTime(data.IncomeVsExpense);
            if (data.BalanceTrend) setBalanceTrend(data.BalanceTrend);
            if (data.Transactions) setTransactions(data.Transactions);
        } else {
        toast.error(res.ResponseMessage);
        }
    };

    return (
        <div className="dashboard-container">
            {isFirstTimeUser && (
                <div className="warning-banner">
                    ⚠️ You have no income recorded yet. Your balance reflects expenses only.
                    <div className="cta-container">
                        <button 
                        className="cta-btn" 
                        onClick={() => window.location.href = "/incomes"}
                        >
                        ➕ Add your first income
                        </button>
                    </div>
                </div>
            )}
            {/* Summary Cards */}
            <div className="summary-cards">
                <div className="card">
                    <h3>Total Income</h3>
                    <p><span>₹</span>{totalIncome}</p>
                </div>
                <div className="card">
                    <h3>Total Expenses</h3>
                    <p><span>₹</span>{totalExpense}</p>
                </div>
                <div className={`card ${isNegativeBalance ? 'card-warning' : ''}`}>
                    <h3>Balance</h3>
                    <p><span>₹</span>{balance}</p>
                </div>
            </div>

            {/* Graphs */}
            <div className="charts">
                <div className="chart-container">
                <h4>Income vs Expense Over Time</h4>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={incomeExpenseOverTime}>
                    <XAxis dataKey="Month" />
                    <YAxis />
                    <Legend />
                    <Line type="monotone" dataKey="TotalIncome" stroke="#4dceac" name="Income" />
                    <Line type="monotone" dataKey="TotalExpense" stroke="#ff6b6b" name="Expense" />
                    <Tooltip content={<CustomTooltip />} />
                    </LineChart>
                </ResponsiveContainer>
                </div>

                <div className="chart-container">
                <h4>Balance Over Time</h4>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={balanceTrend}>
                    <XAxis dataKey="Month" />
                    <YAxis />
                    <Legend />
                    <Line type="monotone" dataKey="Balance" stroke="#8884d8" name="Balance" />
                    <Tooltip content={<CustomTooltip />} />
                    </LineChart>
                </ResponsiveContainer>
                </div>
            </div>
            {/* Recent Transactions Table */}
            <div className="card">
                <table className="transaction-table">
                    <thead>
                        <tr>
                        <th>Date</th>
                        <th>Type</th>
                        <th>Category</th>
                        <th>Notes</th>
                        <th>Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.map((tx, idx) => (
                        <tr key={idx}>
                            <td>{tx.Date}</td>
                            <td>{tx.Type}</td>
                            <td>
                            {tx.Emoji ? decodeEmoji(tx.Emoji) : ""} {tx.CategoryName}
                            </td>
                            <td>{tx.Notes || "-"}</td>
                            <td style={{ color: tx.Type === "Income" ? "#4dceac" : "#ff6b6b" }}>
                            {tx.Type === "Income" ? "+" : "-"}₹{tx.Amount}
                            </td>
                        </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="ai-container">
                {!isOpen && (
                    <button className="ai-fab" onClick={() => setIsOpen(true)}>
                    🤖
                    </button>
                )}

                {isOpen && (
                    <div className="ai-widget">
                    <div className="ai-header">
                        🤖 AI Advisor
                        <span className="close-btn" onClick={() => setIsOpen(false)}>✖</span>
                    </div>
                    <AIChatWidget/>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Dashboard;