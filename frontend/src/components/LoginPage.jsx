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
  if (!formData.email) errors.email = "Email is required";
  else if (!EMAIL_REGEX.test(formData.email))
    errors.email = "Please enter a valid email address";

  if (!formData.password) errors.password = "Password is required";

  return errors;
}

export default function LoginPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
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
    setTouched({ email: true, password: true });
    const errors = validate(formData);
    setFieldErrors(errors);
    if (Object.values(errors).some(Boolean)) return;

    setError("");
    setLoading(true);

    try {
      const response = await authService.login(formData);

      localStorage.setItem("token", response.token);
      localStorage.setItem("user", JSON.stringify(response));

      const audio = new Audio("sounds/login-success.mp3");
      audio.volume = 0.5;
      audio.play();

      setTimeout(() => {
        navigate("/dashboard");
      }, 500);
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
        minHeight: "100vh",
        width: "100vw",
        overflow: "hidden",
        backgroundColor: "#f5f5f5",
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
          color: "#fff",
          padding: 4,
        }}
      >
        <Typography variant="h3" fontWeight="bold" gutterBottom>
          Hey, Hello!
        </Typography>

        <Typography variant="h6" sx={{ mb: 3 }}>
          Welcome back to IBM SkillsBuild - Your gateway to learning and growth!
        </Typography>

        <Typography
          variant="body1"
          sx={{ maxWidth: 400, textAlign: "center" }}
        >
          Unlock your potential with our wide range of courses and resources
          designed to help you succeed in your career.
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
            padding: 4,
            borderRadius: 3,
            boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12)",
          }}
        >
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Welcome Back!
          </Typography>

          <Typography
            variant="body2"
            sx={{ mb: 3 }}
            color="text.secondary"
          >
            Login to access your dashboard and explore new opportunities.
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit} noValidate>
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
              helperText={touched.password && fieldErrors.password}
              sx={{ mb: 1 }}
              placeholder="Enter your password"
            />

            <Box sx={{ textAlign: "right", mb: 3 }}>
              <Link
                href="/forgot-password"
                underline="hover"
                sx={{ fontSize: "14px", color: "#667eea" }}
              >
                Forgot Password?
              </Link>
            </Box>

            <Button
              fullWidth
              variant="contained"
              type="submit"
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
                "Login"
              )}
            </Button>
          </form>

          <Typography variant="body2" sx={{ mt: 3, textAlign: "center" }}>
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              underline="hover"
              sx={{ color: "#667eea", fontWeight: 600 }}
            >
              Sign Up
            </Link>
          </Typography>
        </Card>
      </Box>
    </Box>
  );
}
