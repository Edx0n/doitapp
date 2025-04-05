import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import User from "./models/User.js";
import bcrypt from "bcrypt";
import cors from "cors";
import jwt from "jsonwebtoken";
import Todo from "./models/Todo.js";

const secret = "secret123";

await mongoose.connect(
  "mongodb+srv://teste:TnVkjxzzB3w6LOME@todoapp.8vabbvx.mongodb.net/auth-todo",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);
const db = mongoose.connection;

const app = express();
app.use(cookieParser());
app.use(bodyParser.json({ extended: true }));
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:3000",
  })
);

app.get("/", (req, res) => {
  res.send("ok");
});

app.get("/user", (req, res) => {
  if (!req.cookies.token) {
    return res.json({});
  }
  const payload = jwt.verify(req.cookies.token, secret);
  User.findById(payload.id).then((userInfo) => {
    if (!userInfo) {
      return res.json({});
    }
    res.json({ id: userInfo._id, email: userInfo.email });
  });
});

app.post("/register", (req, res) => {
  const { email, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);
  const user = new User({ password: hashedPassword, email });
  user.save().then((userInfo) => {
    jwt.sign(
      { id: userInfo._id, email: userInfo.email },
      secret,
      (err, token) => {
        if (err) {
          console.log(err);
          res.sendStatus(500);
        } else {
          res
            .cookie("token", token)
            .json({ id: userInfo._id, email: userInfo.email });
        }
      }
    );
  });
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email }).then((userInfo) => {
    if (!userInfo) {
      return res.sendStatus(401);
    }
    const passOk = bcrypt.compareSync(password, userInfo.password);
    if (passOk) {
      jwt.sign({ id: userInfo._id, email }, secret, (err, token) => {
        if (err) {
          console.log(err);
          res.sendStatus(500);
        } else {
          res
            .cookie("token", token)
            .json({ id: userInfo._id, email: userInfo.email });
        }
      });
    } else {
      res.sendStatus(401);
    }
  });
});

app.post("/logout", (req, res) => {
  res.cookie("token", "").send();
});

app.get("/todos", (req, res) => {
  const payload = jwt.verify(req.cookies.token, secret);
  Todo.where({ user: new mongoose.Types.ObjectId(payload.id) }).find(
    (err, todos) => {
      res.json(todos);
    }
  );
});

// No endpoint PUT /todos
app.put("/todos", (req, res) => {
  const payload = jwt.verify(req.cookies.token, secret);
  const todo = new Todo({
    text: req.body.text,
    done: false,
    user: new mongoose.Types.ObjectId(payload.id),
    dueDate: req.body.dueDate || null, // Adiciona a data de vencimento se fornecida
    category: req.body.category || "Trabalho", // Adiciona a categoria
  });
  todo.save().then((todo) => {
    res.json(todo);
  });
});

// No endpoint POST /todos (update)
app.post("/todos", (req, res) => {
  const payload = jwt.verify(req.cookies.token, secret);

  // Preparar o objeto de atualização
  const updateData = {
    done: req.body.done,
  };

  // Se a tarefa estiver sendo marcada como concluída, adiciona a data de conclusão
  if (req.body.done) {
    updateData.completedAt = new Date();
  } else {
    // Se a tarefa estiver sendo desmarcada, remove a data de conclusão
    updateData.completedAt = null;
  }

  // Se houver uma data de vencimento sendo atualizada
  if (req.body.dueDate !== undefined) {
    updateData.dueDate = req.body.dueDate;
  }

  // Se houver uma categoria sendo atualizada
  if (req.body.category !== undefined) {
    updateData.category = req.body.category;
  }

  Todo.updateOne(
    {
      _id: new mongoose.Types.ObjectId(req.body.id),
      user: new mongoose.Types.ObjectId(payload.id),
    },
    updateData
  ).then(() => {
    res.sendStatus(200);
  });
});

app.listen(4000);
