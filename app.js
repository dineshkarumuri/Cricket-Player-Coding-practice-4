const express = require("express");

const path = require("path");

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const app = express();
app.use(express.json());

const dbPath = path.join(__dirname, "cricketTeam.db");
let db = null;
const initializeDbAndServer = async (request, response) => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server is running on port 3000");
    });
  } catch (e) {
    console.log(`DB Error:${e.message}`);
    process.exit(1);
  }
};
initializeDbAndServer();

//GET all players

app.get("/players/", async (request, response) => {
  const getPlayersQuery = `SELECT * FROM cricket_team ORDER BY player_id;`;
  const playerArray = await db.all(getPlayersQuery);
  response.send(playerArray);
});

//Add a player

app.post("/players/", async (request, response) => {
  const playerObject = request.body;
  const { playerName, jerseyNumber, role } = playerObject;
  const addPlayerQuery = `INSERT INTO cricket_team(player_name,jersey_number,role) VALUES('${playerName}',${jerseyNumber},'${role}');`;
  const dbResponse = await db.run(addPlayerQuery);
  const playerId = dbResponse.lastID;
  response.send("Player Added to Team");
  console.log(playerId);
});

//GET Player

app.get("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const getPlayerQuery = `SELECT * FROM cricket_team WHERE player_id=${playerId};`;
  const getPlayer = await db.get(getPlayerQuery);
  response.send(getPlayer);
});

//Update a player

app.put("/players/:playerId/", async (request, response) => {
  const playerObject = request.body;
  const { playerId } = request.params;
  const { playerName, jerseyNumber, role } = playerObject;
  console.log(playerName);
  const updatePlayerQuery = `UPDATE cricket_team SET player_name='${playerName}',
  jersey_number=${jerseyNumber},role='${role}' WHERE player_id=${playerId};`;
  await db.run(updatePlayerQuery);
  response.send("Player Details Updated");
});

//Delete a player

app.delete("/players/:playerId/", async (request, response) => {
  const playerId = request.params;
  const deleteQuery = `DELETE  FROM cricket_team WHERE player_id=${playerId};`;
  await db.run(deleteQuery);
  response.send("Player Removed");
});

module.exports = app;
