const express = require("express");

const app = express();

app.use(express.json());

const database = {
  users: [
    {
      id: "123",
      name: "John",
      email: "john@gmail.com",
      password: "cookies",
      entries: 0, //used to track scores
      date: new Date() // js method to create date
    },
    {
      id: "124",
      name: "Sally",
      email: "sally@gmail.com",
      password: "bananas",
      entries: 0, //used to track scores
      date: new Date() // js method to create date
    }
  ]
};

app.get("/", (req, res) => {
  res.send(database.users);
});

app.post("/signin", (req, res) => {
  if (
    req.body.email === database.users[0].email &&
    req.body.password === database.users[0].password
  ) {
    res.json("success");
  } else {
    res.status(400).json("error logging in");
  }
});

app.post("/register", (req, res) => {
  const { email, name, password } = req.body; //destructing
  database.users.push({
    id: "125", // hardcoded for now
    name: name,
    email: email,
    password: password,
    entries: 0, //everyone starts with zero
    date: new Date() // js method to create date
  });
  res.json(database.users[database.users.length - 1]); // display last item in array
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
        user.entries++ // add 1 to the user entries
        return res.json(user.entries); // display the updated entries

      }
    });
    if (!found) {
      // ie NOT found
      res.status(404).json("not found");
    }
  });

app.listen(3000, () => {
  console.log("app is running on port 3000");
});