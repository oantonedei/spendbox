import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  LinearProgress,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
  useTheme
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  PieChart,
  BarChart,
  ShowChart,
  AccountBalance,
  ShoppingCart,
  Restaurant,
  LocalGasStation,
  Home,
  SportsEsports,
  Work,
  School,
  HealthAndSafety
} from '@mui/icons-material';

const Analytics: React.FC = () => {
  const theme = useTheme();
  const [timeRange, setTimeRange] = useState('month');

  // Mock data
  const spendingByCategory = [
    { category: 'Food & Dining', amount: 450, percentage: 35, icon: <Restaurant />, color: '#10B981' },
    { category: 'Transportation', amount: 280, percentage: 22, icon: <LocalGasStation />, color: '#6366F1' },
    { category: 'Entertainment', amount: 180, percentage: 14, icon: <SportsEsports />, color: '#8B5CF6' },
    { category: 'Shopping', amount: 200, percentage: 15, icon: <ShoppingCart />, color: '#F59E0B' },
    { category: 'Home & Utilities', amount: 120, percentage: 9, icon: <Home />, color: '#6366F1' },
    { category: 'Work & Business', amount: 80, percentage: 6, icon: <Work />, color: '#EF4444' }
  ];

  const monthlyTrends = [
    { month: 'Jan', amount: 1200, trend: 'up' },
    { month: 'Feb', amount: 1350, trend: 'up' },
    { month: 'Mar', amount: 1100, trend: 'down' },
    { month: 'Apr', amount: 1400, trend: 'up' },
    { month: 'May', amount: 1300, trend: 'down' },
    { month: 'Jun', amount: 1500, trend: 'up' }
  ];

  const insights = [
    {
      title: 'Spending Increased',
      description: 'Your spending increased by 12% compared to last month',
      type: 'warning',
      icon: <TrendingUp />,
      color: '#F59E0B'
    },
    {
      title: 'Budget Alert',
      description: 'You\'ve used 85% of your monthly budget',
      type: 'info',
      icon: <AccountBalance />,
      color: '#6366F1'
    },
    {
      title: 'Savings Goal',
      description: 'You\'re on track to meet your savings goal this month',
      type: 'success',
      icon: <TrendingUp />,
      color: '#10B981'
    }
  ];

  const topExpenses = [
    { title: 'Grocery Shopping', amount: 85.50, category: 'Food', date: '2 days ago' },
    { title: 'Gas Station', amount: 45.00, category: 'Transport', date: '3 days ago' },
    { title: 'Restaurant', amount: 67.80, category: 'Food', date: '4 days ago' },
    { title: 'Netflix Subscription', amount: 15.99, category: 'Entertainment', date: '5 days ago' },
    { title: 'Home Utilities', amount: 120.00, category: 'Home', date: '1 week ago' }
  ];

  const totalSpent = spendingByCategory.reduce((sum, item) => sum + item.amount, 0);
  const averageDaily = totalSpent / 30;
  const projectedMonthly = averageDaily * 30;

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#1f2937' }}>
          Analytics & Insights
        </Typography>
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel sx={{ color: '#6b7280' }}>Time Range</InputLabel>
          <Select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            label="Time Range"
            sx={{
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#d1d5db',
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: '#6366F1',
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: '#6366F1',
              },
            }}
          >
            <MenuItem value="week">This Week</MenuItem>
            <MenuItem value="month">This Month</MenuItem>
            <MenuItem value="quarter">This Quarter</MenuItem>
            <MenuItem value="year">This Year</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: '#ffffff', 
            border: '1px solid #e5e7eb', 
            borderRadius: 2,
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: '#6366F1', mr: 2, width: 48, height: 48 }}>
                  <AccountBalance />
                </Avatar>
                <Box>
                  <Typography variant="body2" color="textSecondary">
                    Total Spent
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: '#1f2937' }}>
                    ${totalSpent.toFixed(0)}
                  </Typography>
                </Box>
              </Box>
              <Chip
                label="+12.5% vs last month"
                size="small"
                sx={{
                  bgcolor: '#10B981',
                  color: 'white',
                  fontWeight: 600,
                  fontSize: '0.75rem'
                }}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: '#ffffff', 
            border: '1px solid #e5e7eb', 
            borderRadius: 2,
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: '#8B5CF6', mr: 2, width: 48, height: 48 }}>
                  <ShowChart />
                </Avatar>
                <Box>
                  <Typography variant="body2" color="textSecondary">
                    Daily Average
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: '#1f2937' }}>
                    ${averageDaily.toFixed(0)}
                  </Typography>
                </Box>
              </Box>
              <Chip
                label="On track"
                size="small"
                sx={{
                  bgcolor: '#10B981',
                  color: 'white',
                  fontWeight: 600,
                  fontSize: '0.75rem'
                }}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: '#ffffff', 
            border: '1px solid #e5e7eb', 
            borderRadius: 2,
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: '#10B981', mr: 2, width: 48, height: 48 }}>
                  <TrendingUp />
                </Avatar>
                <Box>
                  <Typography variant="body2" color="textSecondary">
                    Projected Monthly
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: '#1f2937' }}>
                    ${projectedMonthly.toFixed(0)}
                  </Typography>
                </Box>
              </Box>
              <Chip
                label="Within budget"
                size="small"
                sx={{
                  bgcolor: '#10B981',
                  color: 'white',
                  fontWeight: 600,
                  fontSize: '0.75rem'
                }}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: '#ffffff', 
            border: '1px solid #e5e7eb', 
            borderRadius: 2,
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: '#F59E0B', mr: 2, width: 48, height: 48 }}>
                  <PieChart />
                </Avatar>
                <Box>
                  <Typography variant="body2" color="textSecondary">
                    Categories
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: '#1f2937' }}>
                    {spendingByCategory.length}
                  </Typography>
                </Box>
              </Box>
              <Chip
                label="Active"
                size="small"
                sx={{
                  bgcolor: '#6366F1',
                  color: 'white',
                  fontWeight: 600,
                  fontSize: '0.75rem'
                }}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Spending by Category */}
        <Grid item xs={12} md={6}>
          <Card sx={{ 
            height: '100%',
            background: '#ffffff', 
            border: '1px solid #e5e7eb', 
            borderRadius: 2,
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: '#1f2937' }}>
                Spending by Category
              </Typography>
              <Box sx={{ mt: 2 }}>
                {spendingByCategory.map((item, index) => (
                  <Box key={index} sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Avatar sx={{ bgcolor: item.color, mr: 2, width: 32, height: 32 }}>
                        {item.icon}
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="body2" sx={{ fontWeight: 500, color: '#374151' }}>
                          {item.category}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          ${item.amount} ({item.percentage}%)
                        </Typography>
                      </Box>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={item.percentage}
                      sx={{
                        height: 6,
                        borderRadius: 3,
                        bgcolor: '#f3f4f6',
                        '& .MuiLinearProgress-bar': {
                          bgcolor: item.color,
                          borderRadius: 3,
                        }
                      }}
                    />
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Insights */}
        <Grid item xs={12} md={6}>
          <Card sx={{ 
            height: '100%',
            background: '#ffffff', 
            border: '1px solid #e5e7eb', 
            borderRadius: 2,
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: '#1f2937' }}>
                Insights & Recommendations
              </Typography>
              <List sx={{ p: 0 }}>
                {insights.map((insight, index) => (
                  <React.Fragment key={index}>
                    <ListItem sx={{ px: 0, py: 1 }}>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: insight.color, width: 40, height: 40 }}>
                          {insight.icon}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Typography variant="body2" sx={{ fontWeight: 500, color: '#1f2937' }}>
                            {insight.title}
                          </Typography>
                        }
                        secondary={
                          <Typography variant="caption" color="textSecondary">
                            {insight.description}
                          </Typography>
                        }
                      />
                    </ListItem>
                    {index < insights.length - 1 && (
                      <Divider sx={{ my: 1 }} />
                    )}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Top Expenses */}
        <Grid item xs={12}>
          <Card sx={{ 
            background: '#ffffff', 
            border: '1px solid #e5e7eb', 
            borderRadius: 2,
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: '#1f2937' }}>
                Top Expenses This Month
              </Typography>
              <List sx={{ p: 0 }}>
                {topExpenses.map((expense, index) => (
                  <React.Fragment key={index}>
                    <ListItem sx={{ px: 0, py: 1 }}>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: '#6366F1', width: 40, height: 40 }}>
                          <ShoppingCart />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Typography variant="body2" sx={{ fontWeight: 500, color: '#1f2937' }}>
                            {expense.title}
                          </Typography>
                        }
                        secondary={
                          <Typography variant="caption" color="textSecondary">
                            {expense.category} • {expense.date}
                          </Typography>
                        }
                      />
                      <Typography variant="body2" sx={{ fontWeight: 600, color: '#1f2937' }}>
                        ${expense.amount}
                      </Typography>
                    </ListItem>
                    {index < topExpenses.length - 1 && (
                      <Divider sx={{ my: 1 }} />
                    )}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Analytics; 