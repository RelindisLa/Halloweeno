let myModal = new bootstrap.Modal(document.getElementById('playerNames'));
myModal.show();

document.getElementById('playerNamesForm').addEventListener('keyup', function(evt) {
    console.log(evt);
})

document.getElementById('playerNamesForm').addEventListener('submit', function(evt) {
    console.log("submit");
    // Formular absenden verhindern
    evt.preventDefault();
    myModal.hide();

})


let player1; 
let player2; 
let player3;
let player4;


document.getElementById('playerNamesSubmit').addEventListener('click', function (evt) {
    document.getElementById('playerNamesSubmit').disabled = false;
    let inputPlayer1 = document.getElementById(playerName1input);
    let inputplayer2 = document.getElementById(playerName2input);
    let inputplayer3 = document.getElementById(playerName3input);
    let inputplayer4 = document.getElementById(playerName4input);

    // hier muss noch die Namensunterscheidung hin
    if (inputPlayer1 == null || inputplayer2 == null || inputplayer3 == null || inputplayer4 == null) {
        console.log("Alle Spieler müssen einen eindeutigen Namen haben!");
        document.getElementById('playerNamesSubmit').disabled = true;

    } else if (inputPlayer1 == inputplayer2 || inputPlayer1 == inputplayer3 || inputPlayer1 == inputplayer4
        || inputplayer2 == inputplayer3 || inputplayer2 == inputplayer4
        || inputplayer3 == inputplayer4) {
        console.log("Achtung Name ist doppelt!");
        document.getElementById('playerNamesSubmit').disabled = true;
    } else {
        player1 = inputPlayer1;
        player2 = inputplayer2;
        player3 = inputplayer3;
        player4 = inputplayer4;
        myModal.hide();

    }
    console.log(player1);
    console.log(evt);
})

let playerliste = [player1,player2,player3,player4];
console.log(playerliste); 


async function startGame(){
    let response = await fetch("http://nowaunoweb.azurewebsites.net/api/Game/Start",{
    method: 'POST',
    body: JSON.stringify({
        playerliste
    }),
    headers: {
        'Content-type': 'application/json; charset=UTF-8',
    }
})
}

document.getElementById('playerNamesForm').addEventListener('submit', function (evt) {
    console.log("submit");
    startGame();
    evt.preventDefault();
    myModal.hide();
})

async function load() {
    let response = await fetch("https://nowaunoweb.azurewebsites.net/");

    if(response.ok) {
        let result = await response.json();
        console.log(result);
        alert(JSON.stringify(result));
    } else {
        alert("HTTP-Error: " + response.status);
    }
}










