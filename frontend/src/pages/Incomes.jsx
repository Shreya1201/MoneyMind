import React, { useState, useContext, useEffect } from "react";
import { ThemeContext } from "../contexts/ThemeContext";
import { FaEdit, FaTrash } from "react-icons/fa";
import {
  ResponsiveContainer,
  PieChart, Pie, Cell, XAxis, YAxis, Tooltip, Legend, LineChart, Line
} from "recharts";
import { useHttp } from "../api/Http";
import EmojiPicker from "emoji-picker-react";
import { toast } from "react-toastify";
import "../styles/Incomes.css";
import { encodeEmoji, decodeEmoji } from "../utils/emojiCodec";
import CustomTooltip from "../components/CustomToolTip"

export default function Incomes() {
  const { theme } = useContext(ThemeContext);
  const { httpGet, httpPost } = useHttp();

  const [incomes, setIncomes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [monthlyTrendData , setmonthlyTrendData ] = useState([]);
  const [showIncomeModal, setShowIncomeModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingIncome, setEditingIncome] = useState(null);
  const [newCategoryEmoji, setNewCategoryEmoji] = useState("🙂");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const fetchData = async () => {
    try {
      await getCategory();
      await getIncome();
    } catch (err) {
      console.error("Fetch error", err);
      toast.error("Failed to fetch data");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getIncome = async () => {
    const JsonData = {};
    const headerData = {
      TranName: "GetIncome",
      JsonData: JSON.stringify(JsonData)
    };
    const res = await httpGet("http://localhost:5000/incomes", { "HeaderData": JSON.stringify(headerData) });
    if (res.ResponseType === "Success") {
      const data = res.Response || {};
      setIncomes(data.incomes || []);
      
      // Line chart: Monthly income trend
      const monthlyData = (data.monthlyTrend || []).map(item => ({
        month: item.Month,
        value: item.TotalIncome
      }));
      setmonthlyTrendData(monthlyData); 

      // Donut chart: Top categories
      const topCatData = (data.topCategories || []).map(item => ({
        name: item.CategoryName,
        value: item.TotalIncome,
        emoji: item.Emoji
      }));
      setCategoryData(topCatData);
    } else {
      toast.error(res.ResponseMessage);
    }
  };

  const handleSaveIncome = async (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    const payload = {
      incomeId: editingIncome?.Id || null,
      amount: form.get("amount"),
      category: parseInt(form.get("category")),
      date: form.get("date"),
      note: form.get("note"),
      recurrence: form.get("recurrence") || "None",
    };
    const tranName = editingIncome ? "EditIncome" : "AddIncome";
    try {
      const res = await httpPost("http://localhost:5000/incomes", payload, { TranName: tranName });
      setShowIncomeModal(false);
      if (res.ResponseType === 'Success') toast.success(res.ResponseMessage);
      else toast.error(res.ResponseMessage);
      setEditingIncome(null);
      fetchData();
    } catch (err) {
      console.error(err);
      toast.error("Error saving income");
    }
  };

  const handleDeleteIncome = async (id) => {
    try {
      const payload = { incomeId: id };
      const res = await httpPost("http://localhost:5000/incomes", payload, { TranName: "DeleteIncome" });
      if (res.ResponseType === "Success") {
        toast.success(res.ResponseMessage);
        fetchData();
      } else {
        toast.error(res.ResponseMessage);
      }
    } catch (err) {
      console.error(err);
      toast.error("Error deleting income");
    }
  };

  const getCategory = async () => {
    const JsonData = { Type: "Income" };
    const headerData = {
      TranName: "GetCategory",
      JsonData: JSON.stringify(JsonData)
    };
    const res = await httpGet("http://localhost:5000/categories", { "HeaderData": JSON.stringify(headerData) });
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
      const payload = { name: cat, emoji: encodeEmoji(newCategoryEmoji), type: "Income" };
      const res = await httpPost("http://localhost:5000/categories", payload, { TranName: "AddCategory" });
      if (res.ResponseType === 'Success') toast.success(res.ResponseMessage);
      else toast.error(res.ResponseMessage);
      setShowCategoryModal(false);
      setShowEmojiPicker(false);
      setNewCategoryEmoji("🙂");
      fetchData();
    } catch (err) {
      console.error(err);
      toast.error("Error adding category");
    }
  };

  const COLORS = ["#4cafef", "#ff9800", "#4caf50", "#f44336", "#9c27b0"];

  return (
    <div className={`income-page ${theme}`}>
      <div className="header">
        <h2>Incomes</h2>
        <div>
          <button className="btn primary" onClick={() => setShowIncomeModal(true)}>
            + Add Income
          </button>
          <button className="btn secondary" onClick={() => setShowCategoryModal(true)}>
            Manage Categories
          </button>
        </div>
      </div>

      <div className="charts">
        <div className="chart-container">
          <h4>By Category</h4>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label={({ name, value, payload }) => `${decodeEmoji(payload.emoji) || ""} ${name} (${value})`}
              >
                {categoryData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-container">
          <h4>Monthly Income Trend</h4>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={monthlyTrendData /* rename to monthlyTrendData if you want */}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line type="monotone" dataKey="value" stroke="#4cafef" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card">
        <table className="income-table">
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
            {incomes.map((inc) => (
              <tr key={inc.Id}>
                <td>₹{inc.Amount}</td>
                <td>{decodeEmoji(inc.Emoji) ? `${decodeEmoji(inc.Emoji)} ${inc.CategoryName}` : inc.CategoryName}</td>
                <td>{inc.Date}</td>
                <td>{inc.Notes}</td>
                <td>{inc.RecurrenceType}</td>
                <td>
                  <button className="icon-btn edit" onClick={() => { setEditingIncome(inc); setShowIncomeModal(true); }}>
                    <FaEdit />
                  </button>
                  <button className="icon-btn delete" onClick={() => handleDeleteIncome(inc.Id)}>
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showIncomeModal && (
        <div className={`modal-overlay ${theme}`}>
          <div className="modal-content">
            <button className="modal-close" onClick={() => setShowIncomeModal(false)}>&times;</button>
            <h3>{editingIncome ? "Edit Income" : "Add Income"}</h3>
            <form onSubmit={handleSaveIncome}>
              <div className="form-group">
                <label>Amount</label>
                <input type="number" name="amount" defaultValue={editingIncome?.Amount || ""} required />
              </div>
              <div className="form-group">
                <label>Category</label>
                <select name="category" defaultValue={editingIncome?.CategoryId || ""} required>
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
                <input type="date" name="date" defaultValue={editingIncome?.Date || ""} required />
              </div>
              <div className="form-group">
                <label>Note</label>
                <input type="text" name="note" defaultValue={editingIncome?.Notes || ""} />
              </div>
              <div className="form-group">
                <label>Recurrence</label>
                <select name="recurrence" defaultValue={editingIncome?.RecurrenceType || "None"}>
                  <option value="None">None</option>
                  <option value="Weekly">Weekly</option>
                  <option value="Monthly">Monthly</option>
                  <option value="Yearly">Yearly</option>
                </select>
              </div>
              <button type="submit" className="btn primary">Save</button>
            </form>
          </div>
        </div>
      )}

      {showCategoryModal && (
        <div className={`modal-overlay ${theme}`}>
          <div className="modal-content">
            <button className="modal-close" onClick={() => setShowCategoryModal(false)}>&times;</button>
            <h3>Manage Categories</h3>
            <ul className="category-list">
              {categories.map((cat) => (
                <li key={cat.CategoryId}>{decodeEmoji(cat.Emoji)} {cat.CategoryName}</li>
              ))}
            </ul>
            <form onSubmit={handleAddCategory}>
              <div className="form-group category-row-vertical">
                <label>New Category</label>
                <div className="input-emoji-wrapper">
                  <input type="text" name="category" placeholder="Enter category" required />
                  <div className="emoji-box" onClick={() => setShowEmojiPicker((prev) => !prev)}>
                    {newCategoryEmoji}
                  </div>
                  {showEmojiPicker && (
                    <div className="emoji-popover">
                      <EmojiPicker height={300} width={400}
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
              <button type="submit" className="btn secondary">Add</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
