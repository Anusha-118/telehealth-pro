import React, { useState, useEffect } from 'react';
import {
  Box, Container, Typography, Grid, Card, CardContent,
  Chip, Button, Avatar, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, CircularProgress
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { appointmentService } from '../services/doctorService';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import ReceiptIcon from '@mui/icons-material/Receipt';
import SearchIcon from '@mui/icons-material/Search';

const statusColors = {
  PENDING: 'warning',
  CONFIRMED: 'info',
  COMPLETED: 'success',
  CANCELLED: 'error',
  NO_SHOW: 'default',
};

const PatientDashboard = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, upcoming: 0, completed: 0 });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Using userId as patientId for demo - in production you'd get patientId from profile
        const res = await appointmentService.getPatientAppointments(user?.userId || user?.sub, { page: 0, size: 10 });
        const data = res.data.data.content || [];
        setAppointments(data);
        setStats({
          total: data.length,
          upcoming: data.filter(a => ['PENDING', 'CONFIRMED'].includes(a.status)).length,
          completed: data.filter(a => a.status === 'COMPLETED').length,
        });
      } catch {
        // Show empty state for demo
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const statCards = [
    { label: 'Total Appointments', value: stats.total, icon: <CalendarMonthIcon />, color: '#1976d2' },
    { label: 'Upcoming', value: stats.upcoming, icon: <LocalHospitalIcon />, color: '#00897b' },
    { label: 'Completed', value: stats.completed, icon: <ReceiptIcon />, color: '#7b1fa2' },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
          <Typography variant="h4" fontWeight={700}>Patient Dashboard</Typography>
          <Typography color="text.secondary">Welcome back, {user?.sub || 'Patient'}</Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<SearchIcon />}
          onClick={() => navigate('/doctors')}
          size="large"
        >
          Find a Doctor
        </Button>
      </Box>

      {/* Stats */}
      <Grid container spacing={3} mb={4}>
        {statCards.map((stat) => (
          <Grid item xs={12} sm={4} key={stat.label}>
            <Card>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography color="text.secondary" variant="body2">{stat.label}</Typography>
                    <Typography variant="h4" fontWeight={700}>{stat.value}</Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: stat.color, width: 52, height: 52 }}>
                    {stat.icon}
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Recent Appointments */}
      <Card>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h6" fontWeight={600}>Recent Appointments</Typography>
            <Button onClick={() => navigate('/appointments')}>View All</Button>
          </Box>

          {loading ? (
            <Box display="flex" justifyContent="center" py={4}><CircularProgress /></Box>
          ) : appointments.length === 0 ? (
            <Box textAlign="center" py={6}>
              <Typography color="text.secondary" gutterBottom>No appointments yet</Typography>
              <Button variant="contained" onClick={() => navigate('/doctors')}>
                Book Your First Appointment
              </Button>
            </Box>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Doctor</TableCell>
                    <TableCell>Specialization</TableCell>
                    <TableCell>Date & Time</TableCell>
                    <TableCell>Fee</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {appointments.slice(0, 5).map((apt) => (
                    <TableRow key={apt.id} hover>
                      <TableCell>Dr. {apt.doctorName}</TableCell>
                      <TableCell>{apt.specialization}</TableCell>
                      <TableCell>
                        {apt.appointmentDate} at {apt.appointmentTime}
                      </TableCell>
                      <TableCell>₹{apt.consultationFee}</TableCell>
                      <TableCell>
                        <Chip
                          label={apt.status}
                          color={statusColors[apt.status] || 'default'}
                          size="small"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>
    </Container>
  );
};

export default PatientDashboard;
