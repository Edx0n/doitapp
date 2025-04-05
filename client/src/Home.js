import { useContext, useEffect, useState } from "react";
import UserContext from "./UserContext";
import axios from "axios";
import {
  Box,
  Container,
  Typography,
  TextField,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Checkbox,
  Paper,
  IconButton,
  Divider,
  AppBar,
  Toolbar,
  Button,
  Zoom,
  Fab,
  CircularProgress,
  Grid,
  Tooltip,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  Badge,
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Tab,
  Tabs,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  Add as AddIcon,
  Logout as LogoutIcon,
  NoteAdd as NoteAddIcon,
  DateRange as DateRangeIcon,
  AccessTime as AccessTimeIcon,
  Edit as EditIcon,
  CheckCircle as CheckCircleIcon,
  ScheduleOutlined as ScheduleOutlinedIcon,
  Work as WorkIcon,
  SportsEsports as LeisureIcon,
  School as StudyIcon,
  LocalOffer as CategoryIcon,
  PieChart as ChartIcon,
} from "@mui/icons-material";
import { useHistory } from "react-router-dom";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider, DateTimePicker } from "@mui/x-date-pickers";
import ptBR from "date-fns/locale/pt-BR";
import { format, isAfter, isBefore, isPast } from "date-fns";
import CategoryChart from "./components/CategoryChart";

// Estilizando componentes customizados
const TaskTextField = styled(TextField)({
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
});

const CategorySelect = styled(FormControl)({
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
  "& .MuiSelect-icon": {
    color: "rgba(255, 255, 255, 0.5)",
  },
});

const StyledListItem = styled(ListItem)(({ theme, done, isPastDue }) => ({
  backgroundColor: "#1e1e1e",
  borderRadius: "8px",
  marginBottom: "8px",
  transition: "all 0.2s ease",
  opacity: done ? 0.7 : 1,
  borderLeft: isPastDue ? "4px solid #f44336" : "4px solid transparent",
  "&:hover": {
    backgroundColor: "#282828",
    transform: "translateY(-2px)",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
  },
}));

// Mapeamento de categoria para ícones
const categoryIcons = {
  Trabalho: <WorkIcon fontSize="small" />,
  Lazer: <LeisureIcon fontSize="small" />,
  Estudo: <StudyIcon fontSize="small" />,
};

// Mapeamento de categoria para cores
const categoryColors = {
  Trabalho: "#1976d2", // Azul
  Lazer: "#ed6c02", // Laranja
  Estudo: "#2e7d32", // Verde
};

function Home() {
  const userInfo = useContext(UserContext);
  const [inputVal, setInputVal] = useState("");
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentTodo, setCurrentTodo] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("Trabalho");
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [tabValue, setTabValue] = useState(0); // Para controlar as guias (lista/gráfico)

  const history = useHistory();

  useEffect(() => {
    if (!userInfo.email) return;

    setLoading(true);
    axios
      .get("http://localhost:4000/todos", { withCredentials: true })
      .then((response) => {
        setTodos(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to fetch todos:", error);
        setLoading(false);
      });
  }, [userInfo.email]);

  if (!userInfo.email) {
    return (
      <Container maxWidth="sm" sx={{ textAlign: "center", py: 10 }}>
        <Paper elevation={3} sx={{ py: 4, px: 3, backgroundColor: "#1e1e1e" }}>
          <Typography variant="h5" color="error" gutterBottom>
            Acesso Restrito
          </Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>
            Você precisa estar logado para acessar esta página.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => history.push("/login")}
            sx={{ mr: 2 }}
          >
            Login
          </Button>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => history.push("/register")}
          >
            Registrar
          </Button>
        </Paper>
      </Container>
    );
  }

  function addTodo(e) {
    e.preventDefault();
    if (!inputVal.trim()) return;

    axios
      .put(
        "http://localhost:4000/todos",
        {
          text: inputVal,
          dueDate: selectedDate,
          category: selectedCategory, // Adicionando a categoria
        },
        { withCredentials: true }
      )
      .then((response) => {
        setTodos([...todos, response.data]);
        setInputVal("");
        setSelectedDate(null);
        setSelectedCategory("Trabalho"); // Resetando para o valor padrão
      })
      .catch((error) => {
        console.error("Failed to add todo:", error);
      });
  }

  function updateTodo(todo) {
    const data = {
      id: todo._id,
      done: !todo.done,
    };

    axios
      .post("http://localhost:4000/todos", data, { withCredentials: true })
      .then(() => {
        const newTodos = todos.map((t) => {
          if (t._id === todo._id) {
            return {
              ...t,
              done: !t.done,
              completedAt: !t.done ? new Date() : null,
            };
          }
          return t;
        });
        setTodos(newTodos);
      })
      .catch((error) => {
        console.error("Failed to update todo:", error);
      });
  }

  function updateDueDate() {
    if (!currentTodo) return;

    const data = {
      id: currentTodo._id,
      done: currentTodo.done,
      dueDate: selectedDate,
    };

    axios
      .post("http://localhost:4000/todos", data, { withCredentials: true })
      .then(() => {
        const newTodos = todos.map((t) => {
          if (t._id === currentTodo._id) {
            return { ...t, dueDate: selectedDate };
          }
          return t;
        });
        setTodos(newTodos);
        setDialogOpen(false);
        setCurrentTodo(null);
        setSelectedDate(null);
      })
      .catch((error) => {
        console.error("Failed to update due date:", error);
      });
  }

  function updateCategory() {
    if (!currentTodo) return;

    const data = {
      id: currentTodo._id,
      category: selectedCategory,
    };

    axios
      .post("http://localhost:4000/todos", data, { withCredentials: true })
      .then(() => {
        const newTodos = todos.map((t) => {
          if (t._id === currentTodo._id) {
            return { ...t, category: selectedCategory };
          }
          return t;
        });
        setTodos(newTodos);
        setCategoryDialogOpen(false);
        setCurrentTodo(null);
      })
      .catch((error) => {
        console.error("Failed to update category:", error);
      });
  }

  function openDateDialog(todo) {
    setCurrentTodo(todo);
    setSelectedDate(todo.dueDate ? new Date(todo.dueDate) : null);
    setDialogOpen(true);
  }

  function openCategoryDialog(todo) {
    setCurrentTodo(todo);
    setSelectedCategory(todo.category || "Trabalho");
    setCategoryDialogOpen(true);
  }

  function handleLogout() {
    axios
      .post("http://localhost:4000/logout", {}, { withCredentials: true })
      .then(() => {
        userInfo.setEmail("");
        history.push("/login");
      })
      .catch((error) => {
        console.error("Failed to logout:", error);
      });
  }

  function formatDueDate(date) {
    if (!date) return null;
    return format(new Date(date), "dd/MM/yyyy HH:mm");
  }

  function formatCompletedDate(date) {
    if (!date) return null;
    return format(new Date(date), "dd/MM/yyyy HH:mm");
  }

  function isPastDue(todo) {
    if (!todo.dueDate || todo.done) return false;
    return isPast(new Date(todo.dueDate));
  }
  // Função para calcular estatísticas de tarefas
  function getTaskStats() {
    const total = todos.length;
    const completed = todos.filter((todo) => todo.done).length;
    const pending = total - completed;
    const overdue = todos.filter((todo) => isPastDue(todo)).length;

    return { total, completed, pending, overdue };
  }

  const taskStats = getTaskStats();

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
      <AppBar position="static" sx={{ bgcolor: "#1a1a1a", boxShadow: 2 }}>
        <Toolbar>
          <NoteAddIcon sx={{ mr: 2, color: "#6366f1" }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            DO-IT
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography
              variant="body2"
              sx={{ mr: 2, color: "rgba(255,255,255,0.7)" }}
            >
              {userInfo.email}
            </Typography>
            <IconButton color="inherit" onClick={handleLogout}>
              <LogoutIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      <Container className="todo-container">
        <Box sx={{ my: 4, textAlign: "center" }}>
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            sx={{
              background: "linear-gradient(45deg, #6366f1, #8b5cf6)",
              backgroundClip: "text",
              color: "transparent",
              fontWeight: 600,
            }}
          >
            Minhas Tarefas
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Organize seu dia e aumente sua produtividade
          </Typography>
        </Box>

        {/* Estatísticas das tarefas */}
        <Box sx={{ mb: 4 }}>
          <Grid container spacing={2}>
            <Grid item xs={3}>
              <Paper
                sx={{
                  p: 2,
                  textAlign: "center",
                  bgcolor: "#1e1e1e",
                  borderRadius: "8px",
                }}
              >
                <Typography variant="h4" color="primary">
                  {taskStats.total}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total de Tarefas
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={3}>
              <Paper
                sx={{
                  p: 2,
                  textAlign: "center",
                  bgcolor: "#1e1e1e",
                  borderRadius: "8px",
                }}
              >
                <Typography variant="h4" color="success.main">
                  {taskStats.completed}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Concluídas
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={3}>
              <Paper
                sx={{
                  p: 2,
                  textAlign: "center",
                  bgcolor: "#1e1e1e",
                  borderRadius: "8px",
                }}
              >
                <Typography variant="h4" color="info.main">
                  {taskStats.pending}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Pendentes
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={3}>
              <Paper
                sx={{
                  p: 2,
                  textAlign: "center",
                  bgcolor: "#1e1e1e",
                  borderRadius: "8px",
                }}
              >
                <Typography variant="h4" color="error.main">
                  {taskStats.overdue}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Atrasadas
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Box>

        <Paper
          component="form"
          onSubmit={addTodo}
          elevation={0}
          sx={{
            p: "8px 16px",
            display: "flex",
            alignItems: "center",
            backgroundColor: "#1e1e1e",
            borderRadius: "12px",
            mb: 4,
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Grid container spacing={2} alignItems="center">
            <Grid item xs>
              <TaskTextField
                fullWidth
                placeholder="O que você quer fazer hoje?"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                variant="outlined"
                InputProps={{
                  sx: { borderRadius: "8px" },
                }}
              />
            </Grid>
            <Grid item>
              <DateTimePicker
                value={selectedDate}
                onChange={setSelectedDate}
                renderInput={(params) => (
                  <TaskTextField
                    {...params}
                    variant="outlined"
                    placeholder="Data Prazo"
                    sx={{ width: "200px" }}
                  />
                )}
                label="Data Prazo"
                inputFormat="dd/MM/yyyy HH:mm"
                ampm={false}
              />
            </Grid>
            <Grid item>
              <CategorySelect variant="outlined" sx={{ minWidth: 120 }}>
                <InputLabel id="category-select-label">Categoria</InputLabel>
                <Select
                  labelId="category-select-label"
                  id="category-select"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  label="Categoria"
                >
                  <MenuItem value="Trabalho">Trabalho</MenuItem>
                  <MenuItem value="Lazer">Lazer</MenuItem>
                  <MenuItem value="Estudo">Estudo</MenuItem>
                </Select>
              </CategorySelect>
            </Grid>
            <Grid item>
              <Zoom in={inputVal.trim().length > 0}>
                <Fab
                  color="primary"
                  aria-label="add"
                  type="submit"
                  size="small"
                  sx={{
                    background: "linear-gradient(45deg, #6366f1, #8b5cf6)",
                    "&:hover": {
                      background: "linear-gradient(45deg, #4f46e5, #7c3aed)",
                    },
                  }}
                >
                  <AddIcon />
                </Fab>
              </Zoom>
            </Grid>
          </Grid>
        </Paper>

        {/* Tabs para alternar entre lista e gráfico */}
        <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
          <Tabs
            value={tabValue}
            onChange={(e, newValue) => setTabValue(newValue)}
            textColor="primary"
            indicatorColor="primary"
            centered
          >
            <Tab icon={<NoteAddIcon />} label="Lista de Tarefas" />
            <Tab icon={<ChartIcon />} label="Estatísticas" />
          </Tabs>
        </Box>

        {/* Conteúdo da tab selecionada */}
        {tabValue === 0 ? (
          // Lista de tarefas
          loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", my: 5 }}>
              <CircularProgress color="primary" />
            </Box>
          ) : todos.length === 0 ? (
            <Box className="empty-list">
              <NoteAddIcon
                sx={{ fontSize: 60, color: "#6366f1", opacity: 0.3, mb: 2 }}
              />
              <Typography variant="h6" color="text.secondary">
                Sua lista está vazia
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Adicione sua primeira tarefa acima
              </Typography>
            </Box>
          ) : (
            <List>
              {todos.map((todo, index) => (
                <StyledListItem
                  key={todo._id || index}
                  done={todo.done ? 1 : 0}
                  isPastDue={isPastDue(todo) ? 1 : 0}
                >
                  <ListItemIcon>
                    <Checkbox
                      edge="start"
                      checked={todo.done}
                      onClick={() => updateTodo(todo)}
                      sx={{
                        color: "rgba(255, 255, 255, 0.5)",
                        "&.Mui-checked": {
                          color: "#6366f1",
                        },
                      }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography
                        variant="body1"
                        component="span"
                        sx={{
                          textDecoration: todo.done ? "line-through" : "none",
                          color: todo.done
                            ? "rgba(255, 255, 255, 0.5)"
                            : "#fff",
                        }}
                      >
                        {todo.text}
                      </Typography>
                    }
                    secondary={
                      <Stack direction="row" spacing={1} mt={0.5}>
                        {todo.dueDate && (
                          <Chip
                            icon={<DateRangeIcon fontSize="small" />}
                            label={`Vence: ${formatDueDate(todo.dueDate)}`}
                            size="small"
                            color={isPastDue(todo) ? "error" : "default"}
                            variant="outlined"
                            sx={{ fontSize: "0.7rem" }}
                          />
                        )}
                        {todo.category && (
                          <Chip
                            icon={
                              categoryIcons[todo.category] || (
                                <CategoryIcon fontSize="small" />
                              )
                            }
                            label={todo.category}
                            size="small"
                            sx={{
                              fontSize: "0.7rem",
                              backgroundColor:
                                categoryColors[todo.category] || "#6366f1",
                              color: "#fff",
                            }}
                          />
                        )}
                        {todo.done && todo.completedAt && (
                          <Chip
                            icon={<CheckCircleIcon fontSize="small" />}
                            label={`Concluído: ${formatCompletedDate(
                              todo.completedAt
                            )}`}
                            size="small"
                            color="success"
                            variant="outlined"
                            sx={{ fontSize: "0.7rem" }}
                          />
                        )}
                      </Stack>
                    }
                  />
                  <Tooltip title="Definir categoria">
                    <IconButton
                      edge="end"
                      aria-label="set category"
                      onClick={() => openCategoryDialog(todo)}
                      sx={{ color: "rgba(255, 255, 255, 0.5)", mr: 1 }}
                    >
                      <CategoryIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Definir data">
                    <IconButton
                      edge="end"
                      aria-label="set date"
                      onClick={() => openDateDialog(todo)}
                      sx={{ color: "rgba(255, 255, 255, 0.5)" }}
                    >
                      <ScheduleOutlinedIcon />
                    </IconButton>
                  </Tooltip>
                </StyledListItem>
              ))}
            </List>
          )
        ) : (
          // Gráfico de categorias
          <Box sx={{ mt: 2 }}>
            <Paper
              sx={{
                p: 3,
                backgroundColor: "#1e1e1e",
                borderRadius: "12px",
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
              }}
            >
              {loading ? (
                <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
                  <CircularProgress color="primary" />
                </Box>
              ) : todos.length === 0 ? (
                <Box sx={{ textAlign: "center", py: 5 }}>
                  <ChartIcon
                    sx={{ fontSize: 60, color: "#6366f1", opacity: 0.3, mb: 2 }}
                  />
                  <Typography variant="h6" color="text.secondary">
                    Sem dados para exibir
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Adicione tarefas para visualizar estatísticas
                  </Typography>
                </Box>
              ) : (
                <CategoryChart todos={todos} />
              )}
            </Paper>
          </Box>
        )}
      </Container>

      {/* Dialog para definir a data de vencimento */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        PaperProps={{
          sx: { bgcolor: "#1e1e1e", color: "#fff", borderRadius: "12px" },
        }}
      >
        <DialogTitle>Definir data de vencimento</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <DateTimePicker
              label="Data de vencimento"
              value={selectedDate}
              onChange={setSelectedDate}
              renderInput={(params) => (
                <TaskTextField {...params} fullWidth variant="outlined" />
              )}
              inputFormat="dd/MM/yyyy HH:mm"
              ampm={false}
            />
          </Box>
          {selectedDate &&
            isPast(selectedDate) &&
            !isPast(new Date(selectedDate)) && (
              <Alert severity="warning" sx={{ mt: 2 }}>
                A data selecionada já passou.
              </Alert>
            )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setSelectedDate(null);
              setDialogOpen(false);
            }}
            color="inherit"
          >
            Cancelar
          </Button>
          <Button
            onClick={() => {
              if (selectedDate === null) {
                updateDueDate();
              } else {
                updateDueDate();
              }
            }}
            variant="contained"
            sx={{
              background: "linear-gradient(45deg, #6366f1, #8b5cf6)",
              "&:hover": {
                background: "linear-gradient(45deg, #4f46e5, #7c3aed)",
              },
            }}
          >
            {selectedDate === null ? "Remover data" : "Salvar"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog para definir a categoria */}
      <Dialog
        open={categoryDialogOpen}
        onClose={() => setCategoryDialogOpen(false)}
        PaperProps={{
          sx: { bgcolor: "#1e1e1e", color: "#fff", borderRadius: "12px" },
        }}
      >
        <DialogTitle>Definir categoria</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, minWidth: 250 }}>
            <CategorySelect variant="outlined" fullWidth>
              <InputLabel id="category-dialog-select-label">
                Categoria
              </InputLabel>
              <Select
                labelId="category-dialog-select-label"
                id="category-dialog-select"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                label="Categoria"
                fullWidth
              >
                <MenuItem value="Trabalho">
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <WorkIcon sx={{ mr: 1 }} />
                    Trabalho
                  </Box>
                </MenuItem>
                <MenuItem value="Lazer">
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <LeisureIcon sx={{ mr: 1 }} />
                    Lazer
                  </Box>
                </MenuItem>
                <MenuItem value="Estudo">
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <StudyIcon sx={{ mr: 1 }} />
                    Estudo
                  </Box>
                </MenuItem>
              </Select>
            </CategorySelect>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setCategoryDialogOpen(false);
            }}
            color="inherit"
          >
            Cancelar
          </Button>
          <Button
            onClick={updateCategory}
            variant="contained"
            sx={{
              background: "linear-gradient(45deg, #6366f1, #8b5cf6)",
              "&:hover": {
                background: "linear-gradient(45deg, #4f46e5, #7c3aed)",
              },
            }}
          >
            Salvar
          </Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
}

export default Home;
