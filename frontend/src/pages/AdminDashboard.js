import React, { useState, useEffect } from 'react';
import {
  Box, Container, Typography, Grid, Card, CardContent, Avatar,
  Chip, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, CircularProgress, Button, Tab, Tabs
} from '@mui/material';
import { doctorService, appointmentService } from '../services/doctorService';
import PeopleIcon from '@mui/icons-material/People';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';

const AdminDashboard = () => {
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState(0);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [docRes] = await Promise.all([
          doctorService.getAll({ page: 0, size: 50 }),
        ]);
        setDoctors(docRes.data.data.content || []);
      } catch {
        // empty state
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const statCards = [
    { label: 'Total Doctors', value: doctors.length, icon: <LocalHospitalIcon />, color: '#1976d2' },
    { label: 'Active Doctors', value: doctors.filter(d => d.available).length, icon: <PeopleIcon />, color: '#00897b' },
    { label: 'Appointments', value: appointments.length, icon: <CalendarMonthIcon />, color: '#f57c00' },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" fontWeight={700} gutterBottom>Admin Dashboard</Typography>
      <Typography color="text.secondary" mb={4}>Manage doctors, appointments, and platform settings</Typography>

      <Grid container spacing={3} mb={4}>
        {statCards.map((s) => (
          <Grid item xs={12} sm={4} key={s.label}>
            <Card>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography color="text.secondary" variant="body2">{s.label}</Typography>
                    <Typography variant="h4" fontWeight={700}>{s.value}</Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: s.color, width: 52, height: 52 }}>{s.icon}</Avatar>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ px: 2 }}>
            <Tab label="Doctors" />
            <Tab label="Appointments" />
          </Tabs>
        </Box>

        <CardContent>
          {loading ? (
            <Box display="flex" justifyContent="center" py={4}><CircularProgress /></Box>
          ) : tab === 0 ? (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Specialization</TableCell>
                    <TableCell>Hospital</TableCell>
                    <TableCell>Fee</TableCell>
                    <TableCell>Rating</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {doctors.map((doc) => (
                    <TableRow key={doc.id} hover>
                      <TableCell>Dr. {doc.firstName} {doc.lastName}</TableCell>
                      <TableCell>{doc.specialization}</TableCell>
                      <TableCell>{doc.hospitalName || '—'}</TableCell>
                      <TableCell>₹{doc.consultationFee}</TableCell>
                      <TableCell>⭐ {doc.rating?.toFixed(1) || '0.0'}</TableCell>
                      <TableCell>
                        <Chip
                          label={doc.available ? 'Active' : 'Inactive'}
                          color={doc.available ? 'success' : 'default'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Button
                          size="small" color="error" variant="outlined"
                          onClick={() => doctorService.delete(doc.id).then(() =>
                            setDoctors(prev => prev.filter(d => d.id !== doc.id))
                          )}
                        >
                          Remove
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Box textAlign="center" py={4}>
              <Typography color="text.secondary">Appointment management coming soon</Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    </Container>
  );
};

export default AdminDashboard;
