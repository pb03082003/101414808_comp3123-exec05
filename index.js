const express = require('express');
const app = express();
const router = express.Router();
const fs = require('fs');
const path = require('path');

app.use(express.json());


router.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname, 'home.html'));
});


router.get('/profile', (req, res) => {
    fs.readFile('user.json', 'utf8', (err, data) => {
        if (err) {
            res.status(500).json({message: 'Error reading file'});
        } else {
            res.json(JSON.parse(data));
        }
    });
});


app.post('/login', (req, res) => {
   
   
  const { username, password } = req.body;

  // Read user data from user.json
  fs.readFile('user.json', 'utf8', (err, data) => {
      if (err) {
          return res.status(500).json({ message: "Error reading user file" });
      }

      const user = JSON.parse(data);

      if (username !== user.username) {
          return res.json({ status: false, message: "User Name is invalid" });
      }

      if (password !== user.password) {
          return res.json({ status: false, message: "Password is invalid" });
      }

      return res.json({ status: true, message: "User Is valid" });
  });
});

app.get('/logout/:username', (req, res) => {
  const { username } = req.params;
  res.send(`<b>${username} successfully logged out.</b>`);
});


app.use((err, req, res, next) => {
    console.error(err.stack);  // Log the error (optional)
    res.status(500).send('<h1>Server Error</h1><p>Something went wrong.</p>');
});

app.use('/', router);

app.listen(process.env.port || 8086);

console.log('Web Server is listening at port ' + (process.env.port || 8086));
