const express = require('express');

const app = express();

app.get('/', (req, res)=> {
    res.send('This is working');
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