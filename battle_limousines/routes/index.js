var express = require('express');
var router = express.Router();
var gameStats = require("../stats.js");

//Getting the homepage
router.get('/', function(req, res) {
    res.render(__dirname + '/../public/splash.ejs', { gamesStarted: gameStats.started, gamesFinished: gameStats.finished});
});

//Getting the game page when pressing the start button
router.get('/play', function(req, res) {
    res.sendFile('game.html', { root: "./public"});
});

router.get('/*', function(req, res) {
    res.sendFile('error.html', { root: "./public"});
})

module.exports = router;
