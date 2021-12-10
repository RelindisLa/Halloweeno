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
const audioCardflick = new Audio('assets/sound/mixkit-twig-breaking-2945.wav');


//hier beginnt das Spiel mit der Abfrage der Namen:
let myModal = new bootstrap.Modal(document.getElementById('playerNames'));
//myModal.show();  -------------------------------------------------------------------------------------------------> NamesModal!!!
startGame(printGameInfo); //   --------------------------------------------------------------------> wird nicht gebraucht beim Modal!!!!

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
    startGame(printGameInfo);
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
        erstelltAblage(startinhalt.TopCard);
        erstPositionen(startinhalt);
        erstelltHebestapel();
        aktiverSpieler = startinhalt.NextPlayer;
        //alert("startinhalt: " + JSON.stringify(startinhalt));
    }
    callback()
}

function printGameInfo() {
    console.log("Spielid: " + spielID);
    console.log("Startspieler: " + aktiverSpieler);
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
        playerScore.setAttribute("id", `score${element.Player}`);
        let textScore = document.createTextNode("Score: " + element.Score);
        wo.appendChild(playerScore);
        playerScore.appendChild(textScore);

        let divA = document.createElement("div");
        divA.setAttribute("id", element.Player);
        wo.appendChild(divA);
        spielerKartenErstellen(element);
        counter++;
    });
}

function erstesKartenErstellen(element) {
    let box = document.getElementById(`${element.Player}`);
    if (box.hasChildNodes()) {
        while (box.firstChild) {
            box.removeChild(box.firstChild);
        }
        spielerKartenErstellen(element);
    }
}

function spielerKartenErstellen(element) {
    let divA = document.getElementById(element.Player);
    console.log("divA imSpielerKartenErstellen: " + divA);

    element.Cards.forEach(el => {
        const div = document.createElement("div");
        div.setAttribute("style", "display: inline-block");
        const img = document.createElement("img");
        const card = `${el.Color}${el.Value}`;
        img.src = `${baseUrl}${card}.png`;
        img.setAttribute("class", `karte-${element.Player}`); //rounded d-block ??
        img.setAttribute("style", "height: 80px; padding: 10px");
        div.appendChild(img);
        divA.appendChild(div);
    })
}

function erstelltAblage(card) {
    //Ablagestapel:
    ablageStapel = document.getElementById("ablagestapel");
    ablageBild = document.createElement("img");
    ablageBild.setAttribute("style", "text-align: center; height: 100px;");
    ablageBild.setAttribute("id", "ablage123");
    ablageBild.setAttribute("class", "ablage123");
    ablageCard = `${card.Color}${card.Value}`;
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
        let dahin = document.getElementById(wohin);
        dahin.classList.add('unfocus');
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

    //gewinner(aktiverSpieler);

    //Spiellogik - > nur gültige Karten spielen:
    //Ablage holen zum Vergleichen
    let ablageKarte = document.getElementsByClassName('ablage123')[0].getAttribute('src');
    let werteAblage = getKartenWerte(ablageKarte);
    let colorAblage = werteAblage[0];
    let valueAblage = werteAblage[1];
    console.log("Ablagekarte: " + colorAblage + ", " + valueAblage);

    //alle Karten mit eventListener versehen und prüfen
    let kartenArray = document.getElementsByClassName(`karte-${aktiverSpieler}`);
    for (let i = 0; i < kartenArray.length; i++) {
        kartenArray[i].addEventListener("click", function () {
            this.classList.add('vibrate-1');
            let wasAuchImmer = this.getAttribute('src')
            let werteClickKarte = getKartenWerte(wasAuchImmer);
            let colorClick = werteClickKarte[0];
            let valueClick = werteClickKarte[1];
            console.log("gewählte Karte: " + colorClick + ", " + valueClick);

            //prüfen ob Karte gespielt werden darf
            if (valueClick === valueAblage && valueClick !== '13' && valueClick !== '14') {
                this.setAttribute("id", "gespielteKarte");
                unoRufen(aktiverSpieler);
                audioCardflick.play();
                karteAblegen(valueClick, colorClick, '');
            } else if (colorClick === colorAblage) {
                this.setAttribute("id", "gespielteKarte");
                unoRufen(aktiverSpieler);
                audioCardflick.play();
                karteAblegen(valueClick, colorClick, '');
            } else if (colorClick === 'Black') {
                if (valueClick === '14') { //Farbwechsel
                    audioColor.play();
                    if (valueAblage === '13' || valueAblage === '14') {
                        this.setAttribute("id", "gespielteKarte");
                        unoRufen(aktiverSpieler);
                        audioCardflick.play();
                        karteAblegen(valueClick, colorClick, colorAblage);
                    } else {
                        this.setAttribute("id", "gespielteKarte");
                        unoRufen(aktiverSpieler);
                        audioCardflick.play();
                        blackCard(this, valueClick, colorClick);
                    }
                }
                if (valueClick === '13') { //+4
                    if (darfPlus4Legen(kartenArray, colorAblage) === true) {
                        this.setAttribute("id", "gespielteKarte");
                        audioPlus4.play();
                        unoRufen(aktiverSpieler);
                        audioCardflick.play();
                        blackCard(this, valueClick, colorClick);
                    } else {
                        alert("Diese Karte darfst du nur spielen, wenn du weder passende Farbe noch Wert legen kannst!");
                    }
                }
            } else {
                this.classList.remove('vibrate-1');
                this.classList.add('shake');
                shakeTimeout(this);
            }
        })
    }
    document.getElementById('hebestapel').addEventListener('click', drawCard);
}

function blackCard(dort, value, color) {
    let chooseColorModal = new bootstrap.Modal(document.getElementById('colorsToChoose'));
    chooseColorModal.show();

    document.getElementById('chooseRed').addEventListener('click', function (evt) {
        evt.preventDefault();
        chooseColorModal.hide();
        let wildColor = 'Red';
        dort.setAttribute("id", "gespielteKarte");
        karteAblegen(value, color, wildColor);
    });
    document.getElementById('chooseYellow').addEventListener('click', function (evt) {
        evt.preventDefault();
        chooseColorModal.hide();
        let wildColor = 'Yellow';
        dort.setAttribute("id", "gespielteKarte");
        karteAblegen(value, color, wildColor);
    });
    document.getElementById('chooseGreen').addEventListener('click', function (evt) {
        evt.preventDefault();
        chooseColorModal.hide();
        let wildColor = 'Green';
        dort.setAttribute("id", "gespielteKarte");
        karteAblegen(value, color, wildColor);
    });
    document.getElementById('chooseBlue').addEventListener('click', function (evt) {
        evt.preventDefault();
        chooseColorModal.hide();
        let wildColor = 'Blue';
        dort.setAttribute("id", "gespielteKarte");
        karteAblegen(value, color, wildColor);
    });
}

function darfPlus4Legen(kartenArray, colorAblage, valueAblage) {
    let darfLegen = true;
    if (valueAblage === '14') {
        darfLegen = true;
    } else if(valueAblage ==='13'){
        darfLegen = false;
    } else {
        for (let i = 0; i < kartenArray.length; i++) {
            let cardinfo = kartenArray[i].getAttribute('src');
            let colorCard = cardinfo[0];
            if (colorAblage === colorCard) {
                darfLegen = false;
            }
        }
    }
    return darfLegen;
}

function shakeTimeout(element) {
    setTimeout(function () {
        element.classList.remove('shake');
        element.offsetWidth = element.offsetWidth;
    }, 1000);
}

function getKartenWerte(topKarte) {
    let arr = [];
    let valueArray = topKarte.split('');
    let arrtemp = valueArray[valueArray.length - 6];
    let color;
    let value;
    if (arrtemp == 1) {
        let sliceArray = valueArray.slice(-6, -4);
        value = `${sliceArray[0]}${sliceArray[1]}`;
    } else {
        let sliceArray = valueArray.slice(-5, -4);
        value = `${sliceArray}`;
    }
    if (topKarte.includes('Red') === true) {
        color = 'Red';
    } else if (topKarte.includes('Blue') === true) {
        color = 'Blue';
    } else if (topKarte.includes('Green') === true) {
        color = 'Green';
    } else if (topKarte.includes('Yellow') === true) {
        color = 'Yellow';
    } else if (topKarte.includes('Black') === true) {
        color = 'Black';
    } else {
        alert("Falsche Ablagekarte ausgelesen")
    }
    arr[0] = color;
    arr[1] = value;
    return arr;
}

async function karteAblegen(value, color, wildColor) {
    console.log("gespielt wird: " + `${value}${color}${wildColor}`)
    let response = await fetch(`http://nowaunoweb.azurewebsites.net/api/game/playCard/${spielID}?value=${value}&color=${color}&wildColor=${wildColor}`, {
        method: 'PUT',
    });
    let responseInfo;
    if (response.ok) {
        responseInfo = await response.json();
        console.log("responseInfo " + JSON.stringify(responseInfo));
        if (responseInfo.error === 'WrongColor') {
            console.log("Diese Karte hat die falsche Farbe!");
            //aktiverSpieler = aktiverSpieler;
        } else if (responseInfo.error === 'IncorrectPlayer') {
            console.log("Du bis nicht dran!");
            //aktiverSpieler = aktiverSpieler;
        } else if (responseInfo.error === 'Draw4NotAllowed') {
            alert("Diese Karte darfst du noch nicht spielen!");
            console.log("Draw4NotAllowed");
            //aktiverSpieler = aktiverSpieler;
        } else {
            let spielkarte = document.getElementById('gespielteKarte');
            slideCard(spielkarte);
            setTimeout(function () {
                if (value === '13' || value === '14') {
                    document.getElementsByClassName('ablage123')[0].setAttribute('src', `${baseUrl}${wildColor}${value}.png`);
                } else {
                    document.getElementsByClassName('ablage123')[0].setAttribute('src', `${baseUrl}${color}${value}.png`);
                }
            }, 800);
            removeTimeout(spielkarte);
            gewinner(aktiverSpieler);
            setTimeout(function () { beginNextPlayer(responseInfo) }, 800); // value für Abfrage +2/+4
            console.log("alter spieler ist: " + aktiverSpieler);
        }
    } else if (!response.ok) { // falls servererror -> neues Spiel beginnt
        alert("Das Server-Gerippe klappert. Ein neues Spiel beginnt!");
        myModal.show();
    }
}

function slideCard(spielkarte) {
    spielkarte.classList.remove('vibrate-1');
    spielkarte.classList.add('swirl-out-back');
    let ausgespielteSpielkarte = document.getElementById('gespielteKarte');
    // rect is a DOMRect object 
    // https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect
    let rectVon = ausgespielteSpielkarte.getBoundingClientRect();
    let rectZu = document.getElementById("ablage123").getBoundingClientRect();

    // css transform braucht die pixel entfernung im viewport aber relativ vom transformierenden object
    document.querySelector(':root').style.setProperty('--ablage-x', (rectZu.x - rectVon.x) + "px");
    document.querySelector(':root').style.setProperty('--ablage-y', (rectZu.y - rectVon.y) + "px");
    ausgespielteSpielkarte.classList.add('karte-auf-ablage');
}

function removeTimeout(element) {
    setTimeout(function () {
        element.remove();
    }, 700);
}

function beginNextPlayer(response) {// value für Abfrage +2/+4
    playerListe.forEach(element => getCardsOf(element));

    setTimeout(function () {
        aktiverSpieler = response.Player;
        document.getElementById(`score${aktiverSpieler}`).innerHTML = `${response.Score}`;
        console.log("neuer spieler ist: " + aktiverSpieler);
        erstesKartenErstellen(response);
        ablageBild.classList.add('rotate-vert-center');
        ablageStapel.appendChild(ablageBild);

        focusAktivPlayer(aktiverSpieler);
    }, 1000);
}

function unoRufen(aktiverSpieler) {
    let unoGerufen = false;
    let aP = document.getElementById(aktiverSpieler);
    if (aP.hasChildNodes() == true && aP.childNodes.length == 2) {
        if (unoGerufen != true) {
            alert("uno uno uno!");
        }
    }
}

function gewinner(aktiverSpieler) {
    let aP = document.getElementById(aktiverSpieler);
    if (aP.hasChildNodes() == true && aP.childNodes.length == 1) { //aP.hasChildNodes() == false) {
    alert("Du hast gewonnen!!!");
    let myModalEnde = new bootstrap.Modal(document.getElementById('winnerVideo')); //x-mas https://youtu.be/oflFgOYyeoU
    myModalEnde.show();
    document.getElementById('endYes').addEventListener('submit', function (evt) {
        //evt.preventDefault();
        myModalEnde.hide();
    })
    exit = true;
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

//Karten eines Spielers abrufen
async function getCardsOf(player) {
    let response = await fetch(`http://nowaunoweb.azurewebsites.net/api/game/GetCards/${spielID}?playerName=${player}`, {
        method: 'GET',
    });
    let infoPlayerAbfrage;
    if (response.ok) {
        infoPlayerAbfrage = await response.json(); // response Body auslesen
        console.log("abfrage Kards of: " + player + " hat Karten: " + JSON.stringify(infoPlayerAbfrage));
        erstesKartenErstellen(infoPlayerAbfrage);
    }
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
