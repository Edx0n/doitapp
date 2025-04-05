import { useState, useContext } from "react";
import axios from "axios";
import UserContext from "./UserContext";
import { Redirect, Link as RouterLink } from "react-router-dom";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Card,
  CardContent,
  CardHeader,
  Alert,
  Stack,
  InputAdornment,
  IconButton,
  Divider,
  Link,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  Visibility,
  VisibilityOff,
  Email as EmailIcon,
  LockOutlined as LockIcon,
  PersonAddAlt as RegisterIcon,
} from "@mui/icons-material";

// Componentes estilizados
const StyledTextField = styled(TextField)({
  "& .MuiOutlinedInput-root": {
    color: "#fff",
    "& fieldset": {
      borderColor: "rgba(255, 255, 255, 0.23)",
    },
    "&:hover fieldset": {
      borderColor: "rgba(255, 255, 255, 0.5)",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#6366f1",
    },
  },
  "& .MuiInputLabel-root": {
    color: "rgba(255, 255, 255, 0.7)",
  },
  "& .MuiInputAdornment-root .MuiIconButton-root": {
    color: "rgba(255, 255, 255, 0.7)",
  },
});

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [redirect, setRedirect] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [registerError, setRegisterError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const user = useContext(UserContext);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  function registerUser(e) {
    e.preventDefault();
    setIsLoading(true);
    setRegisterError(false);

    if (password.length < 6) {
      setRegisterError(true);
      setErrorMessage("A senha deve ter pelo menos 6 caracteres");
      setIsLoading(false);
      return;
    }

    const data = { email, password };
    axios
      .post("http://localhost:4000/register", data, { withCredentials: true })
      .then((response) => {
        user.setEmail(response.data.email);
        setEmail("");
        setPassword("");
        setRedirect(true);
      })
      .catch((error) => {
        setRegisterError(true);
        setErrorMessage(
          error.response?.data?.message || "Erro ao registrar. Tente novamente."
        );
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  if (redirect) {
    return <Redirect to={"/"} />;
  }

  return (
    <Container className="auth-container">
      <Card className="auth-card">
        <Box className="auth-header">
          <RegisterIcon sx={{ fontSize: 40, mb: 1, color: "#fff" }} />
          <Typography variant="h5" component="h1" color="#fff" fontWeight={500}>
            Criar Conta
          </Typography>
          <Typography variant="body2" color="rgba(255, 255, 255, 0.7)">
            Registre-se para começar a organizar suas tarefas
          </Typography>
        </Box>

        <CardContent className="auth-form">
          {registerError && (
            <Alert
              severity="error"
              sx={{
                mb: 3,
                backgroundColor: "rgba(211, 47, 47, 0.1)",
                color: "#f44336",
                "& .MuiAlert-icon": {
                  color: "#f44336",
                },
              }}
            >
              {errorMessage}
            </Alert>
          )}

          <form onSubmit={(e) => registerUser(e)}>
            <Stack spacing={3}>
              <StyledTextField
                label="Email"
                type="email"
                fullWidth
                variant="outlined"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon sx={{ color: "rgba(255, 255, 255, 0.7)" }} />
                    </InputAdornment>
                  ),
                }}
              />

              <StyledTextField
                label="Senha"
                type={showPassword ? "text" : "password"}
                fullWidth
                variant="outlined"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                helperText="Mínimo de 6 caracteres"
                FormHelperTextProps={{
                  sx: { color: "rgba(255, 255, 255, 0.5)" },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon sx={{ color: "rgba(255, 255, 255, 0.7)" }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                disabled={isLoading}
                sx={{
                  mt: 3,
                  py: 1.2,
                  background: "linear-gradient(45deg, #6366f1, #8b5cf6)",
                  "&:hover": {
                    background: "linear-gradient(45deg, #4f46e5, #7c3aed)",
                  },
                  fontWeight: 500,
                  textTransform: "none",
                }}
              >
                {isLoading ? "Registrando..." : "Registrar"}
              </Button>
            </Stack>
          </form>

          <Divider sx={{ my: 3, borderColor: "rgba(255, 255, 255, 0.1)" }} />

          <Typography
            variant="body2"
            align="center"
            sx={{ color: "rgba(255, 255, 255, 0.7)" }}
          >
            Já tem uma conta?{" "}
            <Link
              component={RouterLink}
              to="/login"
              sx={{ color: "#6366f1", fontWeight: 500 }}
            >
              Faça login
            </Link>
          </Typography>
        </CardContent>
      </Card>
    </Container>
  );
}

export default Register;
