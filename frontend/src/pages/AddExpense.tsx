import React, { useState } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Grid,
  Chip,
  IconButton,
  Alert,
  Divider,
  Card,
  CardContent
} from '@mui/material';
import {
  CameraAlt,
  Mic,
  Save,
  ArrowBack,
  Receipt,
  Restaurant,
  DirectionsCar,
  ShoppingCart,
  Home,
  LocalHospital,
  School,
  SportsEsports
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const AddExpense: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: '',
    date: new Date().toISOString().split('T')[0],
    notes: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  const categories = [
    { value: 'food', label: 'Food & Dining', icon: <Restaurant /> },
    { value: 'transport', label: 'Transportation', icon: <DirectionsCar /> },
    { value: 'shopping', label: 'Shopping', icon: <ShoppingCart /> },
    { value: 'entertainment', label: 'Entertainment', icon: <SportsEsports /> },
    { value: 'bills', label: 'Bills & Utilities', icon: <Home /> },
    { value: 'health', label: 'Healthcare', icon: <LocalHospital /> },
    { value: 'education', label: 'Education', icon: <School /> },
    { value: 'other', label: 'Other', icon: <Receipt /> }
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleCategoryChange = (e: SelectChangeEvent) => {
    setFormData({
      ...formData,
      category: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.description || !formData.amount || !formData.category) {
      setError('Please fill in all required fields');
      return;
    }

    if (isNaN(Number(formData.amount)) || Number(formData.amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    setLoading(true);

    try {
      // TODO: Implement API call to save expense
      console.log('Saving expense:', formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      navigate('/expenses');
    } catch (err) {
      setError('Failed to save expense. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCameraCapture = () => {
    // TODO: Implement camera capture and OCR
    console.log('Camera capture clicked');
  };

  const handleVoiceInput = () => {
    if (!isRecording) {
      setIsRecording(true);
      // TODO: Implement voice recording and speech-to-text
      console.log('Starting voice recording...');
      
      // Simulate voice recording
      setTimeout(() => {
        setIsRecording(false);
        setFormData({
          ...formData,
          description: 'Voice input: Grocery shopping at Walmart'
        });
      }, 3000);
    } else {
      setIsRecording(false);
      console.log('Stopping voice recording...');
    }
  };

  const getCategoryIcon = (categoryValue: string) => {
    const category = categories.find(cat => cat.value === categoryValue);
    return category ? category.icon : <Receipt />;
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton onClick={() => navigate('/expenses')} sx={{ mr: 2 }}>
          <ArrowBack />
        </IconButton>
        <Typography variant="h4">
          Add Expense
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Main Form */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    name="description"
                    label="Description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="e.g., Grocery shopping at Walmart"
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    name="amount"
                    label="Amount"
                    type="number"
                    value={formData.amount}
                    onChange={handleChange}
                    placeholder="0.00"
                    inputProps={{ min: "0", step: "0.01" }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    name="date"
                    label="Date"
                    type="date"
                    value={formData.date}
                    onChange={handleChange}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <FormControl fullWidth required>
                    <InputLabel>Category</InputLabel>
                    <Select
                      value={formData.category}
                      label="Category"
                      onChange={handleCategoryChange}
                    >
                      {categories.map((category) => (
                        <MenuItem key={category.value} value={category.value}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            {category.icon}
                            <Typography sx={{ ml: 1 }}>
                              {category.label}
                            </Typography>
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    name="notes"
                    label="Notes (Optional)"
                    multiline
                    rows={3}
                    value={formData.notes}
                    onChange={handleChange}
                    placeholder="Add any additional notes..."
                  />
                </Grid>

                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                    <Button
                      variant="outlined"
                      onClick={() => navigate('/expenses')}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      startIcon={<Save />}
                      disabled={loading}
                    >
                      {loading ? 'Saving...' : 'Save Expense'}
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </Grid>

        {/* Quick Input Methods */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Quick Input
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Button
                variant="outlined"
                startIcon={<CameraAlt />}
                onClick={handleCameraCapture}
                fullWidth
              >
                Take Photo
              </Button>
              
              <Button
                variant="outlined"
                startIcon={<Mic />}
                onClick={handleVoiceInput}
                fullWidth
                color={isRecording ? 'error' : 'primary'}
              >
                {isRecording ? 'Recording...' : 'Voice Input'}
              </Button>
            </Box>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h6" gutterBottom>
              Quick Categories
            </Typography>
            
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {categories.slice(0, 6).map((category) => (
                <Chip
                  key={category.value}
                  icon={category.icon}
                  label={category.label}
                  onClick={() => setFormData({ ...formData, category: category.value })}
                  color={formData.category === category.value ? 'primary' : 'default'}
                  variant={formData.category === category.value ? 'filled' : 'outlined'}
                  sx={{ mb: 1 }}
                />
              ))}
            </Box>
          </Paper>

          {/* Selected Category Preview */}
          {formData.category && (
            <Card sx={{ mt: 2 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Selected Category
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  {getCategoryIcon(formData.category)}
                  <Typography sx={{ ml: 1 }}>
                    {categories.find(cat => cat.value === formData.category)?.label}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default AddExpense; 