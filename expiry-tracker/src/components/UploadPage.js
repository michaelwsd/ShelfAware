import React from 'react';
import { 
  Box, 
  Typography, 
  Button
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FileUpload from './FileUpload';
import { Link } from 'react-router-dom';

const UploadPage = () => {
  return (
    <Box sx={{ width: '100%', p: 2 }}>
      {/* Page Header */}
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center' }}>
        <Button 
          component={Link} 
          to="/"
          startIcon={<ArrowBackIcon />}
          sx={{ 
            color: 'text.secondary',
            mr: 2,
            '&:hover': { color: 'primary.main' }
          }}
        >
          Back to Dashboard
        </Button>
        <Typography 
          variant="h4" 
          component="h1" 
          sx={{ 
            fontWeight: 600,
            color: 'text.primary'
          }}
        >
          Upload Receipt
        </Typography>
      </Box>
      
      {/*using existing FileUpload component */}
      <FileUpload />
    </Box>
  );
};

export default UploadPage;