const baseUrl = "assets/images/card/";
let aktiverSpieler = 'undefined';
let playerListe;
let spielID;
let ablageCard;
let ablageStapel;
let ablageBild;
let exit = false;

let myModal = new bootstrap.Modal(document.getElementById('playerNames'));
myModal.show();

document.getElementById('playerNamesForm').addEventListener('keyup', function (evt) {
    //Namensunterscheidung
    let player1 = document.getElementById('playerName1input').value.toUpperCase();
    let player2 = document.getElementById('playerName2input').value.toUpperCase();
    let player3 = document.getElementById('playerName3input').value.toUpperCase();
    let player4 = document.getElementById('playerName4input').value.toUpperCase();
    playerListe = [player1, player2, player3, player4];

    if (player1 === "" || player2 === "" || player3 === "" || player4 === "") {
        document.getElementById('playerNamesSubmit').disabled = true;
    } else if (
        player1 !== player2 &&
        player1 !== player3 &&
        player1 !== player4 &&
        player2 !== player3 &&
        player2 !== player4 &&
        player3 !== player4) {
        document.getElementById('playerNamesSubmit').disabled = false;
    }
});

document.getElementById('playerNamesForm').addEventListener('submit', function (evt) {
    startGame(gameLoop);
    evt.preventDefault();
    myModal.hide();
});

async function startGame(callback) {
    let response = await fetch("http://nowaunoweb.azurewebsites.net/api/Game/Start/", {
        method: 'POST',
        body: JSON.stringify(
            playerListe
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
        erstPositionen(startinhalt);
        erstelltHebestapel();
        aktiverSpieler = startinhalt.NextPlayer;
        console.log("Startspieler im response: " + aktiverSpieler);
    }
    callback()
}

function gameLoop() {
    console.log("Spielid im gameLoop " + spielID);
    console.log("Startspieler im gameLoop: " + aktiverSpieler);

    focusAktivPlayer(aktiverSpieler);

    //aus altem Code kopiert:
    //while (!exit) {}
    //readUserInput();
    //updateState();
    //printState();


}


function erstPositionen(startinhalt) {
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
            const card = `${el.Color}0${el.Value}`;
            img.src = `${baseUrl}${card}.png`;
            img.setAttribute("class", "rounded d-block");
            img.setAttribute("style", "height: 80px; padding: 10px");
            divA.appendChild(div);
            div.appendChild(img);
        })

        counter++;
    });
}

function erstelltAblage(startinhalt) {
//Ablagestapel:
    ablageStapel = document.getElementById("ablagestapel");
    ablageBild = document.createElement("img");
    ablageBild.setAttribute("style", "text-align: center; height: 100px;");
    ablageBild.setAttribute("class", "ablage123");
    ablageCard = `${startinhalt.TopCard.Color}0${startinhalt.TopCard.Value}`;
    ablageBild.src = `${baseUrl}${ablageCard}.png`;
    ablageStapel.appendChild(ablageBild);
}

function erstelltHebestapel() {
//Hebestapel:
    let wo2 = document.getElementById("hebestapel");
    let img2 = document.createElement("img");
    img2.setAttribute("style", "text-align: center; height: 100px; width:100%");
    const hebeCard = "Back0";
    img2.src = `${baseUrl}${hebeCard}.png`;
    wo2.appendChild(img2);
}

//Blur alle Spieler:
function unfocus() {
    let counter = 1;

    while (counter < 5) {
        let wohin = "playerName" + counter;
        document.getElementById(wohin).classList.add('unfocus');
        console.log('FOCUS LOST! AktivPlayer: ' + aktiverSpieler);
        counter++;
    }
}

//Aktiver Spieler --> focus + ....
function focusAktivPlayer(aktiverSpieler) {
    unfocus();
    let aP = document.getElementById(aktiverSpieler);
    aP.parentNode.classList.remove('unfocus');
    console.log('FOCUS AktivPlayer: ' + aktiverSpieler);

    aP.addEventListener('click', playCard,true);
    //prüft karte
    //let karte ab
    //prüft gewinner
    //get next Player


}

function playCard() {
    let valueArray;
    let color;

    //Spiellogik - > nur gültige Karten spielen:
    let topKarte = document.getElementsByClassName('ablage123')[0].getAttribute('src');

    //alert(topKarte);
    //assets/images/card/Red04.png

    valueArray = topKarte.split('').slice(-6, -4);
    let value = `${valueArray[0]}${valueArray[1]}`;
    if (topKarte.includes('Red') == true) {
        color = 'Red';
    } else if (topKarte.includes('Blue') == true) {
        color = 'Blue';
    } else if (topKarte.includes('Green') == true) {
        color = 'Green';
    } else if (topKarte.includes('Yellow') == true) {
        color = 'Yellow';
    } else {
        alert("Falsche Ablagekarte ausgelesen")
    }

    if (this.color == 'Black') {
        farbWechsel();
    }
    if (this.value == '13'){
        //prüfen ob Karte gespielt werden darf
    }
    if (this.Value == value || this.Color == color) {
        //karte versenden
        let ablage = document.getElementById('ablagestapel');
        ablage.addEventListener('change', karteAblegen);
    } else {
        //shake karte
        this.classList.add('shake');
        this.classList.remove('shake');
    }


    document.getElementById('hebestapel').addEventListener('click', drawCard);

}

function farbWechsel() {
    let chooseColorModal = new bootstrap.Modal(document.getElementById('colorsToChoose'));
    chooseColorModal.show();
    document.getElementById('chooseRed').addEventListener('click', function (evt) {
        ablageCard = 'Red014';
        ablageBild.src = `${baseUrl}${ablageCard}.png`;
        ablageStapel.appendChild(ablageBild);
        evt.preventDefault();
        chooseColorModal.hide();
    });
    document.getElementById('chooseYellow').addEventListener('click', function (evt) {
        ablageCard = 'Yellow014';
        ablageBild.src = `${baseUrl}${ablageCard}.png`;
        ablageStapel.appendChild(ablageBild);
        evt.preventDefault();
        chooseColorModal.hide();
    });
    document.getElementById('chooseGreen').addEventListener('click', function (evt) {
        ablageCard = 'Green014';
        ablageBild.src = `${baseUrl}${ablageCard}.png`;
        ablageStapel.appendChild(ablageBild);
        evt.preventDefault();
        chooseColorModal.hide();
    });
    document.getElementById('chooseBlue').addEventListener('click', function (evt) {
        ablageCard = 'Blue014';
        ablageBild.src = `${baseUrl}${ablageCard}.png`;
        ablageStapel.appendChild(ablageBild);
        evt.preventDefault();
        chooseColorModal.hide();
    });
}


/*

.getAttribute('src');
topKarte.forEach(element => {
    let temp = element.getAttribute.img('src');
    console.log(temp);
    counter++;
});

let value = atr0.Value;
let color = atr1.Color;
let aP = document.getElementById(aktiverSpieler).childNodes;
aP.filter(element =>
    element.Value !== value || element.Color !== color || element.Color !== 'Black');

//sonst:
aP.add('shake');

//wenn gültig:
let ablage = document.getElementById('ablagestapel');
ablage.addEventListener('change', karteAblegen);


/*
array.filter(log2File); -> nur Namen hinschreiben - dann wird die Funktion übergeben
!!!===== keine Klammern - sonst wird das Ergebnis der Funktion übergeben ======!!!
function log2File(e,i,arr){..tut was auch immer...};  --> die Funktion wird irgendwo fixiert
log2File(); -> und irgendwo aufgerufen


// Execute the function "doThis" with another function as parameter, in this case "andThenThis".
//doThis will execute whatever code it has and when it finishes it should have "andThenThis" being executed.

doThis(andThenThis)

// Inside of "doThis" it's referenced as "callback" which is just a variable that is holding the reference to this function

function andThenThis() {
console.log('and then this')
}

// You can name it whatever you want, "callback" is common approach

function doThis(callback) {
console.log('this first')

// the '()' is when you are telling your code to execute the function reference else it will just log the reference

callback()
}
*/


async function karteAblegen() {
    let response = await fetch(`http://nowaunoweb.azurewebsites.net/api/game/playCard/${spielID}?value={${value}}&color={${color}}&wildColor={${wildColor}}`, {
        method: 'PUT',
    });
    let responseInfo;
    if (response.ok) {
        responseInfo = await response.json();
        console.log(responseInfo);
        if (responseInfo.error == 'WrongColor') {
            alert("Diese Karte hat die falsche Farbe!");
        } else if (responseInfo.error == 'IncorrectPlayer') {
            alert("Du bis nicht dran!");
        } else {
            aktiverSpieler = responseInfo.Player;

        }
    }
    unoRufen(aktiverSpieler);
    gewinner(aktiverSpieler);
    focusAktivPlayer(aktiverSpieler);
}

function unoRufen(aktiverSpieler){
    let aP = document.getElementById(aktiverSpieler);
    alert("Wie viele Karten hat der Spieler noch? " + aP.childNodes.length)
    if (aP.hasChildNodes() == true && aP.childNodes.length == 1) {
        let unoRufenModal = new bootstrap.Modal(document.getElementById('unoRufen'));
        unoRufenModal.show();

        document.getElementById('playerNamesForm').addEventListener('submit', function (evt) {
            evt.preventDefault();
            unoRufenModal.hide();
            alert("unoRufen info: " + evt);
            return evt;
        });
    }
}

function gewinner(aktiverSpieler) {
    let aP = document.getElementById(aktiverSpieler);
    if (!aP.hasChildNodes()) {
        alert("Du hast gewonnen!!!");
        //exit = true;
    }
}

// Karte ziehen
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
        focusAktivPlayer(aktiverSpieler);
    }
}

//gezogene Karte dem Spieler hinzufügen
function addCard(el) {
    let wo = document.getElementById(aktiverSpieler);
    let div = document.createElement("div");
    div.setAttribute("style", "display: inline-block");
    const img = document.createElement("img");
    const card = `${el.Color}0${el.Value}`;
    img.src = `${baseUrl}${card}.png`;
    img.setAttribute("class", "rounded d-block");
    img.setAttribute("style", "height: 80px; padding: 10px");
    wo.appendChild(div);
    div.appendChild(img);
}





