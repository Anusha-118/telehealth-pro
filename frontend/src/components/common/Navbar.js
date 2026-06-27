import React, { useState } from 'react';
import {
  AppBar, Toolbar, Typography, Button, Box, IconButton,
  Menu, MenuItem, Avatar, Chip
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenu = (e) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleLogout = () => {
    dispatch(logout());
    handleClose();
    navigate('/');
  };

  const getDashboardPath = () => {
    if (!user) return '/';
    const roleMap = { PATIENT: '/dashboard/patient', DOCTOR: '/dashboard/doctor', ADMIN: '/dashboard/admin' };
    return roleMap[user.role] || '/';
  };

  return (
    <AppBar position="sticky" elevation={1} sx={{ bgcolor: 'white', color: 'text.primary' }}>
      <Toolbar>
        <LocalHospitalIcon sx={{ color: 'primary.main', mr: 1 }} />
        <Typography
          variant="h6"
          fontWeight={700}
          sx={{ flexGrow: 0, cursor: 'pointer', color: 'primary.main', mr: 4 }}
          onClick={() => navigate('/')}
        >
          TeleHealth Pro
        </Typography>

        <Box sx={{ flexGrow: 1, display: 'flex', gap: 1 }}>
          <Button color="inherit" onClick={() => navigate('/')}>Home</Button>
          <Button color="inherit" onClick={() => navigate('/doctors')}>Find Doctors</Button>
        </Box>

        {user ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Chip
              label={user.role}
              size="small"
              color="primary"
              variant="outlined"
            />
            <IconButton onClick={handleMenu}>
              <AccountCircleIcon color="primary" />
            </IconButton>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
              <MenuItem onClick={() => { navigate(getDashboardPath()); handleClose(); }}>
                Dashboard
              </MenuItem>
              <MenuItem onClick={() => { navigate('/profile'); handleClose(); }}>
                My Profile
              </MenuItem>
              <MenuItem onClick={() => { navigate('/appointments'); handleClose(); }}>
                Appointments
              </MenuItem>
              <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
                Logout
              </MenuItem>
            </Menu>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button variant="outlined" onClick={() => navigate('/login')}>Login</Button>
            <Button variant="contained" onClick={() => navigate('/register')}>Sign Up</Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
