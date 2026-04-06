import React, { useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";

const ExpenseList = ({ expenses, onEdit, onDelete }) => {
  return (
    <div className="expense-list">
      <h2>Expenses</h2>
      {expenses.length === 0 ? (
        <p>No expenses added yet.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Amount</th>
              <th>Category</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((exp) => (
              <tr key={exp.id}>
                <td>{exp.title}</td>
                <td>₹{exp.amount}</td>
                <td>{exp.category}</td>
                <td>{exp.date}</td>
                <td>
                  <button onClick={() => onEdit(exp)} className="edit-btn">
                    <FaEdit />
                  </button>
                  <button onClick={() => onDelete(exp.id)} className="delete-btn">
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ExpenseList;
