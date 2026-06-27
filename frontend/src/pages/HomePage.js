import React from 'react';
import {
  Box, Container, Typography, Button, Grid, Card,
  CardContent, Avatar, Chip
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import VideoCallIcon from '@mui/icons-material/VideoCall';
import SecurityIcon from '@mui/icons-material/Security';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';

const features = [
  { icon: <SearchIcon fontSize="large" />, title: 'Find Specialists', desc: 'Search doctors by specialization, name, or availability across all medical fields.' },
  { icon: <VideoCallIcon fontSize="large" />, title: 'Video Consultations', desc: 'Connect with doctors via secure video calls from the comfort of your home.' },
  { icon: <ReceiptLongIcon fontSize="large" />, title: 'Digital Prescriptions', desc: 'Receive and store prescriptions digitally, accessible anytime from your profile.' },
  { icon: <SecurityIcon fontSize="large" />, title: 'Secure & Private', desc: 'Your health data is encrypted and stored securely following HIPAA guidelines.' },
];

const specializations = [
  'Cardiology', 'Dermatology', 'Neurology', 'Pediatrics',
  'Orthopedics', 'Psychiatry', 'Gynecology', 'General Medicine',
];

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <Box>
      {/* Hero Section */}
      <Box sx={{
        background: 'linear-gradient(135deg, #1976d2 0%, #00897b 100%)',
        color: 'white',
        py: { xs: 8, md: 12 },
        textAlign: 'center',
      }}>
        <Container maxWidth="md">
          <Typography variant="h3" fontWeight={800} gutterBottom>
            Your Health, Our Priority
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9, mb: 4 }}>
            Connect with certified doctors online. Book appointments, get prescriptions,
            and manage your health — all in one place.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              size="large"
              sx={{ bgcolor: 'white', color: 'primary.main', '&:hover': { bgcolor: '#f0f0f0' } }}
              onClick={() => navigate('/doctors')}
            >
              Find a Doctor
            </Button>
            <Button
              variant="outlined"
              size="large"
              sx={{ borderColor: 'white', color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}
              onClick={() => navigate('/register')}
            >
              Get Started Free
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Specializations */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Typography variant="h5" fontWeight={700} textAlign="center" gutterBottom>
          Browse by Specialization
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, justifyContent: 'center', mt: 3 }}>
          {specializations.map((spec) => (
            <Chip
              key={spec}
              label={spec}
              clickable
              color="primary"
              variant="outlined"
              size="medium"
              onClick={() => navigate(`/doctors?specialization=${spec}`)}
              sx={{ fontSize: '0.9rem', py: 2.5, px: 1 }}
            />
          ))}
        </Box>
      </Container>

      {/* Features */}
      <Box sx={{ bgcolor: '#f5f7fa', py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h5" fontWeight={700} textAlign="center" gutterBottom>
            Why Choose TeleHealth Pro?
          </Typography>
          <Grid container spacing={3} sx={{ mt: 2 }}>
            {features.map((f) => (
              <Grid item xs={12} sm={6} md={3} key={f.title}>
                <Card sx={{ height: '100%', textAlign: 'center', p: 2 }}>
                  <CardContent>
                    <Avatar sx={{ bgcolor: 'primary.light', mx: 'auto', mb: 2, width: 56, height: 56 }}>
                      {f.icon}
                    </Avatar>
                    <Typography variant="h6" fontWeight={600} gutterBottom>{f.title}</Typography>
                    <Typography variant="body2" color="text.secondary">{f.desc}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Stats */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Grid container spacing={4} textAlign="center">
          {[
            { value: '500+', label: 'Certified Doctors' },
            { value: '50,000+', label: 'Patients Served' },
            { value: '30+', label: 'Specializations' },
            { value: '4.8★', label: 'Average Rating' },
          ].map((stat) => (
            <Grid item xs={6} md={3} key={stat.label}>
              <Typography variant="h3" fontWeight={800} color="primary">{stat.value}</Typography>
              <Typography variant="body1" color="text.secondary">{stat.label}</Typography>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* CTA */}
      <Box sx={{ bgcolor: 'primary.main', color: 'white', py: 8, textAlign: 'center' }}>
        <Container>
          <Typography variant="h5" fontWeight={700} gutterBottom>
            Ready to take control of your health?
          </Typography>
          <Typography sx={{ mb: 3, opacity: 0.9 }}>
            Join thousands of patients who trust TeleHealth Pro for their healthcare needs.
          </Typography>
          <Button
            variant="contained"
            size="large"
            sx={{ bgcolor: 'white', color: 'primary.main', '&:hover': { bgcolor: '#f0f0f0' } }}
            onClick={() => navigate('/register')}
          >
            Create Free Account
          </Button>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage;
