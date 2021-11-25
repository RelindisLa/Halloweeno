const baseUrl = "assets/images/card/";
let aktiverSpieler = 0;
let playerliste = 0;

let myModal = new bootstrap.Modal(document.getElementById('playerNames'));
myModal.show();

document.getElementById('playerNamesForm').addEventListener('keyup', function (evt) {
    //Namensunterscheidung
    let player1 = document.getElementById('playerName1input').value;
    let player2 = document.getElementById('playerName2input').value;
    let player3 = document.getElementById('playerName3input').value;
    let player4 = document.getElementById('playerName4input').value;

    if (player1 == "" || player2 == "" || player3 == "" || player4 == "") {
        document.getElementById('playerNamesSubmit').disabled = true;
    } else if (player1 != player2 && player1 != player3 && player1 != player4 && player2 != player3 && player2 != player4 && player3 != player4) {
        document.getElementById('playerNamesSubmit').disabled = false;
    }
});

document.getElementById('playerNamesForm').addEventListener('submit', function (evt) {
    startGame();
    evt.preventDefault();
    myModal.hide();
})

async function startGame() {
    let player1 = document.getElementById('playerName1input').value.toUpperCase();
    let player2 = document.getElementById('playerName2input').value.toUpperCase();
    let player3 = document.getElementById('playerName3input').value.toUpperCase();
    let player4 = document.getElementById('playerName4input').value.toUpperCase();
    playerliste = [player1,player2,player3,player4];
    //console.log("playerList ist: " + playerliste);

    let response = await fetch("http://nowaunoweb.azurewebsites.net/api/Game/Start/", {
        method: 'POST',
        body: JSON.stringify(
            playerliste
        ),
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        }
    })
    let startinhalt;
    if (response.ok) { // wenn http-status zwischen 200 und 299 liegt
        startinhalt = await response.json(); // response Body auslesen
        //console.log(startinhalt.stringify)
        //alert(JSON.stringify(startinhalt));
    }

    //get and save SpielId:
    const spielID = startinhalt.Id;

    //Karten der Spieler positionieren:
    let counter = 1;
    startinhalt.Players.forEach(element => {
        let wohin = "playerName" + counter;
        let wo = document.getElementById(wohin);
        wo.setAttribute("style", "text-align: center;");
        wo.setAttribute("class", "row");
        wo.setAttribute("style", "display: block");

        let nameH4 = document.createElement("h4");
        nameH4.setAttribute("style", "text-align: center");
        let textName = document.createTextNode(element.Player);
        wo.appendChild(nameH4);
        nameH4.appendChild(textName);
        
        let playerScore = document.createElement("p");
        playerScore.setAttribute("style", "text-align: center; padding-top: 10px");
        let textScore = document.createTextNode("Score: " + element.Score);
        wo.appendChild(playerScore);
        playerScore.appendChild(textScore);

        let divA = document.createElement("div");
        divA.setAttribute("id", "cardsOfPlayer");
        wo.appendChild(divA);
        element.Cards.forEach(el => {
            const div = document.createElement("div");
            div.setAttribute("style", "display: inline-block");
            const img = document.createElement("img");
            const card = `${el.Color}${el.Value}`;
            img.src = `${baseUrl}${card}.png`;
            img.setAttribute("class","rounded d-block");
            img.setAttribute("style", "height: 80px; padding: 10px");
            divA.appendChild(div);
            div.appendChild(img);
        })



        counter++;
    });
//Ablagestapel:
    let wo1 = document.getElementById("ablagestapel");
    const div1 = document.createElement("div");
    let img1 = document.createElement("img");
    img1.setAttribute("style", "text-align: center; height: 100px;");
    const ablageCard = `${startinhalt.TopCard.Color}${startinhalt.TopCard.Value}`;
    img1.src = `${baseUrl}${ablageCard}.png`;
    wo1.appendChild(div1);
    div1.appendChild(img1);

//Hebestapel:
    let wo2 = document.getElementById("hebestapel");
    const div2 = document.createElement("div");
    let img2 = document.createElement("img");
    img2.setAttribute("style", "text-align: center; height: 100px; width:100%");
    const hebeCard = "Back0";
    img2.src = `${baseUrl}${hebeCard}.png`;
    wo2.appendChild(div2);
    div2.appendChild(img2);


//AktiverSpieler:
    aktiverSpieler = startinhalt.NextPlayer; //Sting mit Namen
    console.log("AktivPlayer is: " + aktiverSpieler);
}

//blurUnactivPlayer();
//focusActivPlayer(aktiverSpieler);

// Karte ziehen
document.getElementById('hebestapel').addEventListener('click', drawCard);
async function drawCard() {
    let response = await fetch(`http://nowaunoweb.azurewebsites.net/api/game/drawCard/${spielID}`, {
        method: 'PUT',
    });
    let newCard;
    if (response.ok) { // wenn http-status zwischen 200 und 299 liegt
        newCard = await response.json(); // response Body auslesen
        console.log(newCard);
    }
}

/*function convertNumber(cardValue) {
    if (cardValue < 15)
        return cardValue
}

function convertToText(cardValue) {
    if (cardValue  != Number)
        return cardValue

    switch (cardValue) {
        case "d2": return 10;
        case "s": return 11;
        case "r": return 12;
        case "wd4": return 13;
        case "wild": return 14;
    }
}
*/


//Aktiver Spieler:
/*
function blurUnactivPlayer() {
    document.getElementById('spielerkarten1u2').addEventListener('blur',(event) => {
        event.target.style.background = '';});
    document.getElementById('spielerkarten3u4').addEventListener('blur', (event) => {
        event.target.style.background = '';});
}

function focusActivPlayer(player){
    let p1 = document.querySelector('#h4').value;
    
    console.log("p1 Array: " + p1);
    console.log("activePlayer is: " + player);

    for(let i = 0; i < p1.length; i++){
        if(i == player){
            console.log("textContent of p1[1]: " + i);
            p1[i].addEventListener('focus', (event) => {
                event.target.style.background = 'black';
              });
        }
    }
}

*/

/*
    p1.forEach(element => {
         if(element.textContent != aktiverSpieler){
            element.addEventListener('blur',(event) => {
             event.target.style.background = '';});
    }
    p1.forEach(element => element.textContent == aktiverSpieler) {
        element.addEventListener('focus')
   }
    p1.forEach(function(pl){
        if(pl.textContent == aktiverSpieler){
            pl.addEventListener("focus")
        } else { pl.addEventListener("blur")}
    });
    //document.getElementById("spielfeld").addEventListener("blur",function(ev){   })
    */


