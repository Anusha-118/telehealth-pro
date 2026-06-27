import React, { useState, useEffect } from 'react';
import {
  Box, Container, Typography, Card, CardContent, Button,
  Grid, TextField, Avatar, Rating, Chip, CircularProgress, Alert
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { doctorService, appointmentService } from '../services/doctorService';
import { toast } from 'react-toastify';

const BookAppointmentPage = () => {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ appointmentDate: '', appointmentTime: '', reasonForVisit: '' });

  useEffect(() => {
    doctorService.getById(doctorId).then(res => setDoctor(res.data.data));
  }, [doctorId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.appointmentDate || !form.appointmentTime) {
      toast.error('Please select date and time');
      return;
    }
    setLoading(true);
    try {
      await appointmentService.book(user?.userId || user?.sub, {
        doctorId: Number(doctorId),
        ...form,
      });
      toast.success('Appointment booked successfully!');
      navigate('/appointments');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Booking failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!doctor) return <Box display="flex" justifyContent="center" pt={8}><CircularProgress /></Box>;

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Typography variant="h4" fontWeight={700} gutterBottom>Book Appointment</Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={5}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2} mb={2}>
                <Avatar sx={{ width: 64, height: 64, bgcolor: 'primary.main', fontSize: '1.5rem' }}>
                  {doctor.firstName?.[0]}{doctor.lastName?.[0]}
                </Avatar>
                <Box>
                  <Typography variant="h6" fontWeight={700}>Dr. {doctor.firstName} {doctor.lastName}</Typography>
                  <Chip label={doctor.specialization} size="small" color="primary" variant="outlined" />
                </Box>
              </Box>
              <Typography variant="body2" color="text.secondary">🏥 {doctor.hospitalName}</Typography>
              <Typography variant="body2" color="text.secondary">🎓 {doctor.qualification} • {doctor.experienceYears} yrs</Typography>
              <Box display="flex" alignItems="center" gap={1} mt={1}>
                <Rating value={doctor.rating || 0} readOnly size="small" />
                <Typography variant="body2">({doctor.totalReviews} reviews)</Typography>
              </Box>
              <Typography variant="h5" color="primary" fontWeight={700} mt={2}>
                ₹{doctor.consultationFee}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={7}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>Select Date & Time</Typography>
              <Box component="form" onSubmit={handleSubmit}>
                <TextField
                  fullWidth type="date" label="Appointment Date"
                  InputLabelProps={{ shrink: true }} margin="normal"
                  inputProps={{ min: new Date().toISOString().split('T')[0] }}
                  value={form.appointmentDate}
                  onChange={(e) => setForm({ ...form, appointmentDate: e.target.value })}
                />
                <TextField
                  fullWidth type="time" label="Appointment Time"
                  InputLabelProps={{ shrink: true }} margin="normal"
                  value={form.appointmentTime}
                  onChange={(e) => setForm({ ...form, appointmentTime: e.target.value })}
                />
                <TextField
                  fullWidth multiline rows={3} label="Reason for Visit (optional)"
                  margin="normal"
                  value={form.reasonForVisit}
                  onChange={(e) => setForm({ ...form, reasonForVisit: e.target.value })}
                />
                <Button
                  type="submit" fullWidth variant="contained"
                  size="large" sx={{ mt: 2 }} disabled={loading}
                >
                  {loading ? <CircularProgress size={24} color="inherit" /> : 'Confirm Booking'}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default BookAppointmentPage;
