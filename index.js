// externals
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const bodyParser = require("body-parser");

// view engine
app.set("view engine", "ejs");

// internals
let Todo = require("./model/todo.model");

// db
var mongoDB = "mongodb://127.0.0.1";
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
var db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB Connection Error"));

// set up BodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// port
const PORT = 5000;

// get all todos
app.get("/", (req, res) => {
  Todo.find({}, function (err, todos) {
    if (err) {
      res.send(err.message);
    } else {
      res.render("index", { data: todos });
    }
  });
});

// post new todo
app.post("/", (req, res) => {
  const title = req.body.title;

  // create instance of model
  var newTodo = new Todo({ title });

  // save to db & show on screen
  newTodo
    .save()
    .then(res.render("index"))
    .then(console.log("todo added"))
    .catch((err) => res.status(400).json("Error: " + err));
});

// update a todo
app.patch("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const update = { completed: true };
    const options = { new: true };
    // retrive todo from DB and update
    const result = await Todo.findByIdAndUpdate(id, update, options);
    res.send(result);
  } catch (error) {
    res.send(error.message);
  }
});

// delete a todo
app.delete("delete/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const result = await Todo.findByIdAndRemove(id);
    res.render("index");
    Todo.find({}, function (err, todos) {
      if (err) {
        res.send(err.message);
      } else {
        res.render("index", { data: todos });
      }
    });
  } catch (error) {
    res.send(error.message);
  }
});

// server running
app.listen(PORT, () => {
  console.log(`Live on ${PORT}`);
});
