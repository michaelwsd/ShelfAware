import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Button,
  Collapse,
  IconButton
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import BugReportIcon from '@mui/icons-material/BugReport';
import FileUpload from './FileUpload';
import StorageDebug from './StorageDebug';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const UploadPage = () => {
  const [showDebug, setShowDebug] = useState(false);
  const isDevelopment = process.env.NODE_ENV === 'development';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Box sx={{ width: '100%', p: 2 }}>
        {/* Page Header */}
        <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              whileHover={{ x: -5 }}
            >
              <Button 
                component={Link} 
                to="/dashboard"
                startIcon={<ArrowBackIcon />}
                sx={{ 
                  color: 'text.secondary',
                  mr: 2,
                  '&:hover': { color: 'primary.main' }
                }}
              >
                Back to Dashboard
              </Button>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
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
            </motion.div>
          </Box>
          
          {/* Debug toggle button (only in development) */}
          {isDevelopment && (
            <IconButton 
              color={showDebug ? "primary" : "default"}
              onClick={() => setShowDebug(!showDebug)}
              title="Debug Storage"
              sx={{ ml: 2 }}
            >
              <BugReportIcon />
            </IconButton>
          )}
        </Box>
        
        {/* Debug panel */}
        {isDevelopment && (
          <Collapse in={showDebug}>
            <Box sx={{ mb: 3, bgcolor: 'background.paper', borderRadius: 2, overflow: 'hidden' }}>
              <StorageDebug />
            </Box>
          </Collapse>
        )}
        
        {/* FileUpload component with animation wrapper */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, type: "spring", stiffness: 100 }}
        >
          <FileUpload />
        </motion.div>
      </Box>
    </motion.div>
  );
};

export default UploadPage;