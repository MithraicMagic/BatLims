var game = function (gameID) {
    this.playerOne = null;
    this.playerTwo = null;
    this.id = gameID;
    this.gameState = "0 PLAYR";
};

var output = function (x) {
    console.log("You know: " + x);
};

output("Death, is but a virtue");