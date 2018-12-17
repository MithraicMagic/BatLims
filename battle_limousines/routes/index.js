var express = require("express");
var router = express.Router();
var gameStats = require("../stats.js");

//Getting the homepage
router.get("/", function(req, res) {
    var path = __dirname + '/../public/splash.ejs';
    res.render(path, {gamesFinished : gameStats.finished, gamesStarted : gameStats.started});
});

router.get("/play", function(req, res) {
    res.sendFile('game.html', { root: "./public"});
});

router.get('/*', function(req, res) {
    res.sendFile('error.html', { root: "./public"});
});

module.exports = router;
