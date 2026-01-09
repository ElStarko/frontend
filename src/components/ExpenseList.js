import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Typography
} from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import { format } from 'date-fns';

const categoryColors = {
  Food: '#ff9800',
  Transportation: '#2196f3',
  Shopping: '#e91e63',
  Entertainment: '#9c27b0',
  Bills: '#f44336',
  Healthcare: '#4caf50',
  Education: '#009688',
  Other: '#607d8b'
};

function ExpenseList({ expenses, onEdit, onDelete }) {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <>
      <Typography variant="h6" gutterBottom>
        Recent Expenses
      </Typography>
      
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Description</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {expenses.map((expense) => (
              <TableRow key={expense._id} hover>
                <TableCell>
                  {format(new Date(expense.date), 'MMM dd, yyyy')}
                </TableCell>
                <TableCell>{expense.title}</TableCell>
                <TableCell>
                  <Chip
                    label={expense.category}
                    size="small"
                    sx={{
                      backgroundColor: categoryColors[expense.category] || '#607d8b',
                      color: 'white'
                    }}
                  />
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>
                  {formatCurrency(expense.amount)}
                </TableCell>
                <TableCell>{expense.description}</TableCell>
                <TableCell align="right">
                  <IconButton
                    size="small"
                    onClick={() => onEdit(expense)}
                    color="primary"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => onDelete(expense._id)}
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}

export default ExpenseList;