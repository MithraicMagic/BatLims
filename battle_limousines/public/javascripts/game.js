function main() {
    for(var i = 1; i <= 64; i++){
        $("#board").append('<div class="tile"></div>');
    }

    $("#board").on("click", function click(event){
        var boardpos = $("#board").offset();
        var x = Math.ceil((event.pageX - boardpos.left)/100);
        var y = Math.ceil((event.pageY - boardpos.top)/100);
        var tile = ((y-1)*8)+x
        console.log("tile: " + tile);
    });

    for(var i = 1; i <= 6; i++){
        $("#garage").append('<div class="limousine" id="limousine'+i+'" draggable="true" ondragstart="drag(event)"></div>');
        $("#limousine"+i).css("width", Math.ceil((i+3)/2)*100 - 3);
    }

    $("[id^=limousine]").on("click", function click(event){
        var limo = $("#"+event.target.id);
        if (limo.parents("#board").length == 1){
            var width = limo.css("width");
            limo.css("width", limo.css("height"));
            limo.css("height", width);

            var limopos = limo.offset();
            var limox = Math.floor((event.pageX - limopos.left)/100)*100;
            var limoy = Math.floor((event.pageY - limopos.top)/100)*100;
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
            var left = Math.ceil((limo.offset().left - $("#board").offset().left)/100);
            var top = Math.ceil((limo.offset().top - $("#board").offset().top)/100);
            var width = Math.round(parseFloat(limo.css("width"),10)/100);
            var height = Math.round(parseFloat(limo.css("height"),10)/100);
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
        console.log(tiles);
    });
}
$(document).ready(main);    

function drag(ev) {
    ev.dataTransfer.setData("object", ev.target.id);
    var limopos = $("#"+ev.target.id).offset();
    ev.dataTransfer.setData("limox", Math.floor((event.pageX - limopos.left)/100)*100);
    ev.dataTransfer.setData("limoy", Math.floor((event.pageY - limopos.top)/100)*100);
}

function allowDrop(ev) {
    ev.preventDefault();
}

function drop(event) {
    event.preventDefault();
    var limo = $("#"+event.dataTransfer.getData("object"));
    var boardpos = $("#board").offset();
    var x = Math.floor((event.pageX - boardpos.left)/100)*100;
    var y = Math.floor((event.pageY - boardpos.top)/100)*100;
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
    else if((x + width) > (boardpos.left + 800)) return x + ((boardpos.left + 800) - (x + width));
    else return x;
}

function checktop(y, height){
    var boardpos = $("#board").offset();
    if(y < boardpos.top) return y + (boardpos.top - y + 2);
    else if((y + height) > (boardpos.top + 800)) return y + ((boardpos.top + 800) - (y + height));
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