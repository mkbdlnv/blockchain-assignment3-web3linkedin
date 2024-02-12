
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require('pg');
const path = require("path");
const session = require('express-session');
require("dotenv").config();


const pool = new Pool({
    user: process.env.USER,
    host: process.env.HOST,
    database: process.env.DB,
    password: process.env.PASSWORD,
    port: process.env.PORT
  });
  

const app = express();
const port = 3000;
const {getContractNft} = require('./smartcontracts/nft');

app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true
}));
app.set('view engine', 'ejs');
app.set('views',__dirname+'/public');
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.get('/connect-wallet', (req, res) => {
    res.sendFile(__dirname + '/public/connect-wallet.html');
});
app.get('/registration', (req, res) => {
    res.sendFile(__dirname + '/public/registration.html');
});


app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }
  
    try {
      const client = await pool.connect();
      const result = await client.query('INSERT INTO users (username, password) VALUES ($1, $2)', [username, password]);
      client.release();
      res.sendFile(__dirname + '/public/registration.html');
    } catch (error) {
      console.error('Error executing query', error);
      res.sendFile(__dirname + '/public/registration.html');
    }
  });


// Endpoint for user login
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }
  
    try {
      const client = await pool.connect();
      const result = await client.query('SELECT * FROM users WHERE username = $1 AND password = $2', [username, password]);
      client.release();
  
      if (result.rows.length === 1) {
        req.session.userId = result.rows[0].id;
        req.session.username = result.rows[0].username;
        res.sendFile(__dirname + '/public/user-profile.html');
      } else {
        res.sendFile(__dirname + '/public/registration.html');
      }
    } catch (error) {
      console.error('Error executing query', error);
      res.status(500).json({ error: 'Internal server error' });
    }
});
  
  // Endpoint to check if user is logged in
  app.get('/check-login', (req, res) => {
    if (req.session.userId) {
      res.status(200).json({ loggedIn: true });
    } else {
      res.status(401).json({ loggedIn: false });
    }
});

app.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Ошибка при выходе из аккаунта:', err);
            res.status(500).json({ error: 'Внутренняя ошибка сервера' });
        } else {
            res.status(200).json({ message: 'Пользователь успешно вышел из аккаунта' });
        }
    });
});

  // Ваш серверный код, например, в файле server.js


// 3) Main page
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/main.html');
});

// 4) User profile page
app.get('/user-profile', (req, res) => {
    res.render('user-profile', {username: req.session.username})
});

// Теперь добавим обработчики для ваших данных пользователя

// Пример данных пользователя (в реальном проекте они будут храниться в базе данных)
const userProfile = {
    avatar: '/images/avatar.jpg',
    address: '0x1234567890abcdef',
    tokens: {
        erc20: 100,
        erc721: [1, 2, 3],
    },
    friends: [],
    connectRequests: [],
};

// Получение данных профиля пользователя
app.get('/api/user-profile', (req, res) => {
    res.json(userProfile);
});

// Добавление в друзья
app.post('/api/add-friend/:friendAddress', (req, res) => {
    const friendAddress = req.params.friendAddress;
    if (!userProfile.friends.includes(friendAddress)) {
        userProfile.friends.push(friendAddress);
    }
    res.json(userProfile.friends);
});

// Обработка запросов на добавление в друзья
app.get('/api/connect-requests', (req, res) => {
    res.json(userProfile.connectRequests);
});

app.post('/api/connect-request/:requesterAddress', (req, res) => {
    const requesterAddress = req.params.requesterAddress;
    if (!userProfile.connectRequests.includes(requesterAddress)) {
        userProfile.connectRequests.push(requesterAddress);
    }
    res.json(userProfile.connectRequests);
});





app.get('/test', async (req, res) => {
    const contract = await getContractNft();
    try {
        const owner = await contract.methods.getUserInfo("0xE51106cEE18EF3BD8C5449278e08dbe2F4c368DB").call({ from: '0xE51106cEE18EF3BD8C5449278e08dbe2F4c368DB' });
        console.log("Owner:", owner);
        res.send("Owner of the contract retrieved successfully.");
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send("Error occurred while retrieving owner of contract.");
    }

    try {
        await contract.methods.registerUser("Medet Kabdulinov", "bio", "img1.jpg").send({ from: '0xE51106cEE18EF3BD8C5449278e08dbe2F4c368DB' })
        .on('transactionHash', function(hash){
            console.log('Transaction Hash:', hash);
        })
        .on('confirmation', function(confirmationNumber, receipt){
            console.log('Confirmation Number:', confirmationNumber);
        })
        .on('receipt', function(receipt){
            console.log('Receipt:', receipt);
        })
        .on('error', function(error){
            console.error('Error:', error);
        });
    } catch (error) {
        console.error('Caught error:', error);
    }
    
    

});


app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});


