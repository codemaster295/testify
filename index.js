const express = require("express");
const app = express()
const bodyParser = require("body-parser");
const cors = require("cors");
app.use(cors())
app.use(bodyParser.json());
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const db = require("./models");
const User = db.User;
const auth = require('./middleware/auth')
db.sequelize.sync({ force: true }).then(() => {

  // console.log("Drop and re-sync db.");

});

app.get("/", (req, res) => {
  res.json({ message: "Welcome to testify api." });
});

app.post('/signup', async (req, res) => {
  const isUserRegisters = await User.findOne({ where: { email: req.body.email } })

  if (isUserRegisters) {
    res.status(200).send({
      success: false,
      message: "Email already exist please login with existing email"
    })
  }
  else if (!req.body.email) {
    res.status(200).send({
      success: false,
      message: "Please provide email"
    })
  }
  else if (!isUserRegisters) {
    const signup = {
      email: req.body.email,
      username: req.body.username,
      password: bcrypt.hashSync(req.body.password, 10)
    };
    User.create(signup)
      .then(data => {
        res.send({
          success: true,
          message: "Account created successfully"
        });
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the Tutorial."
        });
      });
    const token = jwt.sign({ email: signup.email, password: signup.password }, process.env.JWT_KEY)
  }
})

app.listen(3000, () => {
  console.log('Server is running at port 3000');
});