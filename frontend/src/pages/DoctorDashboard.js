import React, { useState, useEffect } from 'react';
import {
  Box, Container, Typography, Grid, Card, CardContent, Avatar,
  Chip, Button, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, CircularProgress, Switch, FormControlLabel
} from '@mui/material';
import { useSelector } from 'react-redux';
import { appointmentService, doctorService } from '../services/doctorService';
import { toast } from 'react-toastify';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PeopleIcon from '@mui/icons-material/People';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const statusColors = {
  PENDING: 'warning', CONFIRMED: 'info', COMPLETED: 'success',
  CANCELLED: 'error', NO_SHOW: 'default',
};

const DoctorDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const [appointments, setAppointments] = useState([]);
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, today: 0, completed: 0 });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const docRes = await doctorService.getAll({ page: 0, size: 100 });
        const docs = docRes.data.data.content || [];
        const myDoc = docs.find(d => d.userId === (user?.userId || user?.sub));
        if (myDoc) {
          setDoctor(myDoc);
          const apptRes = await appointmentService.getDoctorAppointments(myDoc.id, { page: 0, size: 20 });
          const data = apptRes.data.data.content || [];
          setAppointments(data);
          const today = new Date().toISOString().split('T')[0];
          setStats({
            total: data.length,
            today: data.filter(a => a.appointmentDate === today).length,
            completed: data.filter(a => a.status === 'COMPLETED').length,
          });
        }
      } catch {
        // empty state
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const handleStatusUpdate = async (id, status) => {
    try {
      await appointmentService.updateStatus(id, status);
      setAppointments(prev => prev.map(a => a.id === id ? { ...a, status } : a));
      toast.success(`Appointment marked as ${status}`);
    } catch {
      toast.error('Failed to update status');
    }
  };

  const statCards = [
    { label: 'Total Appointments', value: stats.total, icon: <CalendarMonthIcon />, color: '#1976d2' },
    { label: "Today's Appointments", value: stats.today, icon: <PeopleIcon />, color: '#00897b' },
    { label: 'Completed', value: stats.completed, icon: <CheckCircleIcon />, color: '#7b1fa2' },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
          <Typography variant="h4" fontWeight={700}>Doctor Dashboard</Typography>
          {doctor && (
            <Typography color="text.secondary">
              Dr. {doctor.firstName} {doctor.lastName} • {doctor.specialization}
            </Typography>
          )}
        </Box>
        {doctor && (
          <Chip
            label={doctor.available ? 'Available' : 'Unavailable'}
            color={doctor.available ? 'success' : 'error'}
            variant="filled"
            size="medium"
          />
        )}
      </Box>

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
                  <Avatar sx={{ bgcolor: stat.color, width: 52, height: 52 }}>{stat.icon}</Avatar>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Card>
        <CardContent>
          <Typography variant="h6" fontWeight={600} gutterBottom>Appointment Requests</Typography>
          {loading ? (
            <Box display="flex" justifyContent="center" py={4}><CircularProgress /></Box>
          ) : appointments.length === 0 ? (
            <Box textAlign="center" py={6}>
              <Typography color="text.secondary">No appointments yet</Typography>
            </Box>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Patient</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Time</TableCell>
                    <TableCell>Reason</TableCell>
                    <TableCell>Fee</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {appointments.map((apt) => (
                    <TableRow key={apt.id} hover>
                      <TableCell>{apt.patientName}</TableCell>
                      <TableCell>{apt.appointmentDate}</TableCell>
                      <TableCell>{apt.appointmentTime}</TableCell>
                      <TableCell sx={{ maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {apt.reasonForVisit || '—'}
                      </TableCell>
                      <TableCell>₹{apt.consultationFee}</TableCell>
                      <TableCell>
                        <Chip label={apt.status} color={statusColors[apt.status]} size="small" />
                      </TableCell>
                      <TableCell>
                        <Box display="flex" gap={1}>
                          {apt.status === 'PENDING' && (
                            <Button
                              size="small" variant="contained" color="success"
                              onClick={() => handleStatusUpdate(apt.id, 'CONFIRMED')}
                            >
                              Confirm
                            </Button>
                          )}
                          {apt.status === 'CONFIRMED' && (
                            <Button
                              size="small" variant="contained" color="primary"
                              onClick={() => handleStatusUpdate(apt.id, 'COMPLETED')}
                            >
                              Complete
                            </Button>
                          )}
                        </Box>
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

export default DoctorDashboard;
