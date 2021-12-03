const baseUrl = "assets/images/card/";
let aktiverSpieler = 'undefined';
let playerListe;
let spielID;
let ablageCard;
let ablageStapel;
let ablageBild;
let exit = false;
const audioColor = new Audio('assets/sound/mixkit-cartoon-throat-laugh-745.wav');
const audioPlus4 = new Audio('assets/sound/mixkit-little-devil-laughing-413.wav');
const audioBackground = new Audio('assets/sound/Horrormusik.mp3')


let myModal = new bootstrap.Modal(document.getElementById('playerNames'));
//myModal.show();  -------------------------------------------------------------------------------------------------> NamesModal!!!
startGame(gameLoop); //   --------------------------------------------------------------------> wird nicht gebraucht beim Modal!!!!

document.getElementById('playerNamesForm').addEventListener('keyup', function (evt) {
    //Namensunterscheidung
    let player1 = document.getElementById('playerName1input').value.toUpperCase();
    let player2 = document.getElementById('playerName2input').value.toUpperCase();
    let player3 = document.getElementById('playerName3input').value.toUpperCase();
    let player4 = document.getElementById('playerName4input').value.toUpperCase();
    //playerListe = [player1, player2, player3, player4];  --------------------------------------------------------> NamesModal!!!

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
    playerListe = ["a", "b", "c", "d"]; //  ------------------->--------------------------------->  wird nicht gebraucht beim Modal!!!!
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
        erstelltAblage(startinhalt.TopCard);
        erstPositionen(startinhalt);
        erstelltHebestapel();
        aktiverSpieler = startinhalt.NextPlayer;
        console.log("Startspieler im response: " + aktiverSpieler);
        //alert("startinhalt: " + JSON.stringify(startinhalt));
    }
    callback()
}

function gameLoop() {
    console.log("Spielid im gameLoop " + spielID);
    console.log("Startspieler im gameLoop: " + aktiverSpieler);

    focusAktivPlayer(aktiverSpieler);
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
            const card = `${el.Color}${el.Value}`;
            img.src = `${baseUrl}${card}.png`;
            img.setAttribute("class", `karte-${element.Player}`); //rounded d-block ??
            img.setAttribute("style", "height: 80px; padding: 10px");
            divA.appendChild(div);
            div.appendChild(img);
        })

        counter++;
    });
}

function erstelltAblage(card) {
    //Ablagestapel:
    ablageStapel = document.getElementById("ablagestapel");
    ablageBild = document.createElement("img");
    ablageBild.setAttribute("style", "text-align: center; height: 100px;");
    ablageBild.setAttribute("class", "ablage123");
    ablageCard = `${card.Color}${card.Value}`;
    ablageBild.src = `${baseUrl}${ablageCard}.png`;
    ablageStapel.appendChild(ablageBild);
}
function removeAblagekarte(){
    let ablageKarte = document.getElementsByClassName('ablage123')[0];
    ablageKarte.remove();
    neueTopCard();
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
        counter++;
    }
}

//Aktiver Spieler --> focus + ....
function focusAktivPlayer(aktiverSpieler) {
    unfocus();
    let aP = document.getElementById(aktiverSpieler);
    aP.parentNode.classList.remove('unfocus');

    playCard();  //prüft karte, let karte ab, prüft gewinner, get next Player

}

function playCard() {
    //Spiellogik - > nur gültige Karten spielen:
    let ablageKarte = document.getElementsByClassName('ablage123')[0].getAttribute('src');
    let werteAblage = getKartenWerte(ablageKarte);
    let colorAblage = werteAblage[0];
    let valueAblage = werteAblage[1];
    console.log("Ablagekarte: " + colorAblage + ", " + valueAblage);

    //getCardsOf(aktiverSpieler);
    //Karte auswählen:
    let kartenArray = document.getElementsByClassName(`karte-${aktiverSpieler}`);
    //console.log("Karten des aktivenSpielers: " + kartenArray);
    let wildColor = '';

    for (let i = 0; i < kartenArray.length; i++) {
        kartenArray[i].addEventListener("click", function () {
            let werteClickKarte =  getKartenWerte(this.getAttribute('src'));
            let colorClick = werteClickKarte[0];
            let valueClick = werteClickKarte[1];
            //console.log("gewählte Karte im Array: " + werteClickKarte);
            console.log("gewählte Karte: " + colorClick + ", " + valueClick);

        //prüfen ob Karte gespielt werden darf ???
            if (valueClick == valueAblage || colorClick == colorAblage || colorClick == 'Black') {
                console.log("Karte vor Farbwechsel: " + valueClick + ", " + colorClick);
                if (valueClick == '14') {
                    colorClick = farbWechsel();
                    audioColor.play();
                    wildColor = colorClick;
                    console.log("Karte nach Farbwechsel: " + valueClick + ", " + colorClick);
                }
                if (valueClick == '13') {
                    //{error: 'Draw4NotAllowed'} -------------------- !!!!!!!!!! ----------------------
                    colorClick = farbWechsel();
                    wildColor = colorClick;
                    audioPlus4.play();
                    console.log("Karte nach Farbwechsel: " + valueClick + ", " + colorClick);
                }
                
                this.setAttribute("id","gespielteKarte");
                //neueTopCard();
                console.log("valueClick, colorClick, wildColor " + valueClick +", " + colorClick + ", " + wildColor);
                karteAblegen(valueClick, colorClick, wildColor);
            } else {
                this.classList.add('shake');
                shakeTimeout(this);
            }
        }) }

    document.getElementById('hebestapel').addEventListener('click', drawCard);
}

function shakeTimeout(element){
    setTimeout(function() {
        element.classList.remove('shake');
        element.offsetWidth = element.offsetWidth;
      }, 1000);
}


function getKartenWerte(topKarte) {
    //console.log("in Funktion topKarte: " + topKarte);
    let arr = [];
    let valueArray = topKarte.split('');
    let arrtemp = valueArray[valueArray.length-6];
    //console.log("arrtemp = valueArray[valueArray.length-6] " + arrtemp);
    let color;
    let value;
    if(arrtemp == 1){
        //console.log("Array gesliced für 2stellig: " + valueArray + " ------ !!! ------");
        let sliceArray = valueArray.slice(-6, -4);
        //console.log("VALUE sliceArray: " + sliceArray);
        value = `${sliceArray[0]}${sliceArray[1]}`;
        //console.log("value nach sliceArray merge: " + value);
    } else {
        value = valueArray.slice(-5, -4);
        //console.log("Array gesliced für 1stellig: " + valueArray);
        //console.log("value sliced is: " + value);
    }
    if (topKarte.includes('Red') == true) {
        color = 'Red';
    } else if (topKarte.includes('Blue') == true) {
        color = 'Blue';
    } else if (topKarte.includes('Green') == true) {
        color = 'Green';
    } else if (topKarte.includes('Yellow') == true) {
        color = 'Yellow';
    } else if (topKarte.includes('Black') == true) {
        color = 'Black';
    } else {
        alert("Falsche Ablagekarte ausgelesen")
    }
    arr[0] = color;
    arr[1] = value;
    //console.log("gewählte Karte ist: " + arr);
    return arr;
}

function farbWechsel() {
    let colorWechsel;
    let chooseColorModal = new bootstrap.Modal(document.getElementById('colorsToChoose'));
    chooseColorModal.show();
    document.getElementById('chooseRed').addEventListener('click', function (evt) {
        ablageCard = 'Red14';
        ablageBild.src = `${baseUrl}${ablageCard}.png`;
        ablageStapel.appendChild(ablageBild);
        evt.preventDefault();
        chooseColorModal.hide();
        return colorWechsel = 'Red';
    });
    document.getElementById('chooseYellow').addEventListener('click', function (evt) {
        ablageCard = 'Yellow14';
        ablageBild.src = `${baseUrl}${ablageCard}.png`;
        ablageStapel.appendChild(ablageBild);
        evt.preventDefault();
        chooseColorModal.hide();
        return colorWechsel = 'Yellow';
    });
    document.getElementById('chooseGreen').addEventListener('click', function (evt) {
        ablageCard = 'Green14';
        ablageBild.src = `${baseUrl}${ablageCard}.png`;
        ablageStapel.appendChild(ablageBild);
        evt.preventDefault();
        chooseColorModal.hide();
        return colorWechsel = 'Green';
    });
    document.getElementById('chooseBlue').addEventListener('click', function (evt) {
        ablageCard = 'Blue14';
        ablageBild.src = `${baseUrl}${ablageCard}.png`;
        ablageStapel.appendChild(ablageBild);
        evt.preventDefault();
        chooseColorModal.hide();
        return colorWechsel = 'Blue';
    });
}


/*

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

async function neueTopCard(callback){
    let response = await fetch(`http://nowaunoweb.azurewebsites.net/api/game/topCard/${spielID}`, { 
        method: 'GET',
    });
    let responseAblage;
    if (response.ok) {
        responseAblage = await response.json();
        console.log("Ablage neu: " + responseAblage);
        erstelltAblage(responseAblage);
    }
    callback()
}

async function karteAblegen(value, color, wildColor) {
    if(value == 13 || value == 14){
        color = 'Black';
    } else {
        wildColor = '';
    }
    let plus2 = false;
    if(value == 10){
        plus2 = true;
    }
    console.log(`http://nowaunoweb.azurewebsites.net/api/game/playCard/${spielID}?value=${value}&color=${color}&wildColor=${wildColor}`);
    let response = await fetch(`http://nowaunoweb.azurewebsites.net/api/game/playCard/${spielID}?value=${value}&color=${color}&wildColor=${wildColor}`, {
        method: 'PUT',
    });
    let responseInfo;
    if (response.ok) {
        responseInfo = await response.json();
        alert("neuer Spieler ist dran: " + JSON.stringify(responseInfo));
        console.log(responseInfo);
        if (responseInfo.error == 'WrongColor') {
            alert("Diese Karte hat die falsche Farbe!");
        } else if (responseInfo.error == 'IncorrectPlayer') {
            alert("Du bis nicht dran!");
        } else if (responseInfo.error == 'Draw4NotAllowed'){
            alert("Du darfst die +4 erst spielen wenn du sonst keine Karten legen kannst");
        } else {
            if(unoRufen(aktiverSpieler) == true){
                alert("UNO UNO UNO");
            };
            let spielkarte = document.getElementById('gespielteKarte');
            spielkarte.classList.add('huiiiiWeg');
            spielkarte.remove();
            //removeAblage();
            //erstelltAblage(spielkarte);
        }
        aktiverSpieler = responseInfo.Player;
        
    }
    gewinner(aktiverSpieler);
    focusAktivPlayer(aktiverSpieler);
}


function unoRufen(aktiverSpieler) {
    let unoGerufen = true;
    let aP = document.getElementById(aktiverSpieler);
    if (aP.hasChildNodes() == true && aP.childNodes.length == 1) {
        let unoRufenModal = new bootstrap.Modal(document.getElementById('unoRufen'));
        unoRufenModal.show();

        document.getElementById('unoYes').addEventListener('submit', function (evt) {
            unoGerufen = true;
            evt.preventDefault();
            unoRufenModal.hide();
            return unoGerufen;
        });
    }
}


// SpielerInfo vom Server holen:
async function getCardsOf(player) {
    let response = await fetch(`http://nowaunoweb.azurewebsites.net/api/game/GetCards/${spielID}?playerName=${player}`, {
        method: 'GET',
    });
    let infoPlayerAbfrage;
    if (response.ok) {
        infoPlayerAbfrage = await response.json(); // response Body auslesen
        alert("infoPlayerAbfrage: " + JSON.stringify(infoPlayerAbfrage));
    }

}

function gewinner(aktiverSpieler) {
    let aP = document.getElementById(aktiverSpieler);
    console.log(aktiverSpieler);
    console.log("doc: " +document.getElementById(aktiverSpieler));
    console.log("aP = "+aP);
    if (aP.hasChildNodes() == false) {
        alert("Du hast gewonnen!!!");
        let myModal = new bootstrap.Modal(document.getElementById('winnerVideo')); //x-mas https://youtu.be/oflFgOYyeoU
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
        //alert("neue Karte: " + JSON.stringify(newCard));
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
    const card = `${el.Color}${el.Value}`;
    img.src = `${baseUrl}${card}.png`;
    img.setAttribute("class", "rounded d-block");
    img.setAttribute("style", "height: 80px; padding: 10px");
    wo.appendChild(div);
    div.appendChild(img);
}





