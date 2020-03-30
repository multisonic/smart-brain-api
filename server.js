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

app.get("/", (req, res) => {
  res.send(database.users);
});

app.post("/signin", (req, res) => {
  db.select('email', 'hash').from('login')
      .where('email', '=', req.body.email)
      .then(data => {
      const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
      if (isValid) {
          return db.select('*').from('users')
          .where('email', '=', req.body.email)
          .then(user => {
              res.json(user[0])
          })
          .catch(err => res.status(400).json('unable to get user'))
      } else {
          res.status(400).json('wrong credentials')
      }
    })
    .catch(err => res.status(400).json('wrong credentials'))
});

app.post("/register", (req, res) => {
  const { email, name, password } = req.body; //destructing
  const hash = bcrypt.hashSync(password);
  db.transaction(trx => {
    trx
      .insert({
        hash: hash,
        email: email
      })
      .into("login")
      .returning("email")
      .then(loginEmail => {
        return trx("users")
          .returning("*")
          .insert({
            name: name,
            email: loginEmail[0],
            joined: new Date()
          })
          .then(user => {
            res.json(user[0]); // return the first object, since there should onley be one
          })
        })
          .then(trx.commit)
          .catch(trx.rollback)
  })
  .catch(err => res.status(400).json("unable to register"));
});

app.get("/profile/:id", (req, res) => {
  const { id } = req.params;
  db.select("*")
    .from("users")
    .where({ id }) // we can do {id} instead of {id: id} bc prop/value are the same
    .then(user => {
      if (user.length) {
        // if user is greater than 0
        res.json(user[0]);
      } else {
        res.status(400).json("User Not Found");
      }
    })
    .catch(err => res.status(400).json("Error getting user"));
});

app.put("/image", (req, res) => {
  const { id } = req.body; // we rec userId from the body
  db("users")
    .where("id", "=", id)
    .increment("entries", 1)
    .returning("entries")
    .then(entries => {
      res.json(entries[0]);
    })
    .catch(err => res.status(400).json("unable to get entries"));
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
