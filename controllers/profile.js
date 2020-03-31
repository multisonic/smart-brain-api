const handleProfileGet = (req, res, db) => {
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
  }

  module.exports = {
      handleProfileGet //don't need the rest of this in ES6
  }