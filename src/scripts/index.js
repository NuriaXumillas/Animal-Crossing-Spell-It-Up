const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const game = new Game(ctx);
game.setListeners(); 

const buttonStart = document.getElementById("start");

buttonStart.addEventListener("click", () => {
   console.log (game.started)
    if (!game.started) {
        game.start();
        buttonStart.innerText="PAUSE"
        
    } else {
        buttonStart.innerText="START"
        game.pause();
    }
});

const buttonplayAgain = document.querySelectorAll(".playAgain");

    buttonplayAgain.forEach(button => {
        button.addEventListener("click", () => {
        location.reload();
        });
    })
    