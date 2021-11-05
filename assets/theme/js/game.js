let myModal = new bootstrap.Modal(document.getElementById('playerNames'));
myModal.show();
document.getElementById('playerNamesSubmit').disabled = true;

let player1; 
let player2; 
let player3;
let player4;

document.getElementById('playerNamesForm').addEventListener('keyup', function (evt) {
    //hier muss noch die Namensunterscheidung hin

    while(player1 != null && player1 != evt){

    }


    if(evt == player1 || evt == player2 || evt == player3 || evt == player4){
        console.log("Achtung Name ist doppelt!")

    }else
        player1 = document.getElementById(playerName1input); 
        player2 = document.getElementById(playerName2input); 
        player3 = document.getElementById(playerName3input);
        player4 = document.getElementById(playerName4input);
        document.getElementById('playerNamesSubmit').disabled = false;
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










