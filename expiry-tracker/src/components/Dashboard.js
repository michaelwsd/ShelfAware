import React, { useState, useEffect } from 'react';
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
import { motion } from 'framer-motion';
import { keyframes } from '@emotion/react';

// Animations
const countUp = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const pulseWarning = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

// Colors
const primaryPurple = '#755dff';
const secondaryGreen = '#4aeabc';
const accentOrange = '#ff9757';
const dangerRed = '#ff5c5c';
const textPrimary = '#ffffff';

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

const Dashboard = () => {
  const [animateStats, setAnimateStats] = useState(false);
  const [statValues, setStatValues] = useState({ total: 0, categories: 0, saved: 0 });
  
  useEffect(() => {
    // Start animation after component mounts
    setAnimateStats(true);
    
    // Animate stats counting up
    const timer = setTimeout(() => {
      const intervalTotal = setInterval(() => {
        setStatValues(prev => {
          if (prev.total >= 18) clearInterval(intervalTotal);
          return { ...prev, total: Math.min(prev.total + 1, 18) };
        });
      }, 100);
      
      const intervalCategories = setInterval(() => {
        setStatValues(prev => {
          if (prev.categories >= 5) clearInterval(intervalCategories);
          return { ...prev, categories: Math.min(prev.categories + 1, 5) };
        });
      }, 200);
      
      const intervalSaved = setInterval(() => {
        setStatValues(prev => {
          if (prev.saved >= 8) clearInterval(intervalSaved);
          return { ...prev, saved: Math.min(prev.saved + 1, 8) };
        });
      }, 150);
      
      return () => {
        clearInterval(intervalTotal);
        clearInterval(intervalCategories);
        clearInterval(intervalSaved);
      };
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);

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
  
  // Animation variants for staggered children
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        damping: 15
      }
    }
  };

  return (
    <Box sx={{ width: '100%', p: 2 }}>
      {/* Dashboard Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography 
            variant="h4" 
            component="h1" 
            sx={{ 
              fontWeight: 600,
              color: 'text.primary'
            }}
          >
            Dashboard
          </Typography>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
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
          </motion.div>
        </Box>
      </motion.div>
      
      {/* Summary Cards */}
      <motion.div variants={containerVariants} initial="hidden" animate="show">
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={4}>
            <motion.div variants={itemVariants}>
              <Paper 
                sx={{ 
                  p: 3, 
                  bgcolor: 'background.paper', 
                  borderRadius: 3,
                  border: '1px solid rgba(255,255,255,0.05)',
                  height: '100%',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 12px 20px rgba(0,0,0,0.1)'
                  }
                }}
              >
                <Typography 
                  variant="h6" 
                  sx={{ 
                    mb: 2, 
                    color: 'primary.main',
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
                    <Typography sx={{ color: 'primary.main', fontWeight: 'bold' }}>{expiringItems.length}</Typography>
                  </Box>
                  Expiring Soon
                </Typography>
                <Divider sx={{ bgcolor: 'rgba(255,255,255,0.05)', mb: 2 }} />
                
                {expiringItems.length > 0 ? (
                  <List sx={{ p: 0 }}>
                    {expiringItems.map((item, index) => (
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        key={item.id}
                      >
                        <ListItem 
                          sx={{ 
                            px: 0, 
                            py: 1, 
                            borderBottom: '1px solid rgba(255,255,255,0.03)',
                            '&:last-of-type': { border: 'none' },
                            transition: 'background-color 0.3s',
                            '&:hover': { 
                              bgcolor: 'rgba(255,255,255,0.03)',
                              borderRadius: 1
                            }
                          }}
                        >
                          <ListItemIcon sx={{ minWidth: 36 }}>
                            <Box sx={{ 
                              animation: item.daysLeft <= 1 ? `${pulseWarning} 2s infinite` : 'none'
                            }}>
                              {getExpiryStatusIcon(item.daysLeft)}
                            </Box>
                          </ListItemIcon>
                          <ListItemText 
                            primary={item.name} 
                            secondary={`Expires in ${item.daysLeft} day${item.daysLeft !== 1 ? 's' : ''}`}
                            primaryTypographyProps={{ color: 'text.primary' }}
                            secondaryTypographyProps={{ 
                              color: getExpiryStatusColor(item.daysLeft), 
                              fontSize: '0.75rem' 
                            }}
                          />
                          <Chip 
                            label={item.category} 
                            size="small"
                            sx={{ 
                              bgcolor: 'rgba(255,255,255,0.05)', 
                              color: 'text.secondary',
                              fontSize: '0.7rem',
                              transition: 'all 0.3s',
                              '&:hover': {
                                bgcolor: 'rgba(255,255,255,0.1)'
                              }
                            }}
                          />
                        </ListItem>
                      </motion.div>
                    ))}
                  </List>
                ) : (
                  <Typography color="text.secondary">No items expiring soon.</Typography>
                )}
              </Paper>
            </motion.div>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <motion.div variants={itemVariants}>
              <Paper 
                sx={{ 
                  p: 3, 
                  bgcolor: 'background.paper', 
                  borderRadius: 3,
                  border: '1px solid rgba(255,255,255,0.05)',
                  height: '100%',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 12px 20px rgba(0,0,0,0.1)'
                  }
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
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        key={item.id}
                      >
                        <ListItem 
                          sx={{ 
                            px: 0, 
                            py: 1, 
                            borderBottom: '1px solid rgba(255,255,255,0.03)',
                            '&:last-of-type': { border: 'none' },
                            transition: 'background-color 0.3s',
                            '&:hover': { 
                              bgcolor: 'rgba(255,255,255,0.03)',
                              borderRadius: 1
                            }
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
                              fontSize: '0.7rem',
                              transition: 'all 0.3s',
                              '&:hover': {
                                bgcolor: 'rgba(255,255,255,0.1)'
                              }
                            }}
                          />
                        </ListItem>
                      </motion.div>
                    ))}
                  </List>
                ) : (
                  <Typography color="text.secondary">No recent items.</Typography>
                )}
              </Paper>
            </motion.div>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <motion.div variants={itemVariants}>
              <Paper 
                sx={{ 
                  p: 3, 
                  bgcolor: 'background.paper', 
                  borderRadius: 3,
                  border: '1px solid rgba(255,255,255,0.05)',
                  height: '100%',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 12px 20px rgba(0,0,0,0.1)'
                  }
                }}
              >
                <Typography 
                  variant="h6" 
                  sx={{ 
                    mb: 2, 
                    color: 'text.primary',
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
                    <Typography sx={{ color: 'text.primary', fontWeight: 'bold' }}>12</Typography>
                  </Box>
                  Statistics
                </Typography>
                <Divider sx={{ bgcolor: 'rgba(255,255,255,0.05)', mb: 2 }} />
                
                <Box sx={{ mb: 3 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Total Items
                  </Typography>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <Typography variant="h5" color="text.primary" sx={{ 
                      animation: animateStats ? `${countUp} 0.5s ease forwards` : 'none'
                    }}>
                      {statValues.total}
                    </Typography>
                  </motion.div>
                </Box>
                
                <Box sx={{ mb: 3 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Categories
                  </Typography>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <Typography variant="h5" color="text.primary" sx={{ 
                      animation: animateStats ? `${countUp} 0.5s ease forwards` : 'none'
                    }}>
                      {statValues.categories}
                    </Typography>
                  </motion.div>
                </Box>
                
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Saved from waste
                  </Typography>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                  >
                    <Typography variant="h5" color="primary" sx={{ 
                      animation: animateStats ? `${countUp} 0.5s ease forwards` : 'none'
                    }}>
                      {statValues.saved} items
                    </Typography>
                  </motion.div>
                </Box>
              </Paper>
            </motion.div>
          </Grid>
        </Grid>
      </motion.div>
      
      {/* All Items Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        <Paper 
          sx={{ 
            p: 3, 
            bgcolor: 'background.paper', 
            borderRadius: 3,
            border: '1px solid rgba(255,255,255,0.05)',
            transition: 'transform 0.3s',
            '&:hover': {
              transform: 'translateY(-3px)'
            }
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
      </motion.div>
    </Box>
  );
};

export default Dashboard;
