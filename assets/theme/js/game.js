const baseUrl = "assets/images/card/";
let aktiverSpieler;
let playerliste;
let spielID;
let sp1 = {};
let sp2 = {};
let sp3 = {};
let sp4 = {};

let myModal = new bootstrap.Modal(document.getElementById('playerNames'));
myModal.show();

document.getElementById('playerNamesForm').addEventListener('keyup', function (evt) {
    //Namensunterscheidung
    let player1 = document.getElementById('playerName1input').value.toUpperCase();
    let player2 = document.getElementById('playerName2input').value.toUpperCase();
    let player3 = document.getElementById('playerName3input').value.toUpperCase();
    let player4 = document.getElementById('playerName4input').value.toUpperCase();
    playerliste = [player1,player2,player3,player4];

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
    
    //hier muss noch der Focus hin  --------------------------- !!!


})


async function startGame() {
    let response = await fetch("http://nowaunoweb.azurewebsites.net/api/Game/Start/", {
        method: 'POST',
        body: JSON.stringify(
            playerliste
        ),
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        }
    });
    if (response.ok) { // wenn http-status zwischen 200 und 299 liegt
        let startinhalt = await response.json(); // response Body auslesen

        spielID = startinhalt.Id;
        console.log("Spielid im response " + spielID);
        erstelltAblage(startinhalt);
        sp1 = startinhalt.Players[0];
        console.log("Sp1: " + sp1 + ", Sp2: " + sp2);
        sp2 = startinhalt.Players[1];
        sp3 = startinhalt.Players[2];
        sp4 = startinhalt.Players[3];

        erstPositionen(startinhalt);
        erstelltHebestapel();
        aktiverSpieler = startinhalt.NextPlayer;
        console.log("Startspieler im response: " + aktiverSpieler);
        focusAktivPlayer(aktiverSpieler);
    }
}

function erstPositionen(startinhalt){
 //Karten der Spieler positionieren:
 let counter = 1;
 startinhalt.Players.forEach(element => {
     let wohin = "playerName" + counter;
     let wo = document.getElementById(wohin);
     wo.setAttribute("style", "text-align: center;");
     wo.setAttribute("class", "row");
     wo.setAttribute("style", "display: block");
     wo.setAttribute("class", element.Player);

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
     divA.setAttribute("id", element.Player);
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
}
function erstelltAblage(startinhalt){
//Ablagestapel:
    let wo1 = document.getElementById("ablagestapel");
    const div1 = document.createElement("div");
    let img1 = document.createElement("img");
    img1.setAttribute("style", "text-align: center; height: 100px;");
    const ablageCard = `${startinhalt.TopCard.Color}${startinhalt.TopCard.Value}`;
    img1.src = `${baseUrl}${ablageCard}.png`;
    wo1.appendChild(div1);
    div1.appendChild(img1);
}

function erstelltHebestapel(){
//Hebestapel:
    let wo2 = document.getElementById("hebestapel");
    const div2 = document.createElement("div");
    let img2 = document.createElement("img");
    img2.setAttribute("style", "text-align: center; height: 100px; width:100%");
    const hebeCard = "Back0";
    img2.src = `${baseUrl}${hebeCard}.png`;
    wo2.appendChild(div2);
    div2.appendChild(img2);
}


function unfocus(){
    let p1u2 = document.getElementById('spielerkarten1u2');
    p1u2.children.classList.add('unfocused');
    let p3u4 = document.getElementById('spielerkarten3u4');
    p3u4.children.classList.add('unfocused');
    console.log('FOCUS LOST!');
}

//Aktiver Spieler:
//blurUnactivPlayer();
function focusAktivPlayer(aktiverSpieler){
    unfocus();
    let imFocus = document.getElementById(aktiverSpieler);
    let divDarueber = imFocus.parentNode;
    divDarueber.classList.remove('unfocused');
    console.log("focued");
    
    imFocus.addEventListener('click', playCard);

}

function playCard(){
    //Spiellogik - > nur gültige Karten spielen:


    //sonst:

    //wenn gültig:


}

/*
function blurUnactivPlayer() {
    document.getElementById('spielerkarten1u2').addEventListener('blur',(event) => {
        event.target.style.background = '';});
    document.getElementById('spielerkarten3u4').addEventListener('blur', (event) => {
        event.target.style.background = '';});
}


style> .focused { outline: 1px solid red; } </style>

<script>
  // put the handler on capturing phase (last argument true)
  form.addEventListener("focus", () => form.classList.add('focused'), true);
  form.addEventListener("blur", () => form.classList.remove('focused'), true);
</script>
*/

// Karte ziehen
document.getElementById('hebestapel').addEventListener('click', drawCard);
async function drawCard() {
    let response = await fetch(`http://nowaunoweb.azurewebsites.net/api/game/drawCard/${spielID}`, {
        method: 'PUT',
    });
    let newCard;
    if (response.ok) { 
        newCard = await response.json(); // response Body auslesen
        console.log(newCard);
        addCard(newCard.Card);
        aktiverSpieler = newCard.NextPlayer;
    }
}

function addCard(el){

    let wo = document.getElementById(aktiverSpieler);
    let div = document.createElement("div");
        div.setAttribute("style", "display: inline-block");
        const img = document.createElement("img");
        const card = `${el.Color}${el.Value}`;
        img.src = `${baseUrl}${card}.png`;
        img.setAttribute("class","rounded d-block");
        img.setAttribute("style", "height: 80px; padding: 10px");
        wo.appendChild(div);
        div.appendChild(img);
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



