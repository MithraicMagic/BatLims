var express = require('express');
var router = express.Router();

//Getting the homepage
router.get('/', function(req, res) {
  res.sendFile('splash.html', { root: "./public" });
});

//Getting the game page when pressing the start button
router.get('/play', function(req, res) {
  res.sendFile('game.html', { root: "./public"});
});

module.exports = router;
