import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import './App.css';

const API_URL = 'http://localhost:5000/api';
const CATEGORIES = ['Food', 'Transportation', 'Shopping', 'Entertainment', 'Bills', 'Healthcare', 'Education', 'Other'];

function App() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    title: '',
    amount: '',
    category: 'Food',
    date: format(new Date(), 'yyyy-MM-dd'),
    description: ''
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const response = await axios.get(`${API_URL}/expenses`);
      setExpenses(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching expenses:', error);
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const expenseData = {
        ...form,
        amount: parseFloat(form.amount),
        date: new Date(form.date)
      };

      if (editingId) {
        await axios.put(`${API_URL}/expenses/${editingId}`, expenseData);
      } else {
        await axios.post(`${API_URL}/expenses`, expenseData);
      }

      setForm({
        title: '',
        amount: '',
        category: 'Food',
        date: format(new Date(), 'yyyy-MM-dd'),
        description: ''
      });
      setEditingId(null);
      fetchExpenses();
    } catch (error) {
      console.error('Error saving expense:', error);
    }
  };

  const handleEdit = (expense) => {
    setForm({
      title: expense.title,
      amount: expense.amount.toString(),
      category: expense.category,
      date: format(new Date(expense.date), 'yyyy-MM-dd'),
      description: expense.description || ''
    });
    setEditingId(expense._id);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      try {
        await axios.delete(`${API_URL}/expenses/${id}`);
        fetchExpenses();
      } catch (error) {
        console.error('Error deleting expense:', error);
      }
    }
  };

  const calculateTotal = () => {
    return expenses.reduce((total, expense) => total + expense.amount, 0);
  };

  if (loading) {
    return <div className="loading">Loading expenses...</div>;
  }

  return (
    <div className="app">
      <header className="header">
        <h1>Track Your Expenses 💰 </h1>
      </header>
        <div className="summary-section">
          <h2>Summary</h2>
          <div className="total-card">
            <h3>Total Spent</h3>
            <p className="total-amount">${calculateTotal().toFixed(2)}</p>
          </div>
          
          <div className="category-summary">
            <h3>By Category</h3>
            {CATEGORIES.map(category => {
              const categoryTotal = expenses
                .filter(e => e.category === category)
                .reduce((sum, e) => sum + e.amount, 0);
              
              if (categoryTotal === 0) return null;
              
              return (
                <div key={category} className="category-item">
                  <span>{category}</span>
                  <span>${categoryTotal.toFixed(2)}</span>
                </div>
              );
            })}
          </div>
        </div>
        
      <div className="container">
        <div className="form-section">
          <h2>{editingId ? 'Edit Expense' : 'Add New Expense'}</h2>
          <form onSubmit={handleSubmit} className="expense-form">
            <div className="form-group">
              <label>Title *</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({...form, title: e.target.value})}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Amount ($) *</label>
                <input
                  type="number"
                  value={form.amount}
                  onChange={(e) => setForm({...form, amount: e.target.value})}
                  min="0"
                  step="0.01"
                  required
                />
              </div>

              <div className="form-group">
                <label>Category *</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({...form, category: e.target.value})}
                  required
                >
                  {CATEGORIES.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Date *</label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm({...form, date: e.target.value})}
                required
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({...form, description: e.target.value})}
                rows="3"
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary">
                {editingId ? 'Update Expense' : 'Add Expense'}
              </button>
              {editingId && (
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => {
                    setEditingId(null);
                    setForm({
                      title: '',
                      amount: '',
                      category: 'Food',
                      date: format(new Date(), 'yyyy-MM-dd'),
                      description: ''
                    });
                  }}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>



        <div className="expenses-section">
          <h2>Recent Expenses</h2>
          {expenses.length === 0 ? (
            <p className="no-expenses">No expenses yet. Add your first expense!</p>
          ) : (
            <div className="expenses-list">
              {expenses.map(expense => (
                <div key={expense._id} className="expense-card">
                  <div className="expense-header">
                    <div>
                      <h3>{expense.title}</h3>
                      <span className="category-badge">{expense.category}</span>
                    </div>
                    <span className="expense-amount">${expense.amount.toFixed(2)}</span>
                  </div>
                  <div className="expense-details">
                    <p>{expense.description}</p>
                    <small>{format(new Date(expense.date), 'MMM dd, yyyy')}</small>
                  </div>
                  <div className="expense-actions">
                    <button 
                      onClick={() => handleEdit(expense)}
                      className="btn-edit"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(expense._id)}
                      className="btn-delete"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;