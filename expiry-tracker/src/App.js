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
  Button,
  Divider,
  Icon
} from '@mui/material';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import NotificationsIcon from '@mui/icons-material/Notifications';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import FileUpload from './components/FileUpload';
import { keyframes } from '@emotion/react';

// Animations
const gradientShift = keyframes`
  0% { background-position: 0% 50% }
  50% { background-position: 100% 50% }
  100% { background-position: 0% 50% }
`;

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
      <Box sx={{ 
        minHeight: '100vh', 
        bgcolor: 'background.default',
        display: 'flex',
        flexDirection: 'column',
      }}>
        {/* App Bar */}
        <AppBar position="static" sx={{ bgcolor: cardBg, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <Toolbar>
            <Typography 
              variant="h6" 
              component="div" 
              sx={{ 
                flexGrow: 1, 
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                fontSize: '1.2rem',
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
            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1,
                bgcolor: 'rgba(255,255,255,0.05)',
                borderRadius: 2,
                px: 1.5,
                py: 0.5
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
        
        {/* Hero Section */}
        <Box
          sx={{
            bgcolor: 'background.paper',
            color: 'text.primary',
            position: 'relative',
            overflow: 'hidden',
            pb: 6,
            pt: 8,
            borderBottom: '1px solid rgba(255,255,255,0.05)',
          }}
        >
          {/* Gradient background */}
          <Box 
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '100%',
              opacity: 0.05,
              background: `radial-gradient(circle at 20% 30%, ${primaryPurple}88 0%, transparent 50%),
                           radial-gradient(circle at 80% 70%, ${secondaryGreen}88 0%, transparent 50%)`,
              zIndex: 0,
            }}
          />
          
          <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
            <Box textAlign="center" position="relative">
              <Typography 
                variant="h1" 
                component="h1" 
                gutterBottom
                sx={{ 
                  mb: 3,
                  fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                  background: `linear-gradient(90deg, ${primaryPurple}, ${secondaryGreen})`,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundSize: '200% 100%',
                  animation: `${gradientShift} 4s ease infinite`,
                  paddingBottom: '5px',
                }}
              >
                Never Waste Food Again
              </Typography>
              <Typography 
                variant="h5" 
                component="p"
                sx={{ 
                  mb: 4, 
                  maxWidth: '700px', 
                  mx: 'auto', 
                  color: 'text.secondary',
                  fontWeight: 400,
                }}
              >
                Upload your receipts and we'll track expiry dates of your groceries
              </Typography>

              <Box 
                sx={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  gap: 2,
                  flexWrap: 'wrap',
                }}
              >
                <Button 
                  variant="contained" 
                  color="primary"
                  sx={{ 
                    px: 3, 
                    py: 1,
                    fontWeight: 500,
                  }}
                >
                  Get Started
                </Button>
                <Button 
                  variant="outlined"
                  sx={{ 
                    px: 3, 
                    py: 1,
                    borderColor: 'rgba(255,255,255,0.1)',
                    color: 'text.primary',
                  }}
                >
                  Learn More
                </Button>
              </Box>

              {/* Stats cards */}
              <Box 
                sx={{ 
                  display: 'flex', 
                  flexWrap: 'wrap', 
                  gap: 3, 
                  justifyContent: 'center',
                  mt: 6,
                }}
              >
                <Paper 
                  sx={{ 
                    py: 2, 
                    px: 3, 
                    borderRadius: 3, 
                    minWidth: '120px',
                    border: '1px solid rgba(255,255,255,0.05)',
                    bgcolor: 'rgba(255,255,255,0.02)',
                  }}
                >
                  <Typography variant="h5" color="primary" sx={{ fontWeight: 600 }}>31%</Typography>
                  <Typography variant="body2" color="text.secondary">Stats because we're professional</Typography>
                </Paper>

                <Paper 
                  sx={{ 
                    py: 2, 
                    px: 3, 
                    borderRadius: 3, 
                    minWidth: '120px',
                    border: '1px solid rgba(255,255,255,0.05)',
                    bgcolor: 'rgba(255,255,255,0.02)',
                  }}
                >
                  <Typography variant="h5" color="secondary" sx={{ fontWeight: 600 }}>1.2M</Typography>
                  <Typography variant="body2" color="text.secondary">Stats because we're professional</Typography>
                </Paper>

                <Paper 
                  sx={{ 
                    py: 2, 
                    px: 3, 
                    borderRadius: 3, 
                    minWidth: '120px',
                    border: '1px solid rgba(255,255,255,0.05)',
                    bgcolor: 'rgba(255,255,255,0.02)',
                  }}
                >
                  <Typography variant="h5" color="warning" sx={{ fontWeight: 600 }}>$580</Typography>
                  <Typography variant="body2" color="text.secondary">Amount I lost gambling</Typography>
                </Paper>
              </Box>
            </Box>
          </Container>
        </Box>
        
        {/* Main Content */}
        <Container maxWidth="lg" sx={{ mt: 6, mb: 8, flex: 1 }}>
          <Paper 
            elevation={0} 
            sx={{ 
              borderRadius: 3,
              border: '1px solid rgba(255,255,255,0.05)',
              overflow: 'hidden',
              mb: 6,
              position: 'relative',
              pb: 4,
              bgcolor: 'background.paper',
            }}
          >
            <Box sx={{ 
              textAlign: 'center', 
              py: 3, 
              px: 3, 
              borderBottom: '1px solid rgba(255,255,255,0.05)',
              position: 'relative',
            }}>
              <Typography 
                variant="h5" 
                component="h2" 
                gutterBottom
                sx={{ fontWeight: 500 }}
              >
                Upload Your Receipt
              </Typography>
              <Typography 
                variant="body2" 
                color="text.secondary" 
                paragraph
                sx={{ maxWidth: '600px', mx: 'auto' }}
              >
                We'll scan your receipt to identify items and track their expiry dates
              </Typography>
            </Box>
            
            <Box sx={{ px: { xs: 2, sm: 4 }, display: 'flex', justifyContent: 'center', py: 3 }}>
              <FileUpload />
            </Box>
          </Paper>
          
          {/* Features Section */}
          <Box sx={{ mb: 8 }}>
            <Typography 
              variant="h4" 
              component="h2" 
              sx={{ 
                mb: 4.5, 
                textAlign: 'center',
                fontWeight: 500,
              }}
            >
              How It Works
            </Typography>
            
            <Box 
              sx={{ 
                display: 'grid', 
                gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
                gap: 4 
              }}
            >
              <Paper 
                sx={{ 
                  p: 3, 
                  bgcolor: 'background.paper',
                  border: '1px solid rgba(255,255,255,0.05)',
                  borderRadius: 3,
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <Box 
                  sx={{ 
                    display: 'flex',
                    alignItems: 'center',
                    mb: 2,
                  }}
                >
                  <Box 
                    sx={{ 
                      bgcolor: 'rgba(117,93,255,0.1)',
                      borderRadius: '50%',
                      width: 42,
                      height: 42,
                      mr: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <ReceiptLongIcon sx={{ color: primaryPurple, fontSize: 22 }} />
                  </Box>
                  <Typography 
                    variant="h6" 
                    gutterBottom
                    sx={{ mb: 0, fontWeight: 500 }}
                  >
                    1. Upload Receipt
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Take a photo of your grocery receipts or upload existing images. Our system accepts all major receipt formats.
                </Typography>
              </Paper>
              
              <Paper 
                sx={{ 
                  p: 3, 
                  bgcolor: 'background.paper',
                  border: '1px solid rgba(255,255,255,0.05)',
                  borderRadius: 3,
                }}
              >
                <Box 
                  sx={{ 
                    display: 'flex',
                    alignItems: 'center',
                    mb: 2,
                  }}
                >
                  <Box 
                    sx={{ 
                      bgcolor: 'rgba(74,234,188,0.1)',
                      borderRadius: '50%',
                      width: 42,
                      height: 42,
                      mr: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <TrendingUpIcon sx={{ color: secondaryGreen, fontSize: 22 }} />
                  </Box>
                  <Typography 
                    variant="h6" 
                    gutterBottom
                    sx={{ mb: 0, fontWeight: 500 }}
                  >
                    2. Smart Scanning
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Our system automatically identifies products and looks up typical expiry dates based on purchase date.
                </Typography>
              </Paper>
              
              <Paper 
                sx={{ 
                  p: 3, 
                  bgcolor: 'background.paper',
                  border: '1px solid rgba(255,255,255,0.05)',
                  borderRadius: 3,
                }}
              >
                <Box 
                  sx={{ 
                    display: 'flex',
                    alignItems: 'center',
                    mb: 2,
                  }}
                >
                  <Box 
                    sx={{ 
                      bgcolor: 'rgba(255,151,87,0.1)',
                      borderRadius: '50%',
                      width: 42,
                      height: 42,
                      mr: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <NotificationsIcon sx={{ color: accentOrange, fontSize: 22 }} />
                  </Box>
                  <Typography 
                    variant="h6" 
                    gutterBottom
                    sx={{ mb: 0, fontWeight: 500 }}
                  >
                    3. Get Notified
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Receive timely reminders when your food is about to expire so you can use it before it's too late.
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
    </ThemeProvider>
  );
}

export default App; 