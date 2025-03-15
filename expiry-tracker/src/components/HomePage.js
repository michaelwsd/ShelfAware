import React from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Button,
  Container,
  Grid
} from '@mui/material';
import { Link } from 'react-router-dom';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import NotificationsIcon from '@mui/icons-material/Notifications';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { keyframes } from '@emotion/react';

// Animations
const gradientShift = keyframes`
  0% { background-position: 0% 50% }
  50% { background-position: 100% 50% }
  100% { background-position: 0% 50% }
`;

const HomePage = () => {
  // Define theme colors (same as App.js for consistency)
  const darkBg = '#1e2233';
  const cardBg = '#0f1424';
  const primaryPurple = '#755dff';
  const secondaryGreen = '#4aeabc';
  const accentOrange = '#ff9757';
  const textPrimary = '#ffffff';
  const textSecondary = 'rgba(255, 255, 255, 0.6)';

  return (
    <Box>
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
          borderRadius: { xs: 0, sm: 3 },
          mb: 6
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
                component={Link}
                to="/dashboard"
                sx={{ 
                  px: 3, 
                  py: 1,
                  fontWeight: 500,
                }}
              >
                Go to Dashboard
              </Button>
              <Button 
                variant="outlined"
                component={Link}
                to="/upload"
                sx={{ 
                  px: 3, 
                  py: 1,
                  borderColor: 'rgba(255,255,255,0.1)',
                  color: 'text.primary',
                }}
              >
                Upload Receipt
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
                <Typography variant="body2" color="text.secondary">Food Waste Reduced</Typography>
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
                <Typography variant="body2" color="text.secondary">Items Tracked</Typography>
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
                <Typography variant="body2" color="text.secondary">Avg. Savings/Year</Typography>
              </Paper>
            </Box>
          </Box>
        </Container>
      </Box>
      
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
        
        <Grid 
          container 
          spacing={4}
        >
          <Grid item xs={12} md={4}>
            <Paper 
              sx={{ 
                p: 3, 
                bgcolor: 'background.paper',
                border: '1px solid rgba(255,255,255,0.05)',
                borderRadius: 3,
                position: 'relative',
                overflow: 'hidden',
                height: '100%'
              }}
            >
              <Box 
                sx={{ 
                  display: 'flex',
                  alignItems: 'center',
                  mb: 2,
                }}
              >
                {/* Fixed circle container for icon */}
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
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Paper 
              sx={{ 
                p: 3, 
                bgcolor: 'background.paper',
                border: '1px solid rgba(255,255,255,0.05)',
                borderRadius: 3,
                height: '100%'
              }}
            >
              <Box 
                sx={{ 
                  display: 'flex',
                  alignItems: 'center',
                  mb: 2,
                }}
              >
                {/* Fixed circle container for icon */}
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
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Paper 
              sx={{ 
                p: 3, 
                bgcolor: 'background.paper',
                border: '1px solid rgba(255,255,255,0.05)',
                borderRadius: 3,
                height: '100%'
              }}
            >
              <Box 
                sx={{ 
                  display: 'flex',
                  alignItems: 'center',
                  mb: 2,
                }}
              >
                {/* Fixed circle container for icon */}
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
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default HomePage;