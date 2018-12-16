var game = function (gameID) {
    this.playerOne = null;
    this.playerTwo = null;
    this.id = gameID;
    this.battleShipsOne = {};
    this.battleShipsTwo = {};
    this.gameState = "0 PLAYR";
};

game.prototype.twoConnected = function() {
    return (this.gameState == "2 PLAYR");
};

game.prototype.addPlayer = function (player) {
    var status = this.setStatus("1 PLAYR");
    if (status instanceof Error){
        this.setStatus("2 PLAYR");
    }

    if (this.playerOne == null) {
        this.playerOne = player;;
        return "1";
    } else {
        this.playerTwo = player;
        return "2";
    }

};

module.exports = game;