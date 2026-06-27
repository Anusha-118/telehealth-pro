import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Card, CardContent, Button, Avatar, Rating, Chip, Grid, CircularProgress, Divider } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { doctorService } from '../services/doctorService';

const DoctorDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);

  useEffect(() => {
    doctorService.getById(id).then(res => setDoctor(res.data.data)).catch(() => navigate('/doctors'));
  }, [id]);

  if (!doctor) return <Box display="flex" justifyContent="center" pt={8}><CircularProgress /></Box>;

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Card>
        <CardContent sx={{ p: 4 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4} textAlign="center">
              <Avatar sx={{ width: 120, height: 120, bgcolor: 'primary.main', fontSize: '3rem', mx: 'auto', mb: 2 }}>
                {doctor.firstName?.[0]}{doctor.lastName?.[0]}
              </Avatar>
              <Typography variant="h5" fontWeight={700}>Dr. {doctor.firstName} {doctor.lastName}</Typography>
              <Chip label={doctor.specialization} color="primary" sx={{ mt: 1 }} />
              <Box display="flex" justifyContent="center" alignItems="center" gap={1} mt={2}>
                <Rating value={doctor.rating || 0} readOnly precision={0.5} />
                <Typography>({doctor.totalReviews})</Typography>
              </Box>
              <Typography variant="h4" color="primary" fontWeight={700} mt={2}>₹{doctor.consultationFee}</Typography>
              <Button
                variant="contained" size="large" fullWidth sx={{ mt: 2 }}
                disabled={!doctor.available}
                onClick={() => navigate(`/book/${doctor.id}`)}
              >
                {doctor.available ? 'Book Appointment' : 'Not Available'}
              </Button>
            </Grid>
            <Grid item xs={12} md={8}>
              <Typography variant="h6" fontWeight={600} gutterBottom>About</Typography>
              <Typography color="text.secondary" mb={2}>{doctor.bio || 'No bio available.'}</Typography>
              <Divider sx={{ my: 2 }} />
              <Grid container spacing={2}>
                {[
                  { label: 'Qualification', value: doctor.qualification },
                  { label: 'Experience', value: `${doctor.experienceYears} years` },
                  { label: 'Hospital', value: doctor.hospitalName },
                  { label: 'Location', value: doctor.hospitalAddress },
                  { label: 'License No.', value: doctor.licenseNumber },
                  { label: 'Contact', value: doctor.phone },
                ].map(({ label, value }) => value && (
                  <Grid item xs={6} key={label}>
                    <Typography variant="caption" color="text.secondary">{label}</Typography>
                    <Typography variant="body2" fontWeight={500}>{value}</Typography>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Container>
  );
};

export default DoctorDetailPage;
