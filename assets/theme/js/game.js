let myModal = new bootstrap.Modal(document.getElementById('playerNames'));
myModal.show();

document.getElementById('playerNamesForm').addEventListener('keyup', function () {
    console.log(evt);
})

document.getElementById('playerNamesForm').addEventListener('submit', function () {
    console.log("submit");
    evt.preventDefault();
    myModal.hide();
})
