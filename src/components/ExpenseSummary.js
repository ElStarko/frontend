import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  LinearProgress
} from '@mui/material';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const API_URL = 'http://localhost:5000/api';

function ExpenseSummary() {
  const [summary, setSummary] = useState({
    byCategory: [],
    total: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSummary();
  }, []);

  const fetchSummary = async () => {
    try {
      const response = await axios.get(`${API_URL}/expenses/summary`);
      setSummary(response.data);
    } catch (error) {
      console.error('Error fetching summary:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const chartData = {
    labels: summary.byCategory.map(item => item._id),
    datasets: [
      {
        data: summary.byCategory.map(item => item.total),
        backgroundColor: [
          '#ff9800',
          '#2196f3',
          '#e91e63',
          '#9c27b0',
          '#f44336',
          '#4caf50',
          '#009688',
          '#607d8b'
        ],
        borderWidth: 1
      }
    ]
  };

  if (loading) return <LinearProgress />;

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Expense Summary
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h5" gutterBottom align="center">
                Total Spent
              </Typography>
              <Typography variant="h3" align="center" color="primary">
                {formatCurrency(summary.total)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Box sx={{ height: 300 }}>
            <Pie data={chartData} options={{ maintainAspectRatio: false }} />
          </Box>
        </Grid>
        
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            By Category
          </Typography>
          <Grid container spacing={2}>
            {summary.byCategory.map((item) => (
              <Grid item xs={12} sm={6} md={3} key={item._id}>
                <Card>
                  <CardContent>
                    <Typography variant="subtitle2" color="textSecondary">
                      {item._id}
                    </Typography>
                    <Typography variant="h6">
                      {formatCurrency(item.total)}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      {((item.total / summary.total) * 100 || 0).toFixed(1)}% of total
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}

export default ExpenseSummary;