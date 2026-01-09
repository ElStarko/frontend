import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  Grid,
  MenuItem,
  Typography,
  Box
} from '@mui/material';
import { format } from 'date-fns';

const categories = [
  'Food',
  'Transportation',
  'Shopping',
  'Entertainment',
  'Bills',
  'Healthcare',
  'Education',
  'Other'
];

function ExpenseForm({ onSubmit, editingExpense, onCancel }) {
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: 'Food',
    date: format(new Date(), 'yyyy-MM-dd'),
    description: ''
  });

  useEffect(() => {
    if (editingExpense) {
      setFormData({
        title: editingExpense.title,
        amount: editingExpense.amount,
        category: editingExpense.category,
        date: format(new Date(editingExpense.date), 'yyyy-MM-dd'),
        description: editingExpense.description || ''
      });
    }
  }, [editingExpense]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      amount: parseFloat(formData.amount),
      date: new Date(formData.date)
    });
    if (!editingExpense) {
      setFormData({
        title: '',
        amount: '',
        category: 'Food',
        date: format(new Date(), 'yyyy-MM-dd'),
        description: ''
      });
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Typography variant="h6" gutterBottom>
        {editingExpense ? 'Edit Expense' : 'Add New Expense'}
      </Typography>
      
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Amount"
            name="amount"
            type="number"
            value={formData.amount}
            onChange={handleChange}
            inputProps={{ min: 0, step: 0.01 }}
            required
          />
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            select
            label="Category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            {categories.map((category) => (
              <MenuItem key={category} value={category}>
                {category}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Date"
            name="date"
            type="date"
            value={formData.date}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            required
          />
        </Grid>
        
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            multiline
            rows={2}
          />
        </Grid>
        
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
            >
              {editingExpense ? 'Update' : 'Add'} Expense
            </Button>
            
            {editingExpense && (
              <Button
                variant="outlined"
                color="secondary"
                onClick={onCancel}
                fullWidth
              >
                Cancel
              </Button>
            )}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}

export default ExpenseForm;