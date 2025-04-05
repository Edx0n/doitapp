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
  LoginOutlined as LoginIcon,
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

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState(false);
  const [redirect, setRedirect] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const user = useContext(UserContext);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  function loginUser(e) {
    e.preventDefault();
    setIsLoading(true);
    setLoginError(false);

    const data = { email, password };
    axios

      .post("http://localhost:4000/login", data, { withCredentials: true })
      .then((response) => {
        user.setEmail(response.data.email);
        setEmail("");
        setPassword("");
        setLoginError(false);
        setRedirect(true);
      })
      .catch(() => {
        setLoginError(true);
      })
      .finally(() => {
        setIsLoading(false);
      });
    console.log("console.log loginUser dataconsole.log", data);
  }

  if (redirect) {
    return <Redirect to={"/"} />;
  }

  return (
    <Container className="auth-container">
      <Card className="auth-card">
        <Box className="auth-header">
          <LoginIcon sx={{ fontSize: 40, mb: 1, color: "#fff" }} />
          <Typography variant="h5" component="h1" color="#fff" fontWeight={500}>
            Bem-vindo de volta
          </Typography>
          <Typography variant="body2" color="rgba(255, 255, 255, 0.7)">
            Entre para acessar suas tarefas
          </Typography>
        </Box>

        <CardContent className="auth-form">
          {loginError && (
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
              Erro de login! E-mail ou senha incorretos.
            </Alert>
          )}

          <form onSubmit={(e) => loginUser(e)}>
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
                {isLoading ? "Entrando..." : "Entrar"}
              </Button>
            </Stack>
          </form>

          <Divider sx={{ my: 3, borderColor: "rgba(255, 255, 255, 0.1)" }} />

          <Typography
            variant="body2"
            align="center"
            sx={{ color: "rgba(255, 255, 255, 0.7)" }}
          >
            Não tem uma conta?{" "}
            <Link
              component={RouterLink}
              to="/register"
              sx={{ color: "#6366f1", fontWeight: 500 }}
            >
              Registre-se
            </Link>
          </Typography>
        </CardContent>
      </Card>
    </Container>
  );
}

export default Login;
