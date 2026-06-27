import React, { useEffect } from 'react';
import {
  Box, Container, Card, CardContent, Typography,
  TextField, Button, Alert, CircularProgress, Link
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { loginUser, clearError } from '../store/slices/authSlice';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';

const validationSchema = Yup.object({
  email: Yup.string().email('Enter a valid email').required('Email is required'),
  password: Yup.string().required('Password is required'),
});

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user) {
      const paths = { PATIENT: '/dashboard/patient', DOCTOR: '/dashboard/doctor', ADMIN: '/dashboard/admin' };
      navigate(paths[user.role] || '/');
    }
  }, [user, navigate]);

  useEffect(() => {
    return () => dispatch(clearError());
  }, [dispatch]);

  const formik = useFormik({
    initialValues: { email: '', password: '' },
    validationSchema,
    onSubmit: (values) => dispatch(loginUser(values)),
  });

  return (
    <Box sx={{
      minHeight: '100vh',
      bgcolor: '#f5f7fa',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      py: 4,
    }}>
      <Container maxWidth="sm">
        <Card elevation={3}>
          <CardContent sx={{ p: 5 }}>
            <Box textAlign="center" mb={4}>
              <LocalHospitalIcon sx={{ fontSize: 48, color: 'primary.main' }} />
              <Typography variant="h5" fontWeight={700} mt={1}>Welcome Back</Typography>
              <Typography color="text.secondary">Sign in to TeleHealth Pro</Typography>
            </Box>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            <Box component="form" onSubmit={formik.handleSubmit}>
              <TextField
                fullWidth
                label="Email Address"
                name="email"
                type="email"
                margin="normal"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
              />
              <TextField
                fullWidth
                label="Password"
                name="password"
                type="password"
                margin="normal"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.password && Boolean(formik.errors.password)}
                helperText={formik.touched.password && formik.errors.password}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                sx={{ mt: 3, py: 1.5 }}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
              </Button>
            </Box>

            <Typography textAlign="center" mt={3}>
              Don't have an account?{' '}
              <Link component={RouterLink} to="/register" fontWeight={600}>
                Sign Up
              </Link>
            </Typography>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default LoginPage;
