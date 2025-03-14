import React, { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  Alert,
  Paper,
  useTheme
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const theme = useTheme();

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      
      // Create a preview for images
      if (selectedFile.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = () => {
          setPreview(reader.result);
        };
        reader.readAsDataURL(selectedFile);
      } else {
        setPreview(null);
      }
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage({ type: 'error', text: 'Please select a file first!' });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // This is where you would call the OCR service and process the receipt
      console.log('Processing file:', file.name);
      
      setMessage({ 
        type: 'success', 
        text: 'Receipt uploaded successfully! rest TBC' 
      });
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: 'Error uploading receipt: ' + (error.message || 'Unknown error') 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      setFile(droppedFile);
      
      if (droppedFile.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = () => {
          setPreview(reader.result);
        };
        reader.readAsDataURL(droppedFile);
      } else {
        setPreview(null);
      }
    }
  };

  return (
    <Box sx={{ width: '100%', mb: 4 }}>
      <Box
        component="label"
        htmlFor="receipt-upload"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          border: '2px dashed',
          borderColor: 'divider',
          borderRadius: 2,
          p: 3,
          mb: 2,
          minHeight: '200px',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
          '&:hover': {
            borderColor: 'primary.main',
            bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)',
          }
        }}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {preview ? (
          <Box 
            sx={{ 
              width: '100%', 
              display: 'flex', 
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'column' 
            }}
          >
            <Box 
              component="img"
              src={preview}
              alt="Receipt preview"
              sx={{
                maxWidth: '100%',
                maxHeight: '300px',
                objectFit: 'contain',
                borderRadius: 1,
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}
            />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              Click to change image
            </Typography>
          </Box>
        ) : (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              p: 2
            }}
          >
            <CloudUploadIcon 
              color="primary" 
              sx={{ 
                fontSize: 64, 
                mb: 2, 
                opacity: 0.7 
              }} 
            />
            <Typography variant="h6" align="center" gutterBottom>
              Drag and drop your receipt
            </Typography>
            <Typography variant="body2" color="text.secondary" align="center">
              or click to select a file
            </Typography>
          </Box>
        )}
        <input
          id="receipt-upload"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
      </Box>

      {file && (
        <Paper 
          variant="outlined" 
          sx={{ 
            p: 1, 
            mb: 2, 
            display: 'flex', 
            alignItems: 'center',
            borderColor: 'divider'
          }}
        >
          <Typography variant="body2" sx={{ ml: 1 }}>
            Selected: <strong>{file.name}</strong>
          </Typography>
        </Paper>
      )}
      
      <Button 
        variant="contained" 
        color="primary" 
        fullWidth 
        size="large"
        disabled={loading || !file}
        onClick={handleUpload}
        startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
        sx={{ 
          py: 1.5,
          fontSize: '1rem' 
        }}
      >
        {loading ? 'Processing...' : 'Upload Receipt'}
      </Button>
      
      {message.text && (
        <Alert 
          severity={message.type} 
          sx={{ mt: 2, borderRadius: 1 }}
        >
          {message.text}
        </Alert>
      )}
    </Box>
  );
};

export default FileUpload;