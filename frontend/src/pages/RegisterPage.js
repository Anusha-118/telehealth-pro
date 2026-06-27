import React, { useEffect } from 'react';
import {
  Box, Container, Card, CardContent, Typography, TextField,
  Button, Alert, CircularProgress, Link, MenuItem, Grid
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { registerUser, clearError } from '../store/slices/authSlice';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';

const validationSchema = Yup.object({
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string().required('Last name is required'),
  email: Yup.string().email('Enter a valid email').required('Email is required'),
  password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  phone: Yup.string().matches(/^[0-9]{10}$/, 'Enter a valid 10-digit phone number'),
  role: Yup.string().required('Role is required'),
});

const RegisterPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user) {
      const paths = { PATIENT: '/dashboard/patient', DOCTOR: '/dashboard/doctor', ADMIN: '/dashboard/admin' };
      navigate(paths[user.role] || '/');
    }
  }, [user, navigate]);

  useEffect(() => { return () => dispatch(clearError()); }, [dispatch]);

  const formik = useFormik({
    initialValues: { firstName: '', lastName: '', email: '', password: '', phone: '', role: 'PATIENT' },
    validationSchema,
    onSubmit: (values) => dispatch(registerUser(values)),
  });

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f7fa', display: 'flex', alignItems: 'center', py: 4 }}>
      <Container maxWidth="sm">
        <Card elevation={3}>
          <CardContent sx={{ p: 5 }}>
            <Box textAlign="center" mb={4}>
              <LocalHospitalIcon sx={{ fontSize: 48, color: 'primary.main' }} />
              <Typography variant="h5" fontWeight={700} mt={1}>Create Account</Typography>
              <Typography color="text.secondary">Join TeleHealth Pro today</Typography>
            </Box>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            <Box component="form" onSubmit={formik.handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    fullWidth label="First Name" name="firstName"
                    value={formik.values.firstName} onChange={formik.handleChange} onBlur={formik.handleBlur}
                    error={formik.touched.firstName && Boolean(formik.errors.firstName)}
                    helperText={formik.touched.firstName && formik.errors.firstName}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth label="Last Name" name="lastName"
                    value={formik.values.lastName} onChange={formik.handleChange} onBlur={formik.handleBlur}
                    error={formik.touched.lastName && Boolean(formik.errors.lastName)}
                    helperText={formik.touched.lastName && formik.errors.lastName}
                  />
                </Grid>
              </Grid>

              <TextField
                fullWidth label="Email Address" name="email" type="email" margin="normal"
                value={formik.values.email} onChange={formik.handleChange} onBlur={formik.handleBlur}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
              />
              <TextField
                fullWidth label="Password" name="password" type="password" margin="normal"
                value={formik.values.password} onChange={formik.handleChange} onBlur={formik.handleBlur}
                error={formik.touched.password && Boolean(formik.errors.password)}
                helperText={formik.touched.password && formik.errors.password}
              />
              <TextField
                fullWidth label="Phone Number" name="phone" margin="normal"
                value={formik.values.phone} onChange={formik.handleChange} onBlur={formik.handleBlur}
                error={formik.touched.phone && Boolean(formik.errors.phone)}
                helperText={formik.touched.phone && formik.errors.phone}
              />
              <TextField
                fullWidth select label="I am a..." name="role" margin="normal"
                value={formik.values.role} onChange={formik.handleChange}
              >
                <MenuItem value="PATIENT">Patient</MenuItem>
                <MenuItem value="DOCTOR">Doctor</MenuItem>
              </TextField>

              <Button
                type="submit" fullWidth variant="contained" size="large"
                sx={{ mt: 3, py: 1.5 }} disabled={loading}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Create Account'}
              </Button>
            </Box>

            <Typography textAlign="center" mt={3}>
              Already have an account?{' '}
              <Link component={RouterLink} to="/login" fontWeight={600}>Sign In</Link>
            </Typography>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default RegisterPage;
