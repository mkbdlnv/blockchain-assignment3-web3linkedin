// server.js
const http = require('http');
const express = require('express');
const ejs = require('ejs');
const path = require('path');
const userModel = require('./models/user');
const bodyParser = require('body-parser')

const app = express();

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())


// Set the view engine to EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Define a route for the dynamic content
app.get('/', (req, res) => {
  res.render('index');
});

app.get('/home', (req, res) => {
    res.render('home');
  });

app.post('/register', async (req, res) => {
    const email = req.body.email
    const username = req.body.username
    const password = req.body.password
  
    try {
      const existingUser = await userModel.getUserByUsername(username);
      if (existingUser) {
        return res.status(400).json({ error: 'Username already taken' });
      }
  
      const newUser = await userModel.createUser(email, username, password );
      res.redirect('/')
    } catch (error) {
      console.error('Error registering user:', error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  app.post('/login', async (req, res) => {
    const { username, password } = req.body;
  
    try {
      const user = await userModel.getUserByUsername(username);
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      const passwordMatch = await userModel.comparePasswords(password, user.password);
      if (!passwordMatch) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      res.redirect('/home')
    } catch (error) {
      console.error('Error logging in:', error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

const server = http.createServer(app);

const PORT = 3000;

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
