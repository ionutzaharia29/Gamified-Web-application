import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  TextField,
  Button,
  Typography,
  Link,
  Alert,
  CircularProgress,
} from "@mui/material";

import { authService } from "../services/authService";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(formData) {
  const errors = {};

  if (!formData.fullName.trim()) errors.fullName = "Full name is required";
  else if (formData.fullName.trim().length < 2)
    errors.fullName = "Full name must be at least 2 characters";

  if (!formData.email) errors.email = "Email is required";
  else if (!EMAIL_REGEX.test(formData.email))
    errors.email = "Please enter a valid email address";

  if (!formData.password) errors.password = "Password is required";
  else if (formData.password.length < 8)
    errors.password = "Password must be at least 8 characters";
  else if (!/[A-Z]/.test(formData.password))
    errors.password = "Password must include at least one uppercase letter";
  else if (!/[0-9]/.test(formData.password))
    errors.password = "Password must include at least one number";
  else if (!/[^A-Za-z0-9]/.test(formData.password))
    errors.password = "Password must include at least one special character";

  return errors;
}

export default function SignupPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const [fieldErrors, setFieldErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newFormData = { ...formData, [name]: value };
    setFormData(newFormData);
    if (touched[name]) {
      const errors = validate(newFormData);
      setFieldErrors((prev) => ({ ...prev, [name]: errors[name] || "" }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const errors = validate(formData);
    setFieldErrors((prev) => ({ ...prev, [name]: errors[name] || "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({ fullName: true, email: true, password: true });
    const errors = validate(formData);
    setFieldErrors(errors);
    if (Object.values(errors).some(Boolean)) return;

    setError("");
    setLoading(true);

    try {
      await authService.register(formData);
      alert("Signup successful! Please log in.");
      navigate("/login");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "An error occurred. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const hasErrors = Object.values(fieldErrors).some(Boolean);

  return (
    <Box
      sx={{
        display: "flex",
        backgroundColor: "#f5f5f5",
        minHeight: "100vh",
        width: "100vw",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          flex: 1,
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          display: { xs: "none", md: "flex" },
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: 4,
          color: "white",
        }}
      >
        <Typography variant="h3" fontWeight="bold" gutterBottom>
          Join Us Today!
        </Typography>

        <Typography variant="h6" sx={{ mb: 3 }}>
          SkillBuilder – Your Path to Mastery
        </Typography>

        <Typography
          variant="body1"
          sx={{ maxWidth: 400, textAlign: "center" }}
        >
          Create an account to access hundreds of IBM courses, earn badges,
          and track your progress!
        </Typography>
      </Box>

      <Box
        sx={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: 3,
        }}
      >
        <Card
          sx={{
            width: "100%",
            maxWidth: 400,
            p: 4,
            borderRadius: 3,
            boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
          }}
        >
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            Sign Up
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 3 }}
          >
            Create your account to access hundreds of IBM courses,
            earn badges, and track your progress!
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <TextField
              fullWidth
              label="Full Name"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.fullName && !!fieldErrors.fullName}
              helperText={touched.fullName && fieldErrors.fullName}
              sx={{ mb: 2 }}
              placeholder="Enter your full name"
            />

            <TextField
              fullWidth
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.email && !!fieldErrors.email}
              helperText={touched.email && fieldErrors.email}
              sx={{ mb: 2 }}
              placeholder="Enter your email"
            />

            <TextField
              fullWidth
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.password && !!fieldErrors.password}
              helperText={
                touched.password && fieldErrors.password
                  ? fieldErrors.password
                  : "Min 8 characters with uppercase, number, and special character"
              }
              sx={{ mb: 3 }}
              placeholder="Create a password"
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading || hasErrors}
              sx={{
                background:
                  "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "white",
                py: 1.5,
                borderRadius: 2,
                textTransform: "none",
                fontSize: 16,
                fontWeight: 600,
                "&:hover": {
                  background:
                    "linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%)",
                },
              }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Sign Up"
              )}
            </Button>
          </form>

          <Typography variant="body2" sx={{ mt: 3, textAlign: "center" }}>
            Already have an account?{" "}
            <Link
              href="/login"
              underline="hover"
              sx={{ color: "#667eea", fontWeight: 600 }}
            >
              Login
            </Link>
          </Typography>
        </Card>
      </Box>
    </Box>
  );
}
