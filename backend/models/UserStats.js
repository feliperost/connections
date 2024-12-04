// the 3 lines below are used to manipulate our simulated database json file
const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, '../userStats.json');

// used to READ stats from our 'database'
const readStats = () => {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading stats:', error);
    return [];
  }
};

// used to WRITE data on our database
const writeStats = (data) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error writing stats:', error);
  }
};

// gets all stats from the file
const getStats = () => readStats();

// gets stats from a specific user, based on their userId
const getUserStats = (userId) => {
  const stats = readStats();
  return stats.find((user) => user.userId === userId);
};

// upsert = update or insert. if data already exists, updates it. if it doesnt, creates (inserts) it.
// used to UPSERT data on our database
const upsertUserStats = (userId, updates) => {
  const stats = readStats();
  let userStats = stats.find((user) => user.userId === userId);

  if (!userStats) {
    // if user doesnt exist, creates new user with default data
    userStats = {
      userId,
      gamesCompleted: 0,
      currentStreak: 0,
      maxStreak: 0,
      perfectPuzzles: 0,
      mistakeHistogram: { "0": 0, "1": 0, "2": 0, "3": 0, "4": 0 },
    };
    stats.push(userStats);
  }

  // updates user data
  Object.keys(updates).forEach((key) => {
    if (key in userStats) {
      if (typeof updates[key] === 'object') {
        // spread operator used to update internal objects such as mistakeHistogram (which is an array inside an array)
        userStats[key] = { ...userStats[key], ...updates[key] };
      } else {
        userStats[key] = updates[key];
      }
    }
  });

  writeStats(stats);
  return userStats;
};

module.exports = { getStats, getUserStats, upsertUserStats };


// for now, we can manually insert dummy data in our database with the following bash command lines:
// curl -X POST -H "Content-Type: application/json" \
//   -d '{
//         "gamesCompleted": 10,
//         "currentStreak": 5,
//         "maxStreak": 10,
//         "perfectPuzzles": 3,
//         "mistakeHistogram": {"0": 1, "1": 2, "2": 3, "3": 4, "4": 0}
//       }' \
//   http://localhost:5000/stats/dummy-user-id

// we can also delete the cookie from the browser, and create it again refreshing the page