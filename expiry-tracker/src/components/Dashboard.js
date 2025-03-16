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
  Chip,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Pagination,
  Stack,
  Snackbar
} from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import TimerIcon from '@mui/icons-material/Timer';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import FilterListIcon from '@mui/icons-material/FilterList';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import DirectionsIcon from '@mui/icons-material/Directions';
import CallIcon from '@mui/icons-material/Call';
import ShareIcon from '@mui/icons-material/Share';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { keyframes } from '@emotion/react';
import { useAuth } from '../contexts/authContext';
import { dataService } from '../firebase/serviceSwitcher';

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

// Utility function to safely get date string from potentially invalid dates
const safeFormatDate = (dateValue) => {
  try {
    // First check if it's a valid Date object
    if (dateValue instanceof Date && !isNaN(dateValue.getTime())) {
      return dateValue.toISOString().split('T')[0];
    }
    
    // If it's a string or number, try to create a valid date
    if (dateValue) {
      const date = new Date(dateValue);
      if (!isNaN(date.getTime())) {
        return date.toISOString().split('T')[0];
      }
    }
    
    // Return empty string if date is invalid
    return '';
  } catch (error) {
    console.warn('Error formatting date:', error, dateValue);
    return '';
  }
};

// Add a helper function for safe date formatting
const safeFormatDisplayDate = (dateValue) => {
  // console.log(dateValue);
  try {
    // First check if it's a valid Date object
    if (dateValue instanceof Date && !isNaN(dateValue.getTime())) {
      return dateValue.toLocaleDateString();
    }
    
    // If it's a string or number, try to create a valid date
    if (dateValue) {
      const date = new Date(dateValue);
      if (!isNaN(date.getTime())) {
        return date.toLocaleDateString();
      }
    }
    
    // Return placeholder if date is invalid
    return '—';
  } catch (error) {
    console.warn('Error formatting display date:', error, dateValue);
    return '—';
  }
};

const Dashboard = () => {
  const { currentUser } = useAuth();
  const [animateStats, setAnimateStats] = useState(false);
  const [statValues, setStatValues] = useState({ total: 0, categories: 0, saved: 0 });
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [expiringItems, setExpiringItems] = useState([]);
  const [recentItems, setRecentItems] = useState([]);
  const [savedItems, setSavedItems] = useState([]);
  const [viewAllOpen, setViewAllOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [currentItem, setCurrentItem] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'info' });
  const [filter, setFilter] = useState('all');
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [donationDialogOpen, setDonationDialogOpen] = useState(false);
  const [itemToDonate, setItemToDonate] = useState(null);
  
  // Mock data for nearby donation locations
  const mockDonationLocations = [
    {
      id: 1,
      name: "Community Food Bank",
      distance: "1.2 miles",
      address: "123 Charity Lane, City",
      phone: "(555) 123-4567",
      acceptsExpiring: true,
      hours: "Mon-Fri: 9am-5pm, Sat: 10am-2pm",
      image: "https://images.unsplash.com/photo-1593113630400-ea4288922497?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80",
      description: "Accepting all non-expired food items to help local families in need."
    },
    {
      id: 2,
      name: "Hope Shelter",
      distance: "2.5 miles",
      address: "456 Hope Street, City",
      phone: "(555) 234-5678",
      acceptsExpiring: true,
      hours: "24/7 for donations",
      image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80",
      description: "Providing meals for homeless individuals. We welcome all food donations."
    },
    {
      id: 3,
      name: "Neighborhood Pantry",
      distance: "0.8 miles",
      address: "789 Local Avenue, City",
      phone: "(555) 345-6789",
      acceptsExpiring: false,
      hours: "Tue & Thu: 3pm-7pm, Sat: 9am-12pm",
      image: "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80",
      description: "Neighborhood-run pantry providing groceries to local families in need."
    }
  ];
  
  useEffect(() => {
    const fetchItems = async () => {
      if (currentUser) {
        try {
          setLoading(true);
          const fetchedItems = await dataService.getItems(currentUser.uid);
          
          if (fetchedItems && fetchedItems.length > 0) {
            // Process items
            const now = new Date();
            const processedItems = fetchedItems.map(item => {
              // Convert string dates to Date objects if needed
              let expiryDate;
              let daysLeft = null;
              console.log(item);
              try {
                // Safely convert to date object
                // if (item.expiryDate instanceof Date) {
                //   expiryDate = item.expiryDate;
                // } else if (item.expiryDate) {
                //   expiryDate = new Date(item.expiryDate);
                //   // Check if valid date was created
                //   if (isNaN(expiryDate.getTime())) {
                //     expiryDate = null;
                //   }
                // } else {
                //   expiryDate = null;
                // }

                
                // Only calculate days left if we have a valid expiry date
                // if (expiryDate) {
                //   const timeDiff = expiryDate.getTime() - now.getTime();
                //   daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24));
                // }

                // console.log(item.expiryDate["seconds"]);
                expiryDate = new Date(item.expiryDate["seconds"]*1000);
                daysLeft = (item.expiryDate["seconds"] * 1000) - (now.getTime());
                daysLeft = Math.ceil(daysLeft / (1000 * 3600 * 24));
                console.log(daysLeft);
                // console.log(item.expiryDate);

              } catch (error) {
                console.warn('Error processing expiry date:', error, item);
                expiryDate = null;
                daysLeft = null;
              }
              
              // Safely convert purchase date
              let purchaseDate;
              try {
                if (item.purchaseDate instanceof Date) {
                  purchaseDate = item.purchaseDate;
                } else if (item.purchaseDate) {
                  purchaseDate = new Date(item.purchaseDate);
                  // Check if valid date was created
                  if (isNaN(purchaseDate.getTime())) {
                    purchaseDate = now; // Default to today
                  }
                } else {
                  purchaseDate = now; // Default to today
                }
              } catch (error) {
                console.warn('Error processing purchase date:', error, item);
                purchaseDate = now; // Default to today
              }
              
              // Ensure isPerishable property exists (default to true if not specified)
              const isPerishable = item.isPerishable !== undefined ? item.isPerishable : true;
              
              return {
                ...item,
                expiryDate,
                daysLeft,
                isPerishable,
                purchaseDate,
                // Make sure quantity is a number
                quantity: typeof item.quantity === 'number' ? item.quantity : Number(item.quantity) || 1,
                // Add saved property if it doesn't exist
                saved: item.saved || false
              };
            });
            
            setItems(processedItems);
            
            // Filter expiring items (less than 4 days)
            const expiring = processedItems
              .filter(item => item.isPerishable && (item.daysLeft <= 3 || (item.saved && item.daysLeft !== null && item.daysLeft <= 3)))
              .sort((a, b) => {
                // Sort saved items after non-saved items
                if (a.saved && !b.saved) return 1;
                if (!a.saved && b.saved) return -1;
                // Then sort by days left
                return a.daysLeft - b.daysLeft;
              });
            setExpiringItems(expiring);
            
            // Get recent items (added in the last 7 days)
            const recent = processedItems
              .filter(item => {
                const purchaseDate = item.purchaseDate instanceof Date 
                  ? item.purchaseDate 
                  : new Date(item.purchaseDate);
                const daysSincePurchase = Math.ceil((now - purchaseDate) / (1000 * 3600 * 24));
                return daysSincePurchase <= 7;
              })
              .sort((a, b) => {
                // Sort saved items after non-saved items
                if (a.saved && !b.saved) return 1;
                if (!a.saved && b.saved) return -1;
                // Then sort by most recent first
                const dateA = a.purchaseDate instanceof Date ? a.purchaseDate : new Date(a.purchaseDate);
                const dateB = b.purchaseDate instanceof Date ? b.purchaseDate : new Date(b.purchaseDate);
                return dateB - dateA;
              });
            setRecentItems(recent);
            
            // Get saved items
            const saved = processedItems.filter(item => item.saved);
            setSavedItems(saved);
            
            // Update stats
            const categories = new Set(processedItems.map(item => item.category)).size;
            setStatValues({
              total: processedItems.length,
              categories,
              saved: saved.length // Use actual count of saved items
            });
          } else {
            // No items found, clear all arrays
            setItems([]);
            setExpiringItems([]);
            setRecentItems([]);
            setSavedItems([]);
            setStatValues({ total: 0, categories: 0, saved: 0 });
          }
        } catch (error) {
          console.error("Error fetching items:", error);
          setNotification({
            open: true,
            message: `Error loading items: ${error.message}`,
            severity: 'error'
          });
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };
    
    fetchItems();
  }, [currentUser, refreshTrigger]);
  
  useEffect(() => {
    // Start animation after component mounts
    setAnimateStats(true);
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

  // Get filtered items based on current filter
  const getFilteredItems = () => {
    switch(filter) {
      case 'expiring':
        return items.filter(item => item.isPerishable && item.daysLeft <= 7);
      case 'expired':
        return items.filter(item => item.isPerishable && item.daysLeft < 0);
      case 'perishable':
        return items.filter(item => item.isPerishable === true);
      case 'non-perishable':
        return items.filter(item => item.isPerishable === false);
      case 'saved':
        return items.filter(item => item.saved === true);
      case 'dairy':
      case 'meat':
      case 'produce':
      case 'bakery':
      case 'pantry':
      case 'frozen':
      case 'canned':
      case 'snacks':
      case 'beverages':
      case 'toiletries':
      case 'household':
      case 'pet':
      case 'other':
      case 'uncategorized':
        return items.filter(item => item.category === filter);
      default:
        return items;
    }
  };

  // Pagination logic
  const filteredItems = getFilteredItems();
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const currentItems = filteredItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handle page change
  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  // Open edit dialog for an item
  const handleEditItem = (item) => {
    setCurrentItem({...item});
    setEditDialogOpen(true);
  };

  // Save edited item
  const handleSaveEdit = async () => {
    if (!currentItem) return;
    
    try {
      setLoading(true);
      await dataService.editItem(currentUser.uid, currentItem);
      
      // Update local state
      setItems(items.map(item => 
        item.id === currentItem.id ? currentItem : item
      ));
      
      setNotification({
        open: true,
        message: `${currentItem.name} updated successfully`,
        severity: 'success'
      });
      
      setEditDialogOpen(false);
    } catch (error) {
      console.error("Error updating item:", error);
      setNotification({
        open: true,
        message: `Error updating item: ${error.message}`,
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  // Delete a single item
  const handleDeleteItem = async (item) => {
    try {
      setLoading(true);
      await dataService.deleteItem(currentUser.uid, item);
      
      // Update local state
      setItems(items.filter(i => i.id !== item.id));
      
      setNotification({
        open: true,
        message: `${item.name} deleted successfully`,
        severity: 'success'
      });
      
      // Trigger a refresh to ensure database is in sync
      setRefreshTrigger(prev => prev + 1);
    } catch (error) {
      console.error("Error deleting item:", error);
      setNotification({
        open: true,
        message: `Error deleting item: ${error.message}`,
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  // Delete all items
  const handleDeleteAllItems = async () => {
    console.log("handleDeleteAllItems called, items length:", items.length);
    if (!items.length) {
      console.log("No items to delete, returning early");
      return;
    }
    
    try {
      setLoading(true);
      console.log("Setting loading state to true");
      
      // Ensure we have a user ID
      if (!currentUser || !currentUser.uid) {
        throw new Error("No authenticated user found");
      }
      
      // Check if our service has a batch delete function
      console.log("dataService.deleteAllItems exists:", typeof dataService.deleteAllItems === 'function');
      
      let deleteResult;
      if (typeof dataService.deleteAllItems === 'function') {
        // Use the bulk operation if available
        console.log("Attempting to delete all items for user:", currentUser.uid);
        try {
          deleteResult = await dataService.deleteAllItems(currentUser.uid);
          console.log("Delete all items result:", deleteResult);
        } catch (deleteError) {
          console.error("Error in dataService.deleteAllItems:", deleteError);
          throw deleteError;
        }
      } else {
        // Fallback to deleting each item
        console.log("deleteAllItems not available, falling back to individual deletes");
        const deletePromises = items.map(item => 
          dataService.deleteItem(currentUser.uid, item)
        );
        
        await Promise.all(deletePromises);
        console.log("All individual delete promises resolved");
        deleteResult = { success: true, message: `Deleted ${items.length} items individually` };
      }
      
      // Check if the operation was successful
      if (deleteResult && deleteResult.success === false) {
        throw new Error(deleteResult.message || "Failed to delete items");
      }
      
      // Clear local state
      console.log("Clearing local state arrays");
      setItems([]);
      setExpiringItems([]);
      setRecentItems([]);
      setSavedItems([]);
      setStatValues({ total: 0, categories: 0, saved: 0 });
      
      // Show success notification with the result message
      setNotification({
        open: true,
        message: deleteResult?.message || "All items deleted successfully",
        severity: 'success'
      });
      
      console.log("Triggering refresh to update UI");
      // Trigger a refresh to ensure database is in sync
      setRefreshTrigger(prev => prev + 1);
      
      setDeleteConfirmOpen(false);
      setCurrentPage(1); // Reset to first page
    } catch (error) {
      console.error("Error deleting all items:", error);
      setNotification({
        open: true,
        message: `Error deleting items: ${error.message || "Unknown error"}`,
        severity: 'error'
      });
      
      // Still trigger a refresh to ensure UI reflects the current state
      setRefreshTrigger(prev => prev + 1);
    } finally {
      console.log("Delete operation complete, setting loading to false");
      setLoading(false);
    }
  };

  // Close notification
  const handleCloseNotification = (event, reason) => {
    if (reason === 'clickaway') return;
    setNotification({ ...notification, open: false });
  };

  // Add a function to handle using an item
  const handleUseItem = async (item) => {
    try {
      setLoading(true);
      
      // Decrease quantity by 1
      const updatedQuantity = item.quantity - 1;
      
      // Create updated item object
      const updatedItem = {
        ...item,
        quantity: updatedQuantity
      };
      
      // If quantity reached 0, mark as saved
      if (updatedQuantity === 0) {
        updatedItem.saved = true;
        
        // Show success notification
        setNotification({
          open: true,
          message: `${item.name} used up! Added to saved items.`,
          severity: 'success'
        });
      } else {
        setNotification({
          open: true,
          message: `${item.name} quantity decreased to ${updatedQuantity}.`,
          severity: 'success'
        });
      }
      
      // Update the item in the database
      await dataService.editItem(currentUser.uid, updatedItem);
      
      // Update local state
      setItems(items.map(i => 
        i.id === item.id ? updatedItem : i
      ));
      
      // If quantity reached 0, add to saved items
      if (updatedQuantity === 0) {
        setSavedItems([...savedItems, updatedItem]);
        
        // Update stats
        setStatValues(prev => ({
          ...prev,
          saved: prev.saved + 1
        }));
      }
      
      // Trigger a refresh to ensure database is in sync
      setRefreshTrigger(prev => prev + 1);
    } catch (error) {
      console.error("Error using item:", error);
      setNotification({
        open: true,
        message: `Error updating item: ${error.message}`,
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  // Function to handle donation button click
  const handleDonateItem = (item) => {
    setItemToDonate(item);
    setDonationDialogOpen(true);
  };
  
  // Function to simulate donating an item
  const handleCompleteDonation = async (locationId) => {
    if (!itemToDonate) return;
    
    try {
      setLoading(true);
      
      // Create updated item object (mark as saved and donated)
      const updatedItem = {
        ...itemToDonate,
        saved: true,
        donated: true,
        quantity: 0
      };
      
      // Update the item in the database
      await dataService.editItem(currentUser.uid, updatedItem);
      
      // Update local state
      setItems(items.map(i => 
        i.id === itemToDonate.id ? updatedItem : i
      ));
      
      // Add to saved items if not already there
      if (!savedItems.some(item => item.id === itemToDonate.id)) {
        setSavedItems([...savedItems, updatedItem]);
      }
      
      // Show success notification
      setNotification({
        open: true,
        message: `${itemToDonate.name} has been donated to ${mockDonationLocations.find(loc => loc.id === locationId).name}!`,
        severity: 'success'
      });
      
      // Close dialog
      setDonationDialogOpen(false);
      setItemToDonate(null);
      
      // Trigger a refresh
      setRefreshTrigger(prev => prev + 1);
    } catch (error) {
      console.error("Error donating item:", error);
      setNotification({
        open: true,
        message: `Error donating item: ${error.message}`,
        severity: 'error'
      });
    } finally {
      setLoading(false);
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
                              animation: item.daysLeft <= 1 && !item.saved ? `${pulseWarning} 2s infinite` : 'none'
                            }}>
                              {item.saved ? 
                                <CheckCircleIcon sx={{ color: secondaryGreen, fontSize: 18 }} /> : 
                                getExpiryStatusIcon(item.daysLeft)
                              }
                            </Box>
                          </ListItemIcon>
                          <ListItemText 
                            primary={item.name} 
                            secondary={item.saved ? 
                              `Used completely before expiry` : 
                              `Expires in ${item.daysLeft} day${item.daysLeft !== 1 ? 's' : ''}`
                            }
                            primaryTypographyProps={{ 
                              color: 'text.primary',
                              sx: item.saved ? { textDecoration: 'line-through' } : {}
                            }}
                            secondaryTypographyProps={{ 
                              color: item.saved ? secondaryGreen : getExpiryStatusColor(item.daysLeft), 
                              fontSize: '0.75rem',
                              sx: item.saved ? { fontStyle: 'italic' } : {}
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
                          {!item.saved && item.daysLeft <= 3 && item.daysLeft >= 0 && (
                            <Button
                              size="small"
                              variant="outlined"
                              color="secondary"
                              startIcon={<VolunteerActivismIcon />}
                              onClick={() => handleDonateItem(item)}
                              sx={{ 
                                ml: 1, 
                                fontSize: '0.7rem',
                                borderColor: 'rgba(74,234,188,0.3)',
                                '&:hover': { 
                                  borderColor: secondaryGreen,
                                  bgcolor: 'rgba(74,234,188,0.05)'
                                }
                              }}
                            >
                              Donate
                            </Button>
                          )}
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
                          <ListItemIcon sx={{ minWidth: 36 }}>
                            {item.saved ? 
                              <CheckCircleIcon sx={{ color: secondaryGreen, fontSize: 18 }} /> :
                              null
                            }
                          </ListItemIcon>
                          <ListItemText 
                            primary={item.name} 
                            secondary={item.saved ? 
                              "Used completely" : 
                              `${item.daysLeft} days until expiry`
                            }
                            primaryTypographyProps={{ 
                              color: 'text.primary',
                              sx: item.saved ? { textDecoration: 'line-through' } : {}
                            }}
                            secondaryTypographyProps={{ 
                              color: item.saved ? secondaryGreen : 'text.secondary', 
                              fontSize: '0.75rem',
                              sx: item.saved ? { fontStyle: 'italic' } : {}
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
                    <Typography sx={{ color: 'text.primary', fontWeight: 'bold' }}>{statValues.total + statValues.categories + statValues.saved}</Typography>
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
          
          {/* New Saved from Waste Card */}
          <Grid item xs={12} md={12}>
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
                    <Typography sx={{ color: secondaryGreen, fontWeight: 'bold' }}>{savedItems.length}</Typography>
                  </Box>
                  Saved from Waste
                </Typography>
                <Divider sx={{ bgcolor: 'rgba(255,255,255,0.05)', mb: 2 }} />
                
                {savedItems.length > 0 ? (
                  <List sx={{ p: 0 }}>
                    {savedItems.map((item) => (
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
                          <ListItemIcon sx={{ minWidth: 36 }}>
                            <CheckCircleIcon sx={{ color: secondaryGreen, fontSize: 18 }} />
                          </ListItemIcon>
                          <ListItemText 
                            primary={item.name} 
                            secondary={`Used completely before expiry`}
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
                  <Typography color="text.secondary">No items saved from waste yet. Use the "Use Item" button to track used items.</Typography>
                )}
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
            <Box sx={{ display: 'flex', gap: 2 }}>
            <Button 
              variant="outlined" 
                color="error"
              size="small"
                startIcon={<DeleteSweepIcon />}
                onClick={() => setDeleteConfirmOpen(true)}
                disabled={!items.length}
                sx={{
                  borderColor: 'rgba(255,80,80,0.3)',
                  '&:hover': { borderColor: dangerRed, bgcolor: 'rgba(255,80,80,0.05)' }
                }}
              >
                Delete All
              </Button>
              
              <Button 
                variant="outlined" 
                size="small"
                startIcon={<FilterListIcon />}
                onClick={() => setViewAllOpen(!viewAllOpen)}
              sx={{
                borderColor: 'rgba(255,255,255,0.1)',
                color: textPrimary,
                '&:hover': { borderColor: primaryPurple, bgcolor: 'rgba(117,93,255,0.05)' }
              }}
            >
                {viewAllOpen ? 'Hide' : 'View All'}
            </Button>
            </Box>
          </Box>
          
          <Divider sx={{ bgcolor: 'rgba(255,255,255,0.05)', mb: 2 }} />
          
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
              <CircularProgress size={40} />
            </Box>
          ) : !items.length ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 4 }}>
            <Typography color="text.secondary" align="center">
                No items found. Upload receipts to start tracking your food.
            </Typography>
          </Box>
          ) : !viewAllOpen ? (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {items.slice(0, 5).map(item => (
                <Chip 
                  key={item.id}
                  label={item.name} 
                  variant="outlined"
                  sx={{ 
                    borderColor: 'rgba(255,255,255,0.1)',
                    bgcolor: 'rgba(255,255,255,0.05)',
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' }
                  }}
                />
              ))}
              {items.length > 5 && (
                <Chip 
                  label={`+${items.length - 5} more`}
                  sx={{ 
                    bgcolor: 'rgba(117,93,255,0.1)', 
                    color: primaryPurple,
                    '&:hover': { bgcolor: 'rgba(117,93,255,0.2)' }
                  }}
                  onClick={() => setViewAllOpen(true)}
                />
              )}
            </Box>
          ) : (
            <Box>
              {/* Updated Filters with more options */}
              <Box sx={{ mb: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Chip 
                  label="All" 
                  color={filter === 'all' ? 'primary' : 'default'}
                  variant={filter === 'all' ? 'filled' : 'outlined'}
                  onClick={() => setFilter('all')}
                  sx={{ 
                    borderColor: 'rgba(255,255,255,0.1)',
                    bgcolor: filter === 'all' ? undefined : 'rgba(255,255,255,0.05)',
                  }}
                />
                <Chip 
                  label="Perishable" 
                  color={filter === 'perishable' ? 'warning' : 'default'}
                  variant={filter === 'perishable' ? 'filled' : 'outlined'}
                  onClick={() => setFilter('perishable')}
                  sx={{ 
                    borderColor: 'rgba(255,255,255,0.1)',
                    bgcolor: filter === 'perishable' ? undefined : 'rgba(255,255,255,0.05)',
                  }}
                />
                <Chip 
                  label="Non-Perishable" 
                  color={filter === 'non-perishable' ? 'success' : 'default'}
                  variant={filter === 'non-perishable' ? 'filled' : 'outlined'}
                  onClick={() => setFilter('non-perishable')}
                  sx={{ 
                    borderColor: 'rgba(255,255,255,0.1)',
                    bgcolor: filter === 'non-perishable' ? undefined : 'rgba(255,255,255,0.05)',
                  }}
                />
                <Chip 
                  label="Saved" 
                  color={filter === 'saved' ? 'success' : 'default'}
                  variant={filter === 'saved' ? 'filled' : 'outlined'}
                  onClick={() => setFilter('saved')}
                  sx={{ 
                    borderColor: 'rgba(255,255,255,0.1)',
                    bgcolor: filter === 'saved' ? undefined : 'rgba(255,255,255,0.05)',
                  }}
                />
                <Chip 
                  label="Expiring Soon" 
                  color={filter === 'expiring' ? 'warning' : 'default'}
                  variant={filter === 'expiring' ? 'filled' : 'outlined'}
                  onClick={() => setFilter('expiring')}
                  sx={{ 
                    borderColor: 'rgba(255,255,255,0.1)',
                    bgcolor: filter === 'expiring' ? undefined : 'rgba(255,255,255,0.05)',
                  }}
                />
                <Chip 
                  label="Expired" 
                  color={filter === 'expired' ? 'error' : 'default'}
                  variant={filter === 'expired' ? 'filled' : 'outlined'}
                  onClick={() => setFilter('expired')}
                  sx={{ 
                    borderColor: 'rgba(255,255,255,0.1)',
                    bgcolor: filter === 'expired' ? undefined : 'rgba(255,255,255,0.05)',
                  }}
                />
                <Chip 
                  label="Dairy" 
                  variant={filter === 'dairy' ? 'filled' : 'outlined'}
                  color={filter === 'dairy' ? 'secondary' : 'default'}
                  onClick={() => setFilter('dairy')}
                  sx={{ 
                    borderColor: 'rgba(255,255,255,0.1)',
                    bgcolor: filter === 'dairy' ? undefined : 'rgba(255,255,255,0.05)',
                  }}
                />
                <Chip 
                  label="Produce" 
                  variant={filter === 'produce' ? 'filled' : 'outlined'}
                  color={filter === 'produce' ? 'success' : 'default'}
                  onClick={() => setFilter('produce')}
                  sx={{ 
                    borderColor: 'rgba(255,255,255,0.1)',
                    bgcolor: filter === 'produce' ? undefined : 'rgba(255,255,255,0.05)',
                  }}
                />
                <Chip 
                  label="Meat" 
                  variant={filter === 'meat' ? 'filled' : 'outlined'}
                  color={filter === 'meat' ? 'default' : 'default'}
                  onClick={() => setFilter('meat')}
                  sx={{ 
                    borderColor: 'rgba(255,255,255,0.1)',
                    bgcolor: filter === 'meat' ? undefined : 'rgba(255,255,255,0.05)',
                  }}
                />
              </Box>
              
              <TableContainer sx={{ mb: 2 }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Item Name</TableCell>
                      <TableCell>Category</TableCell>
                      <TableCell align="center">Type</TableCell>
                      <TableCell align="right">Quantity</TableCell>
                      <TableCell align="right">Price</TableCell>
                      <TableCell align="center">Expiry Date</TableCell>
                      <TableCell align="center">Days Left</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {currentItems.map((item) => (
                      console.log("currentItems map called, item:", item),
                      <TableRow key={item.id} hover>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>
                          <Chip 
                            label={item.category} 
                            size="small" 
                            sx={{ 
                              bgcolor: 'rgba(255,255,255,0.05)',
                              color: 'text.secondary',
                              fontSize: '0.7rem'
                            }}
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Chip 
                            label={item.isPerishable ? 'Perishable' : 'Non-perishable'} 
                            size="small"
                            color={item.isPerishable ? 'warning' : 'success'}
                            sx={{ fontSize: '0.7rem' }}
                          />
                        </TableCell>
                        <TableCell align="right">
                          <Chip 
                            label={item.quantity}
                            size="small"
                            color={item.quantity <= 0 ? 'error' : 'default'}
                            sx={{ fontSize: '0.7rem' }}
                          />
                        </TableCell>
                        <TableCell align="right">{item.price}</TableCell>
                        <TableCell align="center">
                          {item.isPerishable ? safeFormatDisplayDate(item.expiryDate) : '—'}
                        </TableCell>
                        <TableCell align="center">
                          {item.isPerishable ? (
                            <Chip 
                              label={item.daysLeft} 
                              size="small"
                              color={
                                item.daysLeft <= 0 ? 'error' :
                                item.daysLeft <= 3 ? 'warning' : 'default'
                              }
                              sx={{ 
                                minWidth: '36px',
                                fontSize: '0.7rem'
                              }}
                            />
                          ) : (
                            '—'
                          )}
                        </TableCell>
                        <TableCell align="right">
                          <IconButton 
                            size="small"
                            onClick={() => handleEditItem(item)}
                            sx={{ mr: 1 }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton 
                            size="small"
                            color="error"
                            onClick={() => handleDeleteItem(item)}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                          <Button
                            size="small"
                            variant="outlined"
                            color="success"
                            onClick={() => handleUseItem(item)}
                            disabled={item.quantity <= 0 || item.saved}
                            sx={{ ml: 1, fontSize: '0.7rem' }}
                          >
                            Use Item
                          </Button>
                          {item.isPerishable && item.daysLeft <= 3 && item.daysLeft >= 0 && !item.saved && (
                            <Button
                              size="small"
                              variant="outlined"
                              color="secondary"
                              startIcon={<VolunteerActivismIcon />}
                              onClick={() => handleDonateItem(item)}
                              sx={{ 
                                ml: 1, 
                                fontSize: '0.7rem',
                                borderColor: 'rgba(74,234,188,0.3)',
                                '&:hover': { 
                                  borderColor: secondaryGreen,
                                  bgcolor: 'rgba(74,234,188,0.05)'
                                }
                              }}
                            >
                              Donate
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              
              {/* Pagination */}
              {totalPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                  <Pagination 
                    count={totalPages} 
                    page={currentPage} 
                    onChange={handlePageChange}
                    color="primary"
                  />
                </Box>
              )}
            </Box>
          )}
        </Paper>
      </motion.div>
      
      {/* Edit Item Dialog - Updated with more category options */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit {currentItem?.name}</DialogTitle>
        <DialogContent>
          {currentItem && (
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  label="Item Name"
                  value={currentItem.name}
                  onChange={(e) => setCurrentItem({...currentItem, name: e.target.value})}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={currentItem.category}
                    label="Category"
                    onChange={(e) => setCurrentItem({...currentItem, category: e.target.value})}
                  >
                    <MenuItem value="dairy">Dairy</MenuItem>
                    <MenuItem value="meat">Meat</MenuItem>
                    <MenuItem value="produce">Produce</MenuItem>
                    <MenuItem value="bakery">Bakery</MenuItem>
                    <MenuItem value="pantry">Pantry</MenuItem>
                    <MenuItem value="frozen">Frozen</MenuItem>
                    <MenuItem value="canned">Canned</MenuItem>
                    <MenuItem value="snacks">Snacks</MenuItem>
                    <MenuItem value="beverages">Beverages</MenuItem>
                    <MenuItem value="toiletries">Toiletries</MenuItem>
                    <MenuItem value="household">Household</MenuItem>
                    <MenuItem value="pet">Pet</MenuItem>
                    <MenuItem value="other">Other</MenuItem>
                    <MenuItem value="uncategorized">Uncategorized</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Type</InputLabel>
                  <Select
                    value={currentItem.isPerishable}
                    label="Type"
                    onChange={(e) => setCurrentItem({...currentItem, isPerishable: e.target.value})}
                  >
                    <MenuItem value={true}>Perishable</MenuItem>
                    <MenuItem value={false}>Non-Perishable</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Quantity"
                  value={currentItem.quantity}
                  onChange={(e) => setCurrentItem({...currentItem, quantity: e.target.value})}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Price"
                  value={currentItem.price}
                  onChange={(e) => setCurrentItem({...currentItem, price: e.target.value})}
                  fullWidth
                />
              </Grid>
              {/* Only show expiry options if the item is perishable */}
              {currentItem.isPerishable && (
                <>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Expiry Days"
                      type="number"
                      value={currentItem.expiryDays}
                      onChange={(e) => {
                        const days = parseInt(e.target.value);
                        const purchaseDate = currentItem.purchaseDate instanceof Date 
                          ? currentItem.purchaseDate 
                          : new Date(currentItem.purchaseDate);
                        const newExpiryDate = new Date(purchaseDate);
                        newExpiryDate.setDate(newExpiryDate.getDate() + days);
                        
                        setCurrentItem({
                          ...currentItem, 
                          expiryDays: days,
                          expiryDate: newExpiryDate
                        });
                      }}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Expiry Date"
                      type="date"
                      value={safeFormatDate(currentItem.expiryDate)}
                      onChange={(e) => {
                        const newDate = new Date(e.target.value);
                        const purchaseTime = currentItem.purchaseDate instanceof Date 
                          ? currentItem.purchaseDate 
                          : new Date(currentItem.purchaseDate);
                        const timeDiff = newDate.getTime() - purchaseTime.getTime();
                        const daysDiff = Math.round(timeDiff / (1000 * 3600 * 24));
                        
                        setCurrentItem({
                          ...currentItem,
                          expiryDate: newDate,
                          expiryDays: daysDiff
                        });
                      }}
                      InputLabelProps={{ shrink: true }}
                      fullWidth
                    />
                  </Grid>
                </>
              )}
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleSaveEdit} color="primary" variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Delete All Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)}>
        <DialogTitle>Delete All Items?</DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mt: 1 }}>
            This action cannot be undone. All {items.length} items will be permanently deleted from your account.
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleDeleteAllItems} color="error" variant="contained">
            Delete All
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Donation Dialog */}
      <Dialog 
        open={donationDialogOpen} 
        onClose={() => setDonationDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          alignItems: 'center',
          bgcolor: 'rgba(74,234,188,0.05)',
          pb: 2
        }}>
          <VolunteerActivismIcon sx={{ color: secondaryGreen, mr: 1.5 }} />
          Donate {itemToDonate?.name}
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          {itemToDonate && (
            <>
              <Alert severity="info" sx={{ mb: 3 }}>
                This item will expire in {itemToDonate.daysLeft} day{itemToDonate.daysLeft !== 1 ? 's' : ''}. 
                Donating can help someone in need while preventing food waste!
              </Alert>
              
              <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                <LocationOnIcon sx={{ mr: 1, color: primaryPurple }} />
                Nearby Donation Locations
              </Typography>
              
              <Grid container spacing={3}>
                {mockDonationLocations.map((location) => (
                  <Grid item xs={12} md={4} key={location.id}>
                    <Paper 
                      elevation={0}
                      sx={{ 
                        p: 0,
                        borderRadius: 2,
                        overflow: 'hidden',
                        border: '1px solid rgba(255,255,255,0.05)',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-5px)',
                          boxShadow: '0 10px 20px rgba(0,0,0,0.2)'
                        }
                      }}
                    >
                      <Box 
                        sx={{ 
                          height: 140,
                          backgroundImage: `url(${location.image})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          position: 'relative'
                        }}
                      >
                        <Box sx={{ 
                          position: 'absolute',
                          bottom: 0,
                          left: 0,
                          right: 0,
                          p: 1,
                          background: 'linear-gradient(to top, rgba(0,0,0,0.7), rgba(0,0,0,0))',
                          display: 'flex',
                          justifyContent: 'space-between'
                        }}>
                          <Chip 
                            label={location.distance} 
                            size="small"
                            icon={<LocationOnIcon sx={{ fontSize: '0.8rem !important' }} />}
                            sx={{ 
                              bgcolor: 'rgba(0,0,0,0.5)',
                              color: 'white',
                              height: 22,
                              '& .MuiChip-icon': { color: 'white' }
                            }}
                          />
                          {location.acceptsExpiring && (
                            <Chip 
                              label="Accepts Expiring" 
                              size="small"
                              sx={{ 
                                bgcolor: 'rgba(74,234,188,0.2)',
                                color: secondaryGreen,
                                height: 22
                              }}
                            />
                          )}
                        </Box>
                      </Box>
                      
                      <Box sx={{ p: 2, flexGrow: 1 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                          {location.name}
                        </Typography>
                        
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          {location.description}
                        </Typography>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <LocationOnIcon sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                          <Typography variant="body2" color="text.secondary">
                            {location.address}
                          </Typography>
                        </Box>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <AccessTimeIcon sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                          <Typography variant="body2" color="text.secondary">
                            {location.hours}
                          </Typography>
                        </Box>
                      </Box>
                      
                      <Divider sx={{ opacity: 0.1 }} />
                      
                      <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box>
                          <IconButton size="small" sx={{ mr: 1 }}>
                            <CallIcon fontSize="small" />
                          </IconButton>
                          <IconButton size="small">
                            <DirectionsIcon fontSize="small" />
                          </IconButton>
                        </Box>
                        
                        <Button 
                          variant="contained" 
                          color="secondary"
                          size="small"
                          onClick={() => handleCompleteDonation(location.id)}
                          disabled={!location.acceptsExpiring && itemToDonate.daysLeft <= 1}
                        >
                          Donate Here
                        </Button>
                      </Box>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
              
              <Box sx={{ mt: 3, p: 2, bgcolor: 'rgba(255,255,255,0.03)', borderRadius: 2 }}>
                <Typography variant="subtitle2" sx={{ mb: 1, color: primaryPurple }}>
                  About Food Donation
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  When donating food items, be sure they are properly sealed and labeled with the 
                  item name and expiration date. Most shelters and food banks welcome unopened 
                  items that are close to their expiration date, especially protein-rich and 
                  non-perishable foods.
                </Typography>
              </Box>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDonationDialogOpen(false)} color="inherit">
            Cancel
          </Button>
          <Button 
            startIcon={<ShareIcon />}
            onClick={() => {
              setNotification({
                open: true,
                message: "Sharing options would appear here in a production app",
                severity: 'info'
              });
            }} 
            color="primary"
          >
            Share These Locations
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Notifications */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
      >
        <Alert 
          onClose={handleCloseNotification} 
          severity={notification.severity} 
          sx={{ width: '100%' }}
          variant="filled"
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Dashboard;
