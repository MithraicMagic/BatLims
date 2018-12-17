var game = function (gameID) {
    this.playerOne = null;
    this.playerTwo = null;
    this.id = gameID;
    this.battleShipsOne = [];
    this.battleShipsTwo = [];
    this.gameState = "0 PLAYR";
};

game.prototype.twoConnected = function() {
    return (this.gameState == "2 PLAYR");
};

game.prototype.setStatus = function(s) {
    this.gameState = s;
};

game.prototype.addPlayer = function (player) {
    if (this.gameState == "0 PLAYR") {
        this.setStatus("1 PLAYR");
    } else {
        this.setStatus("2 PLAYR");
    }

    if (this.playerOne == null) {
        this.playerOne = player;
        return "1";
    } else {
        this.playerTwo = player;
        return "2";
    }
};

game.prototype.setLocations = function (player, list) {
    if (player === 1) {
        this.battleShipsOne = list;
    } else {
        this.battleShipsTwo = list;
    }
};

game.prototype.checkHit = function (firingP, shot) {
    if (firingP === 1) {
        console.log(this.battleShipsTwo);
        for (let i = 0; i < 21; i++) {
            if (this.battleShipsTwo[i] === shot) {
                return "Hit";
            }
        }
        return "Miss";
    } else {
        console.log(this.battleShipsOne);
        for (var i = 0; i < 21; i++) {
            if (this.battleShipsOne[i] === shot) {
                return "Hit";
            }
        }
        return "Miss";
    }
};

module.exports = game;