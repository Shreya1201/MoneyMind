import React, { useState, useEffect } from "react";
import { expenseCategories } from "../constants/categories";

const ExpenseForm = ({ onSave, editingExpense, onCancel }) => {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState(expenseCategories[0]);
  const [date, setDate] = useState("");

  useEffect(() => {
    if (editingExpense) {
      setTitle(editingExpense.title);
      setAmount(editingExpense.amount);
      setCategory(editingExpense.category);
      setDate(editingExpense.date);
    }
  }, [editingExpense]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !amount || !date) return alert("Fill all fields!");

    const expenseData = {
      id: editingExpense ? editingExpense.id : Date.now(),
      title,
      amount: parseFloat(amount),
      category,
      date,
    };

    onSave(expenseData);

    // reset
    setTitle("");
    setAmount("");
    setCategory(expenseCategories[0]);
    setDate("");
  };

  return (
    <form className="expense-form" onSubmit={handleSubmit}>
      <h2>{editingExpense ? "Edit Expense" : "Add Expense"}</h2>

      <input
        type="text"
        placeholder="Expense Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        {expenseCategories.map((cat, i) => (
          <option key={i} value={cat}>{cat}</option>
        ))}
      </select>

      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />

      <div className="form-actions">
        <button type="submit" className="save-btn">
          {editingExpense ? "Update" : "Add"}
        </button>
        {editingExpense && (
          <button type="button" className="cancel-btn" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default ExpenseForm;
