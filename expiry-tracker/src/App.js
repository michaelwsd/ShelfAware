import React from 'react';
import { 
  ThemeProvider, 
  createTheme, 
  CssBaseline, 
  Container, 
  Box, 
  Typography, 
  Paper, 
  AppBar, 
  Toolbar,
  useMediaQuery
} from '@mui/material';
import FileUpload from './components/FileUpload';

function App() {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  // Create a responsive theme with green primary color
  const theme = createTheme({
    palette: {
      mode: prefersDarkMode ? 'dark' : 'light',
      primary: {
        main: '#43a047', // A fresh green color for food-related app
      },
      secondary: {
        main: '#ff9800', // Orange for attention items like expiring soon
      },
      background: {
        default: prefersDarkMode ? '#121212' : '#f9f9f9',
        paper: prefersDarkMode ? '#1e1e1e' : '#ffffff',
      },
    },
    typography: {
      fontFamily: '"Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      h1: {
        fontSize: '2.5rem',
        fontWeight: 600,
      },
      h4: {
        fontWeight: 500,
      },
      body1: {
        lineHeight: 1.7,
      },
    },
    shape: {
      borderRadius: 8,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            fontWeight: 500,
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          },
        },
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      
      {/* App Bar */}
      <AppBar position="static" elevation={0} color="primary">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Food Expiry Tracker
          </Typography>
        </Toolbar>
      </AppBar>
      
      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'primary.contrastText',
          pt: 6,
          pb: 8,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Container maxWidth="md">
          <Box textAlign="center" position="relative" zIndex={2}>
            <Typography 
              variant="h1" 
              component="h1" 
              gutterBottom
              sx={{ mb: 2, fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' } }}
            >
              Never Waste Food Again
            </Typography>
            <Typography 
              variant="h5" 
              component="p"
              sx={{ mb: 4, maxWidth: '800px', mx: 'auto', opacity: 0.9 }}
            >
              Upload your receipts and we'll track expiry dates of your groceries
            </Typography>
          </Box>
        </Container>
        
        {/* Background pattern for hero section */}
        <Box 
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.1,
            backgroundImage: `radial-gradient(circle, #fff 1px, transparent 1px)`,
            backgroundSize: '20px 20px',
          }}
        />
      </Box>
      
      {/* Main Content */}
      <Container maxWidth="lg" sx={{ mt: -4 }}>
        <Paper 
          elevation={3} 
          sx={{ 
            borderRadius: 2, 
            overflow: 'hidden',
            mb: 6, 
            position: 'relative',
            pb: 4
          }}
        >
          <Box sx={{ textAlign: 'center', py: 3, px: 3 }}>
            <Typography variant="h4" component="h2" gutterBottom>
              Upload Your Receipt
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              We'll scan your receipt to identify items and track their expiry dates
            </Typography>
          </Box>
          
          <Box sx={{ px: { xs: 2, sm: 4 } }}>
            <FileUpload />
          </Box>
        </Paper>
        
        {/* Features Section */}
        <Box sx={{ mb: 8 }}>
          <Typography variant="h4" component="h2" sx={{ mb: 4, textAlign: 'center' }}>
            How It Works
          </Typography>
          
          <Box 
            sx={{ 
              display: 'grid', 
              gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
              gap: 4 
            }}
          >
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>1. Upload Receipt</Typography>
              <Typography variant="body2" color="text.secondary">
                Take a photo of your grocery receipts or upload existing images.
              </Typography>
            </Paper>
            
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>2. Smart Scanning</Typography>
              <Typography variant="body2" color="text.secondary">
                Our system automatically identifies products and looks up typical expiry dates.
              </Typography>
            </Paper>
            
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>3. Get Notified</Typography>
              <Typography variant="body2" color="text.secondary">
                Receive timely reminders when your food is about to expire.
              </Typography>
            </Paper>
          </Box>
        </Box>
      </Container>
      
      {/* Footer */}
      <Box 
        component="footer" 
        sx={{ 
          py: 3, 
          bgcolor: prefersDarkMode ? 'background.paper' : '#f5f5f5',
          borderTop: '1px solid',
          borderColor: 'divider',
          mt: 'auto' 
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="body2" color="text.secondary" align="center">
            Food Expiry Tracker &copy; {new Date().getFullYear()}
          </Typography>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App; 