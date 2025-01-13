// token based authentication

import express from "express";

const app = express();
app.use(express.json());

const users = [];

function findUser(username) {
  const found = users.find(u => u.username == username);
  return found;
}

function tokenGenerator() {
  let options = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j",
    "k", "l", "m", "n", "o", "p", "q", "r", "s", "t",
    "u", "v", "w", "x", "y", "z", "1", "2", "3", "4",
    "5", "6", "7", "8", "9", "0"];
  let token = "";
  for (let i = 0; i < 10; i++) {
    token += options[Math.floor(Math.random() * options.length)];
  }
  return token;
}

app.post("/signup", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    console.log(username, password)
    return res.json({
      message: "Invalid username or password!"
    })
  }

  if (findUser(username)) {
    return res.json({
      message: "User already exists!"
    })
  }

  users.push({ username: username, password: password });
  res.json({
    message: "Signed Up successfull!"
  })

  console.log(users);
});

app.post("/signin", (req, res) => {
  const foundUser = findUser(req.body.username);
  if (foundUser && foundUser.password == req.body.password) {
    const token = tokenGenerator();
    foundUser.token = token;
    res.json({
      message: "Successfully signed in!",
      token: token
    });
  }
  else {
    res.json({
      message: "User not found"
    });
  }

  console.log(users);
});

app.get("/profile", (req, res) => {
  const token = req.headers.token;
  const foundUser = users.find(u => u.token == token);
  if (foundUser) {
    res.json({
      message: "Welcome to your profile",
      username: foundUser.username
    });
  }
  else {
    res.json({
      message: "Invalid token"
    });
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
