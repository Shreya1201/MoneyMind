import React, { useState, useContext, useEffect } from "react";
import { ThemeContext } from "../contexts/ThemeContext";
import { FaEdit, FaTrash } from "react-icons/fa";
import {
  ResponsiveContainer,
  PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend
} from "recharts";
import { useHttp } from "../api/Http";
import EmojiPicker from "emoji-picker-react";
import { toast } from "react-toastify";
import "../styles/Expenses.css";
import { encodeEmoji, decodeEmoji } from "../utils/emojiCodec";
import CustomTooltip from "../components/CustomToolTip"
export default function Expenses() {
  const { theme } = useContext(ThemeContext);
  const { httpGet, httpPost } = useHttp();

  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [monthlyTrendData, setMonthlyTrendData] = useState([]);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [newCategoryEmoji, setNewCategoryEmoji] = useState("💸");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const fetchData = async () => {
    try {
      await getCategory();
      await getExpense();
    } catch (err) {
      console.error("Fetch error", err);
      toast.error("Failed to fetch data");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getExpense = async () => {
    const JsonData = {};
    const headerData = {
      TranName: "GetExpense",
      JsonData: JSON.stringify(JsonData),
    };
    const res = await httpGet("http://localhost:5000/expenses", {
      HeaderData: JSON.stringify(headerData),
    });
    if (res.ResponseType === "Success") {
      const data = res.Response;
      if(data.expenses){
        setExpenses(data.expenses || []);
      }
      if(data.topCategories){
        // Prepare PieChart data by category
        const catData = data.topCategories.map(cat => ({
          name: cat.CategoryName,
          emoji: cat.Emoji,
          value: cat.TotalExpense
        }));
        setCategoryData(catData);
      }
      if(data.monthlyTrend){
        // Prepare BarChart data by recurrence
        const monthData = data.monthlyTrend.map(m => ({
          month: m.Month,
          total: m.TotalExpense
        }));
        setMonthlyTrendData(monthData);
      }
    } else {
      toast.error(res.ResponseMessage);
    }
  };

  const handleSaveExpense = async (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    const payload = {
      expenseId: editingExpense?.Id || null,
      amount: form.get("amount"),
      category: parseInt(form.get("category")),
      date: form.get("date"),
      note: form.get("note"),
      recurrence: form.get("recurrence") || "None",
    };
    const tranName = editingExpense ? "EditExpense" : "AddExpense";
    try {
      const res = await httpPost("http://localhost:5000/expenses", payload, {
        TranName: tranName,
      });
      setShowExpenseModal(false);
      if (res.ResponseType === "Success") toast.success(res.ResponseMessage);
      else toast.error(res.ResponseMessage);
      setEditingExpense(null);
      fetchData();
    } catch (err) {
      console.error(err);
      toast.error("Error saving expense");
    }
  };

  const handleDeleteExpense = async (id) => {
    try {
      const payload = { expenseId: id };
      const res = await httpPost("http://localhost:5000/expenses", payload, {
        TranName: "DeleteExpense",
      });
      if (res.ResponseType === "Success") {
        toast.success(res.ResponseMessage);
        fetchData();
      } else {
        toast.error(res.ResponseMessage);
      }
    } catch (err) {
      console.error(err);
      toast.error("Error deleting expense");
    }
  };

  const getCategory = async () => {
    const JsonData = { Type: "Expense" };
    const headerData = {
      TranName: "GetCategory",
      JsonData: JSON.stringify(JsonData),
    };
    const res = await httpGet("http://localhost:5000/categories", {
      HeaderData: JSON.stringify(headerData),
    });
    if (res.ResponseType === "Success") {
      setCategories(res.Response);
    } else {
      toast.error(res.ResponseMessage);
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    const cat = form.get("category").trim();
    if (!cat) return;
    try {
      const payload = {
        name: cat,
        emoji: encodeEmoji(newCategoryEmoji),
        type: "Expense",
      };
      const res = await httpPost("http://localhost:5000/categories", payload, {
        TranName: "AddCategory",
      });
      if (res.ResponseType === "Success") toast.success(res.ResponseMessage);
      else toast.error(res.ResponseMessage);
      setShowCategoryModal(false);
      setShowEmojiPicker(false);
      setNewCategoryEmoji("💸");
      fetchData();
    } catch (err) {
      console.error(err);
      toast.error("Error adding category");
    }
  };

  const COLORS = ["#f44336", "#ff9800", "#4caf50", "#2196f3", "#9c27b0"];

  return (
    <div className={`expense-page ${theme}`}>
      <div className="header">
        <h2>Expenses</h2>
        <div>
          <button className="btn primary" onClick={() => setShowExpenseModal(true)}>
            + Add Expense
          </button>
          <button className="btn secondary" onClick={() => setShowCategoryModal(true)}>
            Manage Categories
          </button>
        </div>
      </div>

      {/* ==== Graphs Section ==== */}
      <div className="charts">
        <div className="chart-container">
          <h4>By Category</h4>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={categoryData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label>
                {categoryData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip theme={theme} />} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-container">
          <h4>Monthly Trend</h4>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={monthlyTrendData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip content={<CustomTooltip theme={theme} />} />
              <Legend />
              <Bar dataKey="value" fill={theme === "dark" ? "#3da58a" : "#4dceac"} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ==== Expense Table ==== */}
      <div className="card">
        <table className="expense-table">
          <thead>
            <tr>
              <th>Amount</th>
              <th>Category</th>
              <th>Date</th>
              <th>Note</th>
              <th>Recurrence</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((exp) => (
              <tr key={exp.Id}>
                <td>₹{exp.Amount}</td>
                <td>
                  {decodeEmoji(exp.Emoji)
                    ? `${decodeEmoji(exp.Emoji)} ${exp.CategoryName}`
                    : exp.CategoryName}
                </td>
                <td>{exp.Date}</td>
                <td>{exp.Notes}</td>
                <td>{exp.RecurrenceType}</td>
                <td>
                  <button
                    className="icon-btn edit"
                    onClick={() => {
                      setEditingExpense(exp);
                      setShowExpenseModal(true);
                    }}
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="icon-btn delete"
                    onClick={() => handleDeleteExpense(exp.Id)}
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ==== Expense Modal ==== */}
      {showExpenseModal && (
        <div className={`modal-overlay ${theme}`}>
          <div className="modal-content">
            <button
              className="modal-close"
              onClick={() => setShowExpenseModal(false)}
            >
              &times;
            </button>
            <h3>{editingExpense ? "Edit Expense" : "Add Expense"}</h3>
            <form onSubmit={handleSaveExpense}>
              <div className="form-group">
                <label>Amount</label>
                <input
                  type="number"
                  name="amount"
                  defaultValue={editingExpense?.Amount || ""}
                  required
                />
              </div>
              <div className="form-group">
                <label>Category</label>
                <select
                  name="category"
                  defaultValue={editingExpense?.CategoryId || ""}
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat.CategoryId} value={cat.CategoryId}>
                      {decodeEmoji(cat.Emoji)} {cat.CategoryName}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Date</label>
                <input
                  type="date"
                  name="date"
                  defaultValue={editingExpense?.Date || ""}
                  required
                />
              </div>
              <div className="form-group">
                <label>Note</label>
                <input
                  type="text"
                  name="note"
                  defaultValue={editingExpense?.Notes || ""}
                />
              </div>
              <div className="form-group">
                <label>Recurrence</label>
                <select
                  name="recurrence"
                  defaultValue={editingExpense?.RecurrenceType || "None"}
                >
                  <option value="None">None</option>
                  <option value="Weekly">Weekly</option>
                  <option value="Monthly">Monthly</option>
                  <option value="Yearly">Yearly</option>
                </select>
              </div>

              <button type="submit" className="btn primary">
                Save
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ==== Category Modal ==== */}
      {showCategoryModal && (
        <div className={`modal-overlay ${theme}`}>
          <div className="modal-content">
            <button
              className="modal-close"
              onClick={() => setShowCategoryModal(false)}
            >
              &times;
            </button>
            <h3>Manage Categories</h3>
            <ul className="category-list">
              {categories.map((cat) => (
                <li key={cat.CategoryId}>
                  {decodeEmoji(cat.Emoji)} {cat.CategoryName}
                </li>
              ))}
            </ul>
            <form onSubmit={handleAddCategory}>
              <div className="form-group category-row-vertical">
                <label>New Category</label>
                <div className="input-emoji-wrapper">
                  <input
                    type="text"
                    name="category"
                    placeholder="Enter category"
                    required
                  />
                  <div
                    className="emoji-box"
                    onClick={() => setShowEmojiPicker((prev) => !prev)}
                  >
                    {newCategoryEmoji}
                  </div>
                  {showEmojiPicker && (
                    <div className="emoji-popover">
                      <EmojiPicker
                        height={300}
                        width={400}
                        onEmojiClick={(e) => {
                          setNewCategoryEmoji(e.emoji);
                          setShowEmojiPicker(true);
                        }}
                        previewConfig={{ showPreview: false }}
                      />
                    </div>
                  )}
                </div>
              </div>
              <button type="submit" className="btn secondary">
                Add
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
