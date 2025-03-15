import React from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  Button, 
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip
} from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import TimerIcon from '@mui/icons-material/Timer';
import { Link } from 'react-router-dom';

// Sample data for demonstration
const expiringItems = [
  { id: 1, name: "Milk", expiryDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), daysLeft: 2, category: "Dairy" },
  { id: 2, name: "Bread", expiryDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), daysLeft: 1, category: "Bakery" },
  { id: 3, name: "Spinach", expiryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), daysLeft: 3, category: "Produce" },
];

const recentItems = [
  { id: 4, name: "Eggs", expiryDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), daysLeft: 14, category: "Dairy" },
  { id: 5, name: "Chicken", expiryDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), daysLeft: 2, category: "Meat" },
  { id: 6, name: "Apples", expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), daysLeft: 7, category: "Produce" },
];

// Colors
const darkBg = '#1e2233';
const cardBg = '#0f1424';
const primaryPurple = '#755dff';
const secondaryGreen = '#4aeabc';
const accentOrange = '#ff9757';
const dangerRed = '#ff5c5c';
const textPrimary = '#ffffff';
const textSecondary = 'rgba(255, 255, 255, 0.6)';

const Dashboard = () => {
  const getExpiryStatusColor = (daysLeft) => {
    if (daysLeft <= 1) return dangerRed;
    if (daysLeft <= 3) return accentOrange;
    return secondaryGreen;
  };

  const getExpiryStatusIcon = (daysLeft) => {
    if (daysLeft <= 1) return <WarningIcon sx={{ color: dangerRed, fontSize: 18 }} />;
    if (daysLeft <= 3) return <TimerIcon sx={{ color: accentOrange, fontSize: 18 }} />;
    return <CheckCircleIcon sx={{ color: secondaryGreen, fontSize: 18 }} />;
  };

  return (
    <Box sx={{ width: '100%', p: 2 }}>
      {/* Dashboard Header */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography 
          variant="h4" 
          component="h1" 
          sx={{ 
            fontWeight: 600,
            color: textPrimary
          }}
        >
          Dashboard
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          component={Link} 
          to="/upload"
          sx={{ 
            borderRadius: 2,
            px: 3
          }}
        >
          Upload Receipt
        </Button>
      </Box>
      
      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Paper 
            sx={{ 
              p: 3, 
              bgcolor: cardBg, 
              borderRadius: 3,
              border: '1px solid rgba(255,255,255,0.05)',
              height: '100%'
            }}
          >
            <Typography 
              variant="h6" 
              sx={{ 
                mb: 2, 
                color: primaryPurple,
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <Box 
                sx={{ 
                  bgcolor: 'rgba(117,93,255,0.1)',
                  borderRadius: '50%',
                  width: 32,
                  height: 32,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mr: 1.5
                }}
              >
                <Typography sx={{ color: primaryPurple, fontWeight: 'bold' }}>{expiringItems.length}</Typography>
              </Box>
              Expiring Soon
            </Typography>
            <Divider sx={{ bgcolor: 'rgba(255,255,255,0.05)', mb: 2 }} />
            {expiringItems.length > 0 ? (
              <List sx={{ p: 0 }}>
                {expiringItems.map((item) => (
                  <ListItem 
                    key={item.id} 
                    sx={{ 
                      px: 0, 
                      py: 1, 
                      borderBottom: '1px solid rgba(255,255,255,0.03)',
                      '&:last-of-type': { border: 'none' }
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      {getExpiryStatusIcon(item.daysLeft)}
                    </ListItemIcon>
                    <ListItemText 
                      primary={item.name} 
                      secondary={`Expires in ${item.daysLeft} day${item.daysLeft !== 1 ? 's' : ''}`}
                      primaryTypographyProps={{ color: 'text.primary' }}
                      secondaryTypographyProps={{ color: getExpiryStatusColor(item.daysLeft), fontSize: '0.75rem' }}
                    />
                    <Chip 
                      label={item.category} 
                      size="small"
                      sx={{ 
                        bgcolor: 'rgba(255,255,255,0.05)', 
                        color: 'text.secondary',
                        fontSize: '0.7rem'
                      }}
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography color="text.secondary">No items expiring soon.</Typography>
            )}
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Paper 
            sx={{ 
              p: 3, 
              bgcolor: cardBg, 
              borderRadius: 3,
              border: '1px solid rgba(255,255,255,0.05)',
              height: '100%'
            }}
          >
            <Typography 
              variant="h6" 
              sx={{ 
                mb: 2, 
                color: secondaryGreen,
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <Box 
                sx={{ 
                  bgcolor: 'rgba(74,234,188,0.1)',
                  borderRadius: '50%',
                  width: 32,
                  height: 32,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mr: 1.5
                }}
              >
                <Typography sx={{ color: secondaryGreen, fontWeight: 'bold' }}>{recentItems.length}</Typography>
              </Box>
              Recently Added
            </Typography>
            <Divider sx={{ bgcolor: 'rgba(255,255,255,0.05)', mb: 2 }} />
            {recentItems.length > 0 ? (
              <List sx={{ p: 0 }}>
                {recentItems.map((item) => (
                  <ListItem 
                    key={item.id} 
                    sx={{ 
                      px: 0, 
                      py: 1, 
                      borderBottom: '1px solid rgba(255,255,255,0.03)',
                      '&:last-of-type': { border: 'none' }
                    }}
                  >
                    <ListItemText 
                      primary={item.name} 
                      secondary={`${item.daysLeft} days until expiry`}
                      primaryTypographyProps={{ color: 'text.primary' }}
                      secondaryTypographyProps={{ color: 'text.secondary', fontSize: '0.75rem' }}
                    />
                    <Chip 
                      label={item.category} 
                      size="small"
                      sx={{ 
                        bgcolor: 'rgba(255,255,255,0.05)', 
                        color: 'text.secondary',
                        fontSize: '0.7rem'
                      }}
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography color="text.secondary">No recent items.</Typography>
            )}
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Paper 
            sx={{ 
              p: 3, 
              bgcolor: cardBg, 
              borderRadius: 3,
              border: '1px solid rgba(255,255,255,0.05)',
              height: '100%'
            }}
          >
            <Typography 
              variant="h6" 
              sx={{ 
                mb: 2, 
                color: textPrimary,
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <Box 
                sx={{ 
                  bgcolor: 'rgba(255,255,255,0.05)',
                  borderRadius: '50%',
                  width: 32,
                  height: 32,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mr: 1.5
                }}
              >
                <Typography sx={{ color: textPrimary, fontWeight: 'bold' }}>12</Typography>
              </Box>
              Statistics
            </Typography>
            <Divider sx={{ bgcolor: 'rgba(255,255,255,0.05)', mb: 2 }} />
            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Total Items
              </Typography>
              <Typography variant="h5" color="text.primary">
                18
              </Typography>
            </Box>
            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Categories
              </Typography>
              <Typography variant="h5" color="text.primary">
                5
              </Typography>
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Saved from waste
              </Typography>
              <Typography variant="h5" color="primary">
                8 items
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
      
      {/* All Items Section */}
      <Paper 
        sx={{ 
          p: 3, 
          bgcolor: cardBg, 
          borderRadius: 3,
          border: '1px solid rgba(255,255,255,0.05)',
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6" color="text.primary">
            All Tracked Items
          </Typography>
          <Button 
            variant="outlined" 
            size="small"
            sx={{
              borderColor: 'rgba(255,255,255,0.1)',
              color: textPrimary,
              '&:hover': { borderColor: primaryPurple, bgcolor: 'rgba(117,93,255,0.05)' }
            }}
          >
            View All
          </Button>
        </Box>
        
        <Divider sx={{ bgcolor: 'rgba(255,255,255,0.05)', mb: 2 }} />
        
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 4 }}>
          <Typography color="text.secondary" align="center">
            This is a placeholder for all tracked items. In the full application, this would show a paginated list or grid of all food items being tracked, with filtering and sorting options.
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default Dashboard;
