let myModal = new bootstrap.Modal(document.getElementById('playerNames'));
myModal.show();

document.getElementById('playerNamesForm').addEventListener('keyup', function (evt) {
    //hier muss noch die Namensunterscheidung hin
    let player1 = document.getElementById('playerName1input').value;
    let player2 = document.getElementById('playerName2input').value;
    let player3 = document.getElementById('playerName3input').value;
    let player4 = document.getElementById('playerName4input').value;
    //console.log(player1 + ", " + player2 + ", " + player3 + ", " + player4);

    if (player1 == "" || player2 == "" || player3 == "" || player4 == "") {
        document.getElementById('playerNamesSubmit').disabled = true;
    } else if (player1 != player2 && player1 != player3 && player1 != player4 && player2 != player3 && player2 != player4 && player3 != player4) {
        document.getElementById('playerNamesSubmit').disabled = false;
    }
});

document.getElementById('playerNamesForm').addEventListener('submit', function (evt) {
    console.log("submit");
    startGame();
    evt.preventDefault();
    myModal.hide();
})

async function startGame() {
    let player1 = document.getElementById('playerName1input').value;
    let player2 = document.getElementById('playerName2input').value;
    let player3 = document.getElementById('playerName3input').value;
    let player4 = document.getElementById('playerName4input').value;
    let playerliste = [player1, player2, player3, player4];
    console.log(playerliste);

    let response = await fetch("http://nowaunoweb.azurewebsites.net/api/Game/Start/", {
        method: 'POST',
        body: JSON.stringify(
            playerliste
        ),
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        }
    })

    if(response.ok){ // wenn http-status zwischen 200 und 299 liegt
        // wir lesen den response body 
        let result = await response.json(); // alternativ response.text wenn nicht json gewünscht ist
        console.log(result);
        alert(JSON.stringify(result));
    }
}











