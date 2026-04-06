import React, { useState } from "react";
import { FaTimes } from "react-icons/fa";

export default function Form({ editingIncome, categories, onSave, onClose }) {
  const [form, setForm] = useState(
    editingIncome || { amount: "", category: "", date: "", note: "" }
  );

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  return (
    <div className="modal-overlay">
      <div className="modal-content theme">
        <button className="close-btn" onClick={onClose}>
          <FaTimes />
        </button>
        <h3>{editingIncome ? "Edit Income" : "Add Income"}</h3>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSave(form);
          }}
        >
          <input
            type="number"
            name="amount"
            placeholder="Amount"
            value={form.amount}
            onChange={handleChange}
            required
          />

          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            required
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="note"
            placeholder="Note"
            value={form.note}
            onChange={handleChange}
          />

          <div className="form-actions">
            <button type="submit" className="btn">Save</button>
            <button type="button" className="btn secondary" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
