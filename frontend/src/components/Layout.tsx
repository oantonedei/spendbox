import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
  Fab,
  Button,
  useTheme,
  useMediaQuery,
  Avatar,
  Divider,
  Badge,
  Tooltip,
  BottomNavigation,
  BottomNavigationAction,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  ListItemButton,
  Backdrop,
  Fade,
  Zoom
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Receipt as ReceiptIcon,
  Add as AddIcon,
  Analytics as AnalyticsIcon,
  Person as PersonIcon,
  Logout as LogoutIcon,
  Notifications as NotificationsIcon,
  AccountCircle as AccountCircleIcon,
  CameraAlt as CameraIcon,
  Edit as EditIcon,
  Mic as MicIcon,
  Close as CloseIcon
} from '@mui/icons-material';

const Layout: React.FC = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [addExpenseOverlayOpen, setAddExpenseOverlayOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useAuth();

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
    { text: 'Expenses', icon: <ReceiptIcon />, path: '/expenses' },
    { text: 'Analytics', icon: <AnalyticsIcon />, path: '/analytics' },
    { text: 'Profile', icon: <PersonIcon />, path: '/profile' },
  ];

  const addExpenseOptions = [
    {
      title: 'Camera',
      description: 'Take a photo',
      icon: <CameraIcon />,
      action: () => {
        setAddExpenseOverlayOpen(false);
        navigate('/add-expense?mode=camera');
      },
      position: { top: -120, left: 0 }, // Top
      delay: 0
    },
    {
      title: 'Text',
      description: 'Manual entry',
      icon: <EditIcon />,
      action: () => {
        setAddExpenseOverlayOpen(false);
        navigate('/add-expense?mode=text');
      },
      position: { top: -85, left: -85 }, // Top-left
      delay: 100
    },
    {
      title: 'Voice',
      description: 'Speak details',
      icon: <MicIcon />,
      action: () => {
        setAddExpenseOverlayOpen(false);
        navigate('/add-expense?mode=voice');
      },
      position: { top: 0, left: -120 }, // Left
      delay: 200
    },
    {
      title: 'Scan',
      description: 'Scan receipt',
      icon: <CameraIcon />,
      action: () => {
        setAddExpenseOverlayOpen(false);
        navigate('/add-expense?mode=scan');
      },
      position: { top: 85, left: -85 }, // Bottom-left
      delay: 300
    },
    {
      title: 'Quick',
      description: 'Quick add',
      icon: <AddIcon />,
      action: () => {
        setAddExpenseOverlayOpen(false);
        navigate('/add-expense?mode=quick');
      },
      position: { top: 120, left: 0 }, // Bottom
      delay: 400
    }
  ];

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    if (isMobile) {
      setDrawerOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActiveRoute = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const handleAddExpenseClick = () => {
    if (isMobile) {
      setAddExpenseOverlayOpen(true);
    } else {
      navigate('/add-expense');
    }
  };

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Header - Add top margin to avoid navbar overlap */}
      <Box sx={{ 
        p: 3, 
        textAlign: 'center',
        background: '#ffffff',
        borderBottom: '1px solid #e5e7eb',
        mt: { md: 8 }, // Add top margin on desktop to avoid navbar overlap
      }}>
        <Avatar
          sx={{
            width: 64,
            height: 64,
            mx: 'auto',
            mb: 2,
            background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
            fontSize: '1.5rem',
            fontWeight: 'bold'
          }}
        >
          {user?.firstName?.charAt(0) || 'U'}
        </Avatar>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5, color: '#1f2937' }}>
          {user?.firstName} {user?.lastName}
        </Typography>
        <Typography variant="body2" sx={{ color: '#6b7280' }}>
          {user?.subscription?.plan} Plan
        </Typography>
      </Box>

      <Divider sx={{ borderColor: '#e5e7eb' }} />

      {/* Navigation - Make it scrollable if needed */}
      <List sx={{ 
        flex: 1, 
        pt: 2, 
        overflow: 'auto',
        width: '100%',
        '&::-webkit-scrollbar': {
          width: '8px',
        },
        '&::-webkit-scrollbar-track': {
          background: '#f1f1f1',
        },
        '&::-webkit-scrollbar-thumb': {
          background: '#c1c1c1',
          borderRadius: '4px',
        },
        '&::-webkit-scrollbar-thumb:hover': {
          background: '#a8a8a8',
        },
      }}>
        {menuItems.map((item) => (
          <ListItem
            button
            key={item.text}
            onClick={() => handleNavigation(item.path)}
            sx={{
              mx: 1,
              mb: 0.5,
              borderRadius: 1,
              width: 'calc(100% - 16px)', // Account for mx: 1 (8px on each side)
              backgroundColor: isActiveRoute(item.path) 
                ? 'rgba(99, 102, 241, 0.1)' 
                : 'transparent',
              '&:hover': {
                backgroundColor: 'rgba(99, 102, 241, 0.05)',
              },
              transition: 'all 0.2s ease-in-out',
            }}
          >
            <ListItemIcon sx={{ 
              color: isActiveRoute(item.path) ? '#6366F1' : '#6b7280',
              minWidth: 40
            }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText 
              primary={item.text} 
              sx={{
                '& .MuiListItemText-primary': {
                  fontWeight: isActiveRoute(item.path) ? 600 : 400,
                  color: isActiveRoute(item.path) ? '#6366F1' : '#374151',
                }
              }}
            />
          </ListItem>
        ))}
      </List>

      {/* Logout */}
      <Box sx={{ p: 2, flexShrink: 0 }}>
        <ListItem
          button
          onClick={handleLogout}
          sx={{
            borderRadius: 1,
            backgroundColor: 'rgba(239, 68, 68, 0.05)',
            '&:hover': {
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
            },
            transition: 'all 0.2s ease-in-out',
          }}
        >
          <ListItemIcon sx={{ color: '#EF4444', minWidth: 40 }}>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText 
            primary="Logout" 
            sx={{
              '& .MuiListItemText-primary': {
                color: '#EF4444',
                fontWeight: 500,
              }
            }}
          />
        </ListItem>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Top App Bar */}
      <AppBar 
        position="fixed" 
        sx={{ 
          zIndex: theme.zIndex.drawer + 1,
          background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
          borderRadius: 0,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography 
              variant="h6" 
              noWrap 
              component="div" 
              sx={{ 
                fontWeight: 700,
                background: 'linear-gradient(45deg, #ffffff 30%, #f0f0f0 90%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              SpendBox
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {/* AI Button - Mobile Only */}
            <Button
              variant="contained"
              size="small"
              sx={{
                display: { xs: 'flex', md: 'none' },
                background: 'rgba(255,255,255,0.2)',
                color: 'white',
                borderRadius: 2,
                px: 2,
                py: 0.5,
                fontSize: '0.75rem',
                fontWeight: 600,
                textTransform: 'none',
                '&:hover': {
                  background: 'rgba(255,255,255,0.3)',
                },
              }}
            >
              AI Assistant
            </Button>

            {/* Desktop Actions */}
            <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1 }}>
              <Tooltip title="Notifications">
                <IconButton 
                  color="inherit"
                  sx={{ 
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,0.1)',
                    }
                  }}
                >
                  <Badge badgeContent={3} color="error">
                    <NotificationsIcon />
                  </Badge>
                </IconButton>
              </Tooltip>
              
              <Tooltip title="Profile">
                <IconButton 
                  color="inherit"
                  onClick={() => navigate('/profile')}
                  sx={{ 
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,0.1)',
                    }
                  }}
                >
                  <AccountCircleIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Sidebar Navigation - Desktop Only */}
      <Box
        component="nav"
        sx={{ 
          width: { md: 280 }, 
          flexShrink: { md: 0 },
          zIndex: theme.zIndex.drawer,
          display: { xs: 'none', md: 'block' }
        }}
      >
        {/* Desktop drawer */}
        <Drawer
          variant="permanent"
          sx={{
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: 280,
              background: '#ffffff',
              borderRight: '1px solid #e5e7eb',
              borderRadius: 0,
              position: 'fixed',
              height: '100vh',
              top: 0,
              left: 0,
              overflow: 'hidden',
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={drawerOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box', 
            width: 280,
            background: '#ffffff',
            borderRight: '1px solid #e5e7eb',
            borderRadius: 0,
            overflow: 'hidden',
          },
        }}
      >
        {drawer}
      </Drawer>

      {/* Main Content - Center the content properly */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3 },
          width: { md: `calc(100% - 280px)` },
          mt: { xs: 7, sm: 8 },
          minHeight: '100vh',
          background: '#ffffff',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center', // Center content horizontally
          pb: { xs: 9, md: 3 }, // Add bottom padding on mobile for bottom navigation
        }}
      >
        {/* Content wrapper */}
        <Box sx={{ 
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center', // Center content horizontally
        }}>
          <Outlet />
        </Box>
        
        {/* Floating Action Button for Mobile */}
        {isMobile && (
          <Fab
            color="primary"
            aria-label="add expense"
            onClick={handleAddExpenseClick}
            sx={{
              position: 'fixed',
              bottom: 80, // Above bottom navigation
              right: 16,
              background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
                transform: 'scale(1.1)',
              },
              transition: 'all 0.2s ease-in-out',
              zIndex: theme.zIndex.fab,
            }}
          >
            <AddIcon />
          </Fab>
        )}
      </Box>

      {/* Mobile Bottom Navigation */}
      {isMobile && (
        <Paper 
          sx={{ 
            position: 'fixed', 
            bottom: 0, 
            left: 0, 
            right: 0, 
            zIndex: theme.zIndex.drawer + 1,
            borderTop: '1px solid #e5e7eb',
          }} 
          elevation={3}
        >
          <BottomNavigation
            value={location.pathname}
            onChange={(event, newValue) => {
              handleNavigation(newValue);
            }}
            sx={{
              bgcolor: '#ffffff',
              height: 72, // Increased height for bigger touch targets
              '& .MuiBottomNavigationAction-root': {
                color: '#6b7280',
                minWidth: 'auto',
                padding: '8px 12px 4px',
                '&.Mui-selected': {
                  color: '#6366F1',
                },
                '&:hover': {
                  bgcolor: 'rgba(99, 102, 241, 0.05)',
                },
                '& .MuiBottomNavigationAction-label': {
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  marginTop: '4px',
                },
                '& .MuiSvgIcon-root': {
                  fontSize: '1.5rem', // Bigger icons
                },
              },
            }}
          >
            {menuItems.map((item) => (
              <BottomNavigationAction
                key={item.text}
                label={item.text}
                value={item.path}
                icon={item.icon}
              />
            ))}
          </BottomNavigation>
        </Paper>
      )}

      {/* Animated Add Expense Overlay - Mobile Only */}
      {isMobile && (
        <Fade in={addExpenseOverlayOpen} timeout={300}>
          <Backdrop
            open={addExpenseOverlayOpen}
            onClick={() => setAddExpenseOverlayOpen(false)}
            sx={{
              zIndex: theme.zIndex.fab + 1,
              backgroundColor: 'rgba(99, 102, 241, 0.1)',
              backdropFilter: 'blur(4px)',
            }}
          >
            <Box
              sx={{
                position: 'fixed',
                bottom: 80,
                right: 16,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 2,
              }}
            >
              {/* Option Buttons */}
              {addExpenseOptions.map((option, index) => (
                <Zoom
                  key={option.title}
                  in={addExpenseOverlayOpen}
                  timeout={300 + option.delay}
                  style={{ transitionDelay: `${option.delay}ms` }}
                >
                  <Box
                                         sx={{
                       position: 'absolute',
                       ...option.position,
                       display: 'flex',
                       flexDirection: 'column',
                       alignItems: 'center',
                     }}
                  >
                                         <Fab
                       size="medium"
                       onClick={option.action}
                       sx={{
                         background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
                         color: 'white',
                         width: 56,
                         height: 56,
                         boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
                         '&:hover': {
                           background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
                           transform: 'scale(1.1)',
                           boxShadow: '0 6px 16px rgba(99, 102, 241, 0.4)',
                         },
                         transition: 'all 0.2s ease-in-out',
                       }}
                     >
                       {option.icon}
                     </Fab>
                  </Box>
                </Zoom>
              ))}

              {/* Center Plus Button (always visible) */}
              <Fab
                color="primary"
                aria-label="add expense"
                onClick={() => setAddExpenseOverlayOpen(false)}
                sx={{
                  background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
                    transform: 'scale(1.1)',
                  },
                  transition: 'all 0.2s ease-in-out',
                  zIndex: theme.zIndex.fab + 2,
                }}
              >
                <AddIcon />
              </Fab>
            </Box>
          </Backdrop>
        </Fade>
      )}
    </Box>
  );
};

export default Layout; 