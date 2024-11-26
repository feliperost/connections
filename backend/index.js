const express = require('express');
const statsRoutes = require('./routes/stats');
const cookieParser = require('cookie-parser'); // used to deal with cookies
const { v4: uuidv4 } = require('uuid'); // generates unique IDs
const { upsertUserStats } = require('./models/UserStats');

const app = express();
const PORT = 5000;

// middleware for parsing JSON. the express.json middleware is important for parsing incoming JSON payloads and making that data available in the req. body or further processing within the routes.
app.use(express.json());
app.use(cookieParser());

// default server route
app.get("/", (req, res) => {
    res.send("Server is running!");
  });

// initial route used to generate userId with UUID and cookies. then, it generates default data for new users
app.use((req, res, next) => {
    let userId = req.cookies.userId;
  
    if (!userId) {
      userId = uuidv4(); // generates new Id if it doenst exist
      res.cookie('userId', userId, { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 * 10 }); // cookie lasts for 10 days (for development)
  
      // generates default stats for new users, which are all 0 (see schema) 
      upsertUserStats(userId, {});
      console.log(`New user created with ID: ${userId}`);
    }
  
    req.userId = userId; // makes userId available on all requests
    next();
  });

// route for player stats
app.use('/stats', statsRoutes);

// server listening/operating on established port
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});




// TODO LIST:
// - playing the game needs to send data to the database and update it.
// - display data from the database in our application