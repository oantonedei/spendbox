import React from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  LinearProgress,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
  Button,
  useTheme
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  AccountBalance,
  ShoppingCart,
  Restaurant,
  LocalGasStation,
  Home,
  SportsEsports
} from '@mui/icons-material';

const Dashboard: React.FC = () => {
  const theme = useTheme();

  // Mock data
  const stats = [
    {
      title: 'Total Spent',
      amount: '$2,847.50',
      change: '+12.5%',
      trend: 'up',
      color: '#6366F1',
      icon: <AccountBalance />
    },
    {
      title: 'Monthly Budget',
      amount: '$3,000.00',
      change: '83% used',
      trend: 'neutral',
      color: '#8B5CF6',
      icon: <TrendingUp />
    },
    {
      title: 'Savings',
      amount: '$1,152.50',
      change: '+8.2%',
      trend: 'up',
      color: '#10B981',
      icon: <TrendingUp />
    },
    {
      title: 'This Week',
      amount: '$423.80',
      change: '-5.3%',
      trend: 'down',
      color: '#EF4444',
      icon: <TrendingDown />
    }
  ];

  const recentExpenses = [
    { id: 1, title: 'Grocery Shopping', amount: 85.50, category: 'Food', date: '2 hours ago', icon: <ShoppingCart />, color: '#10B981' },
    { id: 2, title: 'Gas Station', amount: 45.00, category: 'Transport', date: '5 hours ago', icon: <LocalGasStation />, color: '#6366F1' },
    { id: 3, title: 'Restaurant', amount: 67.80, category: 'Food', date: '1 day ago', icon: <Restaurant />, color: '#10B981' },
    { id: 4, title: 'Netflix Subscription', amount: 15.99, category: 'Entertainment', date: '2 days ago', icon: <SportsEsports />, color: '#8B5CF6' },
    { id: 5, title: 'Home Utilities', amount: 120.00, category: 'Home', date: '3 days ago', icon: <Home />, color: '#6366F1' }
  ];

  const budgetProgress = [
    { category: 'Food & Dining', spent: 450, budget: 600, color: '#10B981' },
    { category: 'Transportation', spent: 280, budget: 400, color: '#6366F1' },
    { category: 'Entertainment', spent: 180, budget: 300, color: '#8B5CF6' },
    { category: 'Shopping', spent: 320, budget: 500, color: '#F59E0B' }
  ];

  return (
    <Box sx={{ width: '100%' }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography 
          variant="h4" 
          gutterBottom
          sx={{ 
            fontWeight: 700,
            background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Dashboard
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Welcome back! Here's your financial overview.
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card 
              sx={{ 
                height: '100%',
                background: '#ffffff',
                border: '1px solid #e5e7eb',
                borderRadius: 2,
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                '&:hover': {
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  transform: 'translateY(-2px)',
                },
                transition: 'all 0.2s ease-in-out',
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar 
                    sx={{ 
                      bgcolor: stat.color,
                      mr: 2,
                      width: 48,
                      height: 48
                    }}
                  >
                    {stat.icon}
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" color="textSecondary">
                      {stat.title}
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: '#1f2937' }}>
                      {stat.amount}
                    </Typography>
                  </Box>
                </Box>
                <Chip
                  label={stat.change}
                  size="small"
                  sx={{
                    bgcolor: stat.trend === 'up' ? '#10B981' : stat.trend === 'down' ? '#EF4444' : '#6366F1',
                    color: 'white',
                    fontWeight: 600,
                    fontSize: '0.75rem'
                  }}
                />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        {/* Budget Progress */}
        <Grid item xs={12} md={6}>
          <Card 
            sx={{ 
              height: '100%',
              background: '#ffffff',
              border: '1px solid #e5e7eb',
              borderRadius: 2,
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            }}
          >
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: '#1f2937' }}>
                Budget Progress
              </Typography>
              <Box sx={{ mt: 2 }}>
                {budgetProgress.map((item, index) => (
                  <Box key={index} sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 500, color: '#374151' }}>
                        {item.category}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        ${item.spent} / ${item.budget}
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={(item.spent / item.budget) * 100}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        bgcolor: '#f3f4f6',
                        '& .MuiLinearProgress-bar': {
                          bgcolor: item.color,
                          borderRadius: 4,
                        }
                      }}
                    />
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Expenses */}
        <Grid item xs={12} md={6}>
          <Card 
            sx={{ 
              height: '100%',
              background: '#ffffff',
              border: '1px solid #e5e7eb',
              borderRadius: 2,
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#1f2937' }}>
                  Recent Expenses
                </Typography>
                <Button 
                  size="small" 
                  sx={{ 
                    color: '#6366F1',
                    '&:hover': {
                      bgcolor: 'rgba(99, 102, 241, 0.1)',
                    }
                  }}
                >
                  View All
                </Button>
              </Box>
              <List sx={{ p: 0 }}>
                {recentExpenses.map((expense, index) => (
                  <React.Fragment key={expense.id}>
                    <ListItem sx={{ px: 0, py: 1 }}>
                      <ListItemAvatar>
                        <Avatar 
                          sx={{ 
                            bgcolor: expense.color,
                            width: 40,
                            height: 40
                          }}
                        >
                          {expense.icon}
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
                        -${expense.amount}
                      </Typography>
                    </ListItem>
                    {index < recentExpenses.length - 1 && (
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

export default Dashboard; 