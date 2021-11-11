const baseUrl = "C:/Users/Cinda/OneDrive/Dokumente/Campus02/LV Web2/Projekt/Halloweeno/Halloweeno/assets/images/card";

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
    let playerliste = [player1,player2,player3,player4];

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
        console.log(startinhalt.stringify)
        //alert(JSON.stringify(startinhalt));
    }

    //get and save SpielId:
    var spielID = startinhalt.Id;

    let counter = 1;
    startinhalt.Players.forEach(element => {
        //let wo = document.getElementsById(`${"#playerName"}${counter}`);
        let wohin = "playerName" + counter;
        //console.log(wohin);
        let wo = document.getElementById(wohin);
        console.log(wo);
        let nameH4 = document.createElement("h4");
        let textName = document.createTextNode(element.Player);
        wo.appendChild(nameH4);
        nameH4.appendChild(textName);

        element.Cards.forEach(el => {
            const div = document.createElement("div");
            const img = document.createElement("img");
            img.setAttribute("style", "text-align: center; height: 50px; list-style-type: none;");
            const card = `${el.Color}${convertNumber(el.Value)}`;
            img.src = `${baseUrl}${card}.png`;
            img.setAttribute("class","rounded d-block");
            img.setAttribute("style","hight: 50px;");
            wo.appendChild(div);
            div.appendChild(img);
        })
        let playerScore = document.createElement("p");
        playerScore.setAttribute("style", "text-align: right");
        let textScore = document.createTextNode(element.Score);
        wo.appendChild(playerScore);
        playerScore.appendChild(textScore);

        counter++;
    });
//Ablagestapel:
//function createAblegestapel() {
    let wo1 = document.getElementById("ablagestapel");
    const div1 = document.createElement("div");
    let img1 = document.createElement("img");
    img1.setAttribute("style", "text-align: center; height: 50px; list-style-type: none");
    const ablageCard = `${startinhalt.TopCard.Color}${convertNumber(startinhalt.TopCard.Value)}`;
    img1.src = `${baseUrl}${ablageCard}.png`;
    wo1.appendChild(div1);
    div1.appendChild(img1);
//}
//createAblegestapel;

//Hebestapel:
//function createAbhebestapel() {
    let wo2 = document.getElementById("hebestapel");
    const div2 = document.createElement("div");
    let img2 = document.createElement("img");
    img2.setAttribute("style", "text-align: center; height: 50px; list-style-type: none");
    const hebeCard = `${Back}${0}`;
    img2.src = `${baseUrl}${hebeCard}.png`;
    wo2.appendChild(div2);
    div2.appendChild(img2);
//}
//createAbhebestapel;


    /*
    //tatsächlich kommt retour:
    {
    "Id":"73936523-e4ec-46c2-832f-4df69df03a04",
    "Players":[
        {   "Player":"a",
            "Cards":[   {"Color":"Red","Text":"Five","Value":5,"Score":5},
                        {"Color":"Yellow","Text":"One","Value":1,"Score":1},
                        {"Color":"Yellow","Text":"Six","Value":6,"Score":6},
                        {"Color":"Yellow","Text":"Skip","Value":11,"Score":20},
                        {"Color":"Blue","Text":"Six","Value":6,"Score":6},
                        {"Color":"Blue","Text":"Draw2","Value":10,"Score":20},
                        {"Color":"Black","Text":"ChangeColor","Value":14,"Score":50} ],
            "Score":108},
    
        {   "Player":"b",
            "Cards":[   {"Color":"Yellow","Text":"Four","Value":4,"Score":4},
                        {"Color":"Yellow","Text":"Nine","Value":9,"Score":9},
                        {"Color":"Green","Text":"Five","Value":5,"Score":5},
                        {"Color":"Green","Text":"Draw2","Value":10,"Score":20},
                        {"Color":"Blue","Text":"Six","Value":6,"Score":6},
                        {"Color":"Blue","Text":"Seven","Value":7,"Score":7},
                        {"Color":"Blue","Text":"Skip","Value":11,"Score":20} ],
            "Score":71},
    
        {   "Player":"c",
            "Cards":[   {"Color":"Red","Text":"Eight","Value":8,"Score":8},
                        {"Color":"Red","Text":"Draw2","Value":10,"Score":20},
                        {"Color":"Red","Text":"Reverse","Value":12,"Score":20},
                        {"Color":"Yellow","Text":"Nine","Value":9,"Score":9},
                        {"Color":"Green","Text":"Zero","Value":0,"Score":0},
                        {"Color":"Green","Text":"Seven","Value":7,"Score":7},
                        {"Color":"Black","Text":"ChangeColor","Value":14,"Score":50} ],
            "Score":114},
    
        {   "Player":"d",
            "Cards":[   {"Color":"Red","Text":"One","Value":1,"Score":1},
                        {"Color":"Red","Text":"Eight","Value":8,"Score":8},
                        {"Color":"Yellow","Text":"Six","Value":6,"Score":6},
                        {"Color":"Green","Text":"Two","Value":2,"Score":2},
                        {"Color":"Green","Text":"Three","Value":3,"Score":3},
                        {"Color":"Green","Text":"Six","Value":6,"Score":6},
                        {"Color":"Blue","Text":"Seven","Value":7,"Score":7} ],
            "Score":33}
        ],
    "NextPlayer":"a",
    "TopCard":{"Color":"Blue","Text":"Zero","Value":0,"Score":0}
    }

    let infoPlayer1 = startinhalt.Players[0];
    console.log(infoPlayer1)
    /*da kommt retour:
    Object {    Player: "a", 
                Cards: Array(7) [ {…}, {…}, {…}, … ],
                Score: 115
            }

            //karte selbst:
    // <img src="...." class="rounded mx-auto d-block">
    
    document.querySelector("#cards ul").addEventListener("mouseover",function(event){
        event.target.classList.toggle("select")
    });
    
    document.querySelector("#cards ul").addEventListener("click",function(event){
        console.log(event.target);
        console.log(event.currentTarget);
    
        event.target.classLis.toggle("selected")
    });
    
    */

}


function convertNumber(cardValue) {
    if (cardValue < 10)
        return cardValue

    switch (cardValue) {
        case 10: return "d2";
        case 11: return "s";
        case 12: return "r";
        case 13: return "wd4";
        case 14: return "wild";
    }
}














