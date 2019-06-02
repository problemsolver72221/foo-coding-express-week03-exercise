const express = require("express"); // Import the expressJS.
const app = express(); // Call the express function, store it in "app" as convention.

const Joi = require("@hapi/joi"); // Input validation

// post part:
app.use(express.json()); // Applying middleware for post req

// app.get() - Read
// app.post() - Create
// app.put() - Update
// app.delete() - Delete

const todos = [
  { id: 1, description: "Wake Up" },
  { id: 2, description: "Brush Teeth" },
  { id: 3, description: "Drink Coffee" }
];

// GET (Read)

// localhost:3000

app.get("/", (req, res) => {
  res.send("Home Page");
});

app.get("/api/todos", (req, res) => {
  res.send(todos);
});

app.get("/api/todos/:id", (req, res) => {
  const todo = todos.find(t => t.id === parseInt(req.params.id));
  if (!todo)
    return res.status(404).send("The todo with the given ID was not found..");
  res.send(todo);
});

// Route Parameters:
app.get("/api/posts/:year/:month", (req, res) => {
  res.send(req.params);
});

// POST (Create)

app.post("/api/todos", (req, res) => {
  const { error } = validateToDo(req.body); // Equal to result.error
  if (error) {
    // Bad request
    return res.status(400).send(error.details[0].message);
  }

  const todo = {
    id: todos.length + 1,
    description: req.body.description
  };

  todos.push(todo);
  res.send(todo);
});

// PUT (Update)

app.put("/api/todos/:id", (req, res) => {
  // Look up the todo
  // If not existing, return 404
  const todo = todos.find(t => t.id === parseInt(req.params.id));
  if (!todo)
    return res.status(404).send("The todo with the given ID was not found..");

  // Otherwise validate
  // If invalid, return 400 - bad request

  const result = validateToDo(req.body); // Equal to result.error
  if (result.error) {
    // Bad request
    res.status(400).send(result.error.details[0].message);
    return;
  }

  // If everything is okay, update the todo
  todo.description = req.body.description;
  // Return the updated course to the client.
  res.send(todo);
});

app.delete("/api/todos/:id", (req, res) => {
  // Look up the todo
  // If not existing, return 404

  const todo = todos.find(t => t.id === parseInt(req.params.id));
  if (!todo)
    return res.status(404).send("The todo with the given ID was not found..");

  // Otherwise delete it

  const index = todos.indexOf(todo);
  todos.splice(index, 1); //Go to the index, and remove one object.

  // Then return the same todo that was deleted.
  res.send(todo);
});

// Utility Function to handle input validation:

function validateToDo(todo) {
  const schema = {
    description: Joi.string()
      .min(3)
      .required()
  };

  return Joi.validate(todo, schema);
}

//Use env variable instead of fixed port.

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
