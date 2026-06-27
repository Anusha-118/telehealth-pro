import React, { useState, useEffect } from 'react';
import {
  Box, Container, Typography, Grid, Card, CardContent, CardActions,
  Button, TextField, InputAdornment, Chip, Avatar, Rating,
  CircularProgress, Alert, Pagination
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import StarIcon from '@mui/icons-material/Star';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { doctorService } from '../services/doctorService';

const DoctorsPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState(searchParams.get('specialization') || '');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const fetchDoctors = async () => {
    setLoading(true);
    setError('');
    try {
      const params = { page: page - 1, size: 9 };
      let res;
      if (search.trim()) {
        res = await doctorService.search({ specialization: search, page: page - 1, size: 9 });
      } else {
        res = await doctorService.getAll(params);
      }
      setDoctors(res.data.data.content || []);
      setTotalPages(res.data.data.totalPages || 0);
    } catch {
      setError('Failed to load doctors. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDoctors(); }, [page]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchDoctors();
  };

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Typography variant="h4" fontWeight={700} gutterBottom>Find a Doctor</Typography>
      <Typography color="text.secondary" mb={4}>
        Browse our network of certified healthcare professionals
      </Typography>

      {/* Search Bar */}
      <Box component="form" onSubmit={handleSearch} sx={{ display: 'flex', gap: 2, mb: 5, maxWidth: 600 }}>
        <TextField
          fullWidth
          placeholder="Search by specialization or name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: <InputAdornment position="start"><SearchIcon color="action" /></InputAdornment>,
          }}
        />
        <Button type="submit" variant="contained" size="large" sx={{ px: 4 }}>Search</Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      {loading ? (
        <Box display="flex" justifyContent="center" py={8}>
          <CircularProgress size={48} />
        </Box>
      ) : (
        <>
          {doctors.length === 0 ? (
            <Box textAlign="center" py={8}>
              <Typography variant="h6" color="text.secondary">No doctors found.</Typography>
              <Button onClick={() => { setSearch(''); setPage(1); fetchDoctors(); }} sx={{ mt: 2 }}>
                Clear Search
              </Button>
            </Box>
          ) : (
            <Grid container spacing={3}>
              {doctors.map((doc) => (
                <Grid item xs={12} sm={6} md={4} key={doc.id}>
                  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Box display="flex" alignItems="center" gap={2} mb={2}>
                        <Avatar
                          src={doc.profileImageUrl}
                          sx={{ width: 64, height: 64, bgcolor: 'primary.main', fontSize: '1.5rem' }}
                        >
                          {doc.firstName?.[0]}{doc.lastName?.[0]}
                        </Avatar>
                        <Box>
                          <Typography variant="h6" fontWeight={600}>
                            Dr. {doc.firstName} {doc.lastName}
                          </Typography>
                          <Chip
                            label={doc.specialization || 'General'}
                            size="small"
                            color="primary"
                            variant="outlined"
                          />
                        </Box>
                      </Box>

                      <Box display="flex" alignItems="center" gap={0.5} mb={1}>
                        <Rating value={doc.rating || 0} readOnly size="small" precision={0.5} />
                        <Typography variant="body2" color="text.secondary">
                          ({doc.totalReviews || 0} reviews)
                        </Typography>
                      </Box>

                      <Typography variant="body2" color="text.secondary" mb={0.5}>
                        🏥 {doc.hospitalName || 'Private Practice'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" mb={0.5}>
                        🎓 {doc.qualification} • {doc.experienceYears} yrs exp
                      </Typography>
                      <Typography variant="h6" color="primary" fontWeight={700} mt={1}>
                        ₹{doc.consultationFee}
                        <Typography component="span" variant="body2" color="text.secondary"> / consultation</Typography>
                      </Typography>
                    </CardContent>

                    <CardActions sx={{ p: 2, pt: 0, gap: 1 }}>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => navigate(`/doctors/${doc.id}`)}
                      >
                        View Profile
                      </Button>
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => navigate(`/book/${doc.id}`)}
                        disabled={!doc.available}
                      >
                        {doc.available ? 'Book Now' : 'Unavailable'}
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}

          {totalPages > 1 && (
            <Box display="flex" justifyContent="center" mt={5}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={(_, val) => setPage(val)}
                color="primary"
                size="large"
              />
            </Box>
          )}
        </>
      )}
    </Container>
  );
};

export default DoctorsPage;
