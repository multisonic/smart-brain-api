const express = require('express');

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

app.get('/', (req, res)=> {
    res.send(database.users);
})

app.post('/signin', (req, res) => {
    if (req.body.email === database.users[0].email &&
        req.body.password === database.users[0].password) {
            res.json('success');
        } else {
            res.status(400).json('error logging in');
        }
})

app.post('/register', (req, res) => {
    const { email, name, password } = req.body; //destructing
    database.users.push({
        id: "125", // hardcoded for now
        name: name,
        email: email,
        password: password,
        entries: 0, //everyone starts with zero
        date: new Date() // js method to create date
    })
    res.json(database.users[database.users.length-1]) // display last item in array
})

app.listen(3000, () => {
    console.log('app is running on port 3000');
});

/*
/ --> res = this is working
/signin --> POST = success/fail (this is post bc we are sending credentials)
/register --> POST = user
/profile/:userId --> GET = user
/image --> PUT = updated count/user 

*/