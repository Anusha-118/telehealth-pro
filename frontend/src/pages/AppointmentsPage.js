import React, { useState, useEffect } from 'react';
import {
  Box, Container, Typography, Card, CardContent, Chip,
  Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, CircularProgress, Button, Alert
} from '@mui/material';
import { useSelector } from 'react-redux';
import { appointmentService } from '../services/doctorService';
import { toast } from 'react-toastify';

const statusColors = {
  PENDING: 'warning', CONFIRMED: 'info', COMPLETED: 'success',
  CANCELLED: 'error', NO_SHOW: 'default',
};

const AppointmentsPage = () => {
  const { user } = useSelector((state) => state.auth);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const userId = user?.userId || user?.sub;
        const res = user?.role === 'DOCTOR'
          ? await appointmentService.getDoctorAppointments(userId, { page: 0, size: 50 })
          : await appointmentService.getPatientAppointments(userId, { page: 0, size: 50 });
        setAppointments(res.data.data.content || []);
      } catch {
        setError('Could not load appointments.');
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, [user]);

  const handleCancel = async (id) => {
    try {
      await appointmentService.cancel(id);
      setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: 'CANCELLED' } : a));
      toast.success('Appointment cancelled');
    } catch {
      toast.error('Could not cancel appointment');
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" fontWeight={700} gutterBottom>My Appointments</Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Card>
        <CardContent>
          {loading ? (
            <Box display="flex" justifyContent="center" py={6}><CircularProgress /></Box>
          ) : appointments.length === 0 ? (
            <Box textAlign="center" py={6}>
              <Typography color="text.secondary">No appointments found</Typography>
            </Box>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>#</TableCell>
                    <TableCell>{user?.role === 'DOCTOR' ? 'Patient' : 'Doctor'}</TableCell>
                    <TableCell>Specialization</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Time</TableCell>
                    <TableCell>Fee</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {appointments.map((apt, index) => (
                    <TableRow key={apt.id} hover>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>
                        {user?.role === 'DOCTOR' ? apt.patientName : `Dr. ${apt.doctorName}`}
                      </TableCell>
                      <TableCell>{apt.specialization || '—'}</TableCell>
                      <TableCell>{apt.appointmentDate}</TableCell>
                      <TableCell>{apt.appointmentTime}</TableCell>
                      <TableCell>₹{apt.consultationFee}</TableCell>
                      <TableCell>
                        <Chip label={apt.status} color={statusColors[apt.status]} size="small" />
                      </TableCell>
                      <TableCell>
                        {['PENDING', 'CONFIRMED'].includes(apt.status) && (
                          <Button
                            size="small" color="error" variant="outlined"
                            onClick={() => handleCancel(apt.id)}
                          >
                            Cancel
                          </Button>
                        )}
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

export default AppointmentsPage;
