import React from 'react';
import { Box, Button, Typography, Paper } from '@mui/material';
import { ErrorBoundary } from 'react-error-boundary';

interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

const ErrorFallback: React.FC<ErrorFallbackProps> = ({ error, resetErrorBoundary }) => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      p={3}
    >
      <Paper elevation={3} sx={{ p: 4, maxWidth: 500, textAlign: 'center' }}>
        <Typography variant="h4" color="error" gutterBottom>
          Oops! Something went wrong
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          We're sorry, but something unexpected happened. Please try again.
        </Typography>
        
        <Box display="flex" gap={2} justifyContent="center" mt={3}>
          <Button
            variant="contained"
            onClick={resetErrorBoundary}
            color="primary"
          >
            Try Again
          </Button>
          <Button
            variant="outlined"
            onClick={() => window.location.reload()}
          >
            Refresh Page
          </Button>
        </Box>
        
        {process.env.NODE_ENV === 'development' && (
          <Box mt={3} textAlign="left">
            <Typography variant="caption" color="text.secondary">
              Error details (development only):
            </Typography>
            <pre style={{ 
              fontSize: '12px', 
              color: 'red', 
              overflow: 'auto',
              maxHeight: '200px',
              backgroundColor: '#f5f5f5',
              padding: '8px',
              borderRadius: '4px'
            }}>
              {error.message}
              {error.stack}
            </pre>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default ErrorFallback; 