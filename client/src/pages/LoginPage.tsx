import React, { useState } from 'react';
import { useNavigate, Link as RouterLink, Navigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  Link,
  CircularProgress,
} from '@mui/material';
import { Sparkles } from 'lucide-react';
import { PageContainer } from '../components/common/PageContainer';
import { useAuth } from '../features/auth/useAuth';

const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const onSubmit = async (data: LoginFormValues) => {
    setServerError('');
    try {
      await login(data);
      navigate('/', { replace: true });
    } catch (error: unknown) {
      const axiosError = error as { response?: { data?: { error?: { code?: string; message?: string } } } };
      const errorData = axiosError.response?.data?.error;

      if (errorData?.code === 'INVALID_CREDENTIALS') {
        setServerError('Invalid email or password. Please try again.');
      } else if (errorData?.code === 'ACCOUNT_SUSPENDED') {
        setServerError('Your account has been suspended. Please contact support.');
      } else if (errorData?.code === 'ACCOUNT_BANNED') {
        setServerError('Your account has been banned. Please contact support.');
      } else {
        setServerError('Something went wrong. Please try again later.');
      }
    }
  };

  return (
    <PageContainer maxWidth="sm">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          pt: { xs: 4, md: 8 },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            mb: 1,
          }}
        >
          <Sparkles size={24} color="secondary.main" />
          <Typography
            variant="h4"
            sx={{
              fontWeight: 800,
              letterSpacing: '-0.03em',
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            PulseNote
          </Typography>
        </Box>

        <Typography variant="h3" sx={{ mb: 1, fontWeight: 700, textAlign: 'center' }}>
          Welcome back
        </Typography>

        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ mb: 4, textAlign: 'center', maxWidth: 380 }}
        >
          Sign in to continue reading, challenging, and contributing.
        </Typography>

        {serverError && (
          <Alert severity="error" sx={{ width: '100%', mb: 3, borderRadius: 2 }}>
            {serverError}
          </Alert>
        )}

        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 2.5 }}
        >
          <TextField
            label="Email"
            type="email"
            fullWidth
            autoComplete="email"
            error={!!errors.email}
            helperText={errors.email?.message}
            {...register('email')}
          />

          <TextField
            label="Password"
            type="password"
            fullWidth
            autoComplete="current-password"
            error={!!errors.password}
            helperText={errors.password?.message}
            {...register('password')}
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            fullWidth
            disabled={isSubmitting}
            sx={{
              py: 1.5,
              fontSize: '1rem',
              fontWeight: 600,
              mt: 1,
            }}
          >
            {isSubmitting ? (
              <CircularProgress size={22} color="inherit" />
            ) : (
              'Sign In'
            )}
          </Button>
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mt: 3, textAlign: 'center' }}>
          Don&apos;t have an account?{' '}
          <Link
            component={RouterLink}
            to="/register"
            sx={{ fontWeight: 600, color: 'secondary.main' }}
          >
            Create one
          </Link>
        </Typography>
      </Box>
    </PageContainer>
  );
};
