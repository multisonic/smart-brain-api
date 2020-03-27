const express = require("express");
const bcrypt = require("bcrypt-nodejs");
const cors = require("cors");
const knex = require("knex");

const db = knex({
  client: "pg",
  connection: {
    host: "127.0.0.1",
    user: "michaelzaleski",
    password: "",
    database: "smart-brain"
  }
});

const app = express();

app.use(express.json());
app.use(cors());

const database = {
  users: [
    {
      id: "123",
      name: "John",
      password: "cookies",
      email: "john@gmail.com",
      entries: 0, //used to track scores
      date: new Date() // js method to create date
    },
    {
      id: "124",
      name: "Sally",
      password: "bananas",
      email: "sally@gmail.com",
      entries: 0, //used to track scores
      date: new Date() // js method to create date
    }
  ],
  login: [
    {
      id: "123",
      hash: "",
      email: "john@gmail.com"
    }
  ]
};

app.get("/", (req, res) => {
  res.send(database.users);
});

app.post("/signin", (req, res) => {
  bcrypt.compare(
    "saladkit",
    "$2a$10$JDCKtnaWkW9RmP5Cyzuid.Vx7JjKMHXOHxbiQJ7h/VSuCMOJuiZ9m",
    function(err, res) {
      console.log("first guess", res);
    }
  );
  bcrypt.compare(
    "veggies",
    "$2a$10$JDCKtnaWkW9RmP5Cyzuid.Vx7JjKMHXOHxbiQJ7h/VSuCMOJuiZ9m",
    function(err, res) {
      console.log("second guess", res);
    }
  );
  if (
    req.body.email === database.users[0].email &&
    req.body.password === database.users[0].password
  ) {
    res.json(database.users[0]);
  } else {
    res.status(400).json("error logging in");
  }
});

app.post("/register", (req, res) => {
  const { email, name, password } = req.body; //destructing
  db("users")
    .returning("*")
    .insert({
      name: name,
      email: email,
      joined: new Date()
    })
    .then(user => {
      res.json(user[0]); // return the first object, since there should onley be one
    })
    .catch(err => res.status(400).json('unable to register'));
});

app.get("/profile/:id", (req, res) => {
  const { id } = req.params;
  let found = false;
  // loop thru the users in array to find matching user
  database.users.forEach(user => {
    if (user.id === id) {
      found = true;
      return res.json(user);
    }
  });
  if (!found) {
    // ie NOT found
    res.status(404).json("no such user");
  }
});

app.put("/image", (req, res) => {
  const { id } = req.body; // we rec userId from the body
  let found = false;
  database.users.forEach(user => {
    if (user.id === id) {
      found = true;
      user.entries++; // add 1 to the user entries
      return res.json(user.entries); // display the updated entries
    }
  });
  if (!found) {
    // ie NOT found
    res.status(404).json("not found");
  }
});

// bcrypt.hash("bacon", null, null, function(err, hash) {
//     // Store hash in your password DB.
// });

// // Load hash from your password DB.
// bcrypt.compare("bacon", hash, function(err, res) {
//     // res == true
// });
// bcrypt.compare("veggies", hash, function(err, res) {
//     // res = false
// });

app.listen(3000, () => {
  console.log("app is running on port 3000");
});
