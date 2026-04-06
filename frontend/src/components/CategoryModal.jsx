import React, { useState } from "react";
import { FaTrash, FaTimes } from "react-icons/fa";
import '../styles/Incomes.css'
export default function CategoryModal({ categories, setCategories, onClose }) {
  const [newCategory, setNewCategory] = useState("");

  const addCategory = () => {
    if (newCategory.trim() && !categories.includes(newCategory.trim())) {
      setCategories([...categories, newCategory.trim()]);
      setNewCategory("");
    }
  };

  const deleteCategory = (cat) => {
    setCategories(categories.filter((c) => c !== cat));
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content theme">
        <button className="close-btn" onClick={onClose}>
          <FaTimes />
        </button>
        <h3>Manage Categories</h3>
        <ul className="category-list">
          {categories.map((cat) => (
            <li key={cat}>
              {cat}
              <button className="icon-btn delete" onClick={() => deleteCategory(cat)}>
                <FaTrash />
              </button>
            </li>
          ))}
        </ul>
        <div className="form-row">
          <input
            type="text"
            placeholder="New category"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
          />
          <button className="btn" onClick={addCategory}>Add</button>
        </div>
      </div>
    </div>
  );
}
