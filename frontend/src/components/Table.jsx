import React from "react";
import { FaEdit, FaTrash } from "react-icons/fa";

export default function Table({ incomes, onEdit, onDelete }) {
  return (
    <div className="card theme">
      <div className="table-wrapper">
        <table className="income-table theme">
          <thead>
            <tr>
              <th>Amount</th>
              <th>Category</th>
              <th>Date</th>
              <th>Note</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {incomes.map((inc) => (
              <tr key={inc.id}>
                <td>₹{inc.amount}</td>
                <td>{inc.category}</td>
                <td>{inc.date}</td>
                <td>{inc.note}</td>
                <td>
                  <button className="icon-btn edit" onClick={() => onEdit(inc)}>
                    <FaEdit />
                  </button>
                  <button className="icon-btn delete" onClick={() => onDelete(inc.id)}>
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
