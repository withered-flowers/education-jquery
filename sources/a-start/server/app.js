const jwt = require("jsonwebtoken");
const express = require("express");
const app = express();

const secretKey = "halo, kunci ini tidak aman !";
const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const todos = [
  {
    id: 1,
    name: "Waduh, bahan baru lagi",
    isCompleted: false,
    by: "Anya",
  },
  {
    id: 2,
    name: "Jangan lupa nyatet yah",
    isCompleted: false,
    by: "Forger",
  },
  {
    id: 3,
    name: "Namanya jQuery",
    isCompleted: false,
    by: "Yor",
  },
];

const authN = (req, res, next) => {
  try {
    const { access_token: token } = req.headers;

    if (!token) {
      throw new Error("NO_TOKEN");
    }

    const payload = jwt.verify(token, secretKey);

    req.additional = {
      username: payload.username,
    };

    next();
  } catch (err) {
    next(err);
  }
};

// POST /login
app.post("/login", (req, res, next) => {
  const { username } = req.body;

  try {
    const token = jwt.sign({ username }, secretKey, {
      expiresIn: "2h",
    });

    res.status(200).json({
      statusCode: 200,
      data: {
        access_token: token,
      },
    });
  } catch (err) {
    next(err);
  }
});

/*
GET /todos

Request
  -

Response
  Body
    {
      statusCode: 200,
      data: {
        todos: [
          {
            id: Integer,
            name: String,
            isCompleted: Boolean,
            by: String
          },
          ...
        ]
      }
    }
*/
app.get("/todos", (req, res) => {
  res.status(200).json({
    statusCode: 200,
    data: {
      todos,
    },
  });
});

app.post(
  // Endpoint
  "/todos",
  // Middleware Authentication
  authN,
  // Handler
  (req, res, next) => {
    try {
      const { todoName } = req.body;

      let newId = todos[todos.length - 1].id + 1;

      let newTodo = {
        id: newId,
        name: todoName,
        isCompleted: false,
        by: req.additional.username,
      };

      todos.push(newTodo);

      res.status(201).json({
        statusCode: 201,
        data: {
          todo: newTodo,
        },
      });
    } catch (err) {
      next(err);
    }
  }
);

// error handler
app.use((err, req, res, next) => {
  let statusCode = 500;
  let msg = "Internal Server Error";

  if (err.message === "NO_TOKEN" || err.name === "JsonWebTokenError") {
    statusCode = 401;
    msg = "Unauthorized Access (Token)";
  }

  res.status(statusCode).json({
    statusCode,
    error: {
      message: msg,
    },
  });
});

app.listen(port, (_) => console.log(`Apps is working at port ${port}`));
