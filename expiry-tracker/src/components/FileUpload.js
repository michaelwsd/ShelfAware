import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  Alert,
  Paper,
  Fade,
  Zoom,
  IconButton,
  Divider
} from '@mui/material';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloseIcon from '@mui/icons-material/Close';
import { keyframes } from '@emotion/react';

// Custom animations
const pulseAnimation = keyframes`
  0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(117, 93, 255, 0.4); }
  70% { transform: scale(1.03); box-shadow: 0 0 0 10px rgba(117, 93, 255, 0); }
  100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(117, 93, 255, 0); }
`;

const scanLine = keyframes`
  0% { top: 0%; }
  100% { top: 100%; }
`;

const glowEffect = keyframes`
  0% { box-shadow: 0 0 5px rgba(117, 93, 255, 0.4); }
  50% { box-shadow: 0 0 20px rgba(117, 93, 255, 0.7); }
  100% { box-shadow: 0 0 5px rgba(117, 93, 255, 0.4); }
`;

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [dragActive, setDragActive] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);

  // Colors
  const darkBg = '#1e2233';
  const cardBg = '#0f1424';
  const primaryPurple = '#755dff';
  const secondaryGreen = '#4aeabc';
  const accentOrange = '#ff9757';
  const textPrimary = '#ffffff';
  const textSecondary = 'rgba(255, 255, 255, 0.6)';

  // Reset success state after 5 seconds
  useEffect(() => {
    let timer;
    if (uploadComplete) {
      timer = setTimeout(() => setUploadComplete(false), 5000);
    }
    return () => clearTimeout(timer);
  }, [uploadComplete]);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setUploadComplete(false);
      setMessage({ type: '', text: '' });
      
      // Create a preview for images
      if (selectedFile.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = () => {
          setPreview(reader.result);
        };
        reader.readAsDataURL(selectedFile);
      } else {
        setPreview(null);
        setMessage({ type: 'error', text: 'Please select an image file.' });
      }
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage({ type: 'error', text: 'Please select a receipt image first!' });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 2200));
      
      // This is where you would call the OCR service and process the receipt
      console.log('Processing file:', file.name);
      
      setMessage({ 
        type: 'success', 
        text: 'Receipt processed! 6 items identified with expiry dates.' 
      });
      setUploadComplete(true);
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: 'Error processing receipt: ' + (error.message || 'Unknown error') 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      setFile(droppedFile);
      setUploadComplete(false);
      setMessage({ type: '', text: '' });
      
      if (droppedFile.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = () => {
          setPreview(reader.result);
        };
        reader.readAsDataURL(droppedFile);
      } else {
        setPreview(null);
        setMessage({ type: 'error', text: 'Please upload an image file.' });
      }
    }
  };

  const clearFile = (e) => {
    e.stopPropagation();
    setFile(null);
    setPreview(null);
    setMessage({ type: '', text: '' });
  };

  return (
    <Box 
      sx={{ 
        width: '100%', 
        maxWidth: '600px',
        mx: 'auto', 
        p: 2, 
        bgcolor: darkBg,
        borderRadius: 4,
        boxShadow: '0 10px 30px rgba(0,0,0,0.25)'
      }}
    >
      {/* Header - with fixed spacing and alignment */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 3,
        px: 1 // Add some horizontal padding
      }}>
        <Typography 
          variant="h5" 
          component="h2"
          sx={{ 
            color: textPrimary, 
            fontWeight: 500,
            fontSize: '1.3rem'
          }}
        >
          Scan Receipt
        </Typography>
        
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1,
            bgcolor: 'rgba(255,255,255,0.05)',
            borderRadius: 2,
            px: 1.5,
            py: 0.7 // Increase vertical padding slightly
          }}
        >
          <Box 
            sx={{ 
              width: 8, 
              height: 8, 
              borderRadius: '50%', 
              bgcolor: secondaryGreen 
            }}
          />
          <Typography 
            variant="body2" 
            sx={{ 
              color: textSecondary,
              fontSize: '0.75rem',
              fontWeight: 500 // Add some weight to make it more legible
            }}
          >
            Ready to scan
          </Typography>
        </Box>
      </Box>
      
      {/* Main upload area */}
      <Paper
        elevation={0}
        component="label"
        htmlFor="receipt-upload"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 3,
          p: 3,
          mb: 2,
          minHeight: '220px',
          cursor: 'pointer',
          position: 'relative',
          overflow: 'hidden',
          bgcolor: cardBg,
          border: `1px solid ${dragActive ? primaryPurple : 'rgba(255,255,255,0.1)'}`,
          transition: 'all 0.3s ease',
          ...(dragActive && {
            animation: `${glowEffect} 1.5s infinite`
          })
        }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {/* Loading scan line effect */}
        {loading && (
          <Box 
            sx={{
              position: 'absolute',
              height: '2px',
              width: '100%',
              background: `linear-gradient(90deg, ${cardBg}, ${primaryPurple}, ${cardBg})`,
              backgroundSize: '200% 100%',
              animation: `${scanLine} 1.5s infinite ease-in-out`,
              zIndex: 2
            }}
          />
        )}
        
        {preview ? (
          <Fade in={true}>
            <Box 
              sx={{ 
                width: '100%', 
                display: 'flex', 
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
                position: 'relative',
              }}
            >
              {/* Close button to clear selection */}
              <IconButton
                size="small"
                onClick={clearFile}
                sx={{
                  position: 'absolute',
                  top: -12,
                  right: -12,
                  backgroundColor: 'rgba(0,0,0,0.5)',
                  color: 'white',
                  zIndex: 3,
                  '&:hover': {
                    backgroundColor: 'rgba(0,0,0,0.7)',
                  }
                }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
              
              {/* Receipt preview */}
              <Box 
                component="img"
                src={preview}
                alt="Receipt preview"
                sx={{
                  maxWidth: '100%',
                  maxHeight: '200px',
                  objectFit: 'contain',
                  borderRadius: 2,
                  filter: loading 
                    ? 'brightness(0.7) contrast(1.1)' 
                    : 'brightness(0.85)',
                  transition: 'all 0.3s ease',
                }}
              />
              
              {/* Success overlay */}
              {uploadComplete && (
                <Zoom in={uploadComplete}>
                  <Box 
                    sx={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      bgcolor: 'rgba(0,0,0,0.7)',
                      borderRadius: '50%',
                      p: 1.5,
                      animation: `${pulseAnimation} 2s infinite`,
                    }}
                  >
                    <CheckCircleIcon 
                      sx={{ 
                        fontSize: 50,
                        color: secondaryGreen
                      }}
                    />
                  </Box>
                </Zoom>
              )}
            </Box>
          </Fade>
        ) : (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              p: 2,
            }}
          >
            <Box 
              sx={{ 
                p: 2.5, 
                borderRadius: '50%', 
                bgcolor: 'rgba(117,93,255,0.1)',
                mb: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <ReceiptLongIcon 
                sx={{ 
                  fontSize: 40, 
                  color: primaryPurple
                }} 
              />
            </Box>
            
            <Typography 
              variant="body1" 
              align="center" 
              sx={{ 
                color: textPrimary,
                fontWeight: 500,
                mb: 1
              }}
            >
              {dragActive ? 'Drop to Upload' : 'Upload Receipt'}
            </Typography>
            
            <Typography 
              variant="body2" 
              align="center"
              sx={{ 
                color: textSecondary,
                fontSize: '0.75rem',
                maxWidth: '80%'
              }}
            >
              Drag & drop or click to browse
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
      </Paper>
      
      {/* Mobile upload options */}
      <Box
        sx={{
          display: 'flex',
          gap: 1.5,
          mb: 3
        }}
      >
        <Button
          variant="outlined"
          fullWidth
          startIcon={<PhotoCameraIcon />}
          onClick={() => document.getElementById('receipt-upload').click()}
          sx={{
            borderColor: 'rgba(255,255,255,0.1)',
            color: textPrimary,
            textTransform: 'none',
            borderRadius: 2,
            py: 1
          }}
        >
          Take Photo
        </Button>
        
        <Button
          variant="contained"
          color="primary"
          fullWidth
          disabled={loading || !file}
          onClick={handleUpload}
          sx={{
            bgcolor: primaryPurple,
            color: textPrimary,
            textTransform: 'none',
            borderRadius: 2,
            py: 1,
            '&:hover': {
              bgcolor: '#8672ff'
            },
            '&:disabled': {
              bgcolor: 'rgba(117,93,255,0.2)',
              color: 'rgba(255,255,255,0.3)'
            }
          }}
        >
          {loading ? (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <CircularProgress size={16} sx={{ color: 'white', mr: 1 }} />
              Scanning...
            </Box>
          ) : uploadComplete ? (
            'View Results'
          ) : (
            'Process Receipt'
          )}
        </Button>
      </Box>
      
      {/* Status card */}
      <Box
        sx={{
          bgcolor: cardBg,
          borderRadius: 3,
          p: 2,
          mb: 2
        }}
      >
        <Typography 
          variant="body2"
          sx={{ 
            color: textSecondary,
            fontSize: '0.75rem',
            mb: 1
          }}
        >
          STATUS
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box 
            sx={{ 
              width: 8, 
              height: 8, 
              borderRadius: '50%', 
              bgcolor: loading 
                ? primaryPurple 
                : uploadComplete 
                  ? secondaryGreen 
                  : file 
                    ? accentOrange 
                    : 'rgba(255,255,255,0.3)',
              mr: 1.5
            }}
          />
          <Typography 
            variant="body1"
            sx={{ 
              color: textPrimary,
              fontWeight: 500
            }}
          >
            {loading 
              ? 'Processing Receipt...' 
              : uploadComplete 
                ? 'Ready to Track' 
                : file 
                  ? 'Ready to Process' 
                  : 'Waiting for Receipt'}
          </Typography>
        </Box>
      </Box>
      
      {/* Message alert */}
      {message.text && (
        <Fade in={!!message.text}>
          <Alert 
            severity={message.type} 
            icon={false}
            sx={{ 
              mb: 2, 
              borderRadius: 2,
              bgcolor: message.type === 'success' 
                ? 'rgba(74, 234, 188, 0.1)' 
                : 'rgba(255, 86, 86, 0.1)',
              color: message.type === 'success' 
                ? secondaryGreen 
                : '#ff5656',
              border: '1px solid',
              borderColor: message.type === 'success' 
                ? 'rgba(74, 234, 188, 0.2)' 
                : 'rgba(255, 86, 86, 0.2)',
            }}
          >
            {message.text}
          </Alert>
        </Fade>
      )}
      
      {/* Feature hints */}
      <Divider sx={{ bgcolor: 'rgba(255,255,255,0.1)', my: 2 }} />
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', px: 1 }}>
        <Box 
          sx={{ 
            textAlign: 'center',
            opacity: 0.7,
            transition: 'opacity 0.2s',
            '&:hover': { opacity: 1 }
          }}
        >
          <Box 
            sx={{ 
              mb: 0.5, 
              width: 36, 
              height: 36, 
              borderRadius: '50%',
              bgcolor: 'rgba(255,255,255,0.05)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto'
            }}
          >
            <Typography sx={{ color: primaryPurple, fontWeight: 'bold' }}>1</Typography>
          </Box>
          <Typography 
            variant="caption" 
            sx={{ 
              color: textSecondary,
              fontSize: '0.7rem'
            }}
          >
            Upload
          </Typography>
        </Box>
        
        <Box 
          sx={{ 
            textAlign: 'center',
            opacity: file ? 0.7 : 0.4,
            transition: 'opacity 0.2s',
            '&:hover': { opacity: file ? 1 : 0.4 }
          }}
        >
          <Box 
            sx={{ 
              mb: 0.5, 
              width: 36, 
              height: 36, 
              borderRadius: '50%',
              bgcolor: 'rgba(255,255,255,0.05)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto'
            }}
          >
            <Typography sx={{ color: primaryPurple, fontWeight: 'bold' }}>2</Typography>
          </Box>
          <Typography 
            variant="caption" 
            sx={{ 
              color: textSecondary,
              fontSize: '0.7rem'
            }}
          >
            Process
          </Typography>
        </Box>
        
        <Box 
          sx={{ 
            textAlign: 'center',
            opacity: uploadComplete ? 0.7 : 0.4,
            transition: 'opacity 0.2s',
            '&:hover': { opacity: uploadComplete ? 1 : 0.4 }
          }}
        >
          <Box 
            sx={{ 
              mb: 0.5, 
              width: 36, 
              height: 36, 
              borderRadius: '50%',
              bgcolor: 'rgba(255,255,255,0.05)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto'
            }}
          >
            <Typography sx={{ color: primaryPurple, fontWeight: 'bold' }}>3</Typography>
          </Box>
          <Typography 
            variant="caption" 
            sx={{ 
              color: textSecondary,
              fontSize: '0.7rem'
            }}
          >
            Track
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default FileUpload;