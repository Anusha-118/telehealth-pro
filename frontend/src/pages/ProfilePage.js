import React from 'react';
import {
  Box, Container, Typography, Card, CardContent,
  Avatar, Grid, Chip, Divider
} from '@mui/material';
import { useSelector } from 'react-redux';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const ProfilePage = () => {
  const { user } = useSelector((state) => state.auth);

  const roleColor = { PATIENT: 'success', DOCTOR: 'primary', ADMIN: 'error' };

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Typography variant="h4" fontWeight={700} gutterBottom>My Profile</Typography>

      <Card>
        <CardContent sx={{ p: 4 }}>
          <Box display="flex" alignItems="center" gap={3} mb={4}>
            <Avatar sx={{ width: 96, height: 96, bgcolor: 'primary.main', fontSize: '2.5rem' }}>
              <AccountCircleIcon sx={{ fontSize: '3rem' }} />
            </Avatar>
            <Box>
              <Typography variant="h5" fontWeight={700}>
                {user?.role === 'DOCTOR' ? 'Dr. ' : ''}{user?.fullName || user?.sub || user?.email || 'User'}
              </Typography>
              <Chip
                label={user?.role}
                color={roleColor[user?.role] || 'default'}
                size="small"
                sx={{ mt: 0.5 }}
              />
            </Box>
          </Box>

          <Divider sx={{ mb: 3 }} />

          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Typography variant="caption" color="text.secondary">Email</Typography>
              <Typography fontWeight={500}>{user?.sub || '—'}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="caption" color="text.secondary">Role</Typography>
              <Typography fontWeight={500}>{user?.role || '—'}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="caption" color="text.secondary">User ID</Typography>
              <Typography fontWeight={500}>{user?.userId || '—'}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="caption" color="text.secondary">Account Status</Typography>
              <Chip label="Active" color="success" size="small" />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Container>
  );
};

export default ProfilePage;
