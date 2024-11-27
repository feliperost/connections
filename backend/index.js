const express = require('express');
const statsRoutes = require('./routes/stats');
const cookieParser = require('cookie-parser'); // used to deal with cookies
const { v4: uuidv4 } = require('uuid'); // generates unique IDs
const { upsertUserStats } = require('./models/UserStats');

const app = express();
const PORT = 5000;
const cors = require("cors");

app.use(cors({
    origin: "http://localhost:3000", // allows requests from port 3000
    credentials: true, // allows cookies being sent
}));

// middleware for parsing JSON. the express.json middleware is important for parsing incoming JSON payloads and making that data available in the req. body or further processing within the routes.
app.use(express.json());
app.use(cookieParser());

// used to generate userId with UUID and cookies. then, it generates default data for new users
app.use((req, res, next) => {
  let userId = req.cookies.userId;

  if (!userId) {
    userId = uuidv4(); // generates a new userId if it doesn't exist
    // setting the cookie parameters
    res.cookie("userId", userId, { 
      httpOnly: false, 
      secure: false, 
      path: '/', 
      sameSite: 'Lax', 
      maxAge: 1000 * 60 * 60 * 24 * 10 // cookie lasts for 10 days (development)
    });

    // creates default stats for new users (all set to 0 by default, see schema)
    upsertUserStats(userId, {
      gamesCompleted: 0,
      winPercentage: 0,
      currentStreak: 0,
      maxStreak: 0,
      perfectPuzzles: 0,
      mistakeHistogram: { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0 },
    });
  }

  req.userId = userId; // makes userId available in all requests
  next();
});

// default server route
app.get("/", (req, res) => {
  res.send("Server is running!");
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