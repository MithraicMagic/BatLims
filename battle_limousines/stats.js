var gameStats = {
    since : Date.now(),
    started : 0,   //number of games that have started
    stopped : 0,  //number of games stopped (not finished)
    finished : 0  //number of completed games
};

module.exports = gameStats;