import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  TextField,
  Button,
  Typography,
  Link,
  Alert,
  CircularProgress,
} from '@mui/material';
import { authService } from '../services/authService';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateEmail(value) {
  if (!value) return 'Email is required';
  if (!EMAIL_REGEX.test(value)) return 'Please enter a valid email address';
  return '';
}

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [emailTouched, setEmailTouched] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    if (emailTouched) {
      setEmailError(validateEmail(value));
    }
  };

  const handleBlur = () => {
    setEmailTouched(true);
    setEmailError(validateEmail(email));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEmailTouched(true);
    const err = validateEmail(email);
    setEmailError(err);
    if (err) return;

    setError('');
    setLoading(true);

    try {
      await authService.forgotPassword(email);
      navigate('/reset-password');
    } catch (err) {
      setError('Failed to send reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '100vh',
        width: '100vw',
        overflow: 'hidden',
        backgroundColor: '#f5f5f5',
      }}
    >
      {/* Left side — gradient panel */}
      <Box
        sx={{
          flex: 1,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          display: { xs: 'none', md: 'flex' },
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          color: '#fff',
          padding: 4,
        }}
      >
        <Typography variant="h3" fontWeight="bold" gutterBottom>
          Reset Password
        </Typography>
        <Typography variant="h6" sx={{ mb: 3 }}>
          Welcome back to IBM SkillsBuild - Your gateway to learning and growth!
        </Typography>
        <Typography variant="body1" sx={{ maxWidth: 400, textAlign: 'center' }}>
          Enter your email address and we'll send you a code to reset your password.
        </Typography>
      </Box>

      {/* Right side — card */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 3,
        }}
      >
        <Card
          sx={{
            width: '100%',
            maxWidth: 400,
            padding: 4,
            borderRadius: 3,
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
          }}
        >
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Forgot Password
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Enter your email to receive a password reset code.
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <form onSubmit={handleSubmit} noValidate>
            <TextField
              fullWidth
              label="Email Address"
              type="email"
              value={email}
              onChange={handleChange}
              onBlur={handleBlur}
              error={emailTouched && !!emailError}
              helperText={emailTouched && emailError}
              sx={{ mb: 3 }}
              placeholder="Enter your email"
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading || (emailTouched && !!emailError)}
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                py: 1.5,
                borderRadius: 2,
                textTransform: 'none',
                fontSize: 16,
                fontWeight: 600,
                mb: 2,
                '&:hover': {
                  background: 'linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%)',
                },
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Send Reset Code'}
            </Button>
          </form>

          <Typography variant="body2" sx={{ textAlign: 'center' }}>
            <Link href="/login" underline="hover" sx={{ color: '#667eea', fontWeight: 600 }}>
              Back to Login
            </Link>
          </Typography>
        </Card>
      </Box>
    </Box>
  );
}
