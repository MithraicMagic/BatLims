var express = require("express");
var http = require("http");
var port = process.argv[2];
var app = express();
var messages = require("./public/javascripts/messages");
var Game = require("./game.js");
var websocket = require("ws");

var gameStats = require("./stats.js");

app.use(express.static(__dirname + "/public"));
var server = http.createServer(app);

var indexRouter = require("./routes/index");
app.use(indexRouter);

const wss = new websocket.Server({ server });
var websockets = {};

var game = new Game(gameStats.started++);
var connectionID = 0;

wss.on("connection", function(ws) {

    let con = ws;
    con.id = connectionID++;
    console.log("Player " + con.id + " has connected");
    let player = game.addPlayer(con);
    websockets[con.id] = game;

    console.log("Player %s placed in game %s", ws.id, game.id);

    if (game.twoConnected()) {
        setTimeout(function() {
            ws.send(JSON.stringify(messages.PLAYER_TWO));
        }, 1000);
        game = new Game(gameStats.started++);
    }

    if (con == game.playerOne) {
        con.send(JSON.stringify(messages.ATTACKER));
    }

    con.on("message", function incoming(message) {
        console.log(message);
        let game = websockets[con.id];

        let isPlayerOne = (game.playerOne === con);
        let jMsg = JSON.parse(message);

        if (jMsg.type === messages.SET_LOCS) {
            if (isPlayerOne) {
                game.setLocations(1, jMsg.data);
            } else {
                game.setLocations(2, jMsg.data);
            }
        }

        if (isPlayerOne) {
            if (jMsg.type === messages.SHOT_FIRED) {
                check = game.checkHit(1, jMsg.data);
                messages.HIT_OR_MISS_D.data = check;
                con.send(JSON.stringify(messages.HIT_OR_MISS_D));
                game.playerTwo.send(JSON.stringify(messages.ATTACKER));
            }
        } else {
            if (jMsg.data === "READY") {
                game.playerOne.send(JSON.stringify(messages.PLAYER_ONE));
            }
            if (jMsg.type === messages.SHOT_FIRED) {
                check = game.checkHit(2, jMsg.data);
                messages.HIT_OR_MISS_D.data = check;
                con.send(JSON.stringify(messages.HIT_OR_MISS_D));
                game.playerOne.send(JSON.stringify(messages.ATTACKER));
            }
        }
    });
});


server.listen(port, function() {
    console.log("Listening on port: " + port);
});

module.exports = app;