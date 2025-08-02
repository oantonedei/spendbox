import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  useTheme,
  useMediaQuery,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider
} from '@mui/material';
import {
  Add,
  Search,
  Edit,
  Delete,
  FilterList,
  Sort,
  Receipt,
  ShoppingCart,
  Restaurant,
  LocalGasStation,
  Home,
  SportsEsports,
  Work,
  School,
  HealthAndSafety
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const Expenses: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<any>(null);

  // Mock data
  const expenses = [
    {
      id: 1,
      title: 'Grocery Shopping',
      amount: 85.50,
      category: 'Food',
      date: '2024-01-15',
      description: 'Weekly groceries from Walmart',
      icon: <ShoppingCart />,
      color: '#10B981'
    },
    {
      id: 2,
      title: 'Gas Station',
      amount: 45.00,
      category: 'Transport',
      date: '2024-01-14',
      description: 'Fuel for car',
      icon: <LocalGasStation />,
      color: '#6366F1'
    },
    {
      id: 3,
      title: 'Restaurant',
      amount: 67.80,
      category: 'Food',
      date: '2024-01-13',
      description: 'Dinner at Italian restaurant',
      icon: <Restaurant />,
      color: '#10B981'
    },
    {
      id: 4,
      title: 'Netflix Subscription',
      amount: 15.99,
      category: 'Entertainment',
      date: '2024-01-12',
      description: 'Monthly subscription',
      icon: <SportsEsports />,
      color: '#8B5CF6'
    },
    {
      id: 5,
      title: 'Home Utilities',
      amount: 120.00,
      category: 'Home',
      date: '2024-01-11',
      description: 'Electricity and water bills',
      icon: <Home />,
      color: '#6366F1'
    },
    {
      id: 6,
      title: 'Work Supplies',
      amount: 32.50,
      category: 'Work',
      date: '2024-01-10',
      description: 'Office supplies and materials',
      icon: <Work />,
      color: '#F59E0B'
    }
  ];

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'Food', label: 'Food & Dining' },
    { value: 'Transport', label: 'Transportation' },
    { value: 'Entertainment', label: 'Entertainment' },
    { value: 'Home', label: 'Home & Utilities' },
    { value: 'Work', label: 'Work & Business' },
    { value: 'Education', label: 'Education' },
    { value: 'Health', label: 'Health & Fitness' }
  ];

  const sortOptions = [
    { value: 'date', label: 'Date' },
    { value: 'amount', label: 'Amount' },
    { value: 'category', label: 'Category' },
    { value: 'title', label: 'Title' }
  ];

  const filteredExpenses = expenses
    .filter(expense => 
      expense.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filterCategory === 'all' || expense.category === filterCategory)
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'amount':
          return b.amount - a.amount;
        case 'category':
          return a.category.localeCompare(b.category);
        case 'title':
          return a.title.localeCompare(b.title);
        default:
          return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
    });

  const totalAmount = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);

  const handleDeleteClick = (expense: any) => {
    setSelectedExpense(expense);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    // Handle delete logic here
    setDeleteDialogOpen(false);
    setSelectedExpense(null);
  };

  return (
    <Box sx={{ width: '100%' }}>
      {/* Header - Responsive */}
      <Box sx={{ 
        display: 'flex', 
        flexDirection: isMobile ? 'column' : 'row',
        justifyContent: 'space-between', 
        alignItems: isMobile ? 'stretch' : 'center', 
        mb: 3,
        gap: isMobile ? 2 : 0
      }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#1f2937' }}>
          Expenses
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => navigate('/add-expense')}
          sx={{
            background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
            },
            boxShadow: '0 2px 8px rgba(99, 102, 241, 0.3)',
            width: isMobile ? '100%' : 'auto',
          }}
        >
          Add Expense
        </Button>
      </Box>

      {/* Filters and Search - Responsive */}
      <Card sx={{ mb: 3, background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: 2 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                placeholder="Search expenses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search sx={{ color: '#6b7280' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: '#d1d5db',
                    },
                    '&:hover fieldset': {
                      borderColor: '#6366F1',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#6366F1',
                    },
                  },
                }}
              />
            </Grid>
            <Grid item xs={6} md={3}>
              <FormControl fullWidth>
                <InputLabel sx={{ color: '#6b7280' }}>Category</InputLabel>
                <Select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  label="Category"
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
                  {categories.map((category) => (
                    <MenuItem key={category.value} value={category.value}>
                      {category.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6} md={3}>
              <FormControl fullWidth>
                <InputLabel sx={{ color: '#6b7280' }}>Sort By</InputLabel>
                <Select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  label="Sort By"
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
                  {sortOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <Typography variant="body2" color="textSecondary" align={isMobile ? "left" : "right"}>
                Total: <strong style={{ color: '#1f2937' }}>${totalAmount.toFixed(2)}</strong>
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Expenses Display - Responsive */}
      {isMobile ? (
        // Mobile List View
        <Card sx={{ background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: 2 }}>
          <List sx={{ p: 0 }}>
            {filteredExpenses.map((expense, index) => (
              <React.Fragment key={expense.id}>
                <ListItem sx={{ px: 3, py: 2 }}>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: expense.color, width: 48, height: 48 }}>
                      {expense.icon}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="body1" sx={{ fontWeight: 600, color: '#1f2937' }}>
                          {expense.title}
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 700, color: '#1f2937' }}>
                          ${expense.amount.toFixed(2)}
                        </Typography>
                      </Box>
                    }
                    secondary={
                      <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <Chip
                            label={expense.category}
                            size="small"
                            sx={{
                              bgcolor: expense.color,
                              color: 'white',
                              fontWeight: 500,
                              fontSize: '0.75rem',
                            }}
                          />
                          <Typography variant="caption" color="textSecondary">
                            {new Date(expense.date).toLocaleDateString()}
                          </Typography>
                        </Box>
                        <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                          {expense.description}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <IconButton
                            size="small"
                            onClick={() => navigate(`/edit-expense/${expense.id}`)}
                            sx={{
                              color: '#6366F1',
                              '&:hover': {
                                bgcolor: 'rgba(99, 102, 241, 0.1)',
                              },
                            }}
                          >
                            <Edit fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleDeleteClick(expense)}
                            sx={{
                              color: '#EF4444',
                              '&:hover': {
                                bgcolor: 'rgba(239, 68, 68, 0.1)',
                              },
                            }}
                          >
                            <Delete fontSize="small" />
                          </IconButton>
                        </Box>
                      </Box>
                    }
                  />
                </ListItem>
                {index < filteredExpenses.length - 1 && (
                  <Divider sx={{ mx: 3 }} />
                )}
              </React.Fragment>
            ))}
          </List>
        </Card>
      ) : (
        // Desktop Table View
        <Card sx={{ background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: 2 }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f9fafb' }}>
                  <TableCell sx={{ fontWeight: 600, color: '#374151' }}>Expense</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#374151' }}>Category</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#374151' }}>Amount</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#374151' }}>Date</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#374151' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredExpenses.map((expense) => (
                  <TableRow key={expense.id} sx={{ '&:hover': { backgroundColor: '#f9fafb' } }}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar sx={{ bgcolor: expense.color, mr: 2, width: 40, height: 40 }}>
                          {expense.icon}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 500, color: '#1f2937' }}>
                            {expense.title}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            {expense.description}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={expense.category}
                        size="small"
                        sx={{
                          bgcolor: expense.color,
                          color: 'white',
                          fontWeight: 500,
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: '#1f2937' }}>
                        ${expense.amount.toFixed(2)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="textSecondary">
                        {new Date(expense.date).toLocaleDateString()}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton
                          size="small"
                          onClick={() => navigate(`/edit-expense/${expense.id}`)}
                          sx={{
                            color: '#6366F1',
                            '&:hover': {
                              bgcolor: 'rgba(99, 102, 241, 0.1)',
                            },
                          }}
                        >
                          <Edit fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteClick(expense)}
                          sx={{
                            color: '#EF4444',
                            '&:hover': {
                              bgcolor: 'rgba(239, 68, 68, 0.1)',
                            },
                          }}
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle sx={{ color: '#1f2937', fontWeight: 600 }}>
          Delete Expense
        </DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{selectedExpense?.title}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setDeleteDialogOpen(false)}
            sx={{ color: '#6b7280' }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleDeleteConfirm}
            sx={{ 
              color: '#EF4444',
              '&:hover': {
                bgcolor: 'rgba(239, 68, 68, 0.1)',
              },
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Expenses; 