import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
} from '@mui/material';
import { authService } from '../services/authService';

function validate(formData) {
  const errors = {};

  if (!formData.resetToken.trim()) errors.resetToken = 'Reset code is required';

  if (!formData.newPassword) errors.newPassword = 'Password is required';
  else if (formData.newPassword.length < 8)
    errors.newPassword = 'Password must be at least 8 characters';
  else if (!/[A-Z]/.test(formData.newPassword))
    errors.newPassword = 'Password must include at least one uppercase letter';
  else if (!/[0-9]/.test(formData.newPassword))
    errors.newPassword = 'Password must include at least one number';
  else if (!/[^A-Za-z0-9]/.test(formData.newPassword))
    errors.newPassword = 'Password must include at least one special character';

  return errors;
}

export default function ResetPassword() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    resetToken: '',
    newPassword: '',
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newFormData = { ...formData, [name]: value };
    setFormData(newFormData);
    if (touched[name]) {
      const errors = validate(newFormData);
      setFieldErrors((prev) => ({ ...prev, [name]: errors[name] || '' }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const errors = validate(formData);
    setFieldErrors((prev) => ({ ...prev, [name]: errors[name] || '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({ resetToken: true, newPassword: true });
    const errors = validate(formData);
    setFieldErrors(errors);
    if (Object.values(errors).some(Boolean)) return;

    setError('');
    setLoading(true);

    try {
      await authService.resetPassword(formData);
      alert('Password reset successful! Please login.');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password.');
    } finally {
      setLoading(false);
    }
  };

  const hasErrors = Object.values(fieldErrors).some(Boolean);

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
          New Password
        </Typography>
        <Typography variant="h6" sx={{ mb: 3 }}>
          Welcome back to IBM SkillsBuild - Your gateway to learning and growth!
        </Typography>
        <Typography variant="body1" sx={{ maxWidth: 400, textAlign: 'center' }}>
          Enter the reset code from your email and choose a new password to regain access.
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
            Reset Password
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Enter the reset code from your email and your new password.
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <form onSubmit={handleSubmit} noValidate>
            <TextField
              fullWidth
              label="Reset Code"
              name="resetToken"
              value={formData.resetToken}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.resetToken && !!fieldErrors.resetToken}
              helperText={touched.resetToken && fieldErrors.resetToken}
              sx={{ mb: 2 }}
              placeholder="Enter code from email"
            />

            <TextField
              fullWidth
              label="New Password"
              name="newPassword"
              type="password"
              value={formData.newPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.newPassword && !!fieldErrors.newPassword}
              helperText={
                touched.newPassword && fieldErrors.newPassword
                  ? fieldErrors.newPassword
                  : 'Min 8 characters with uppercase, number, and special character'
              }
              sx={{ mb: 3 }}
              placeholder="Enter new password"
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading || hasErrors}
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
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Reset Password'}
            </Button>
          </form>

          <Typography variant="body2" sx={{ textAlign: 'center' }}>
            <Typography
              component="span"
              variant="body2"
              sx={{ color: '#667eea', fontWeight: 600, cursor: 'pointer' }}
              onClick={() => navigate('/login')}
            >
              Back to Login
            </Typography>
          </Typography>
        </Card>
      </Box>
    </Box>
  );
}
