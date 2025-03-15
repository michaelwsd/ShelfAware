import React from 'react';
import { 
  ThemeProvider, 
  createTheme, 
  CssBaseline, 
  Container, 
  Box, 
  Typography, 
  AppBar, 
  Toolbar,
  Button,
  Link
} from '@mui/material';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import { AnimatePresence, motion } from 'framer-motion';
import Dashboard from './components/Dashboard';
import UploadPage from './components/UploadPage';
import HomePage from './components/HomePage';

function App() {
  // Define theme colors
  const darkBg = '#1e2233';
  const cardBg = '#0f1424';
  const primaryPurple = '#755dff';
  const secondaryGreen = '#4aeabc';
  const accentOrange = '#ff9757';
  const textPrimary = '#ffffff';
  const textSecondary = 'rgba(255, 255, 255, 0.6)';

  // Create custom theme
  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
      primary: {
        main: primaryPurple,
      },
      secondary: {
        main: secondaryGreen,
      },
      warning: {
        main: accentOrange,
      },
      background: {
        default: darkBg,
        paper: cardBg,
      },
      text: {
        primary: textPrimary,
        secondary: textSecondary,
      },
    },
    typography: {
      fontFamily: '"Inter", "Segoe UI", Roboto, -apple-system, BlinkMacSystemFont, sans-serif',
      h1: {
        fontSize: '2.5rem',
        fontWeight: 600,
        letterSpacing: '-0.5px',
        lineHeight: 1.2,
      },
      h4: {
        fontWeight: 500,
        letterSpacing: '-0.3px',
      },
      h5: {
        fontWeight: 500,
        letterSpacing: '-0.2px',
      },
      h6: {
        fontWeight: 500,
        letterSpacing: '-0.2px',
      },
      body1: {
        lineHeight: 1.7,
        letterSpacing: '0.1px',
      },
      button: {
        textTransform: 'none',
        fontWeight: 500,
      },
    },
    shape: {
      borderRadius: 12,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            fontWeight: 500,
            borderRadius: 8,
          },
          contained: {
            boxShadow: 'none',
            '&:hover': {
              boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
            },
          },
          outlined: {
            borderColor: 'rgba(255,255,255,0.1)',
            '&:hover': {
              backgroundColor: 'rgba(255,255,255,0.05)',
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            boxShadow: 'none',
            backgroundImage: 'none',
          },
        },
      },
      MuiDivider: {
        styleOverrides: {
          root: {
            backgroundColor: 'rgba(255,255,255,0.1)',
          },
        },
      },
    },
  });

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Router>
        <Box sx={{ 
          minHeight: '100vh', 
          bgcolor: 'background.default',
          display: 'flex',
          flexDirection: 'column',
        }}>
          {/* App Bar with Navigation */}
          <AppBar position="sticky" sx={{ bgcolor: cardBg, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <Toolbar>
              <Typography 
                variant="h6" 
                component={Link} 
                to="/"
                sx={{ 
                  flexGrow: 1, 
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  fontSize: '1.2rem',
                  textDecoration: 'none',
                  color: 'inherit'
                }}
              >
                <Box 
                  sx={{ 
                    bgcolor: 'rgba(117,93,255,0.1)', 
                    p: 0.8, 
                    borderRadius: '8px',
                    mr: 1.5,
                    display: 'flex',
                  }}
                >
                  <ReceiptLongIcon sx={{ color: primaryPurple }} />
                </Box>
                Food Expiry Tracker
              </Typography>
              
              {/* Navigation Links */}
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button 
                  component={Link} 
                  to="/"
                  color="inherit"
                  sx={{ 
                    opacity: 0.8,
                    '&:hover': { opacity: 1 }
                  }}
                >
                  Home
                </Button>
                <Button 
                  component={Link} 
                  to="/dashboard"
                  color="inherit"
                  sx={{ 
                    opacity: 0.8,
                    '&:hover': { opacity: 1 }
                  }}
                >
                  Dashboard
                </Button>
                <Button 
                  component={Link} 
                  to="/upload"
                  color="inherit"
                  sx={{ 
                    opacity: 0.8,
                    '&:hover': { opacity: 1 }
                  }}
                >
                  Upload
                </Button>
              </Box>
              
              <Box 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 1,
                  bgcolor: 'rgba(255,255,255,0.05)',
                  borderRadius: 2,
                  px: 1.5,
                  py: 0.5,
                  ml: 2
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
                    fontSize: '0.75rem'
                  }}
                >
                  ACTIVE
                </Typography>
              </Box>
            </Toolbar>
          </AppBar>
          
          {/* Main Content */}
          <Container maxWidth="xl" sx={{ mt: 4, mb: 4, flex: 1 }}>
            <AnimatePresence mode="wait">
              <Routes>
                <Route path="/" element={
                  <motion.div
                    key="home"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <HomePage />
                  </motion.div>
                } />
                <Route path="/dashboard" element={
                  <motion.div
                    key="dashboard"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Dashboard />
                  </motion.div>
                } />
                <Route path="/upload" element={
                  <motion.div
                    key="upload"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <UploadPage />
                  </motion.div>
                } />
              </Routes>
            </AnimatePresence>
          </Container>
          
          {/* Footer */}
          <Box 
            component="footer" 
            sx={{ 
              py: 3,
              bgcolor: cardBg,
              borderTop: '1px solid rgba(255,255,255,0.05)',
            }}
          >
            <Container maxWidth="lg">
              <Typography variant="body2" color="text.secondary" align="center">
                Food Expiry Tracker &copy; {new Date().getFullYear()}
              </Typography>
            </Container>
          </Box>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App; 