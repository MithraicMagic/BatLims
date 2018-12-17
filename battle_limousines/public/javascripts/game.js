var socket = new WebSocket("ws://localhost:3000");
var attacker = false;
var shot = false;

socket.onopen = function(){
    socket.send("{}");
};

socket.onmessage = function(event) {
    message = JSON.parse(event.data);
    console.log(message.data);
    console.log(event.data);

    if (message.data === "ATTACK") {
        console.log("Lol atekker");
        attacker = true;
    }

    if (message.type == Messages.HIT_OR_MISS && shot) {
        if (message.data == "Hit") {
            console.log("HIT!");
        } else if (message.data == "Miss") {
            console.log("Miss...");
        }
    }

    if (message.data === "player2") {
        document.getElementById("overlayText").innerHTML = "Player 1 is ready!";
        socket.send(JSON.stringify(Messages.READY));
        setTimeout(function () {
            olOff();
        }, 2000);
    } else if (message.data === "player1") {
        document.getElementById("overlayText").innerHTML = "Player 2 is ready!";
        setTimeout(function () {
            olOff();
        }, 2000);
    }

};

function olOff() {
    document.getElementById("overlay").style.display = "none";
}

function main() {
    for(var i = 1; i <= 64; i++){
        $("#board").append('<div class="tile '+ i +'"></div>');
        $("#eBoard").append('<div class="tile '+ i +'"></div>');
    }

    $("#eBoard").on("click", function click(event) {
        if (attacker) {
            var boardpos = $("#eBoard").offset();
            var x = Math.ceil((event.pageX - boardpos.left) / 70);
            var y = Math.ceil((event.pageY - boardpos.top) / 70);
            var tile = ((y - 1) * 8) + x;
            Messages.SHOT_FIRED_LOC.data = tile;
            socket.send(JSON.stringify(Messages.SHOT_FIRED_LOC));
            attacker = false;
            shot = true;
        }
    });

    for(var i = 1; i <= 6; i++){
        let colors = ["#4DA4A8", "#FF6347", "#DAF7A6", "#C70039", "#6C3483", "#D35400"];
        let widths = ["134px", "204px", "204px", "274px", "274px", "344px"];
        $("#garage").append('<div class="limousine" id="limousine'+i+'" draggable="true" ondragstart="drag(event)"></div>');

        $("#limousine"+i).css("width", widths[i-1]);
        $("#limousine"+i).css("background-color", colors[i-1]);
    }

    $("[id^=limousine]").on("click", function click(event){
        var limo = $("#"+event.target.id);
        if (limo.parents("#board").length == 1){
            var width = limo.css("width");
            limo.css("width", limo.css("height"));
            limo.css("height", width);

            var limopos = limo.offset();
            var limox = Math.floor((event.pageX - limopos.left)/70)*70;
            var limoy = Math.floor((event.pageY - limopos.top)/70)*70;
            var x = limopos.left + limox - limoy;
            var y = limopos.top + limoy - limox;
            x = checkleft(x, limo.width());
            y = checktop(y, limo.height());
            limo.css("left", x +"px");
            limo.css("top", y +"px");
        }
    });

    $("#start").on("click", function start(){
        var tiles = [];
        for (var i = 1; i <= 6; i++){
            var limo = $("#limousine"+i);
            var left = Math.ceil((limo.offset().left - $("#board").offset().left)/70);
            var top = Math.ceil((limo.offset().top - $("#board").offset().top)/70);
            var width = Math.round(parseFloat(limo.css("width"),10)/70);
            var height = Math.round(parseFloat(limo.css("height"),10)/70);
            var tile = ((top - 1)*8)+left;
            if(height == 1){
                for(var j = 0; j < width; j++){
                    var newtile = j + tile;
                    if(newtile > 0 && newtile < 65) tiles.push(newtile);
                    else {
                        alert("Not all limousines are in the field!");
                        return;
                    }
                }
            }
            else{
                for(var j = 0; j < height; j++){
                    var newtile = (j*8) + tile;
                    if(newtile > 0 && newtile < 65) tiles.push(newtile);
                    else {
                        alert("Not all limousines are in the field!");
                        return;
                    }
                }
            }
        }
        if(checkunique(tiles) == false) return;
        Messages.SET_LOCS_D.data = tiles;
        socket.send(JSON.stringify(Messages.SET_LOCS_D));
        //Disabling start button and disabling dragging of the limousines
        for (var i = 1; i < 7; i++) {
            document.getElementById("limousine"+i).removeAttribute("draggable");
            document.getElementById("limousine"+i).removeAttribute("ondragstart");
        }
        document.getElementById("start").style.display = "none";
    });
}
$(document).ready(main);

function drag(ev) {
    ev.dataTransfer.setData("object", ev.target.id);
    var limopos = $("#"+ev.target.id).offset();
    ev.dataTransfer.setData("limox", Math.floor((event.pageX - limopos.left)/70)*70);
    ev.dataTransfer.setData("limoy", Math.floor((event.pageY - limopos.top)/70)*70);
}

function allowDrop(ev) {
    ev.preventDefault();
}

function drop(event) {
    event.preventDefault();
    var limo = $("#"+event.dataTransfer.getData("object"));
    var boardpos = $("#board").offset();
    var x = Math.floor((event.pageX - boardpos.left)/70)*70;
    var y = Math.floor((event.pageY - boardpos.top)/70)*70;
    x += boardpos.left + 3 - event.dataTransfer.getData("limox");
    y += boardpos.top + 3 - event.dataTransfer.getData("limoy");
    x = checkleft(x, limo.width());
    y = checktop(y, limo.height());
    limo.css({"position":"fixed", "left":x + "px", "top":y + "px"});
    $("#board").append(limo);
}

function checkleft(x, width){
    var boardpos = $("#board").offset();
    if(x < boardpos.left) return x + (boardpos.left - x + 2);
    else if((x + width) > (boardpos.left + 560)) return x + ((boardpos.left + 560) - (x + width));
    else return x;
}

function checktop(y, height){
    var boardpos = $("#board").offset();
    if(y < boardpos.top) return y + (boardpos.top - y + 2);
    else if((y + height) > (boardpos.top + 560)) return y + ((boardpos.top + 560) - (y + height));
    else return y;
}

function checkunique(tiles){
    var duplicate = [];
    for(var i = 0; i < tiles.length; i++){
        var check = tiles[i];
        for(var j = 0; j < duplicate.length; j++){
            if(duplicate[j] == check){
                alert("Some limousines overlap!");
                return false;
            }
        }
        duplicate.push(check);
    }
}