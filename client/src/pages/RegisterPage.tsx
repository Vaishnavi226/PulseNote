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

const registerSchema = z
  .object({
    name: z.string().min(1, 'Name is required').max(100, 'Name must be 100 characters or fewer'),
    username: z
      .string()
      .min(3, 'Username must be at least 3 characters')
      .max(30, 'Username must be 30 characters or fewer')
      .regex(/^[a-zA-Z0-9_]+$/, 'Username must contain only letters, numbers, and underscores'),
    email: z.string().min(1, 'Email is required').email('Invalid email format'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .max(128, 'Password must be 128 characters or fewer'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register: registerUser, isAuthenticated } = useAuth();
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const onSubmit = async (data: RegisterFormValues) => {
    setServerError('');
    try {
      await registerUser({
        name: data.name,
        username: data.username,
        email: data.email,
        password: data.password,
      });
      navigate('/', { replace: true });
    } catch (error: unknown) {
      const axiosError = error as { response?: { data?: { error?: { code?: string; message?: string } } } };
      const errorData = axiosError.response?.data?.error;

      if (errorData?.code === 'EMAIL_EXISTS') {
        setServerError('An account with this email already exists.');
      } else if (errorData?.code === 'USERNAME_EXISTS') {
        setServerError('This username is already taken.');
      } else if (errorData?.code === 'VALIDATION_ERROR') {
        setServerError('Please check your input and try again.');
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
          Create your account
        </Typography>

        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ mb: 4, textAlign: 'center', maxWidth: 420 }}
        >
          Join the community of technology readers and thinkers.
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
            label="Full Name"
            fullWidth
            autoComplete="name"
            error={!!errors.name}
            helperText={errors.name?.message}
            {...register('name')}
          />

          <TextField
            label="Username"
            fullWidth
            autoComplete="username"
            error={!!errors.username}
            helperText={errors.username?.message}
            {...register('username')}
          />

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
            autoComplete="new-password"
            error={!!errors.password}
            helperText={errors.password?.message}
            {...register('password')}
          />

          <TextField
            label="Confirm Password"
            type="password"
            fullWidth
            autoComplete="new-password"
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword?.message}
            {...register('confirmPassword')}
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
              'Create Account'
            )}
          </Button>
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mt: 3, textAlign: 'center' }}>
          Already have an account?{' '}
          <Link
            component={RouterLink}
            to="/login"
            sx={{ fontWeight: 600, color: 'secondary.main' }}
          >
            Sign in
          </Link>
        </Typography>
      </Box>
    </PageContainer>
  );
};
